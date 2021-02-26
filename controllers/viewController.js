const Product = require('./../models/productModel');
const Category = require('./../models/catagoryModel');

const catchAsync = require('./../utils/catchAsync');

exports.getCatagories = catchAsync(async (req, res, next) => {
  const catagories = await Category.find();
  res.locals.catagories = catagories;
  next();
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const products = await Category.findOne({ slug: req.params.slug }).populate('products');

  // console.log(products);
  res.status(200).render('category', products);
});

exports.getMCategory = catchAsync(async (req, res, next) => {
  res.status(200).render('manageCategory');
});

exports.getMProduct = catchAsync(async (req, res, next) => {
  const categoryName = await Category.find();

  res.status(200).render('manageProduct', { categoryName });
});

exports.getHome = catchAsync(async (req, res, next) => {
  //1) Get data from database

  const latestProducts = await Product.find();

  const trendingProducts = await Product.find();

  res.status(200).render('home', {
    title: 'DigiStore',
    latestProducts,
    trendingProducts
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('reviews');

  console.log(product.reviews);

  const similarProducts = await Product.find({ $text: { $search: product.name } })
    .select({ score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .skip(1);

  res.status(200).render('product', {
    product,
    similarProducts
  });
});

exports.getLogin = catchAsync(async (req, res, next) => {
  res.status(200).render('login');
});

exports.getProfile = catchAsync(async (req, res, next) => {
  res.status(200).render('profile');
});

exports.getSearch = catchAsync(async (req, res, next) => {
  const searchRes = await Product.find({ $text: { $search: req.query.text } })
    .select({ score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });

  res.status(200).render('search', {
    searchRes,
    searchText: req.query.text
  });
});
