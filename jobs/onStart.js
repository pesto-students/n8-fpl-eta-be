// 1. update status to 'GETTING_READY'
// 2. get stock list for the challenge 
// 3. set base price for all the stocks 
// 4. set base price for all the portfolios 
// 5. start leaderboard calculation
// 5. update status to 'LIVE'

// firebase setup to access firestore
const admin = require('../firebase').firebaseAdmin;
const db = admin.firestore();
const realTimeDb = admin.database();

const config = require('../config');

// alphavantage to fetch pervious day closing price
const alphavantage = require('alphavantage')

// unique id generator 
const { v4: uuidv4 } = require('uuid');


// Websocket and decoder
const protobuf = require("protobufjs");
const WebSocket = require('ws')

// stocks list for each challenge
let uniqueStocks = [];


const Portfolio = require('../models/portfolio');
const StockLookup = require('../models/stockLookup');


const getChallenge = async (challengeId) => {
    try {
        const challenge = await db.collection('challenges').doc(challengeId);
        const data = await challenge.get();
        if (!data.exists) {
            console.error('challenge error', challengeId);
        } else {
            return data.data();
        }
    } catch (error) {
        console.error('challenge error', error);
    }
}
const updateChallenge = async (id, data) => {
    try {
        const challenge = await db.collection('challenges').doc(id);
        await challenge.update(data);
        return true;
    } catch (error) {
        console.error(`update challenge error `, error);
        return false;
    }
}
const getPortfolios = async (id) => {
    const portfolioRef = db.collection('portfolios');
    const portfolioArray = [];
    let snapshot = null;

    snapshot = await portfolioRef.where('challengeId', '==', id).orderBy('submitTimestamp', 'desc').get();
    if (snapshot.empty) {
        try {
            console.log(`No Porfolios found for challenge ${id}`);
        } catch (error) {
            console.error(`getPortfolios`, error);
        }
    } else {
        snapshot.forEach(doc => {
            const portfolio = new Portfolio(
                doc.id,
                doc.data().userId,
                doc.data().username,
                doc.data().challengeId,
                doc.data().stocks,
                doc.data().submitTimestamp,
            );
            portfolioArray.push(portfolio);
        });
        return (portfolioArray);
    };
}
const avStockList = [];
const isStockPresent = (stock) => {
    isPresent = false;
    let s = 0;
    while (s < uniqueStocks.length) {
        if (avStockList[s] === stock) {
            isPresent = true;
            break;
        }
        s++;
    }

    return isPresent;
}
const getBSESymbol = async (securityCode) => {

    try {
        const code = securityCode;
        const stockLookupRef = db.collection('lookup');
        const stockLookupArray = [];
        let snapshot = null;

        snapshot = await stockLookupRef.where('securityCode', '==', parseInt(code)).orderBy('securityName', 'asc').get();
        if (snapshot.empty) {
            try {
                return (`{"status": "No records found"}`);
            } catch (error) {
                return (`{"status": "FAIL", "message":${error}}`);
            }
        } else {
            snapshot.forEach(doc => {
                const { id, securityId, securityCode, securityName } = doc.data();
                const stockLookup = new StockLookup(id, securityCode, securityId, securityName);
                stockLookupArray.push(stockLookup);
            });
            return (stockLookupArray);
        };
    } catch (error) {
        return (error.message);
    }
}

const saveToRTDb = async (id, l, reference) => {
    const ref = realTimeDb.ref(reference);
    const objRef = ref.child(id);
    await objRef.set({ l }, (a) => { if (a !== null) console.log(a) });
}

const readfromRTDb = (id, object) => {
    const oRef = realTimeDb.ref(`${object}/${id}`);
    oRef.on('value', (snapshot) => {
        console.log(snapshot.val());
        return snapshot.val();
    }, (errorObject) => {
        console.log('The read failed: ' + errorObject.name);
    });
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const sym = (s) => {
    return new Promise((resolve, reject) => {
        resolve(getBSESymbol(s)
            .then(symbol => {
                return (symbol[0].securityId)
            }));
    });

};


let portfolioByStocks = [];
const calculateLeaderboard = async (challengeId, portfolios, stockList) => {

    // STEPS
    // 1. initiate ws with Yahoo finance
    // 2. initialize firebase database for realtime
    // 3. generate unique id for the leaderboard 
    // 4. build yahoo symbol list.
    // 5. on message calculate the leaderboard
    // 6. update challenge with unique id
    // 7. update realtime firebase with leaderboard with unique id

    // 1.
    const root = protobuf.loadSync(__dirname + '/YPricingData.proto');
    const stockTicker = root.lookupType("yaticker");
    ws = new WebSocket('wss://streamer.finance.yahoo.com');


    // 3.
    const uid = uuidv4();

    // 4. To be tested till market opening
    ws.onopen = () => {
        console.log(`Connected to yahoo for challenge id ${challengeId}`)
        // make portfolio by stocks list 

        for (let sl = 0; sl < stockList.length; sl++) {
            const _p = [];
            for (let p = 0; p < portfolios.length; p++) {
                const pStocks = portfolios[p].stocks;
                for (s = 0; s < pStocks.length; s++) {
                    if (pStocks[s] === stockList[sl].stock) {
                        _p.push({ portfolioId: portfolios[p].id, stocks: portfolios[p].stocks });
                    }
                }
            }
            portfolioByStocks.push({ stock: stockList[sl].stock, portfolios: _p });
        }
        // subscribing to all symbols in challenge
        const symbols = stockList.map(s => { return s.stock });
        symbols.map(sym => {
            const sendMessage = JSON.stringify({
                subscribe: [`${sym}.BO`]
            });
            console.log(`Subscribing to ${sendMessage}`)
            ws.send(sendMessage);
        });

        let leaderboard = [];

        for (let p = 0; p < portfolios.length; p++) {
            let baseP = [];
            const pStocks = portfolios[p].stocks;

            //save base portfolios 

            pStocks.map(pS => {
                const symbol = pS.split(".")[0];
                stockList.map(async (sl) => {
                    if (isNaN(symbol)) {
                        console.log(`Comparing ${symbol} and ${sl.stock}`)
                        if (symbol === sl.stock) {
                            console.log(JSON.stringify(sl, 0, 2))
                            baseP.push(sl);
                            console.table(baseP);
                            saveToRTDb(portfolios[p].id, baseP, 'FPL/Portfolios');

                        }
                    } else {
                        const bSymbol = await getBSESymbol(symbol);
                        console.log(`Comparing ${bSymbol[0].securityId} and ${sl.stock}`)
                        if (bSymbol[0].securityId === sl.stock) {
                            console.log(JSON.stringify(sl, 0, 2))
                            baseP.push(sl);
                            console.table(baseP);
                            saveToRTDb(portfolios[p].id, baseP, 'FPL/Portfolios');
                        }
                    }
                })
            })

            const l = {
                avgReturn: 0,
                minReturnStock: '',
                minReturn: 00,
                maxReturnStock: '',
                maxReturn: 00,
                portfolioId: portfolios[p].id,
                username: portfolios[p].username,
                submitTimestamp: portfolios[p].submitTimestamp
            }

            leaderboard.push(l);
        }

        // 6.
        saveToRTDb(uid, leaderboard, 'FPL/Leaderboard');

        // 7.
        getChallenge(challengeId)
            .then(data => {
                let _c = data;
                _c.status = 'LIVE';
                _c.leaderboard = uid;
                updateChallenge(challengeId, _c)
            });
    }

    // 5.
    ws.onmessage = function incoming(data) {
        const ticker = stockTicker.decode(new Buffer(data.data, 'base64'));
        console.log(`${ticker.id} - ${ticker.price} - ${ticker.change}`);

        for (let p = 0; p < portfolioByStocks.length; p++) {
            if (ticker.id === portfolioByStocks[p].stock) {
                const portfolios = portfolioByStocks[p].portfolios;
                for (let pper = 0; pper < portfolios.length; pper++) {

                    const { portfolioId } = portfolios[pper];
                    // fetch from rtdb

                    const prevPortfolio = readfromRTDb(portfolioId, 'Portfolio');

                    const currPortfolio = [];
                    console.log(JSON.stringify(prevPortfolio));
                    for (let pp = 0; p < prevPortfolio.length; pp++) {
                        if (prevPortfolio[pp].stock === ticker.id) {
                            currPortfolio.push({ stock: ticker.id, price: ticker.price });
                        } else {
                            currPortfolio.push(prevPortfolio[pp]);
                        }
                    }
                    saveToRTDb(portfolioId, currPortfolio, 'FPL/Portfolio');
                }
            }
        }
    };
}

async function onStart(challengeId) {

    const av = alphavantage({ key: config.alphavantageApiKey });

    let _c = await getChallenge(challengeId);
    _c.status = 'GETTING_READY';
    if (updateChallenge(challengeId, _c)) {
        const portfolios = await getPortfolios(challengeId);
        let p = 0; l = 0, apiCounter = 0;

        // latest date for closing value
        const date = new Date();
        if (date.getDay() === 1) { // monday
            date.setDate(date.getDate() - 3); // 2 days prior 
        } else {
            date.setDate(date.getDate() - 1); // one day prior
        }
        // formating date as per api syntax
        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
        const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);

        while (p < portfolios.length) {

            const portfolio = portfolios[p];

            const pStocks = portfolio.stocks;

            for (let s = 0; s < pStocks.length; s++) {
                if (!isStockPresent(pStocks[s])) {
                    avStockList.push(pStocks[s]);
                    console.log(`Fetching stock - ${pStocks[s]}`);

                    let stockPrice = await av.data.daily(pStocks[s], 'compact', 'json', '1')
                        .then(data => {
                            apiCounter++;
                            if (isNaN(pStocks[s].split(".")[0])) {
                                return ({
                                    stock: pStocks[s].split(".")[0],
                                    price: data["Time Series (Daily)"][`${ye}-${mo}-${da}`]["4. close"]
                                });
                            } else {
                                return getBSESymbol(pStocks[s].split(".")[0])
                                    .then(symbol => {
                                        return ({
                                            stock: symbol[0].securityId,
                                            price: data["Time Series (Daily)"][`${ye}-${mo}-${da}`]["4. close"]
                                        });
                                    })
                            }
                        },
                            error => {
                                apiCounter++;
                                console.log(`API call error `, error);
                            });

                    uniqueStocks.push(stockPrice);
                    console.log(`Added stock Price ${JSON.stringify(stockPrice, 0, 2)}\n`);

                    if (apiCounter === 5) {
                        console.log(`waiting for 60 secs`)
                        await delay(60000);
                        apiCounter = 0;
                        console.log(`Wait Complete\n`);
                    }
                }
            }
            p++;
        }
        _c.stocks = uniqueStocks;
        updateChallenge(challengeId, _c);
        calculateLeaderboard(challengeId, portfolios, uniqueStocks);
    } else {
        return 'error';
    }
}

module.exports = onStart;