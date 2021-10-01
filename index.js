'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const studentRoutes = require('./routes/student-routes');
const pingRoutes = require('./routes/ping-routes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/', landingPage);
app.use('/api', studentRoutes.routes);
app.use('/ping', pingRoutes.routes);

const landingPage = async (req, res, next) => {
    try {
        res.send('Server is Active');
    } catch (error) {
        res.status(400).send(error.message);
    }
}


app.listen(config.port, () => console.log('App is listening on ' + config.port));
