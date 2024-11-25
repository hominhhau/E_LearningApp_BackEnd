const mongoose = require('mongoose');

// Lesson Schema
const LessonSchema = new mongoose.Schema({
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    video: {
        url: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true,
            min: 0
        }
    },
    order: {
        type: Number,
        required: true,
        min: 1
    },
    watchRequired: {
        type: Boolean,
        default: false, // Phần trăm video cần xem để hoàn thành (mặc định 90%)
        // min: 0,
        // max: 100
    }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Lesson', LessonSchema);