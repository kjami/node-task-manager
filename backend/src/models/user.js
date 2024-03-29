/* global require, module, process */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            if (typeof value == "string" && value.toLowerCase().includes("password")) {
                throw new Error("Password value should not be password.");
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email provided is not valid email address.");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number.");
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: String
    }
}, {
    timestamps: true
});

userSchema.virtual('tasks', {
    'ref': 'Task',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.toJSON = function () {
    const user = this.toObject();

    delete user.tokens;
    delete user.password;
    delete user.avatar;
    return user;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    // eslint-disable-next-line no-process-env
    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    // eslint-disable-next-line no-use-before-define
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Unable to login. User not found.");
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (isMatched) {
        return user;
    } else {
        throw new Error("Unable to login.");
    }
}

userSchema.pre('save', async function (next) {
    // eslint-disable-next-line no-invalid-this
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.pre('remove', async function (next) {
    // eslint-disable-next-line no-invalid-this
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;