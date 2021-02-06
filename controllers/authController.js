const jwt = require('jsonwebtoken');

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
