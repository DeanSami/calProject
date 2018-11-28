const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
let UserSchema = new Schema({
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

let User = mongoose.model('User', UserSchema);

module.exports = User;