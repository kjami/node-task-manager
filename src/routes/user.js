/* global require, module */
const User = require('../models/user');
const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
// const sharp = require('sharp');
const { sendWelcomeEmail, sendGoodbyeEmail } = require("../emails/accounts");

router.post("/users", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post("/user/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/user/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((t) => t.token !== req.token);
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/user/logout/all", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get("/users/me", auth, async (req, res) => {
    res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"]; //eslint-disable-line array-element-newline

    try {
        const isInvalid = updates.find((x) => allowedUpdates.indexOf(x) < 0);
        if (isInvalid) {
            return res.status(500).send();
        }

        let user = req.user;
        updates.forEach((update) => {
            user[updates] = req.body[update]
        });
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
    return null;
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        sendGoodbyeEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-type', 'image/jpg');
        res.send(user.avatar);
    } catch (error) {
        res.status(400).send("No profile pic");
    }
});

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter: (req, file, cb) => {
        const isValid = file.originalname.match(/\.(jpg|jpeg|png)$/);
        if (isValid) {
            return cb(null, true);
        } else {
            return cb(new Error('Please upload an image.'));
        }
    }
});

router.post("/users/me/avatar", auth, upload.single('avatar'), async (req, res) => {
    // const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    // req.user.avatar = buffer;
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => { //eslint-disable-line max-params, no-unused-vars
    res.status(400).send({ error: error.message });
});

router.delete("/users/me/avatar", auth, async (req, res) => {
    try {
        req.user.avatar = null;
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;