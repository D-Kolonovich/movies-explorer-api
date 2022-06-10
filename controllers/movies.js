const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const ValidationError = require('../errors/ValidationError');

module.exports.findMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => {
      if (!movie) {
        throw new ValidationError('Переданы некорректные данные'); // res.status(400).send
      } else {
        res.send(movie);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные')); // res.status(400).send
      } else {
        next(err); // res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
};

module.exports.deleteMovieById = (req, res, next) => {
  const anotherUser = req.user._id;
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Карточка с указанным _id не найдена'); // res.status(404).send
      } else if (anotherUser !== String(movie.owner)) {
        return Promise.reject(new ForbiddenError('Попытка удалить другого пользователя'));
      } else {
        return movie.remove();
      }
    })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные при удалении')); // res.status(400).send
      } else {
        next(err); // res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
};
