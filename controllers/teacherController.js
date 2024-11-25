const Teacher = require('../models/Teacher');
const User = require('../models/User');
const Course = require('../models/Course');
const mongoose = require('mongoose');
module.exports = {

    // add  teacher
    /**
     *  user: {
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
     */
    createTeacher: async (req, res) => {
        try {
            const { _id, major, courses } = req.body;

            const user = await User.findById(_id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const teacher = new Teacher({
                user: _id,
                major,
                courses
            });
            await teacher.save();
            return res.status(201).json({ teacher });
        } catch (error) {
            console.error("Error adding teacher:", error);
            res.status(500).json({ message: error.message });
        }
    }


};


