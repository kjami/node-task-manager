/* global require, exports */
const Task = require('../models/task');
const express = require('express');
const router = new express.Router();

router.post("/tasks", async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/tasks", async (req, res) => {
    try {
        const users = await Task.find({});
        res.send(users);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/tasks/:id", async (req, res) => {
    try {
        const user = await Task.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.patch("/tasks/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];

    try {
        const isInvalid = updates.find(x => allowedUpdates.indexOf(x) < 0);
        if (isInvalid) {
            return res.status(500).send();
        }

        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, useValidators: true });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;