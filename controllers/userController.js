'use strict';

const admin = require('../firebase').firebaseAdmin;
const db = admin.firestore();

const User = require('../models/user');
const addUser = async (req, res, next) => {
    try {
        const data = req.body;
        await db.collection('users').doc().set(data);
        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await db.collection('users');
        const data = await users.get();
        const usersArray = [];
        if (data.empty) {
            res.status(404).send('No Users record found');
        } else {
            data.forEach(doc => {
                const user = new User(
                    doc.id,
                    doc.data().name,
                    doc.data().email
                );
                usersArray.push(user);
            });
            res.send(usersArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await db.collection('users').doc(id);
        const data = await user.get();
        if (!data.exists) {
            res.status(404).send('user with the given ID not found');
        } else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const userAuth = async (req, res, next) => {

    const expiresIn = 1000 * 60 * 60;
    admin
        .auth()
        .createSessionCookie(req.params.token, { expiresIn })
        .then(
            (sessionCookie) => {
                const options = { maxAge: expiresIn, httpOnly: true };
                res.cookie("session", sessionCookie, options);
                res.status(200).send(JSON.stringify({ status: "success" }));
            },
            (error) => {
                res.status(401).send(JSON.stringify({ status: "UNAUTHORIZED" }));
            }
        );
};

const checkUser = async (req, res, next) => {
    try {
        const email = req.body.email;
        const usersRef = db.collection('users');
        const userArray = [];
        const snapshot = await usersRef.where('email', '==', email).get();
        if (snapshot.empty) {
            try {
                const data = req.body;
                await db.collection('users').doc().set(data);
                res.send(`{"status": "SUCCESS", "message":"User created successully"}`);
            } catch (error) {
                res.status(400).send(`{"status": "FAIL", "message":${error}}`);
            }
        } else {
            snapshot.forEach(doc => {
                const { name, email } = doc.data();
                const user = new User(
                    doc.id,
                    name,
                    email
                );
                userArray.push(user);
            });
            res.send(`{"info": "Users Exists"}`);
        }
    } catch (error) {
        res.status(404).send(`{error: ${error}}`);
    }
}

const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const user = await db.collection('users').doc(id);
        await user.update(data);
        res.send('user record updated successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        await db.collection('users').doc(id).delete();
        res.send('Record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    checkUser,
    userAuth
}