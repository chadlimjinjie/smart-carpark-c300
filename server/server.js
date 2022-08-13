require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const MONGO_DB_PASS = "root";

mongoose.connect(`mongodb+srv://root:${MONGO_DB_PASS}@cluster0.wmfbe.mongodb.net/car_park?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

const PORT = 8080;
const app = express();

app.use(express.json());
const api = require('./routes/api');
const test = require('./routes/test');

app.use('/api', api);
app.use('/test', test);
app.use(express.static('tmp'));

app.get('/', async (req, res) => {
    res.json([]);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('server running http://localhost:8080');
});
