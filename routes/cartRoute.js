const express = require('express');
const cartController = require('./../controllers/cartController');
const authController = require('../controllers/authController');

const router = new express.Router();

//all routes after this will use this middleware authController.protect
router.use(authController.protect);
router
  .route('/')
  .get(cartController.getCarts)
  .post(cartController.creatCart);

router
  .route('/:id')
  .get(cartController.getCart)
  .patch(cartController.updateCart)
  .delete(cartController.deleteCart);

module.exports = router;
