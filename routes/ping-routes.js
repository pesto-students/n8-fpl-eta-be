const express = require('express');
const {getIsActive} = require('../controllers/pingController');

const router = express.Router();

router.get('/isActive', getIsActive);

module.exports = {
    routes: router
}