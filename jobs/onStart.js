// 1. update status to 'GETTING_READY'
// 2. get stock list for the challenge 
// 3. set base price for all the stocks 
// 4. set base price for all the portfolios 
// 5. start leaderboard calculation
// 5. update status to 'LIVE'

// firebase setup to access firestore
const admin = require('../firebase').firebaseAdmin;
const db = admin.firestore();

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
                doc.data().challengeId,
                doc.data().stocks,
                doc.data().submitTimestamp,
            );
            portfolioArray.push(portfolio);
        });
        return (portfolioArray);
    };
}

const isStockPresent = (stock) => {
    isPresent = false;
    let s = 0;
    while (s < uniqueStocks.length) {
        if (uniqueStocks[s].stock === stock) {
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


const getYahooSymbols = async (bseSymbols) => {
    const yahoSymbols = await bseSymbols.map(sym => {
        return (getBSESymbol(sym).then(
            data => {
                y = data[0].securityId + '.BO';
                return y;
            },
            error => {
                console.error(error);
                return null;
            }))
    });
    return yahoSymbols;
};


const delay = ms => new Promise(res => setTimeout(res, ms));

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

    // 2.
    const realTimeDb = admin.database();

    // 3.
    const uid = uuidv4();

    // 4. To be tested till market opening
    ws.onopen = () => {
        console.log(`Connected to yahoo for challenge id ${challengeId}`)
        const aVsymbols = stockList.map(s => { return s.stock });
        aVsymbols.map(sym => {
            const _s = sym;
            if (!isNaN(_s)) {
                getBSESymbol(_s)
                    .then(symbol => {
                        console.log(`subscribing to Symbol - ${symbol[0].securityId}\n\n`)
                        ws.send(JSON.stringify({
                            subscribe: `${symbol[0].securityId}.BO`
                        }));
                    })
            }
        });

        for (let a = 0; a < aVsymbols.length; a++) {
            const _s = aVsymbols[a];
            if (isNaN(_s)) {
                console.log(`subscribing to Symbol - ${_s}\n\n`)
                ws.send(JSON.stringify({
                    subscribe: `${_s}.BO`
                }));
            }
        }
    }

    // 5.
    ws.onmessage = function incoming(data) {
        console.log(stockTicker.decode(new Buffer(data.data, 'base64')))
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
                if (!isStockPresent(pStocks[s].split('.')[0], uniqueStocks)) {

                    console.log(`Fetching stock - ${pStocks[s]}`);

                    let stockPrice = await av.data.daily(pStocks[s], 'compact', 'json', '1')
                        .then(data => {
                            apiCounter++;
                            return ({
                                stock: pStocks[s].split(".")[0],
                                price: data["Time Series (Daily)"][`${ye}-${mo}-${da}`]["4. close"]
                            });
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