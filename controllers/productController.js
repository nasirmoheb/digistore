const Product = require('./../models/producModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllProduct = catchAsync(async (req, res, next) => {
  //Build query
  //1)Filtering
  let queryObj = { ...req.query };
  //exclude fields that are not in database
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(e => delete queryObj[e]);

  //2)Advanced Filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  queryObj = JSON.parse(queryStr);

  let query = Product.find(queryObj);

  //3)sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //4)Feild Limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
    console.log(fields);
  } else {
    query = query.select('-__v');
  }

  //Execute query
  const products = await query;

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
