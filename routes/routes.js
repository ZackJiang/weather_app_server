const express = require('express');

const router = express.Router();
const {
    addUser,
    signInUser,
    isValidUser
} = require('../controllers/user.js')
const { getWeatherInfo } = require('../controllers/weather.js');

router.post('/users', addUser);
router.post('/auth/signin', signInUser);
router.get('/weather', isValidUser, getWeatherInfo);

module.exports = router;
