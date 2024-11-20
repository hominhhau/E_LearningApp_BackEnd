// index.js
const admin = require('firebase-admin');
const path = require('path');

// Trỏ đến file service account key trong thư mục config
const serviceAccount = path.join(__dirname, 'config/e-learningapp-75f96-firebase-adminsdk-uhzta-fd4367629a.json');

// Khởi tạo Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'e-learningapp-75f96.appspot.com',  // Thay bằng ID dự án Firebase của bạn
});

// Bây giờ bạn có thể sử dụng Firebase trong ứng dụng Node.js của mình
console.log("Firebase Admin SDK initialized!");
