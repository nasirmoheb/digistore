const express = require('express');

const viewController = require('./../controllers/viewController');

const router = express.Router();
router.use('/', viewController.getHome);

router.use('/product', viewController.getProduct);

module.exports = router;
