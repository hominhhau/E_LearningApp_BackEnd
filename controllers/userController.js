const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const PhoneAuth = require('../models/PhoneAuth');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

//Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('Email không tồn tại');

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'nguyenquynhgiang1324@gmail.com',
            pass: 'wgpj zhvj oghf fdzz',
        },
    });

    const mailOptions = {
        to: user.email,
        subject: 'E_LearningAPP thông báo: Yêu cầu reset mật khẩu',
        text: `Chào bạn,\n\nChúng tôi đã nhận được yêu cầu reset mật khẩu cho tài khoản của bạn tại E-Learning App.\n\nMã reset mật khẩu của bạn là: ${resetToken}\n\nVui lòng nhập mã này vào trang reset mật khẩu trong vòng 1 giờ. Nếu bạn không yêu cầu thay đổi mật khẩu, bạn có thể bỏ qua email này và tài khoản của bạn sẽ không bị ảnh hưởng.\n\nChúc bạn học tập hiệu quả!\nTrân trọng,\nĐội ngũ E-Learning App`,
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) return res.status(500).send('Có lỗi xảy ra khi gửi email');
        //res.send('Mã reset mật khẩu đã được gửi đến email của bạn');
        return res.status(200).json({
            success: true,
            message: 'Mã reset mật khẩu đã được gửi đến email của bạn',
        });
    });
};

exports.verifyResetToken = async (req, res) => {
    const { email, resetToken } = req.body;

    console.log('Email:', email);  // In email nhận được từ frontend
    console.log('Reset Token:', resetToken);  // In mã nhận được từ frontend
    console.log('--------------------------------');

    const user = await User.findOne({
        email: email.toLowerCase(),
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: Date.now() }, // Kiểm tra mã hết hạn
    });

    if (!user) {
        console.log('User not found or token expired');  // Ghi lại lỗi nếu không tìm thấy người dùng hoặc token hết hạn
        //return res.status(400).send('Mã reset mật khẩu không hợp lệ hoặc đã hết hạn');
        return res.status(400).json({
            success: false,
            message: 'Mã reset mật khẩu không hợp lệ hoặc đã hết hạn',
        });
    }

    //res.send('Mã hợp lệ, bạn có thể tạo mật khẩu mới');
    return res.status(200).json({
        success: true,
        message: 'Mã hợp lệ, bạn có thể tạo mật khẩu mới',
    });
};

// Đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
    const { email, resetToken, newPassword } = req.body;

    console.log('Email:', email);  // In email nhận được từ frontend
    console.log('Reset Token:', resetToken);  // In mã nhận được từ frontend
    console.log('New Password:', newPassword);

    const user = await User.findOne({
        email: email.toLowerCase(),
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        // return res.status(400).send('Mã reset mật khẩu không hợp lệ hoặc đã hết hạn');
        return res.status(400).json({
            success: false,
            message: 'Mã reset mật khẩu không hợp lệ hoặc đã hết hạn',
        })
    }

    //Cập nhật mật khẩu trong PhoneAuth
    const phoneAuth = await PhoneAuth.findOne({ userID: user.userID });
    if (!phoneAuth) {
        return res.status(404).json({
            success: false,
            message: 'Không tìm thấy thông tin tài khoản',
        });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    phoneAuth.password = hashedPassword;
    phoneAuth.resetPasswordToken = undefined; // Xóa mã reset sau khi sử dụng
    phoneAuth.resetPasswordExpires = undefined; // Xóa thời gian hết hạn

    //Check password coi có thay đổi không 
    //consolog.log('updating user password');
    // const updatedUser = await User.save(); // Lưu lại thay đổi vào DB

    // //kiểm tra kết quả lưu
    //     if (updatedUser) {
    //         return res.status(200).json({
    //             success: true,
    //             message: 'Mật khẩu đã được cập nhật',
    //         });
    //     } else {
    //         return res.status(500).json({
    //             success: false,
    //             message: 'Có lỗi xảy ra khi cập nhật mật khẩu',
    //         });
    //     }

    await phoneAuth.save();
    return res.status(200).json({
        success: true,
        message: 'Mật khẩu đã được cập nhật',
    });

    //res.send('Mật khẩu đã được cập nhật');
    //res.status(200).json({ success: true, message: 'Mật khẩu đã được cập nhật' });
};



// Enroll Course
exports.enrollCourse = async (req, res) => {
    const { userId, courseId } = req.body;

    try {
        // Find User
        const user = await User.findOne({ userID: userId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Find Course
        const course = await Course.findOne({ courseID: courseId });
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Check if User is already enrolled in the course
        const alreadyEnrolled = user.enrolledCourses.some(
            (enrollment) => enrollment.courseId.toString() === course._id.toString()
        );
        if (alreadyEnrolled) {
            return res.status(400).json({ success: false, message: 'User is already enrolled in this course' });
        }

        // Fetch lessons for the course
        const lessons = await Lesson.find({ courseID: course._id });

        // Initialize completedLessons with lessons from the course
        const completedLessons = lessons.map((lesson) => ({
            lessonId: lesson._id,
            watchedDuration: 0,
            isCompleted: false,
            lastWatched: new Date(),
        }));

        // Add course to user's enrolled courses
        user.enrolledCourses.push({
            courseId: course._id,
            enrolledDate: new Date(),
            completedLessons,
            progress: 0, // Initial progress
        });

        // Save changes
        await user.save();

        res.status(200).json({ success: true, message: 'Enrolled in course successfully' });
    } catch (error) {
        console.error('Error enrolling course:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

exports.updateLessonCompletion = async (req, res) => {
    const { userId, courseId, lessonId, isCompleted } = req.body;

    try {
        // Find User and Course
        const user = await User.findOne({ userID: userId, 'enrolledCourses.courseId': courseId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User or course not found' });
        }

        // Find the specific course enrollment
        const courseEnrollment = user.enrolledCourses.find(enrollment => enrollment.courseId.toString() === courseId);
        if (!courseEnrollment) {
            return res.status(404).json({ success: false, message: 'Course not found in user enrollments' });
        }

        // Find the lesson in the enrolled course
        const lesson = courseEnrollment.completedLessons.find(lesson => lesson.lessonId.toString() === lessonId);
        if (!lesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found' });
        }

        // Update the lesson's completion status
        lesson.isCompleted = isCompleted;

        // Recalculate progress
        const totalLessons = courseEnrollment.completedLessons.length;
        const completedCount = courseEnrollment.completedLessons.filter(lesson => lesson.isCompleted).length;
        courseEnrollment.progress = (completedCount / totalLessons) * 100;

        // Save changes
        await user.save();

        res.status(200).json({ success: true, message: 'Lesson status updated', progress: courseEnrollment.progress });
    } catch (error) {
        console.error('Error updating lesson completion:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};







