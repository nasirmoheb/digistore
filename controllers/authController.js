const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//create JWT token
const createToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

//create and send JWT token
const createAndSentToken = (res, user) => {
  const token = createToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
};

//signing up user to the system
exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    photo: req.body.photo,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = createToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
});

//login up user to the system
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide your email and password', 400));
  }
  //check if user exists and password is corect

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Your Email or Password is incorrect!', 400));
  }

  //if everything is ok create and send token to client
  createAndSentToken(res, user);
});

exports.protect = catchAsync(async (req, res, next) => {
  //1)Get token and check if it's there
  let token = '';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  //if there is not token create Error
  if (!token) {
    return next(new AppError('You are not loged in,Please Log in to get access!', 401));
  }

  //2)Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  if (!decoded) {
    return next(new AppError('You are not loged in,Please Log in to get access!', 401));
  }

  //3)Check if user still exist
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('The user belong to this token does no longer exist!', 401));
  }

  //4)Check if user changed password after JWT token was issued
  if (user.changePasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password. Please loged in again!', 401));
  }

  //Set the req.user to decoded user to use in other middlewares
  req.user = user;
  //GRANT ACESS TO PROTECT ROUTE
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You are not allowed to access this route', 403));
    }
    next();
  };
};
