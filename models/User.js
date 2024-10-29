const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userID: {
        type: String,
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

    roleID: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);