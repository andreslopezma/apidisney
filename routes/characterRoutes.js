const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');

router.get('/characters', characterController.getAllCharacters);
router.post('/characters', characterController.createCharaceter);
router.put('/character/:id', characterController.updateCharacter);
router.delete('/character/:id', characterController.deleteCharacter);

module.exports = router;