const mongoose = require('mongoose');

// User Schema
let UserSchema = mongoose.Schema({
    username: String,
    password: String,
    fullname: String,
    permission: String,
    registeredAt: Date,
    loggedInAt: [ 
        {
            loginTime: Date
        }
    ],
    userEvents: [
        {
            eventName: String,
            eventStart: String,
            eventEnd: Date,
            eventDetails: String
        }
    ],
    globalEvents: [
        {
            event: String
        }
    ],
    iPermit: [
        {
            username: String
        }
    ],
    theyPermit: [
        {
            username: String
        }
    ],
    token: String
});

let User = module.exports = mongoose.model('User', UserSchema, 'users');