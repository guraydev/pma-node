// const logger = require('../utils/logger');

// const errorHandler = (err, req, res, next) => {
//   logger.error({
//     message: err.message,
//     stack: err.stack,
//     method: req.method,
//     url: req.url,
//     user: req.user ? req.user.id : 'unauthenticated',
//   });
//   const status = err.status || 500;
//   const message = err.message || 'Something went wrong';
//   res.status(status).json({ error: message });
// };

// module.exports = errorHandler;


const logger = require('../utils/logger');

// Global error handler for Express
const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.url}`);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
};

module.exports = errorHandler;