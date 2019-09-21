/* global require, process */
const app = require('./app');
const chalk = require('chalk');

// eslint-disable-next-line no-process-env
const port = process.env.PORT || 3000;

app.listen(port, (error) => {
    if (!error) {
        // eslint-disable-next-line no-console
        console.log(chalk.green.inverse(`App strated on ${port}`));
    }
});