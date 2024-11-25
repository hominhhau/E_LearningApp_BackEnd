const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
const mongoose = require('mongoose');

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
    },
    getCourseByUser: async (req, res) => {
        const { userId } = req.body;
        console.log("userIdsfsf", userId);

        try {
            const user = await User.findOne({ userID: userId }).populate('enrolledCourses.courseId');

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Lấy thông tin chi tiết cho từng khóa học đã đăng ký
            const courses = user.enrolledCourses.map(enrollment => enrollment.courseId);

            return res.status(200).json({ success: true, courses });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // Lấy các khóa học mà user chưa enroll
    getUnenrolledCourses: async (req, res) => {
        const { userId } = req.body;

        try {
            // Tìm user và populate các khóa học đã đăng ký
            const user = await User.findOne({ userID: userId }).populate('enrolledCourses.courseId');

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Log enrolled courses
            console.log("User Enrolled Courses:", user.enrolledCourses);

            // Lấy danh sách các khóa học đã đăng ký
            const enrolledCourseIds = user.enrolledCourses.map(enrollment => enrollment.courseId.toString());
            console.log("Enrolled Course IDs:", enrolledCourseIds); // Log the IDs

            // Validate ObjectId format
            const validCourseIds = enrolledCourseIds.filter(id => mongoose.Types.ObjectId.isValid(id));
            console.log("Valid Course IDs:", validCourseIds); // Log valid IDs

            // Tìm các khóa học không nằm trong danh sách đã đăng ký
            const unenrolledCourses = await Course.find({
                _id: { $nin: validCourseIds.map(id => new mongoose.Types.ObjectId(id)) }
            });

            console.log("Unenrolled Courses:", unenrolledCourses); // Log the unenrolled courses

            return res.status(200).json({ success: true, unenrolledCourses });
        } catch (error) {
            console.error("Error fetching unenrolled courses:", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // Lấy cả khóa học đã đăng ký và khóa học chưa đăng ký
    getUnenrolledCourses: async (req, res) => {
        const { userId } = req.body; // Lấy userId từ request body

        try {
            // Tìm user và populate các khóa học đã đăng ký
            const user = await User.findOne({ userID: userId }).populate('enrolledCourses.courseId');

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Lấy danh sách ID các khóa học đã đăng ký
            const enrolledCoursesIds = user.enrolledCourses.map(enrollment => enrollment.courseId?._id.toString());
            console.log("Enrolled Courses IDs:", enrolledCoursesIds); // Debug: Log danh sách ID khóa học đã đăng ký

            // Lấy tất cả khóa học
            const allCourses = await Course.find(); // Lấy tất cả các khóa học từ collection
            console.log("All Courses:", allCourses); // Debug: Log danh sách tất cả khóa học

            // Tìm các khóa học chưa được đăng ký
            const unenrolledCourses = allCourses.filter(course =>
                !enrolledCoursesIds.includes(course._id.toString())
            );

            // Trả về danh sách khóa học chưa đăng ký
            return res.status(200).json({
                success: true,
                unenrolledCourses
            });
        } catch (error) {
            console.error("Error fetching unenrolled courses:", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    },
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