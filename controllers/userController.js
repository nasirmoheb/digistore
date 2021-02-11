const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeature = require('./../utils/apiFeature');
const User = require('./../models/userModel');

exports.getAllUser = catchAsync(async (req, res, next) => {
  const features = new APIFeature(User.find(), req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const user = await features.query;

  res.status(200).json({
    status: 'success',
    length: user.length,
    data: user
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate('reviews');

  if (!user) {
    return next(new AppError('No User found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: user
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({
    status: 'success',
    data: user
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new AppError('No User found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: user
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

//This function is for filtering unwanted fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //send error if user want to update password with this route
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('This route is not for updating password.Please use updatePassword route!', 400)
    );
  }
  //filter unwanted fields
  const updateData = filterObj(req.body, 'name');
  //update the current user
  const user = await User.findByIdAndUpdate(req.user.id, updateData, {
    runValidators: true,
    new: true
  });
  //send the response
  res.status(200).json({
    status: 'success',
    data: user
  });
});
