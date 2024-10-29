const User = require('../models/User');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const admin = require("firebase-admin");

module.exports = {
    register: async (req, res) => {
        const { userID, name, email, roleID, image, password } = req.body; // Thêm password vào body

        try {
            // Kiểm tra xem người dùng có tồn tại trong Firebase Authentication không
            let firebaseUser;
            try {
                firebaseUser = await admin.auth().getUserByEmail(email);
            } catch (error) {
                // Xử lý lỗi nếu người dùng không tìm thấy
                if (error.code === 'auth/user-not-found') {
                    return res.status(404).json({ message: "Firebase user not found. Please register first." });
                }
                return res.status(500).json({ message: error.message });
            }

            // Kiểm tra xem người dùng đã tồn tại trong MongoDB chưa
            let user = await User.findOne({ email });

            if (user) {
                // Nếu người dùng đã tồn tại, trả về thông báo
                return res.status(409).json({ message: "User already exists." });
            }

            // Tạo người dùng mới nếu không tìm thấy trong MongoDB
            const hashedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET).toString(); // Mã hóa mật khẩu
            const newUser = new User({
                userID: firebaseUser.uid,
                name,
                email,
                roleID,
                image,
                // password: hashedPassword // Lưu mật khẩu đã mã hóa
            });
            user = await newUser.save();

            res.status(200).json(user);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email }, { __v: 0, updatedAt: 0, createdAt: 0, email: 0 });

            if (!user) return res.status(401).json("Wrong credentials!");

            // Giải mã mật khẩu đã lưu và so sánh
            const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
            const decrypted = decryptedPassword.toString(CryptoJS.enc.Utf8);

            if (decrypted !== req.body.password) return res.status(401).json("Wrong credentials!");

            // Tạo JWT
            const userToken = jwt.sign(
                { id: user._id, role: user.roleID, email: user.email },
                process.env.JWT_SEC,
                { expiresIn: "21d" }
            );

            const { password, ...other } = user._doc;
            res.status(200).json({ ...other, userToken });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
