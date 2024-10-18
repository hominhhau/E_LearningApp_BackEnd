const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

dotenv.config();
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB with SSL/TLS enabled');
}).catch((err) => {
    console.log('Failed to connect to MongoDB', err);
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(process.env.PORT || port, () => {
    console.log(`E Learning backend app listening at http://localhost:${port}`);
});