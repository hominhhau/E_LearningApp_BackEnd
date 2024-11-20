const express = require('express');
const router = express.Router();

const chatgptController = require('../controllers/chatgptController');

// Route để tạo bài học mới
router.post('/chatgpt', chatgptController.chatgpt);


module.exports = router;