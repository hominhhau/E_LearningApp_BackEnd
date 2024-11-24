const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 6002;

const authRoutes = require('./routes/Auth');
const userRoutes = require('./routes/User');

const courseRoutes = require('./routes/Course');
const lessonRoutes = require('./routes/Lesson');
const categoryRoutes = require('./routes/category');


dotenv.config();

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

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


app.listen(process.env.PORT || port, () => {
    console.log(`E Learning backend app listening at http://localhost:${port}`);
});