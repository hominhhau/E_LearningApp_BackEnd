const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// Route để tạo bài học mới
router.post('/enrollCourse', userController.enrollCourse);


module.exports = router;