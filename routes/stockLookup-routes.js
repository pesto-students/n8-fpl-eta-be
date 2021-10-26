const express = require('express');
const {
    getStockById
} = require('../controllers/stockLookupController');

const router = express.Router();
router.get('/:securityCode',getStockById);

module.exports = {
    routes: router
}