const upload = require('../multer');
const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');

router.get('/characters', characterController.getAllCharacters);
router.get('/character/:id', characterController.getCharacter);
router.post('/characters', upload.single('image'), characterController.createCharaceter);
router.put('/character/:id', characterController.updateCharacter);
router.delete('/character/:id', characterController.deleteCharacter);

module.exports = router;