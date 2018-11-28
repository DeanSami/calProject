const express = require('express');

const User = require('../models/User');
const Event = require('../models/Event');

const usersData = require('./seedData/usersData');
const eventsData = require('./seedData/eventData');

module.exports = (app) => {

    app.post('/api/setup/seed', async (req, res) => {
        let response = {
            success: 'false'
        }
        let users = await User.create(usersData);
        let events = await Event.create(eventsData);
        if (users && events) {
            response.success = 'true';
            response.users = users;
            response.events = events;
        }
        res.json(response);
    });

    // return user list
    app.get('/api/setup/users', async (req, res) => {
        let users = await User.find();
        if (users) res.json(users);
    });

    // clear db of data
    app.delete('/api/setup/clear', async (req, res) => {
        let response = {
            success: "false"
        }
        let usersRemoved = await User.deleteMany();
        let eventsRemoved = await Event.deleteMany();
        if (usersRemoved && eventsRemoved) {
            let users = await User.find();
            let events = await Event.find();
            if (users && events) {
                response.success = "true";
                response.users = users;
                response.events = events;
            }
        }
        res.json(response);
    });
}