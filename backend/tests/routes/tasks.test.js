/*global require, describe, it, expect, beforeEach, process*/
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = require('../../src/app');
const request = require('supertest');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

describe('Testing task related routes', () => {
    const password = '123456';
    const email = 'abc@example.com';
    // let user = await User.findOne({ email });
    // const id = user._id;

    it('create a task', async () => {
        const user = await User.findOne({ email });
        await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .send({
                description: "Test task"
            })
            .expect(201);
    });

    it('get tasks - all', async () => {
        const user = await User.findOne({ email });
        const response = await request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .expect(200);
        expect(response.body.length).toBe(3);
    });

    it('get tasks - one element only (limit=1)', async () => {
        const user = await User.findOne({ email });
        const response = await request(app)
            .get('/tasks?limit=1')
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .expect(200);
        expect(response.body.length).toBe(1);
    });

    it('get tasks - second element only (limit=1, page=2)', async () => {
        const user = await User.findOne({ email });
        const response = await request(app)
            .get('/tasks?limit=1&page=2')
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .expect(200);
        expect(response.body.length).toBe(1);
    });

    it('get tasks - second completed only (completed=true)', async () => {
        const user = await User.findOne({ email });
        const response = await request(app)
            .get('/tasks?completed=true')
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .expect(200);
        expect(response.body.length).toBe(1);
    });

    it('get task', async () => {
        const user = await User.findOne({ email });
        const task = await Task.findOne({ description: "Task 1" });
        const response = await request(app)
            .get(`/tasks/${task._id}`)
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .expect(200);
        expect(response.body.description).toBe("Task 1");
        expect(response.body.completed).toBe(false);
    });

    it('update task', async () => {
        const user = await User.findOne({ email });
        const task = await Task.findOne({ description: "Task 1" });
        const response = await request(app)
            .patch(`/tasks/${task._id}`)
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .send({ completed: true })
            .expect(200);
        expect(response.body.description).toBe("Task 1");
        expect(response.body.completed).toBe(true);
    });

    it('delete task', async () => {
        const user = await User.findOne({ email });
        const task = await Task.findOne({ description: "Task 1" });
        const response = await request(app)
            .delete(`/tasks/${task._id}`)
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .expect(200);
        const removedTask = await Task.findOne({ description: "Task 1" });
        expect(removedTask).toBeNull();
    });
});