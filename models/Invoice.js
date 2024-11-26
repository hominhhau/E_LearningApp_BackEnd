const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    invoiceID: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userID: {
        type: String,
        required: true,
        index: true
    },
    courseID: {
        type: String,
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'paid', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Invoice', InvoiceSchema);