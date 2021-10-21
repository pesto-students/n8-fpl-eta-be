const express = require('express');
const {
    getPortfolios,
    getPortfolio,
    postPortfolio
} = require('../controllers/portfolioController');

const router = express.Router();
router.post('/', postPortfolio);
router.get('/:filter/:id',getPortfolios);
router.get('/:id',getPortfolio);

module.exports = {
    routes: router
}