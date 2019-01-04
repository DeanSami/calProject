const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
let UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: false
    },
    permission: {
        type: String,
        enum: [ 'user', 'editor', 'admin' ],
        default: 'user',
        required: true
    },
    registeredAt: {
        type: Date,
        default: new Date(),
        required: false
    },
    loggedInAt: {
        type: Array,
        require: false
    },
    globalEvents: {
        type: Array,
        require: false
    },
    iPermit: {
        type: Array,
        require: false
    },
    theyPermit: {
        type: Array,
        require: false
    },
    token: {
        type: String,
        default: null,
        require: false
    }
});

let User = mongoose.model('User', UserSchema);

module.exports = User;