const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
let GlobalEventSchema = new Schema({
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
    postedBy: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    editedLastBy: {
        type: String,
        default: null,
        required: false
    }
});

let GlobalEvent = mongoose.model('GlobalEvent', GlobalEventSchema);

module.exports = GlobalEvent;