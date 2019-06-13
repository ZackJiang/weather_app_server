const express=require('express');
const router = require('./routes/routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const {task} = require('./services/cron');

const dev_db_url = 'mongodb://localhost:27017/weather';
mongoose.connect(dev_db_url);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/', router);

task.start();

dotenv.config();

app.listen( process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}!`))