const Category = require('../models/Category');

module.exports = {
    // Tạo danh mục mới
    createCategory: async (req, res) => {
        const { name, description } = req.body;

        try {
            const newCategory = new Category({ name, description });
            const savedCategory = await newCategory.save();
            res.status(201).json(savedCategory);
        } catch (error) {
            console.error("Error creating category:", error);
            res.status(500).json({ message: error.message });
        }
    },

    // Lấy tất cả danh mục
    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.find();
            res.status(200).json(categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            res.status(500).json({ message: error.message });
        }
    },

    // Cập nhật danh mục
    updateCategory: async (req, res) => {
        const { id } = req.params;
        const updates = req.body;

        try {
            const updatedCategory = await Category.findByIdAndUpdate(id, updates, { new: true });
            res.status(200).json(updatedCategory);
        } catch (error) {
            console.error("Error updating category:", error);
            res.status(500).json({ message: error.message });
        }
    },

    // Xóa danh mục
    deleteCategory: async (req, res) => {
        const { id } = req.params;

        try {
            await Category.findByIdAndDelete(id);
            res.status(204).send();
        } catch (error) {
            console.error("Error deleting category:", error);
            res.status(500).json({ message: error.message });
        }
    }
}; 