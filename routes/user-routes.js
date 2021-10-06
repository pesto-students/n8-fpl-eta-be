const express = require('express');
const {
    getUser,
    checkUser
} = require('../controllers/userController');

const router = express.Router();

router.get('/user/:id', getUser);
router.get('/user/check/:email', checkUser);


module.exports = {
    routes: router
}