const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RejectedRequestSchema = new Schema({
    event_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: false
    },
    start: {
        type: Date, 
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
        required: false
    },
    category: {
        type: String,
        required: false
    },
    place: {
        type: String,
        required: false
    },
    editedLastBy: {
        type: String,
        default: null,
        required: false
    },
    update: {
        type: Boolean,
        required: false,
        default: false
    },
    delete: {
        type: Boolean,
        required: false,
        default: false
    },
    reason: {
        type: String,
        required: true
    },
    editorRequesting: {
        type: String,
        required: true
    }
});

let RejectedRequest = mongoose.model('RejectedRequest', RejectedRequestSchema);

module.exports = RejectedRequest;