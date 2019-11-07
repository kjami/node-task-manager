/* global require, module, __dirname, process */
const express = require('express');
require('./db/mongoose');
const userRoute = require('./routes/user');
const taskRoute = require('./routes/task');
const path = require('path');

const app = express();

// app.use((req, res, next) => {
//     res.status(503).send('Currently under maintenance.');
// });
const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    next();
};

app.use(allowCrossDomain);

app.use(express.json());

app.use(taskRoute);
app.use(userRoute);

// const publicPath = path.join(__dirname, '../../public');
// app.use(express.static(publicPath));

// eslint-disable-next-line no-process-env
if (process.env.NODE_ENV == 'production') {
    const publicPath = path.join(__dirname, '../../client/build');
    // app.use(express.static(publicPath));
    app.use(express.static(publicPath))
}

module.exports = app;