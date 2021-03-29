const express = require('express');
const productController = require('../controllers/productController');
const reviewRoute = require('../routes/reviewRoute');
const authController = require('../controllers/authController');

const router = express.Router();

//if this happen redirect to review Router to handler
router.use('/:productId/review', reviewRoute);

router
  .route('/')
  .get(productController.getAllProduct)
  .post(productController.createProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productController.uploadTourImages,
    productController.resizeUserPhoto,
    productController.updateProduct
  )
  .delete(productController.deleteProduct);

module.exports = router;
