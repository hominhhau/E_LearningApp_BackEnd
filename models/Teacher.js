const mongoose = require('mongoose');

// Define the Teacher schema
const teacherSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    major: {
        type: String,
        required: true,
        trim: true,
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }],
}, {
    timestamps: true,
    versionKey: false,
});

// Ensure the referenced User has the role of 'teacher'
teacherSchema.pre('save', async function (next) {
    const User = mongoose.model('User');
    const user = await User.findById(this.user);
    if (!user || user.role !== 'teacher') {
        return next(new Error('Associated user must have the role of teacher'));
    }
    next();
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
