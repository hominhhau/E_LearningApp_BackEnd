const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Route để tạo bài học mới
router.post('/createInvoice', invoiceController.createInvoice);


router.post('/getInvoicesByUser', invoiceController.getInvoiceByUser);

module.exports = router;