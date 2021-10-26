'use strict';
const dotenv = require('dotenv');
const assert = require('assert');
const path = require('path');
dotenv.config({path:path.resolve(__dirname,"./.env")});

console.log(`${path.resolve(__dirname,"./.env")}`);

const {
    PORT,
    HOST,
    HOST_URL,
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID,
    ALPHAVANTAGE_API_KEY
} = process.env;

// assert(PORT, 'PORT is required');
// assert(HOST, 'HOST is required');

module.exports = {
    port: PORT,
    host: HOST,
    url: HOST_URL,
    firebaseConfig: {
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
        messagingSenderId: MESSAGING_SENDER_ID,
        appId: APP_ID
    },
    alphavantageApiKey: ALPHAVANTAGE_API_KEY
}