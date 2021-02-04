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
    //default sort by time of creation
    query = query.sort('-createdAt');
  }

  //4)Feild Limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
    console.log(fields);
  } else {
    //default don't show (__v)
    query = query.select('-__v');
  }

  //5)Paginating
  if (req.query.page && req.query.limit) {
    //page
    const page = req.query.page * 1;
    //limit item per page
    const limit = req.query.limit * 1;
    //calculate skip
    const skip = page * limit - limit;
    //paginating
    query = query.skip(skip).limit(limit);
  } else {
    //default limit 100 item in page
    query = query.skip(0).limit(100);
  }

  //6)

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
