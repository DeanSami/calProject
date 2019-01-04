const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
let EventSchema = new Schema({
    type: {
        type: String,
        default: 'personal',
        required: false
    },
    allDay: {
        type: Boolean,
        default: true,
        required: false
    },
    title: {
        type: String,
        default: '',
        required: false
    },
    start: {
        type: Date,
        default: new Date(),
        required: false
    },
    end: {
        type: Date,
        default: '',
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