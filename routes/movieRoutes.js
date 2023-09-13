const upload = require('../multer');
const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/movies', movieController.getAllMovies);
router.get('/movie/:id', movieController.getAllMovie);
router.post('/movies', upload.single('image'), movieController.createMovie);
router.put('/movie/:id', movieController.updateMovie);
router.delete('/movie/:id', movieController.deleteMovie);

module.exports = router;