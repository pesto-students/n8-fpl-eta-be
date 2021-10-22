'use strict';

// unique id generator
const { v4 : uuidv4 } = require('uuid');

// firebase setup to access firestore
const admin = require('../firebase').firebaseAdmin;
const db = admin.firestore();


const Challenge = require('../models/challenge');

const postChallenge = async (req, res, next) => {
    try {
        const data = req.body;
        const _c = {...data, status:'NOT_LIVE'};
        const id = uuidv4();
        await db.collection('challenges').doc(id).set(_c);
        // onStart cron job
        res.status(200).send(JSON.stringify({ status: `challenge created successfully` }));
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const getChallenges = async (req, res, next) => {
    try {

        const challenges = await db.collection('challenges');
        const data = await challenges.get();
        const challengesArray = [];
        if (data.empty) {
            res.status(404).send(JSON.stringify({ status: "No records found" }));
        } else {
            data.forEach(doc => {
                const challenge = new Challenge(
                    doc.id,
                    doc.data().name,
                    doc.data().startDate,
                    doc.data().endDate,
                    doc.data().rules,
                    doc.data().status,
                );
                challengesArray.push(challenge);
            });
            res.send(challengesArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const getChallenge = async (req, res, next) => {
    try {
        const id = req.params.id;
        const challenge = await db.collection('challenges').doc(id);
        const data = await challenge.get();
        if (!data.exists) {
            res.status(404).send(JSON.stringify({ status: 'Challenge not found' }));
        } else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}



const getChallengesByFilter = async (req, res, next) => {
    try {
        const filter = req.params.filter;
        const challengesRef = db.collection('challenges');
        const challengeArray = [];
        let snapshot = null;
        const currentDate = new Date();

        switch (filter) {
            case "STARTING_SOON":
                snapshot = await challengesRef.where('status', '==', 'NOT_LIVE').orderBy('startDate', 'desc').get();
                if (snapshot.empty) {
                    try {
                        res.status(200).send(`{"status": "No records found"}`);
                    } catch (error) {
                        res.status(400).send(`{"status": "FAIL", "message":${error}}`);
                    }
                } else {

                    snapshot.forEach(doc => {
                        const challenge = new Challenge(
                            doc.id,
                            doc.data().name,
                            doc.data().startDate,
                            doc.data().endDate,
                            doc.data().rules,
                            doc.data().status,

                        );
                        challengeArray.push(challenge);
                    });
                    res.send(challengeArray);
                };
                break;
            case "LIVE":
                snapshot = await challengesRef.where('status', '==', 'LIVE').orderBy('startDate', 'desc').get();
                if (snapshot.empty) {
                    try {
                        res.status(200).send(`{"status": "No records found"}`);
                    } catch (error) {
                        res.status(400).send(`{"status": "FAIL", "message":${error}}`);
                    }
                } else {

                    snapshot.forEach(doc => {
                        const challenge = new Challenge(
                            doc.id,
                            doc.data().name,
                            doc.data().startDate,
                            doc.data().startDate,
                            doc.data().rules,
                            doc.data().status,

                        );
                        challengeArray.push(challenge);
                    });
                    res.send(challengeArray);
                };
                break;
            case "CLOSED":
                snapshot = await challengesRef.where('status', '==', 'CLOSED').orderBy('startDate', 'desc').get();
                if (snapshot.empty) {
                    try {
                        res.status(200).send(`{"status": "No records found"}`);
                    } catch (error) {
                        res.status(400).send(`{"status": "FAIL", "message":${error}}`);
                    }
                } else {

                    snapshot.forEach(doc => {
                        const challenge = new Challenge(
                            doc.id,
                            doc.data().name,
                            doc.data().startDate,
                            doc.data().startDate,
                            doc.data().rules,
                            doc.data().status,

                        );
                        challengeArray.push(challenge);
                    });
                    res.send(challengeArray);
                };
                break;
            default:
                res.send(JSON.stringify({ status: "Incorrect Filter" }));
        }

    } catch (error) {
        res.status(404).send(`{error: ${error}}`);
    }

};

module.exports = {
    getChallenges,
    getChallengesByFilter,
    getChallenge,
    postChallenge
}