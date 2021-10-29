const express = require('express');
const {
    getChallenges,
    getChallengesByFilter,
    getChallenge,
    postChallenge
} = require('../controllers/challengeController');

const router = express.Router();
router.post('/', postChallenge);
router.get('/all', getChallenges);
router.get('/filter/:filter',getChallengesByFilter);
router.get('/:id',getChallenge);

module.exports = {
    routes: router
}