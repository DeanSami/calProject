const User = require('../models/User');
const Event = require('../models/Event');
const RegisterRequest = require('../models/RegisterRequest');
const Editor = require('../models/Editor');
const GlobalEvent = require('../models/GlobalEvent');
const EventRequest = require('../models/EventRequest');
const RejectedRequest = require('../models/RejectedRequest');

const bcrypt = require('bcrypt');

const saltRounds = 10;

const usersData = require('./seedData/usersData');
const eventsData = require('./seedData/eventData');
const editorsData = require('./seedData/editorsData');

module.exports = (app) => {

    app.post('/api/setup/seed', async (req, res) => {
        let response = {
            success: 'false'
        }

        usersData.forEach(user => {
            user.password = bcrypt.hashSync(user.password, saltRounds);
        });

        let users = await User.create(usersData);
        let events = await Event.create(eventsData);
        let editors = await Editor.create(editorsData);
        if (users && events && editors) {
            response.success = 'true';
            response.users = users;
            response.events = events;
            response.editors = editors;
        }
        res.json(response);
    });

    // return user list
    app.get('/api/setup/users', async (req, res) => {
        let users = await User.find();
        res.json(users);
    });

    app.get('/api/setup/registrations', async (req, res) => {
        let requests = await RegisterRequest.find();
        res.json(requests);
    });
    
    app.get('/api/setup/editors', async (req, res) => {
        let editors = await Editor.find();
        res.json(editors);
    });

    // clear db of data
    app.delete('/api/setup/clear', async (req, res) => {
        let response = {
            success: "false"
        }
        let users_removed = await User.deleteMany();
        let events_removed = await Event.deleteMany();
        let register_requests_removed = await RegisterRequest.deleteMany();
        let event_requests_removed = await EventRequest.deleteMany();
        let editors_removed = await Editor.deleteMany();
        let global_events_removed = await GlobalEvent.deleteMany();
        let rejected_requests_removed = await RejectedRequest.deleteMany();
        if (users_removed && events_removed && register_requests_removed && editors_removed && global_events_removed && event_requests_removed && rejected_requests_removed) {
            let users = await User.find();
            let events = await Event.find();
            let register_requests = await RegisterRequest.find();
            let editors = await Editor.find();
            let global_events = await GlobalEvent.find();
            let event_requests = await EventRequest.find();
            let rejected_requests = await RejectedRequest.find();
            if (users && events && register_requests && editors && global_events && event_requests && rejected_requests) {
                response.success = "true";
                response.users = users;
                response.events = events;
                response.register_requests = register_requests;
                response.event_requests = event_requests
                response.editors = editors;
                response.global_events = global_events;
                response.rejected_requests = rejected_requests;
            }
        }
        res.json(response);
    });
}