const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const config = require('../config');

const User = require('../models/User');
const Event = require('../models/Event');
const GlobalEvent = require('../models/GlobalEvent');

function generateResponse(type, success, message, attachments) {
    let response = {
        success: success,
        message: message
    }
    if (attachments) {
        switch (type) {
            case 'login':
                    response.token = token;
                    response.username = user.username;
            case 'new_event':
            case 'edit_event':
            case 'delete_event':
            case 'give_permission':
            case 'delete_permissions':
        }
    }
}

module.exports = (app) => {

    //***********************************************************************************//
    //***********************************************************************************//
    //***************************          REGISTRATION      ****************************//
    //***********************************************************************************//
    //***********************************************************************************//
    app.post('/register',
        check('username').isEmail().withMessage('שם משתמש חייב להיות מייל תקני'),
        check('password').isLength({ min: 6 }).withMessage('סיסמא חייבת להיות לפחות באורך 6'),
        async (req, res) => {
            let response = {
                success: "false"
            }
            // check validation errors
            const errors = validationResult(req);
            if (errors.isEmpty()) {
                // check if username doesnt exist in DB
                const user = await User.findOne({ username: req.body.username });
                if (user) {
                    response.message = "משתמש כבר רשום";
                }
                // check if passwords match
                else if (req.body.password == req.body.password2) {
                    // construct the response and create the new user
                    response.success = "true";
                    let newUser = await User.create({
                        username: req.body.username,
                        password: req.body.password,
                        fullname: req.body.fullname
                    });
                    if (newUser)
                        response.message = "משתמש חדש נרשם";
                } else {
                    response.message = "סיסמאות לא תואמות";
                }
            } else {
                response.message = errors.array()[0].msg;
            }
            res.json(response)
        }
    );

    //***********************************************************************************//
    //***********************************************************************************//
    //***************************            Login           ****************************//
    //***********************************************************************************//
    //***********************************************************************************//
    app.post('/login', async (req, res) => {
        let response = {
            success: "false"
        };
        // check if a user with the given username exists in DB
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            // check if passwords match between input and DB
            if (req.body.password == user.password) {
                // create a token
                let cert = fs.readFileSync('private.key');
                let token = await jwt.sign({ username: user.username, loggedInAt: Date.now().toString() }, cert, { algorithm: 'RS256', expiresIn: '1h' });
                if (token) {
                    // push login log and tell the requester user has logged in
                    user.loggedInAt.push(Date.now());
                    user.token = token;
                    response.token = token;
                    response.username = user.username;
                    response.success = "true";
                    response.message = "משתמש התחבר"
                    user.save((err) => {
                        if (err) throw err;
                    });
                } else {
                    response.message = "שגיאה ביצירת מפתח";
                }
            } else {
                response.message = "סיסמאות לא תואמות";
            }
        } else response.message = "לא נמצא משתמש";

        res.json(response);
    });

    // CAL POST - returns all events of requesting user
    app.post('/calendar', async (req, res) => {
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        let response = {
            success: "false"
        };
        if (user) {
            let events = await Event.find().where('owner').equals(user.username).exec();
            if (events) {
                response.events = [];
                response.success = "true";
                events.forEach((event) => {
                    response.events.push(event);
                });
                response.message = 'הנך מועבר ליומן';
            }
        }
        res.json(response);
    });

    // Get all user global events
    app.post('/globalCal', async (req, res) => {
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        let response = {
            success: "false"
        };
        if (user) {
            let events = await GlobalEvent.find();
            if (events) {
                response.global_events = {};
                response.success = "true";
                response.permission = user.permission;
                response.categories = config.getCategories();
                response.places = config.getPlaces();
                if (!response.global_events.places)
                    response.global_events.places = {};
                events.forEach((event) => {
                    let place = event.place;
                    let category = event.category;
                    if (!response.global_events.places[place])
                        response.global_events.places[place] = {};
                    if (!response.global_events.places[place][category])
                        response.global_events.places[place][category] = [];
                    response.global_events.places[place][category].push(event);
                });
                response.message = 'הנך מועבר ליומן הגלובלי';
            }
        }
        res.json(response);
    });

    // USER ADD EVENT
    app.put('/calendar', async (req, res) => {
        let response = {
            success: "false"
        };
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            let newEvent = new Event({
                title: req.body.event.title,
                start: req.body.event.start,
                end: req.body.event.end,
                description: req.body.event.description,
                owner: user.username
            });
            let event = await newEvent.save();
            if (event) {
                response.event = event;
                response.success = "true";
            }
        }
        res.json(response);
    });

    // USER DELETE EVENT
    app.delete('/calendar/:id', async (req, res) => {
        let response = {
            success: "false"
        };
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            let event = await Event.findOne({ _id: req.params.id });
            if (event) {
                if (event.owner == user.username) {
                    Event.deleteOne({ _id: req.params.id }).exec();
                    response.success = "true";
                }
            }
        }
        res.json(response);
    });

    // USER UPDATE EVENT
    app.post('/calendar/:id', async (req, res) => {
        let response = {
            success: "false"
        }
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            let event = await Event.findOne({ _id: req.params.id });
            if (event) {
                if (event.owner == user.username) {
                    Event.findOneAndUpdate({ _id: req.params.id }, {
                        title: req.body.event.title,
                        start: req.body.event.start,
                        end: req.body.event.end,
                        description: req.body.event.description
                    }).exec();
                    response.success = "true";
                }
            }
        }
        res.json(response);
    });

    // USER GIVE PERMISSIONS
    app.post('/givepermissions', async (req, res) => {
        let response = {
            success: "false"
        };
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            user.iPermit.push(req.body.permitedUserID);
            user.save();
            response.success = "true";
        }
        res.json(response);
    });

    app.delete('/removepermission/:id', async (req, res) => {
        let response = {
            success: "false"
        };
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            let index = user.iPermit.indexOf(req.params.id);
            user.iPermit.splice(index, 1);
            user.save();
            response.success = "true";
        }
        res.json(response);
    });
}