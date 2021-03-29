const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

//merge the parameters of other routes to this route
const router = express.Router({ mergeParams: true });

// const loger = (req, res, next) => {
//   console.log(req.body);
//   console.log(req.params);
//   console.log(req.user);
//   next();
// };

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
