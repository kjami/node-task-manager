/* global require, process*/
const mongoose = require('mongoose');

// eslint-disable-next-line no-process-env
const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
}).then(() => {
    // eslint-disable-next-line no-console
    console.log("Database started.");
}).catch((error) => {
    // eslint-disable-next-line no-console
    console.log("Unab;e to start database!", error.message);
});