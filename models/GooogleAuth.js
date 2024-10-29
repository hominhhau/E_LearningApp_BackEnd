
const mongoose = require('mongoose');

const GoogleAuthSchema = new mongoose.Schema({
    authID: {
        type: String,
        required: true
    },
    googleID: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    token: {
        type: String,
        required: false
    },
}, { timestamps: true });