const User = require('../models/User');
const Event = require('../models/Event');
const GlobalEvent = require('../models/GlobalEvent');

module.exports = (app) => {

    app.post('/calendar', async (req, res) => {

        let response = {};

        const { username, token } = req.body;
        user = await User.findOne({ username: username, token: token });

        if (user) {

            const events = await Event.find().where('owner').equals(username).exec();
            let user_events = [],
                they_permit = [],
                global_events = [];

            events.forEach((event) => {
                user_events.push(event);
            });

            for (let i = 0; i < user.theyPermit.length; i++) {
                const permited_user = await User.findOne({ _id: user.theyPermit[i] });
                if (permited_user) {
                    they_permit.push(permited_user.username);
                }
            }

            for (let i = 0; i < user.globalEvents.length; i++) {
                const global_event = await GlobalEvent.findOne({ _id: user.globalEvents[i] });
                if (global_event) {
                    global_events.push(global_event);
                }
            }

            response = {
                success: 'true',
                message: 'הנך מועבר ליומן',
                events: user_events,
                globalEvents: global_events,
                theyPermit: they_permit,
                permission: user.permission,
                loggedInAt: user.loggedInAt
            };

        } else {

            response = {
                success: 'false',
                message: 'שגיאת משתמש'
            };

        }

        res.json(response);

    });

    app.put('/calendar', async (req, res) => {

        let response = {};

        const { username, token, event } = req.body,
            { title, start, end, description, allDay } = event,
            user = await User.findOne({ username: username, token: token });

        if (user) {

            const event = await Event.create({
                title: title,
                allDay: allDay,
                start: start,
                end: end,
                description: description,
                owner: user.username
            });

            response = {
                success: 'true',
                message: 'אירוע נוצר בהצלחה',
                event: event
            };

        } else {

            response = {
                success: 'false',
                message: 'שגיאת משתמש'
            };

        }

        res.json(response);

    });

    app.delete('/calendar/:id', async (req, res) => {

        let response = {};
        const { username, token } = req.body;
        id = req.params.id;

        const user = await User.findOne({ username: username, token: token });

        if (user) {

            const event = await Event.findOne({ _id: id });

            if (event) {
                if (event.owner == user.username) {

                    await Event.deleteOne({ _id: id });

                    response = {
                        success: 'true',
                        message: 'אירוע נמחק בהצלחה'
                    };

                }
            } else {

                let event_index = -1;

                user.globalEvents.forEach((event, index) => {
                    if (event._id == id) {
                        event_index = index;
                    }
                });

                if (event_index >= 0) {

                    user.globalEvents.splice(event_index, 1);

                    await user.save();

                    response = {
                        success: 'true',
                        message: 'אירוע גלובלי הוסר בהצלחה'
                    };

                } else {

                    response = {
                        success: 'false',
                        message: 'שגיאה במציאת אירוע'
                    };

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

    app.post('/calendar/:id', async (req, res) => {

        let response = {};

        const { username, token, event, permited_username } = req.body,
            { title, start, end, allDay, description } = event,
            id = req.params.id,
            user = await User.findOne({ username: username, token: token }),
            permited = await User.findOne({ username: permited_username });

        if (user) {

            let event_to_edit = await Event.findOne({ _id: id });

            if (event_to_edit) {

                event_to_edit.title = (title) ? title : event_to_edit.title;
                event_to_edit.allDay = (allDay) ? allDay : event_to_edit.allDay;
                event_to_edit.start = (start) ? start : event_to_edit.start;
                event_to_edit.end = (end) ? end : event_to_edit.end;
                event_to_edit.description = (description) ? description : event_to_edit.description;

                if (event_to_edit.owner == username) {

                    await event_to_edit.save();

                    response = {
                        success: 'true',
                        message: 'אירוע עודכן בהצלחה',
                        event: event
                    };

                } else if (permited) {

                    if (permited.iPermit.findIndex(id => id.equals(user._id) > -1) > -1) {

                        await event_to_edit.save();

                        response = {
                            success: 'true',
                            message: 'אירוע עודכן בהצלחה',
                            event: event
                        };

                    } else {

                        response = {
                            success: 'false',
                            message: 'שגיאת הרשאה'
                        };

                    }
                } else {

                    response = {
                        success: 'false',
                        message: 'שגיאת הרשאה'
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
                message: 'שגיאת משתמש'
            };

        }
        res.json(response);
    });



}