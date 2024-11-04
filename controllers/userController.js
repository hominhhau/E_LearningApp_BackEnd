const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    // find user with email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send('Email không tồn tại');
    }

    // Luu db
    //const resetToken = crypto.randomBytes(32).toString('hex');
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; //1h
    await user.save();

    
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'nguyenquynhgiang1324@gmail.com',
            pass: 'wgpj zhvj oghf fdzz',
        },
    });

    const mailOptions = {
        to: user.email,
        subject: 'E_LearningAPP thông báo: Yêu cầu reset mật khẩu',
        text: `Mã reset mật khẩu của bạn là: ${resetToken}`,
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            return res.status(500).send('Có lỗi xảy ra khi gửi email');
        }
        res.send('Mã reset mật khẩu đã được gửi đến email của bạn');
    });
};

// Reset mật khẩu
exports.resetPassword = async (req, res) => {
    const { email, resetToken, newPassword } = req.body;

    // Tìm người dùng với email và mã reset
    const user = await User.findOne({
        email,
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).send('Mã reset mật khẩu không hợp lệ hoặc đã hết hạn');
    }

    // Reset mật khẩu
    user.password = newPassword; // Mã hóa mật khẩu nếu cần
    user.resetPasswordToken = undefined; // Xóa token
    user.resetPasswordExpires = undefined; // Xóa thời gian hết hạn
    await user.save();

    res.send('Mật khẩu đã được reset thành công');
};