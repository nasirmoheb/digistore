const express = require('express');
const cartController = require('./../controllers/cartController');

const router = new express.Router();

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
