/* global require, module, process*/
const sendgrid = require('@sendgrid/mail'); 

// eslint-disable-next-line no-process-env
sendgrid.setApiKey(process.env.SEND_GRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'me@kish.rocks',
        subject: 'Welcome to the Task Manager application.',
        text: `Hi ${name}, \n\nIts great to have you onboard. Have a good time playing with the application.\n\nRegards, \n\nTask Manager Team`,
        html: `Hi ${name}, <br/><br/>Its great to have you onboard. Have a good time playing with the application.<br/><br/>Regards, <br/>Task Manager Team`
    }
    sendgrid.send(msg).catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error.message);
    });
}

const sendGoodbyeEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'me@kish.rocks',
        subject: 'Sorry to see you go.',
        text: `Hi ${name}, <br/><br/>Its sad to see you leaving this task manager application. Hope to see you back soon.<br/><br/>Regards, <br/>Task Manager Team`
    }
    sendgrid.send(msg).catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error.message);
    });
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}