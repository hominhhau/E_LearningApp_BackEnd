const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userID: {
        type: String,  // Sử dụng Number thay vì Integer
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        enum: ['learner', 'teacher', 'admin']
    },
    image: {
        type: String,
        required: false
    },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
