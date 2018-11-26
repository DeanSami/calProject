const mongoose = require('mongoose');

// User Schema
let EventSchema = mongoose.Schema({
    eventName: String,
    eventStart: String,
    eventEnd: String,
    eventDetails: String,
    owner: String
});

let Event = module.exports = mongoose.model('Event', EventSchema, 'userEvents');

module.exports.createEvent = (newEvent, callback) => {
    newEvent.save(callback);
};

// module.exports.getUserByUsername = (username, callback) => {
//     let query = {username: username};
//     User.findOne(query, callback);
// };

// module.exports.comparePassword = (password1, password2) => {
//     return password1 === password2;
// };

// module.exports.getUserById = (id, callback) => {
//     User.findById(id, callback);
// };