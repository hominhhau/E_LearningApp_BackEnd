const { auth } = require('firebase-admin');
const mongoose = require('mongoose');
const { create } = require('./User');

const AuthSchema = new mongoose.Schema({
    authID: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    authType: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

module.exports = mongoose.model('Auth', AuthSchema);