const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Tạo danh mục mới
router.post('/createCategory', categoryController.createCategory);

// Lấy tất cả danh mục
router.get('/getAllCategories', categoryController.getAllCategories);

// Cập nhật danh mục
router.put('/updateCategory:id', categoryController.updateCategory);

// Xóa danh mục
router.delete('/deleteCategory:id', categoryController.deleteCategory);

module.exports = router; 