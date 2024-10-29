
const { auth } = require('firebase-admin');
const mongoose = require('mongoose');

const PhoneAuthSchema = new mongoose.Schema({
    authID: {
        type: String,
        required: true
    },
    phoneNumBer: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
    ,
}, { timestamps: true });

module.exports = mongoose.model('PhoneAuth', PhoneAuthSchema);