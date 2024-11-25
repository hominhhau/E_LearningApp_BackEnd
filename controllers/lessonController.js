const Lesson = require('../models/Lesson');

module.exports = {
    // Tạo bài học mới
    createLesson: async (req, res) => {
        const { courseID, name, description, content, video, order, minimumWatchRequired } = req.body;

        try {
            const newLesson = new Lesson({
                courseID,
                name,
                description,
                content,
                video,
                order,
                minimumWatchRequired
            });
            const savedLesson = await newLesson.save();
            res.status(201).json(savedLesson);
        } catch (error) {
            console.error("Error creating lesson:", error);
            res.status(500).json({ message: error.message });
        }
    },

    // Lấy tất cả bài học theo khóa học
    getLessonsByCourse: async (req, res) => {
        const { courseID } = req.body;
        console.log("courseIDhjfdfh", courseID);

        try {
            const lessons = await Lesson.find({ courseID });
            res.status(200).json(lessons);
        } catch (error) {
            console.error("Error fetching lessons:", error);
            res.status(500).json({ message: error.message });
        }
    },

    // Cập nhật bài học
    updateLesson: async (req, res) => {
        const { id } = req.params;
        const updates = req.body;

        try {
            const updatedLesson = await Lesson.findByIdAndUpdate(id, updates, { new: true });
            res.status(200).json(updatedLesson);
        } catch (error) {
            console.error("Error updating lesson:", error);
            res.status(500).json({ message: error.message });
        }
    },

    // Xóa bài học
    deleteLesson: async (req, res) => {
        const { id } = req.params;

        try {
            await Lesson.findByIdAndDelete(id);
            res.status(204).send();
        } catch (error) {
            console.error("Error deleting lesson:", error);
            res.status(500).json({ message: error.message });
        }
    }
};