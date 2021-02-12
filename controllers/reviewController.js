const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createReview = catchAsync(async (req, res, next) => {
  //Nested Routes
  //if user don't specify the product id get it from params
  if (!req.body.product) req.body.product = req.params.productId;
  //if user don't' specify the user id get it from current user
  if (!req.body.user) req.body.user = req.user.id;

  const review = await Review.create(req.body);

  res.status(200).json({
    status: 'success',
    data: review
  });
});

exports.getAllReview = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.params.productId) filter.product = req.params.productId;
  const review = await Review.find(filter).populate('user');

  res.status(200).json({
    status: 'success',
    data: review
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate('user');

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: review
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: review
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
