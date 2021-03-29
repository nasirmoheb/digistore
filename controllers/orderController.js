const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.creatOrder = catchAsync(async (req, res, next) => {
  const order = await Order.create(req.body);

  if (!order) {
    return next(new AppError('There is an error in creating cart', 404));
  }

  res.status(200).json({
    status: 'success',
    data: order
  });
});

exports.getOrders = catchAsync(async (req, res, next) => {
  const carts = await Order.find();

  res.status(200).json({
    status: 'success',
    data: carts
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const cart = await Order.findById(req.params.id);

  if (!cart) {
    return next(new AppError('No cart with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: cart
  });
});

exports.deleteOrders = catchAsync(async (req, res, next) => {
  const cart = await Order.findByIdAndDelete(req.params.id);

  if (!cart) {
    return next(new AppError('No cart found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.updateOrders = catchAsync(async (req, res, next) => {
  const cart = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!cart) {
    return next(new AppError('No cart found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: cart
  });
});
