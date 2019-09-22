/*global require, describe, it, expect, beforeEach, process*/
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = require('../../src/app');
const request = require('supertest');
const User = require('../../src/models/user');

describe('Testing user related routes', () => {
    const name = 'Kishor';
    const email = 'abc@example.com';
    const password = '123456';

    it('create a user', async () => {
        await request(app)
            .post('/users')
            .send({
                name: 'test2',
                email: 'test2@example.com',
                password
            })
            .expect(201);
    });

    it('login a user - check name', async () => {
        const response = await request(app)
            .post('/user/login')
            .send({
                email,
                password
            })
            .expect(200);
        expect(response.body.user.name).toBe(name);
    });

    it('login a user - check 200 status', async () => {
        await request(app)
            .post('/user/login')
            .send({
                email,
                password
            })
            .expect(200);
    });

    it('login a user - passpord encrypt', async () => {
        const response = await request(app)
            .post('/user/login')
            .send({
                email,
                password
            });
        expect(response.body.user.password).not.toBe(password);
    });

    it('login a user - check token', async () => {
        let user = await User.findOne({ email: email });
        const id = user._id;
        const response = await request(app)
            .post('/user/login')
            .send({
                email,
                password
            });
        const currUser = await User.findById(id);
        expect(response.body.token).toBe(currUser.tokens[1].token);
    });

    it('logout a user', async () => {
        let user = await User.findOne({ email: email });
        await request(app)
            .post("/user/logout")
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .send()
            .expect(200);
    });

    it('logout a user from all devices', async () => {
        let user = await User.findOne({ email: email });
        const id = user._id;
        await request(app)
            .post("/user/logout/all")
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .send()
            .expect(200);
        const currUser = await User.findById(id);
        expect(currUser.tokens.length).toBe(0);
    });

    it("get current user", async () => {
        let user = await User.findOne({ email: email });
        const response = await request(app)
            .get("/users/me")
            .set("Authorization", `Bearer ${user.tokens[0].token}`);
        expect(response.body.user).not.toBeNull();
    });

    it("update current user", async () => {
        let user = await User.findOne({ email: email });
        const id = user._id;
        await request(app)
            .patch("/users/me")
            .set("Authorization", `Bearer ${user.tokens[0].token}`)
            .send({
                age: 12
            })
            .expect(200);
        const currUser = await User.findById(id);
        expect(currUser.age).toBe(12);
    });

    it("delete current user", async () => {
        let user = await User.findOne({ email: email });
        const id = user._id;
        await request(app)
            .delete("/users/me")
            .set("Authorization", `Bearer ${user.tokens[0].token}`)
            .expect(200);
        const currUser = await User.findById(id);
        expect(currUser).toBeNull();
    });
});