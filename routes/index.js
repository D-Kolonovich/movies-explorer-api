const routesUsers = require('./users');
const routesMovies = require('./movies');

module.exports = (app) => {
  app.use('/users', routesUsers);
  app.use('/movies', routesMovies);
};
