/*global require, module, process*/
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.SECRET_KEY); //eslint-disable-line no-process-env
        const user = await User.findOne({ email: decoded.email, "tokens.token": token  });
        if (!user) {
            throw new Error();
        }
        
        req.token = token;
        req.user = user;
        next(); //eslint-disable-line callback-return
    } catch (e) {
        res.status(401).send({ error: "Please authenticate." });
    }
}

module.exports = auth;