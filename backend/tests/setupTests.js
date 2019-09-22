const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = require('../src/app');
const request = require('supertest');
const User = require('../src/models/user');
const Task = require('../src/models/task');

global.beforeEach(async () => {
    const name = 'Kishor';
    const email = 'abc@example.com';
    const password = '123456';
    const taskId = mongoose.Types.ObjectId();
    const id = mongoose.Types.ObjectId();
    const id2 = mongoose.Types.ObjectId();

    //Delete all users and insert below mentioned users
    await User.deleteMany();
    const user1 = new User({
        _id: id,
        name: name,
        email,
        password,
        tokens: [{
            // eslint-disable-next-line no-process-env
            token: jwt.sign({ email }, process.env.SECRET_KEY)
        }]
    });
    const user2 = new User({
        _id: id2,
        name: 'Test',
        email: 'test@example.com',
        password,
        tokens: [{
            // eslint-disable-next-line no-process-env
            token: jwt.sign({ email: 'test@example.com' }, process.env.SECRET_KEY)
        }]
    });
    await user1.save();
    await user2.save();

    //Delete all tasks and insert below mentioned tasks
    await Task.deleteMany();
    const tasks = [{
        _id: taskId,
        description: "Task 1",
        completed: false,
        owner: id
    }, {
        description: "Task 2",
        completed: true,
        owner: id
    }, {
        description: "Task 3",
        completed: false,
        owner: id2
    }, {
        description: "Task 4",
        completed: true,
        owner: id2
    }, {
        description: "Task 5",
        completed: false,
        owner: id
    }];

    tasks.forEach(async (task) => {
        const taskObj = new Task(task);
        await taskObj.save();
    });
});