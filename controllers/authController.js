const User = require('../models/User');
const PhoneAuth = require('../models/PhoneAuth');
const nodemailer = require('nodemailer');
const CryptoJS = require("crypto-js");
const bcrypt = require('bcryptjs');
const { forgotPassword } = require('./userController');

module.exports = {
    registerByPhone: async (req, res) => {
        const { name, email, phone, password, image, role } = req.body;

        try {
            let user = await User.findOne({ phone });

            if (user) {
                return res.status(409).json({ message: "User already exists." });
            } else {
                //const hashedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET).toString();
                const hashedPassword = await bcrypt.hash(password, 10); // Băm mật khẩu
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
            const authPhone = await PhoneAuth.findOne({ phoneNumber: phone });
            if (!authPhone) {
                return res.status(404).json({ message: "User not found." });
            } else {
                // 
                const isMatch = await bcrypt.compare(password, authPhone.password); // So sánh mật khẩu
                if (!isMatch) {
                    return res.status(401).json({ message: "Wrong password." });
                } else {
                    const user = await User.findOne({ userID: authPhone.userID });

                    res.status(200).json({ user });
                }
            }
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).json({ message: error.message });
        }
    },
    // change password
    changePassword: async (req, res) => {
        const { userID, oldPassword, newPassword } = req.body;

        try {
            const phoneAuth = await PhoneAuth.findOne({ userID });
            if (!phoneAuth) {
                return res.status(404).json({ message: "User not found." });
            } else {
                const isMatch = await bcrypt.compare(oldPassword, phoneAuth.password);
                if (!isMatch) {
                    return res.status(401).json({ message: "Wrong password." });
                } else {
                    const hashedPassword = await bcrypt.hash(newPassword, 10);
                    phoneAuth.password = hashedPassword;
                    await phoneAuth.save();

                    res.status(200).json({ message: "Password changed successfully." });
                }
            }
        }
        catch (error) {
            console.error("Error during changing password:", error);
            res.status(500).json({ message: error.message });
        }
    },

    //Forgot Password
    //     forgotPassword: async (req, res) => {
    //         const { email } = req.body;

    //     const user = await User.findOne({ email });
    //     if (!user) 
    //         //return res.status(404).send('Email không tồn tại');
    //         return res.status(404).json({
    //             success: false,
    //             message: 'Email không tồn tại',
    //         });


    //     const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    //     user.resetPasswordToken = resetToken;
    //     user.resetPasswordExpires = Date.now() + 3600000;
    //     await user.save();

    //     const transporter = nodemailer.createTransport({
    //         service: 'Gmail',
    //         auth: {
    //             user: 'nguyenquynhgiang1324@gmail.com',
    //             pass: 'wgpj zhvj oghf fdzz',
    //         },
    //     });

    //     const mailOptions = {
    //         to: user.email,
    //         subject: 'E_LearningAPP thông báo: Yêu cầu reset mật khẩu',
    //         text: `Mã reset mật khẩu của bạn là: ${resetToken}`,
    //     };

    //     transporter.sendMail(mailOptions, (error) => {
    //         if (error) 
    //             //return res.status(500).send('Có lỗi xảy ra khi gửi email');
    //             return res.status(500).json({
    //                 success: false,
    //                 message: 'Có lỗi xảy ra khi gửi email',
    //             });
    //         //res.send('Mã reset mật khẩu đã được gửi đến email của bạn');
    //         return res.status(200).json({
    //             success: true,
    //             message: 'Mã reset mật khẩu đã được gửi đến email của bạn',
    //         });
    //     });
    //     },
    //     //Verify Reset Token
    //     verifyResetToken: async (req, res) => {
    //         const { email, resetToken } = req.body;

    //     console.log('Email:', email);  // In email nhận được từ frontend
    //     console.log('Reset Token:', resetToken);  // In mã nhận được từ frontend
    //     console.log('--------------------------------'); 

    //     const user = await User.findOne({
    //       email: email.toLowerCase(),
    //       resetPasswordToken: resetToken,
    //       resetPasswordExpires: { $gt: Date.now() }, // Kiểm tra mã hết hạn
    //     });

    //     if (!user) {
    //         console.log('User not found or token expired');  // Ghi lại lỗi nếu không tìm thấy người dùng hoặc token hết hạn
    //         //return res.status(400).send('Mã reset mật khẩu không hợp lệ hoặc đã hết hạn');
    //         return res.status(400).json({
    //             success: false,
    //             message: 'Mã reset mật khẩu không hợp lệ hoặc đã hết hạn',
    //         });
    //     }

    //     //res.send('Mã hợp lệ, bạn có thể tạo mật khẩu mới');
    //     return res.status(200).json({
    //         success: true,
    //         message: 'Mã hợp lệ, bạn có thể tạo mật khẩu mới',
    //     });
    //     },
    //     //Reset Password
    //     resetPassword: async (req, res) => {
    //         const { email, resetToken, newPassword } = req.body;

    //     console.log('Email:', email);  // In email nhận được từ frontend
    //     console.log('Reset Token:', resetToken);  // In mã nhận được từ frontend
    //     console.log('New Password:', newPassword);

    //     const user = await User.findOne({
    //         email: email.toLowerCase(),
    //         resetPasswordToken: resetToken,
    //         resetPasswordExpires: { $gt: Date.now() },
    //     });

    //     if (!user) {
    //        // return res.status(400).send('Mã reset mật khẩu không hợp lệ hoặc đã hết hạn');
    //        return res.status(400).json({
    //         success: false,
    //         message: 'Mã reset mật khẩu không hợp lệ hoặc đã hết hạn',
    //        })
    //     }

    //     //Cập nhật mật khẩu trong PhoneAuth
    //     const phoneAuth = await PhoneAuth.findOne({ userID: user.userID });
    //     if (!phoneAuth) {
    //         return res.status(404).json({
    //             success: false,
    //             message: 'Không tìm thấy thông tin tài khoản',
    //         });
    //     }

    //     const hashedPassword = await bcrypt.hash(newPassword, 10);
    //     phoneAuth.password = hashedPassword;
    //     phoneAuth.resetPasswordToken = undefined; // Xóa mã reset sau khi sử dụng
    //     phoneAuth.resetPasswordExpires = undefined; // Xóa thời gian hết hạn

    //     //Check password coi có thay đổi không 
    //     //consolog.log('updating user password');
    //     // const updatedUser = await User.save(); // Lưu lại thay đổi vào DB

    //     // //kiểm tra kết quả lưu
    //     //     if (updatedUser) {
    //     //         return res.status(200).json({
    //     //             success: true,
    //     //             message: 'Mật khẩu đã được cập nhật',
    //     //         });
    //     //     } else {
    //     //         return res.status(500).json({
    //     //             success: false,
    //     //             message: 'Có lỗi xảy ra khi cập nhật mật khẩu',
    //     //         });
    //     //     }

    //     await phoneAuth.save();
    //     return res.status(200).json({
    //         success: true,
    //         message: 'Mật khẩu đã được cập nhật',
    //     });

    //     //res.send('Mật khẩu đã được cập nhật');
    //     //res.status(200).json({ success: true, message: 'Mật khẩu đã được cập nhật' });
    // },
};
//"$2a$10$6VeJAVzCeMNLyp.BVEam5OhsCEh6f6gUajNPoGQD8aRPBFjd4Gt1."