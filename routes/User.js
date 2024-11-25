const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route quên mật khẩu
router.post('/forgot-password', userController.forgotPassword);

// Route kiểm tra mã reset
router.post('/verify-reset-token', userController.verifyResetToken);

// Route đặt lại mật khẩu
router.post('/reset-password', userController.resetPassword);

// Route để tạo bài học mới
router.post('/enrollCourse', userController.enrollCourse);

router.post('/updateLessonCompletion', userController.updateLessonCompletion);

module.exports = router;