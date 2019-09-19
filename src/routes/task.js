/* global require, exports */
const Task = require('../models/task');
const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');

router.post("/tasks", auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/tasks", auth, async (req, res) => {
    try {
        const q = req.query;
        const match = {};
        const sort = {};
        const limit = parseInt(q.limit < 0 ? 10 : q.limit);
        const skip = parseInt((q.page < 1 ? 0 : q.page-1) * limit);

        if (q.completed === "true") {
            match.completed = true
        }

        if (q.completed === "false") {
            match.completed = false
        }

        if (q.sortBy) {
            const sortBy = q.sortBy;
            if (sortBy.indexOf("_") >= 0) {
                const sortByArr = sortBy.split("_");
                sort[sortByArr[0]] = sortByArr[1].toLowerCase() == "desc" ? -1 : 1;
            } else {
                sort[sortBy] = 1;
            }
        }

        console.log(sort);

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit,
                skip,
                sort
            }
        }).execPopulate();
        // const tasks = await Task.find({ owner: req.user._id });
        res.send(req.user.tasks);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOne({ 
            _id: req.params.id, 
            owner: req.user._id 
        });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];

    try {
        const isInvalid = updates.find(x => allowedUpdates.indexOf(x) < 0);
        if (isInvalid) {
            return res.status(500).send();
        }

        let task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        });
        if (!task) {
            return res.status(404).send();
        }
        updates.forEach(update => task[updates] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        let task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!task) {
            return res.status(404).send();
        }

        await task.remove();
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;