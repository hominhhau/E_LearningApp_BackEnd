const User = require('../models/User');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');

module.exports = {
    register: async (req, res) => {
        const { name, email, roleID, image, password } = req.body;

        console.log("Request body:", req.body); // Log body yêu cầu

        try {
            // Kiểm tra xem người dùng đã tồn tại trong MongoDB chưa
            let user = await User.findOne({ email });

            if (user) {
                // Nếu người dùng đã tồn tại, trả về thông báo
                return res.status(409).json({ message: "User already exists." });
            }

            // Tạo người dùng mới nếu không tìm thấy trong MongoDB
            const hashedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET).toString(); // Mã hóa mật khẩu

            // Tạo userID tự động (ví dụ: UUID, hoặc bất kỳ định dạng nào bạn muốn)
            const userID = new Date().getTime().toString(); // Dùng timestamp làm userID

            const newUser = new User({
                userID,
                name,
                email,
                roleID,
                image,
                password: hashedPassword // Lưu mật khẩu đã mã hóa
            });

            user = await newUser.save();

            console.log("User created successfully:", user); // Log thông tin người dùng đã tạo
            res.status(200).json(user);

        } catch (error) {
            console.error("Error during registration:", error); // Ghi lại lỗi
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
            console.error("Error during login:", error); // Ghi lại lỗi
            res.status(500).json({ message: error.message });
        }
    }
};
