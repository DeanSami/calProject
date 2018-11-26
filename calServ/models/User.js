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
    ]
});

let User = module.exports = mongoose.model('User', UserSchema, 'users');

module.exports.createUser = (newUser, callback) => {
    newUser.save(callback);
};

module.exports.getUserByUsername = (username, callback) => {
    let query = {username: username};
    User.findOne(query, callback);
};

module.exports.comparePassword = (password1, password2) => {
    return password1 == password2;
};

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
};