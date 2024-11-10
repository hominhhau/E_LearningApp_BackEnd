const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

module.exports = {
    // Tạo khóa học mới
    createCourse: async (req, res) => {
        const { courseID, name, teacherID, description, image, category, price, discount, status } = req.body;

        try {
            const newCourse = new Course({
                courseID,
                name,
                teacherID,
                description,
                image,
                category,
                price,
                discount,
                status
            });
            const savedCourse = await newCourse.save();
            res.status(201).json(savedCourse);
        } catch (error) {
            console.error("Error creating course:", error);
            res.status(500).json({ message: error.message });
        }
    },

    // Lấy tất cả khóa học
    getAllCourses: async (req, res) => {
        try {
            const courses = await Course.find().populate('category');
            res.status(200).json(courses);
        } catch (error) {
            console.error("Error fetching courses:", error);
            res.status(500).json({ message: error.message });
        }
    },

    // Cập nhật khóa học
    updateCourse: async (req, res) => {
        const { id } = req.params;
        const updates = req.body;

        try {
            const updatedCourse = await Course.findByIdAndUpdate(id, updates, { new: true }).populate('category');
            res.status(200).json(updatedCourse);
        } catch (error) {
            console.error("Error updating course:", error);
            res.status(500).json({ message: error.message });
        }
    },

    // Xóa khóa học
    deleteCourse: async (req, res) => {
        const { id } = req.params;

        try {
            await Course.findByIdAndDelete(id);
            res.status(204).send();
        } catch (error) {
            console.error("Error deleting course:", error);
            res.status(500).json({ message: error.message });
        }
    },

    addLessonToCourse: async (req, res) => {
        const { courseId, lessonId } = req.body;

        try {
            await addLessonToCourse(courseId, lessonId);
            res.status(200).json({ message: 'Lesson added to course successfully' });
        } catch (error) {
            console.error("Error adding lesson to course:", error);
            res.status(500).json({ message: error.message });
        }
    }
};

async function addLessonToCourse(courseId, lessonId) {
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            throw new Error('Course not found');
        }
        course.lessons.push(lessonId); // Thêm ID bài học vào mảng lessons
        await course.save(); // Lưu khóa học với bài học mới
    } catch (error) {
        console.error(error);
    }
}