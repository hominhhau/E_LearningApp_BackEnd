const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

router.post('/createTeacher', teacherController.createTeacher);

module.exports = router; 