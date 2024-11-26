const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');

// Route để tạo bài học mới
router.post('/createLesson', lessonController.createLesson);

// Route để lấy tất cả bài học theo khóa học
router.post('/getLessonsByCourse', lessonController.getLessonsByCourse);

// Route để cập nhật bài học
router.put('/updateLesson:id', lessonController.updateLesson);

// Route để xóa bài học
router.delete('/deleteLesson:id', lessonController.deleteLesson);
//getLessonsByCourse
router.post('/getLessonsByCourse', lessonController.getLessonsByCourse);

// Route để cập nhật watchRequired
router.post('/updateWatchRequired', lessonController.updateWatchRequired);

// Route để lấy thống kê watchRequired
router.post('/getWatchRequiredStats', lessonController.getWatchRequiredStats);

module.exports = router;