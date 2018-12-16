const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
let EventSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    start: {
        type: Date,
        default: Date.now(),
        required: false
    },
    end: {
        type: Date,
        default: "",
        required: false
    },
    description: {
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