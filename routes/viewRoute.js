const express = require('express');

const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.use('/product/:slug', viewController.getProduct);

router.use('/search', viewController.getSearch);

router.use('/login', viewController.getLogin);

router.use('/profile', viewController.getProfile);

router.use('/', viewController.getHome);

module.exports = router;
