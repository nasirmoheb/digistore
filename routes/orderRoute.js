const express = require('express');
const orderController = require('./../controllers/orderController');

const router = new express.Router();

router
  .route('/')
  .get(orderController.getOrders)
  .post(orderController.creatOrder);

router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(orderController.updateOrders)
  .delete(orderController.deleteOrders);

module.exports = router;
