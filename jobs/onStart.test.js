const admin = require('../firebase').firebaseAdmin;
const db = admin.firestore();

const StockLookup = require('../models/stockLookup');


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
        const s = sym.split(".");
        const id = parseInt(s[0]);
        if (id !== NaN) {
            return (getBSESymbol(id).then(
                data => {
                    y = data[0].securityId + '.BO';
                    return y;
                },
                error => {
                    console.error(error);
                    return null;
                }))

        } else {
            y = s[0] + '.BO';
            return y;
        }
    });
    return yahoSymbols;
};

getYahooSymbols(['OFSS.BSE', 'TCS.BSE', 'TECHM.BSE', 'INFY.BSE', '532790.BSE', '532400.BSE'])
    .then(data =>
        Promise.all(data)
            .then(
                data =>{
                    console.log(data);
                }
            ))