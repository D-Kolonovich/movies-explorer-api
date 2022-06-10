require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const { errors } = require('celebrate');
const cors = require('cors');
const errorHandler = require('./errors/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const { NODE_ENV, DB_URL } = process.env;
const { PORT = 3001 } = process.env;

app.use(express.json());

const NotFoundError = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');

mongoose.connect(NODE_ENV === 'production' ? DB_URL : 'mongodb://localhost:27017/moviesdb-test');

app.use(requestLogger); // подключаем логгер запросов

app.use(cors({
  origin: ['http://localhost:3000', 'https://api.movies.kolonovich.nomoreparties.sbs'], // https будет переделан
  credentials: true,
}));

require('./routes/auth')(app);

app.use(auth);

require('./routes/index')(app);

app.use('/', (req, res, next) => {
  next(new NotFoundError('Путь не найден')); // res.status(404).send
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
