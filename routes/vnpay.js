const express = require('express');
const router = express.Router();

const vnpayController = require('../controllers/vnpayController');

// Route để tạo bài học mới
router.post('/createPaymentUrl', vnpayController.createPaymentUrl);
router.post('/order/vnpay_return', vnpayController.vnpayReturn);

module.exports = router;