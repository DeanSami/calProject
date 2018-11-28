const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
let EventSchema = new Schema({
    eventName: String,
    eventStart: {
        type: Date, 
        default: Date.now()
    },
    eventEnd: {
        type: Date,
        default: null
    },
    eventDetails: String,
    owner: String
});

let Event = mongoose.model('Event', EventSchema);

module.exports = Event;