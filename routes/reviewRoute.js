const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

//merge the parameters of other routes to this route
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.protect, authController.restrictTo('user'), reviewController.getAllReview)
  .post(authController.protect, authController.restrictTo('user'), reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
