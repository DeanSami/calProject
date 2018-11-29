const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
let RegisterRequestSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: false
    },
    category: {
        type: Array,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now()
    }
});

let RegisterRequest = mongoose.model('RegisterRequest', RegisterRequestSchema);

module.exports = RegisterRequest;