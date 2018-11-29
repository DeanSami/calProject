const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
let EditorSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    declinedRequests: {
        type: Array,
        required: false
    },
    category: {
        type: Array,
        required: true
    }
});

let Editor = mongoose.model('Editor', EditorSchema);

module.exports = Editor;