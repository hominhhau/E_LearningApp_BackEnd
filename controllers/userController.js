const User = require('../models/User');
const Course = require('../models/Course');

module.exports = {
    // Đăng ký khóa học
    async enrollCourse(req, res) {
        const { userId, courseId } = req.body;

        try {
            // Tìm người dùng bằng trường userID
            const user = await User.findOne({ userID: userId });
            console.log("userId", userId);
            console.log("user", user);
            const course = await Course.findOne({ courseID: courseId });
            console.log("courseId", courseId);
            console.log("course", course);

            // Kiểm tra xem người dùng có tồn tại không
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            // Kiểm tra xem khóa học có tồn tại không
            if (!course) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }

            // Log enrolledCourses để kiểm tra
            console.log("Enrolled Courses:", user.enrolledCourses);

            // Check if the user is already enrolled in the course
            const alreadyEnrolled = user.enrolledCourses.some(
                (enrollment) => enrollment.courseId.toString() === course._id.toString()
            );

            // Log để kiểm tra giá trị alreadyEnrolled
            console.log("Already Enrolled:", alreadyEnrolled);

            if (alreadyEnrolled) {
                return res.status(400).json({ success: false, message: 'User is already enrolled in this course' });
            }

            // Add course to user's enrolledCourses array
            user.enrolledCourses.push({
                courseId: course._id,
                enrolledDate: new Date(),
                completedLessons: [],  // initially empty since the user hasn't completed any lessons
                progress: 0  // initial progress
            });

            // Save the user with the new enrollment
            await user.save();

            return res.status(200).json({ success: true, message: 'Enrolled in course successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },
    getCourseByUser: async (req, res) => {
        const { userId } = req.body;

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
    }



};
