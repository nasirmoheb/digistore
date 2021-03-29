const express = require('express');
const orderController = require('./../controllers/orderController');
const authController = require('../controllers/authController');

const router = new express.Router();

//all routes after this will use this middleware authController.protect
router.use(authController.protect);
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
