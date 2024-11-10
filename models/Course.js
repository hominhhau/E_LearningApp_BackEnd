const mongoose = require('mongoose');
const Category = require('./Category'); // Import Category model

// Course Schema
const CourseSchema = new mongoose.Schema({
    courseID: {
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
    teacherID: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        url: {
            type: String,
            default: 'https://example.com/default-course.png'
        },
        alt: {
            type: String,
            default: 'Course thumbnail'
        }
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, // Change to ObjectId
        ref: 'Category', // Reference to Category model
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['draft', 'published', 'unpublished'],
        default: 'draft'
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numRating: {
        type: Number,
        default: 0,
        min: 0
    },
    numEnrollment: {
        type: Number,
        default: 0,
        min: 0
    },
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
    duration: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    versionKey: false
});

// Thêm index cho full-text search
CourseSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Course', CourseSchema);
