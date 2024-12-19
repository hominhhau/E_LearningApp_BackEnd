const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 6002;
const mongodb = require('mongodb');

const authRoutes = require('./routes/Auth');
const courseRoutes = require('./routes/Course');
const lessonRoutes = require('./routes/Lesson');
const categoryRoutes = require('./routes/category');
const teacherRoutes = require('./routes/Teacher');
const userRoutes = require('./routes/User');
const chatRoutes = require('./routes/Chatgpt');
const vnpay = require('./routes/vnpay');
const invoiceRoutes = require('./routes/Invoice');


dotenv.config();

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
// mongoose.connect(process.env.MONGO_URL_AZURE).then(() => {
//     console.log('Connected to MongoDB Azure');
// }).catch((err) => {
//     console.log(err);
// });


const connectWithRetry = async (maxRetries = 3) => {
    let retries = 0;

    while (retries < maxRetries) {
        try {
            retries++; // Tăng số lần thử
            console.log(`🔄 Attempt ${retries} to connect to MongoDB Azure...`);

            // Thử kết nối
            await mongoose.connect(process.env.MONGO_URL_AZURE);
            console.log('✅ Connected to MongoDB Azure');
            return; // Kết nối thành công, thoát khỏi hàm
        } catch (err) {
            console.error(`❌ Attempt ${retries} failed:`, err);

            if (retries < maxRetries) {
                console.log(`⏳ Retrying to connect in 2 seconds... (${retries}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Chờ 2 giây
            } else {
                console.error(`❗ All ${maxRetries} connection attempts failed. Exiting...`);
                process.exit(1); // Thoát chương trình với mã lỗi
            }
        }
    }
};

// Gọi hàm kết nối
connectWithRetry();



// mongoose.connect(process.env.MONGO_URL).then(() => {
//     console.log('Connected to MongoDB');
// }).catch((err) => {
//     console.log(err);
// });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    credentials: true,
}));
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', courseRoutes);
app.use('/', lessonRoutes);
app.use('/', categoryRoutes);
app.use('/', teacherRoutes);
app.use('/', chatRoutes);
app.use('/', vnpay);
app.use('/', invoiceRoutes);


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`E Learning backend app listening at http://localhost:${port}`);
});