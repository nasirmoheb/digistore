const multer = require('multer');
const sharp = require('sharp');
const Product = require('./../models/productModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeature = require('./../utils/apiFeature');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image ! Please upload only images.', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

//When mix of one and array
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  {
    name: 'images'
  }
]);

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // req.files.imageCover = `user-${req.user.id}-${Date.now()}.jpeg`;

  //1) ImageCover
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/${req.body.imageCover}`);
  //2) Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (el, i) => {
      const fileName = `product-${req.params.id}-${Date.now()}-image-${i}.jpeg`;
      await sharp(el.buffer)
        .resize(500, 700)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/${fileName}`);

      req.body.images.push(fileName);
    })
  );

  next();
});

exports.getAllProduct = catchAsync(async (req, res, next) => {
  const features = new APIFeature(Product.find(), req.query)
    .filter()
    .search()
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
  const product = await Product.findById(req.params.id).populate('reviews');

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
