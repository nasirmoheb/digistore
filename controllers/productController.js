const Product = require('./../models/producModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeature = require('./../utils/apiFeature');

exports.getAllProduct = catchAsync(async (req, res, next) => {
  const features = new APIFeature(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  //Execute query
  const products = await features.query;

  //send response
  res.status(200).json({
    status: 'success',
    length: products.length,
    data: products
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: product
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newProduct
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!newProduct) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: newProduct
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});
