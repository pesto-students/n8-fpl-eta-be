'use strict';

// post portfolio 
// get  portfolio 
// get  portfolioByUserID
// get  portfolioByChallengeID

const admin = require('../firebase').firebaseAdmin;
const db = admin.firestore();

const Portfolio = require('../models/portfolio');

const getPortfolio = async (req, res, next) => {
    try {
        const id = req.params.id;
        const portfolio = await db.collection('portfolios').doc(id);
        const data = await portfolio.get();
        if (!data.exists) {
            res.status(404).send(JSON.stringify({ status: 'Portfolio not found' }));
        } else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
};


const postPortfolio = async (req, res, next) => {
    try {
        const data = req.body;

        const ts = admin.firestore.Timestamp.fromDate(new Date(data.submittedAt));
        const _p = { ...data, submitTimestamp: ts };
        await db.collection('portfolios').doc().set(_p);
        res.status(200).send(JSON.stringify({ status: `Portfolio Saved Successfully` }));
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const getPortfolios = async (req, res, next) => {

    const filter = req.params.filter;
    const id = req.params.id;
    const portfolioRef = db.collection('portfolios');
    const portfolioArray = [];
    let snapshot = null;

    switch (filter) {
        case "challenge":
            snapshot = await portfolioRef.where('challengeId', '==', id).orderBy('submitTimestamp', 'desc').get();
            if (snapshot.empty) {
                try {
                    res.status(200).send(`{"status": "No records found"}`);
                } catch (error) {
                    res.status(400).send(`{"status": "FAIL", "message":${error}}`);
                }
            } else {

                snapshot.forEach(doc => {
                    const { id, userId, challengeId, stocks, submitTimestamp } = doc.data();
                    const portfolio = new Portfolio(
                        id, userId, challengeId, stocks, submitTimestamp
                    );
                    portfolioArray.push(portfolio);
                });
                res.send(portfolioArray);
            };
            break;
        case "user":
            snapshot = await portfolioRef.where('uid', '==', id).orderBy('submitTimestamp', 'desc').get();
            if (snapshot.empty) {
                try {
                    res.status(200).send(`{"status": "No records found"}`);
                } catch (error) {
                    res.status(400).send(`{"status": "FAIL", "message":${error}}`);
                }
            } else {

                snapshot.forEach(doc => {
                    const { id, userId, username, challengeId, stocks, submitTimestamp } = doc.data();
                    const portfolio = new Portfolio(
                        id, userId, username, challengeId, stocks, submitTimestamp
                    );
                    portfolioArray.push(portfolio);
                });
                res.send(portfolioArray);
            };
            break;
        case "user":
            snapshot = await portfolioRef.where('uid', '==', id).orderBy('submitTimestamp', 'desc').get();
            if (snapshot.empty) {
                try {
                    res.status(200).send(`{"status": "No records found"}`);
                } catch (error) {
                    res.status(400).send(`{"status": "FAIL", "message":${error}}`);
                }
            } else {

                snapshot.forEach(doc => {

                    const { id, userId, username, challengeId, stocks, submitTimestamp } = doc.data();
                    const portfolio = new Portfolio(
                        id, userId, username, challengeId, stocks, submitTimestamp
                    );

                    portfolioArray.push(portfolio);
                });
                res.send(portfolioArray);
            };
            break;
        default:
            res.send(JSON.stringify({ status: "Incorrect Filter" }));
    }
};

module.exports = {
    postPortfolio,
    getPortfolio,
    getPortfolios
}