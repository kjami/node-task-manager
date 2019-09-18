/* global require, process */
const express = require('express');
const chalk = require('chalk');
require("./db/mongoose");
const userRoute = require("./routes/userRoute");
const taskRoute = require("./routes/taskRoute");

// eslint-disable-next-line no-process-env
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use(taskRoute);
app.use(userRoute);

app.listen(port, (error) => {
    if (!error) {
        // eslint-disable-next-line no-console
        console.log(chalk.green.inverse(`App strated on ${port}`));
    }
});