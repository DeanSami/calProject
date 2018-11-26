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