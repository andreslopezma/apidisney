const express = require('express');
const router = express.Router();
const genderController = require('../controllers/genderController');

router.get('/genders', genderController.getAllGenders);

module.exports = router;