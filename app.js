require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const { errors, celebrate, Joi } = require('celebrate');
const cors = require('cors');
// const validator = require('validator');
const errorHandler = require('./errors/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const { PORT = 3001 } = process.env;
app.use(express.json());

// const UnauthorizedError = require('./errors/UnauthorizedError');

// const validateURL = (value) => {
//   if (!validator.isURL(value, { require_protocol: true })) {
//     throw new UnauthorizedError('Неправильный формат ссылки');
//   }
//   return value;
// };

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');

// NODE_ENV === 'production' ? DB_URL :

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.use(requestLogger); // подключаем логгер запросов



app.use(cors({
  origin: ['http://localhost:3000', 'https://dkmesto.students.nomoredomains.xyz'], // https будет переделан
  credentials: true,
}));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

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
