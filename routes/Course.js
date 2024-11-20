const router = require('express').Router();
const courseController = require('../controllers/courseController');

// Route để tạo khóa học mới
router.post('/createCourse', courseController.createCourse);

// Route để lấy tất cả khóa học
router.get('/getAllCourses', courseController.getAllCourses);

// Route để cập nhật khóa học
router.put('/updateCourse:id', courseController.updateCourse);

// Route để xóa khóa học
router.delete('/deleteCourse:id', courseController.deleteCourse);
router.post('/getCourseByUser', courseController.getCourseByUser);

module.exports = router;