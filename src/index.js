/* global require, process */
const express = require('express');
const chalk = require('chalk');
require("./db/mongoose");
const userRoute = require("./routes/user");
const taskRoute = require("./routes/task");

// eslint-disable-next-line no-process-env
const port = process.env.PORT || 3000;

const app = express();

// app.use((req, res, next) => {
//     res.status(503).send("Currently under maintenance.");
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

app.listen(port, (error) => {
    if (!error) {
        // eslint-disable-next-line no-console
        console.log(chalk.green.inverse(`App strated on ${port}`));
    }
});