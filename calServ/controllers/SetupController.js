const User = require('../models/User');
const Event = require('../models/Event');
const RegisterRequest = require('../models/RegisterRequest');
const Editor = require('../models/Editor');
const GlobalEvent = require('../models/GlobalEvent');

const usersData = require('./seedData/usersData');
const eventsData = require('./seedData/eventData');
const editorsData = require('./seedData/editorsData');

module.exports = (app) => {

    app.post('/api/setup/seed', async (req, res) => {
        let response = {
            success: 'false'
        }
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
        let usersRemoved = await User.deleteMany();
        let eventsRemoved = await Event.deleteMany();
        let requestsRemoved = await RegisterRequest.deleteMany();
        let editorsRemoved = await Editor.deleteMany();
        let globalEventsRemoved = await GlobalEvent.deleteMany();
        if (usersRemoved && eventsRemoved && requestsRemoved && editorsRemoved && globalEventsRemoved) {
            let users = await User.find();
            let events = await Event.find();
            let requests = await RegisterRequest.find();
            let editors = await Editor.find();
            let globalEvents = await GlobalEvent.find();
            if (users && events && requests && editors && globalEvents) {
                response.success = "true";
                response.users = users;
                response.events = events;
                response.registerRequests = requests;
                response.editors = editors;
                response.globalEvents = globalEvents;
            }
        }
        res.json(response);
    });
}