const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Route để tạo khóa học mới
router.post('/createCourse', courseController.createCourse);

// Route để lấy tất cả khóa học
router.get('/getAllCourses', courseController.getAllCourses);

// Route để cập nhật khóa học
router.put('/updateCourse/:id', courseController.updateCourse);

// Route để xóa khóa học
router.delete('/deleteCourse/:id', courseController.deleteCourse);

// Route để lấy khóa học theo user
router.post('/getCourseByUser', courseController.getCourseByUser);

// Route để lấy các khóa học mà user chưa enroll
router.post('/unenrolled-courses', courseController.getUnenrolledCourses);


module.exports = router;