// 1. update status to 'GETTING_READY'
// 2. get stock list for the challenge 
// 3. set base price for all the stocks 
// 4. set base price for all the portfolios 
// 5. update status to 'LIVE'

// firebase setup to access firestore
const admin = require('../firebase').firebaseAdmin;
const db = admin.firestore();


const Portfolio = require('../models/portfolio');

// crud functions
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

const isStockPresent = (stock, stockArr) => {
    isPresent = false;
    let s = 0;
    while (s < stockArr.length) {
        if (stockArr[0] === stock) {
            isPresent = true;
            break;
        }
        s++;
    }
    return isPresent;
}

async function onStart(challengeId) {

    let stocks = [];
    let _c = await getChallenge(challengeId);
    _c.status = 'GETTING_READY';
    if (updateChallenge(challengeId, _c)) {
        const portfolios = getPortfolios(challengeId);
        let p = 0;
        while (p < portfolios.length) {
            const portfolio = portfolios[p];
            portfolio.map(stock => {
                if (!isStockPresent(stock, stocks)) {
                    stocks.push(stock);
                }
            });
            p++;
        }
        _c.stocks = stocks;
        updateChallenge(challengeId, _c);
    } else {
        return 'error';
    }
}

module.exports = onStart;