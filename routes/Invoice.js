const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Route để tạo bài học mới
router.post('/createInvoice', invoiceController.createInvoice);

// Route để lấy tất cả bài học theo khóa học
router.post('/getInvoicesByCourse', invoiceController.getInvoiceByUser);

module.exports = router;