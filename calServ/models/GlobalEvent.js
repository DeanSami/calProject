const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
let GlobalEventSchema = new Schema({
    type: {
        type: String,
        default: 'global',
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
        require: false
    },
    start: {
        type: Date, 
        default: new Date(),
        required: false
    },
    end: {
        type: Date,
        default: () => {
            return this.start;
        },
        required: false
    },
    description: {
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