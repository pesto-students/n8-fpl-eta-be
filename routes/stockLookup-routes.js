const express = require('express');
const {
    getStockById,
    getStockByName
} = require('../controllers/stockLookupController');

const router = express.Router();
router.get('/:securityCode',getStockById);
router.get('/search/:name',getStockByName);

module.exports = {
    routes: router
}