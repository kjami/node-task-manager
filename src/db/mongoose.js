/* global require*/
const mongoose = require('mongoose');

const mongoUrl = "mongodb://127.0.0.1:3001/task-manager-api";

mongoose.connect(mongoUrl, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
});