const express = require('express');
const {
    getStockByCode,
    getStockById
} = require('../controllers/stockLookupController');

const router = express.Router();
router.get('/code/:securityCode',getStockByCode);
router.get('/id/:securityId',getStockById);

module.exports = {
    routes: router
}