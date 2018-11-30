const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
let EventSchema = new Schema({
    eventName: {
        type: String,
        require: true
    },
    eventStart: {
        type: Date, 
        default: Date.now(),
        required: false
    },
    eventEnd: {
        type: Date,
        default: () => {
            return this.eventStart;
        },
        required: false
    },
    eventDetails: {
        type: String,
        required: false
    },
    owner: {
        type: String,
        required: true
    }
});

let Event = mongoose.model('Event', EventSchema);

module.exports = Event;