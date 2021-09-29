'use strict';

const getIsActive = async (req, res, next) => {
    try {
        res.send('Server is Active');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    getIsActive
}