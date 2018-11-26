const mongoose = require('mongoose');

// User Schema
let UserSchema = mongoose.Schema({
    username: String,
    password: String,
    fullname: String,
    permission: String,
    registeredAt: Date,
    loggedInAt: Array,
    globalEvents: Array,
    iPermit: Array,
    theyPermit: Array,
    token: String
});

let User = module.exports = mongoose.model('User', UserSchema, 'users');