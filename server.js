const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 6002;
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
mongoose.connect(process.env.MONGO_URL_AZURE).then(() => {
    console.log('Connected to MongoDB Azure');
}).catch((err) => {
    console.log(err);
});



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
app.use('/', userRoutes);
app.use('/', teacherRoutes);
app.use('/', chatRoutes);
app.use('/', vnpay);
app.use('/', invoiceRoutes);

app.use('/', chatRoutes);


app.listen(process.env.PORT || port, () => {
    console.log(`E Learning backend app listening at http://localhost:${port}`);
});