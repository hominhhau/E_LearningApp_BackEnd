const router = require('express').Router();
const userController = require('../controllers/userController');

router.post('/forgot-password', userController.forgotPassword);

router.post('/reset-password', userController.resetPassword);

module.exports = router;
