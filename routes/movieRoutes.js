const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/movies', movieController.getAllMovies);
router.post('/movies', movieController.createMovie);
router.put('/movie/:id', movieController.updateMovie);
router.delete('/movie/:id', movieController.deleteMovie);

module.exports = router;