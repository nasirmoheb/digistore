const express = require('express');
const morgan = require('morgan');

const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

// ***********************/
// INITIALIZING

const app = express();

//*** */ MIDDLE WARES
app.use(express.json());

//development Loger
app.use(morgan('dev'));

app.use('/api/v1/product', productRoute);
app.use('/api/v1/user', userRoute);

//handle request not fount error
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
