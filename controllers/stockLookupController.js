const admin = require('../firebase').firebaseAdmin;
const db = admin.firestore();

const StockLookup = require('../models/stockLookup');

const getStockById = async (req, res, next) => {
    try {
        const code = req.params.securityCode;
        const stockLookupRef = db.collection('lookup');
        const stockLookupArray = [];
        let snapshot = null;

        snapshot = await stockLookupRef.where('securityCode', '==', parseInt(code)).orderBy('securityName','asc').get();
        if (snapshot.empty) {
            try {
                res.status(200).send(`{"status": "No records found"}`);
            } catch (error) {
                res.status(400).send(`{"status": "FAIL", "message":${error}}`);
            }
        } else {
            snapshot.forEach(doc => {
                const { id, securityId, securityCode, securityName } = doc.data();
                const stockLookup = new StockLookup(id, securityCode, securityId, securityName);
                stockLookupArray.push(stockLookup);
            });
            res.send(stockLookupArray);
        };
    } catch (error) {
        res.status(400).send(error.message);
    }
};

module.exports = {
    getStockById
}