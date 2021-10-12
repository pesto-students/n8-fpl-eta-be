const express = require('express');
const {
    getChallenges,
    getChallengesByFilter
} = require('../controllers/challengeController');

const router = express.Router();
router.get('/all', getChallenges);
router.get('/filter/:filter',getChallengesByFilter);
module.exports = {
    routes: router
}