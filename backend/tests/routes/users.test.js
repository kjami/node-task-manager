/*global require, describe, it, expect, beforeEach, process*/
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = require('../../src/app');
const request = require('supertest');
const User = require('../../src/models/user');

describe('Testing user related routes', () => {
    const email = 'abc@example.com';
    const password = '123456';

    beforeEach(async () => {
        await User.deleteMany();
        const id = mongoose.Types.ObjectId();
        const user = new User({
            _id: id,
            name: 'Kishor',
            email,
            password,
            tokens: [{
                // eslint-disable-next-line no-process-env
                token: jwt.sign({ email }, process.env.SECRET_KEY)
            }]
        });
        await user.save();
    });

    it('create a user', async () => {
        await request(app)
            .post('/users')
            .send({
                name: 'test',
                email: 'test@example.com',
                password
            })
            .expect(201);
    });

    it('login a user', async () => {
        await request(app)
            .post('/user/login')
            .send({
                email,
                password
            })
            .expect(200);
    });
});