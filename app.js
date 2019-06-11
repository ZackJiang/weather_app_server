const express=require('express');
const router = require('./routes/routes');
const bodyParser = require('body-parser');

//const { isValidUser } = require('./controllers/user.js')

const app=express();
// Set up mongoose connection
const mongoose = require('mongoose');
const dev_db_url = 'mongodb://localhost:27017/weather';
mongoose.connect(dev_db_url);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(isValidUser);
app.use('/api/', router);

const port = 3000;
app.listen(port || process.env.PORT, () => console.log(`App listening on port ${port}!`))