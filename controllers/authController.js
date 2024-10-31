const User = require('../models/User');
const PhoneAuth = require('../models/PhoneAuth');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');

module.exports = {
    registerByPhone: async (req, res) => {
        const { name, email, phone, password, image, role } = req.body;

        try {
            let user = await User.findOne({ phone });

            if (user) {
                return res.status(409).json({ message: "User already exists." });
            } else {
                const hashedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET).toString();

                // Tạo userID duy nhất dựa trên timestamp hiện tại
                const userID = `${Date.now()}`;

                const newUser = new User({
                    userID,
                    name,
                    email,
                    image,
                    role,
                });
                user = await newUser.save();

                const newPhoneAuth = new PhoneAuth({
                    phoneNumber: phone,
                    password: hashedPassword,
                    userID
                });
                await newPhoneAuth.save();

                res.status(200).json(user);
            }

        } catch (error) {
            console.error("Error during registration:", error);
            res.status(500).json({ message: error.message });
        }
    },

    loginByPhone: async (req, res) => {
        const { phone, password } = req.body;

        try {
            const phoneAuth = await PhoneAuth.findOne({ phoneNumber: phone });
            if (!phoneAuth) {
                return res.status(404).json({ message: "User not found." });
            } else {
                const user = await User.findOne({ userID: phoneAuth.userID });

                if (!user) {
                    return res.status(404).json({ message: "User not found." });
                } else {
                    return res.status(200).json(user);
                }
            }

            const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
            const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

            if (originalPassword !== password) {
                return res.status(401).json({ message: "Wrong password." });
            }


        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).json({ message: error.message });
        }


    }
};
