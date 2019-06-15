const express=require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const router = require('./routes/routes');
const {cronTask} = require('./services/cron');

dotenv.config();

mongoose.connect(`mongodb://${process.env.MONGODB_CONTAINER}:${process.env.MONGODB_PORT}/weather`);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/', router);

cronTask.start();

app.listen( process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}!`))