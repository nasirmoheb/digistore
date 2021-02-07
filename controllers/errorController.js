const AppError = require('./../utils/appError');

const handleJWTExpiredError = err => {
  return new AppError('Your token has been expired.Please log in again!', 401);
};

const handleJWTError = err => {
  return new AppError('Invalid token.Please log in again!', 401);
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const message = Object.values(err.errors).map(el => el.message);
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = err => {
  const message = `Duplicate feild, value:" ${Object.values(err.keyValue).map(
    el => el
  )} " .Please provide another value`;
  return new AppError(message, 400);
};

const sendDevError = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    Stack: err.stack
  });
};

const sendProdError = (err, req, res) => {
  //Operational trusted error send to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    //Programing or other unknown error: don't leak error detail
    //loging error
    console.log('Error 💥', err);
    //send error message
    res.status(500).json({
      status: 'Error',
      message: 'something went very wrong'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  //send development error
  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, req, res);
  }
  //send production error
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);
    sendProdError(error, req, res);
  }
};
