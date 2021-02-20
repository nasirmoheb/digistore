const express = require('express');

const viewController = require('./../controllers/viewController');

const router = express.Router();
router.use('/product/:slug', viewController.getProduct);

router.use('/', viewController.getHome);

module.exports = router;
