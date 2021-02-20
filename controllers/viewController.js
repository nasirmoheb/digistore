const Product = require('./../models/productModel');

const catchAsync = require('./../utils/catchAsync');

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
