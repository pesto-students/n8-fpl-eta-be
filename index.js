'use strict';

// middleware for the api routes
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config');
const userRoutes = require('./routes/user-routes');
const { userAuth } = require('./controllers/userController');

const admin = require('./firebase').firebaseAdmin;


const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

const landingPage = async (req, res, next) => {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then(() => {
            try {
                res.status(200).send(JSON.stringify({ status: "Server is active" }));
            } catch (error) {
                res.status(400).send(JSON.stringify({ status: error }));
            }
        })
        .catch((error) => {
            res.status(401).send(JSON.stringify({ status: "UNAUTHORIZED" }));
        });
}

app.use('/api/:token', userAuth)

app.use('/api', userRoutes.routes);

app.use('/', landingPage);

app.listen(config.port, () => console.log('App is listening on ' + config.port));