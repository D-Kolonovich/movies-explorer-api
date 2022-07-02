const router = require('express').Router();
const { findMovies, createMovie, deleteMovieById } = require('../controllers/movies');
const { movie, movieId } = require('../middlewares/validations');

router.get('/', findMovies);
router.post('/', movie, createMovie);
router.delete('/:movieId', movieId, deleteMovieById);

module.exports = router;
