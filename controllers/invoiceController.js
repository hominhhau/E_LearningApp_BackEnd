const User = require('../models/User');
const Course = require('../models/Course');
const Invoice = require('../models/Invoice');
const mongoose = require('mongoose');
module.exports = {
    // create invoice
    createInvoice: async (req, res) => {
        try {
            const { invoiceID, userID, courseID, price, status } = req.body;
            console.log("invoice", req.body);

            const user = await User.findById(userID);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const course = await Course.findById(courseID);
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            const invoice = new Invoice({
                invoiceID,
                userID,
                courseID,
                price,
                status
            });
            await invoice.save();
            return res.status(201).json({ invoice });
        } catch (error) {
            console.error("Error creating invoice:", error);
            res.status(500).json({ message: error.message });
        }
    },
    // get invoice by user
    getInvoiceByUser: async (req, res) => {
        const { userID } = req.body;
        try {
            const invoices = await Invoice.find({ userID });
            res.status(200).json(invoices);
        } catch (error) {
            console.error("Error fetching invoices:", error);
            res.status(500).json({ message: error.message });
        }
    },

};


