const Cart = require('../models/cartModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.creatCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.create(req.body);

  if (!cart) {
    return next(new AppError('There is an error in creating cart', 404));
  }

  res.status(200).json({
    status: 'success',
    data: cart
  });
});

exports.getCarts = catchAsync(async (req, res, next) => {
  const carts = await Cart.find();

  res.status(200).json({
    status: 'success',
    data: carts
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id);

  if (!cart) {
    return next(new AppError('No cart with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: cart
  });
});

exports.deleteCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findByIdAndDelete(req.params.id);

  if (!cart) {
    return next(new AppError('No cart found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.updateCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!cart) {
    return next(new AppError('No cart found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: cart
  });
});
