const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');

const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

//create JWT token
const createToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

//create and send JWT token
const createAndSentToken = (res, statusCode, user) => {
  //create token with user id payload
  const token = createToken(user._id);
  //seting cookie options
  const cookieOption = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  //if we are in producuction sent cookie on a secure connection
  if (process.env.NODE_ENV === 'production') cookieOption.secure = true;
  //don't show user password
  user.password = undefined;
  //send JWT cookie
  res.cookie('jwt', token, cookieOption);
  //send the respone with the token and user information
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

//signing up user to the system
exports.signup = catchAsync(async (req, res, next) => {
  //only create the user with allowed fields
  const user = await User.create({
    name: req.body.name,
    photo: req.body.photo,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  //Create random active token
  const activeToken = user.createUserActiveToken();
  //after modefing the user save it
  user.save({ validateBeforeSave: false });

  //create the url of activation
  const activeUrl = `${req.protocol}://${req.get('host')}/api/v1/user/active/${activeToken}`;
  //create the message
  const message = `Hi ${
    user.name
  }!\n We are glad that you are useing our website. Please submit a POST request m to:\n ${activeUrl}\n to active your account \n If you do not register in our website, please ignore this email. `;

  try {
    //send the token to the user email
    await sendEmail({
      email: user.email,
      subject: 'Your Account Activeation Link (Valid for 5 days)',
      message: message
    });

    //Send response to the user
    res.status(200).json({
      status: 'success',
      message: `Your activation link has been sent to ${
        user.email
      }.\n Please go to your email and active your account.`,
      data: user
    });
  } catch (err) {
    //if there is error delete the user and send error message
    await User.deleteOne({ email: req.body.email });
    res.status(500).json({
      status: 'Error',
      message: 'There was error in sending email'
    });
  }

  // res.status(200).json({
  //   status: 'success',
  //   message: message,
  //   data: user
  // });
});

exports.activeUser = catchAsync(async (req, res, next) => {
  //Get the token from request
  const { token } = req.params;

  //Create the has of token and check it with activeHashToken

  const hashToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  //get the user based on hashToken
  const user = await User.findOne({
    activeHashToken: hashToken,
    activeTokenExpires: { $gt: Date.now() }
  });

  //if the is not a user means token is incorrect or expired
  if (!user) {
    return next(new AppError('Your token is incorrect or expired ', 400));
  }

  //active the user
  user.active = true;
  user.activeHashToken = undefined;
  user.activeTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  //create and send JWT to the user
  createAndSentToken(res, 200, user);
});

//login user to the system
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide your email and password', 400));
  }
  //check if user exists and active and password is corect

  const user = await User.findOne({ email }).select('+password');

  //if Email or password is incorrect send error message
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Your Email or Password is incorrect!', 400));
  }

  //If user is not actived send error message
  if (!user.active) {
    return next(
      new AppError('Your account is not acctivated.Please go to your email and active it!', 400)
    );
  }
  //if everything is ok create and send token to client
  createAndSentToken(res, 200, user);
});

exports.logout = (req, res) => {
  res.cookie('jwt', '', { expires: new Date(Date.now() + 1000), httpOnly: true });
  res.status(200).json({ status: 'success', message: 'loged out successfully' });
};

exports.protect = catchAsync(async (req, res, next) => {
  //1)Get token and check if it's there
  let token = '';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    //in sever rendaring  get the token from cookie
    token = req.cookies.jwt;
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

//This middle ware is for chacking if user is logged in
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);
      if (!user) {
        return next();
      }

      if (user.changePasswordAfter(decoded.iat)) {
        return next();
      }

      //If there is a logged in user we passed to PUG template and every template access to it
      res.locals.user = user;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You are not allowed to access this route', 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email.', 404));
  }
  //2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3)Send it to user email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`;
  const message = `Forgot Password ? Please submit a PATCH request with your new password and password confirm to:\n ${resetURL}\n If you didn't forgot your password , please ignore this email. `;

  try {
    await sendEmail({
      email: req.body.email,
      subject: 'Your password reset token (Valid for 10 minutes)',
      message: message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error on sending email! Please try again later.', 500));
  }
  // res.status(200).json({
  //   status: 'success',
  //   data: resetURL
  // });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //get the posted token from request
  const { token } = req.params;

  //hash the token to check with reset token in user model
  const hashToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  //Check if the token is relate to the user and not expire
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  //if there is not user send error
  if (!user) {
    return next(new AppError('Your token is incorect or expired', 404));
  }

  //send error if user does not provide new password and password confirm
  if (!req.body.password || !req.body.passwordConfirm) {
    return next(new AppError('Please provide your password and password confirm!', 400));
  }

  //update the password of user with new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  //set the password tokens in db to undefined to remove
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // after modefing the user save it in DB
  await user.save();

  //create and send JWT token to log in the user
  createAndSentToken(res, 200, user);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req.body;
  //Send error if user does not provide current password, password and password confirm
  if (!currentPassword || !password || !passwordConfirm) {
    return next(
      new AppError('Please provide your currentPassword ,password and passwordConfirm', 400)
    );
  }
  //find the user by id and select the password field
  const user = await User.findById(req.user.id).select('+password');
  //check the currentPassword of user
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Your current password is incorect', 400));
  }
  //modefy the user password and passwordConfirm with updated password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  //save the modefied user
  await user.save();

  //create and send JWT token to log in the user
  createAndSentToken(res, 200, user);
});
