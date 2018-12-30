const config = require('../config');

const User = require('../models/User');
const Editor = require('../models/Editor');
const GlobalEvent = require('../models/GlobalEvent');
const EventRequest = require('../models/EventRequest');
const RejectedRequest = require('../models/RejectedRequest');

module.exports = (app) => {

    app.post('/globalCal', async (req, res) => { //show globle event

        let response = {};

        const { username, token }   = req.body,
                user                = await User.findOne({ username: username, token: token });

        if (user) {

            let events = await GlobalEvent.find(),
                global_events = [];
            
            events.forEach(event => {
                let index = -1;
                for (let i = 0; i < global_events.length; i++) {
                    if (global_events[i].categoryName == event.category) {
                        global_events[i].events.push(event);
                        index = i;
                    }
                }
                if (index < 0) {
                    let new_category = {
                        categoryName: event.category,
                        events: []
                    };
                    new_category.events.push(event);
                    global_events.push(new_category);
                }
            });

            response = {
                success: 'true',
                message: 'הנך מועבר ליומן הגלובלי',
                globalEvents: global_events,
                permission: user.permission,
                categories: config.getCategories(),
                places: config.getPlaces()
            };

            if (user.permission == 'editor') {
                const editor = await Editor.findOne({ username: username });
                if (editor) {
                    let declined_requests = [];
                    for (let i = 0; i < editor.declinedRequests.length; i++) {
                        const declined_found = await RejectedRequest.findById(editor.declinedRequests[i]._id);
                        if (declined_found) {
                            declined_requests.push(declined_found);
                        }
                    };
                    response.declined_requests = declined_requests;

                    let awaiting_requests = await EventRequest.find({ editorRequesting: username });
                    response.awaiting_requests = awaiting_requests;
                    response.categories = editor.category[0];
                }
            }

        } else {

            response = {
                success: 'false',
                message: 'שגיאת משתמש'
            };

        }

        res.json(response);

    });

    app.post('/globalCal/pull/:id', async (req, res) => {
        
        const { username, token }   = req.body;
                id                  = req.params.id;

        let response    = {},
            user        = await User.findOne({ username: username, token: token });

        if (user) {

            const event = await GlobalEvent.findById(id);

            if (event) {

                let already_exists = false;

                user.globalEvents.forEach((event) => {
                    if (id == event._id) {
                        already_exists = true;
                    }
                });

                if (!already_exists) {

                    user.globalEvents.push(event._id);

                    await user.save();

                    response = {
                        success: 'true',
                        message: 'אירוע גלובלי נוסף בהצלחה ליומן אישי'
                    };

                } else {

                    response = {
                        success: 'false',
                        message: 'אירוע קיים כבר ביומן האישי'
                    };

                }
            } else {

                response = {
                    success: 'false',
                    message: 'שגיאה בבחירת אירוע'
                };

            }
        } else {

            response = {
                success: 'false',
                message: 'שגיאה בהרשאות'
            };

        }

        res.json(response);

    });

}