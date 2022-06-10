const { createUser, login } = require('../controllers/users');
const { signin, signup } = require('../middlewares/validations');

module.exports = (app) => {
  app.use('/signup', signup, createUser);
  app.use('/signin', signin, login);
};
