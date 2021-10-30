'use strict';

// middleware for the api routes
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config');
const { userAuth } = require('./controllers/userController');

const admin = require('./firebase').firebaseAdmin;
const challengeRoutes = require('./routes/challenge-routes');
const portfolioRoutes = require('./routes/portfolio-routes');
const stockLookupRoutes = require('./routes/stockLookup-routes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api/challenge', challengeRoutes.routes);
app.use('/api/portfolio', portfolioRoutes.routes);
app.use('/api/lookup', stockLookupRoutes.routes);

app.listen(config.port, () => console.log('App is listening on ' + config.port));