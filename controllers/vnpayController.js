const moment = require('moment');
const crypto = require('crypto');
const querystring = require('qs');
const config = require('config');

module.exports = {
    async createPaymentUrl(req, res) {
        process.env.TZ = 'Asia/Ho_Chi_Minh';

        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');

        let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let tmnCode = config.get('vnp_TmnCode');
        let secretKey = config.get('vnp_HashSecret');
        console.log("tmnCode", tmnCode);
        console.log("secretKey", secretKey);
        let vnpUrl = config.get('vnp_Url');
        let returnUrl = config.get('vnp_ReturnUrl');
        let orderId = moment(date).format('DDHHmmss');
        const { amount } = req.body;

        console.log("amount", amount);

        let locale = "vn";

        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount.amount;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        // if (bankCode !== null && bankCode !== '') {
        //     vnp_Params['vnp_BankCode'] = bankCode;
        // }

        vnp_Params = sortObject(vnp_Params);

        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        console.log("vnpUrl", vnpUrl);

        res.status(200).json({ code: '00', data: vnpUrl });
    },

    async vnpayReturn(req, res) {
        const vnp_Params = req.query;
        console.log("vnp_Params", vnp_Params);

        let secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        let secretKey = config.get('vnp_HashSecret');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        if (secureHash === signed) {
            console.log("Payment successful:", vnp_Params);
            res.status(200).json({
                code: vnp_Params['vnp_ResponseCode'],
                message: 'Payment successful',
                data: vnp_Params
            });
        } else {
            console.log("Checksum failed");
            res.status(400).json({
                code: '97',
                message: 'Checksum failed',
                data: vnp_Params
            });
        }
    },

    // Xử lý khi VNPAY trả lại kết quả
    async vnpayReturn(req, res) {
        // Lấy các tham số trả về từ VNPAY
        let vnp_Params = req.query;
        console.log("Request Query:", vnp_Params);  // Hiển thị toàn bộ tham số trả về từ VNPAY

        let secureHash = vnp_Params['vnp_SecureHash'];
        if (!secureHash) {
            return res.status(400).json({
                code: '97',
                message: 'Secure hash is missing',
                data: vnp_Params
            });
        }

        // Xóa các tham số không cần thiết trước khi kiểm tra
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        // Sắp xếp lại các tham số
        vnp_Params = sortObject(vnp_Params);

        // Lấy key bảo mật từ config
        let secretKey = config.get('vnp_HashSecret');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        // Kiểm tra checksum
        if (secureHash === signed) {
            console.log("Payment successful:", vnp_Params);
            res.status(200).json({
                code: vnp_Params['vnp_ResponseCode'],
                message: 'Payment successful',
                data: vnp_Params
            });
        } else {
            console.log("Checksum failed");
            res.status(400).json({
                code: '97',
                message: 'Checksum failed',
                data: vnp_Params
            });
        }
    }
};

// Hàm sắp xếp các tham số theo thứ tự để tính checksum chính xác
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
