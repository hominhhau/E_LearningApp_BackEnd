const express = require('express');
const router = express.Router();
const vnpayController = require('../controllers/vnpayController');

// Route to handle creating VNPAY payment URL
router.post('/createPaymentUrl', vnpayController.createPaymentUrl);

// Route to handle VNPAY return callback
router.get('/order/vnpay_return', vnpayController.vnpayReturn);

module.exports = router;
