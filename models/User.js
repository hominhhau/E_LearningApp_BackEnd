const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    role: {
        type: String,
        required: true,
        enum: ['learner', 'teacher', 'admin'],
        default: 'learner'
    },
    image: {
        type: String,
        required: false
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetPasswordExpires: {
        type: Date,
        required: false
    },

    isActive: {
        type: Boolean,
        default: true
    },
    enrolledCourses: [{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        enrolledDate: {
            type: Date,
            default: Date.now
        },
        completedLessons: [{
            lessonId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Lesson'
            },
            watchedDuration: {
                type: Number,
                default: 0
            },
            isCompleted: {
                type: Boolean,
                default: false
            },
            lastWatched: {
                type: Date,
                default: Date.now
            }
        }],
        progress: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true,
    versionKey: false
});

// Tính toán tiến độ khóa học
UserSchema.methods.calculateCourseProgress = async function (courseId) {
    const course = await this.model('Course').findById(courseId);
    if (!course) return 0;

    const enrolledCourse = this.enrolledCourses.find(
        course => course.courseId.toString() === courseId.toString()
    );

    if (!enrolledCourse) return 0;

    const completedLessons = enrolledCourse.completedLessons.filter(
        lesson => lesson.isCompleted
    ).length;

    const totalLessons = course.lessons.length;
    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // Cập nhật tiến độ
    enrolledCourse.progress = progress;
    await this.save();

    return progress;
};

module.exports = mongoose.model('User', UserSchema);
