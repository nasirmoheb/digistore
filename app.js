const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const reviewRoute = require('./routes/reviewRoute');
const categoryRoute = require('./routes/categoryRoute');
const viewRoute = require('./routes/viewRoute');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

// ***********************/
// INITIALIZING

//setting the view engine to pug
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//*** */ Parser MIDDLE WARES
//JSON parser and limit the sending json
app.use(express.json({ limit: '50kb' }));

//parse the cookie
app.use(cookieParser());

//*** */ SECURITY MIDDLEWARES
//

//Preventing from DOS and BRUTE FORCE ATTACK
const limiter = rateLimit({
  //maximum request
  max: 100,
  //maximum request in time
  windowMs: 60 * 60 * 1000,
  //message
  message: 'You have used your limit 100 request in one hour please use later'
});
app.use('/api', limiter);

//seting http security headers
app.use(helmet());

//Preventing NO-SQL injenction
app.use(mongoSanitize());

//Preventin XSS Attack
app.use(xss());

//Preventing parameter polution
app.use(
  hpp({
    //whitelist some parameters that are safe
    whitelist: ['name', 'price']
  })
);

//* ***/ SECURITY MIDDLEWARES

//development Loger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));

//App Routes
app.use('/api/v1/product', productRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/review', reviewRoute);
app.use('/api/v1/category', categoryRoute);
app.use('/', viewRoute);

//handle request not fount error
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
