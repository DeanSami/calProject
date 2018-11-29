const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const User = require('../models/User');
const Event = require('../models/Event');

module.exports = (app) => {

    // REGISTER POST - checks validity of username input and if valid put them to DB
    app.post('/register', async (req, res) => {
        let response = {
            success: "false"
        }

        // check if username doesnt exist in DB
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            response.message = "משתמש כבר רשום";
        }
        else if (req.body.password == req.body.password2) {
            response.success = "true";
            let newUser = new User({
                username: req.body.username,
                password: req.body.password,
                fullname: req.body.fullname
            });
            response.message = "משתמש חדש נרשם";
            newUser.save((err) => {
                if (err) throw err;
            });
        } else {
            response.message = "סיסמאות לא תואמות";
        }
        res.json(response)
    });

    // LOGIN POST - should create new token and save it, both server and client side
    app.post('/login', async (req, res) => {
        let response = {
            success: "false"
        };
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            if (req.body.password == user.password) {
                let cert = fs.readFileSync('private.key');
                let token = await jwt.sign({ username: user.username, loggedInAt: Date.now().toString() }, cert, { algorithm: 'RS256', expiresIn: '1h' });
                if (token) {
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
                events.forEach((event) => {
                    response.success = "true";
                    response.events.push(event);
                });
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
                eventName: req.body.eventName,
                eventStart: req.body.eventStart,
                eventEnd: req.body.eventEnd,
                eventDetails: req.body.eventDetails,
                owner: user.username
            });
            let promise = await newEvent.save();
            if (promise) response.success = "true";
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
                if (event.owner == user._id) {
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
                if (event.owner == user._id) {
                    Event.findOneAndUpdate({ _id: req.params.id }, {
                        eventName: req.body.event.eventName,
                        eventStart: req.body.event.eventStart,
                        eventEnd: req.body.event.eventEnd,
                        eventDetails: req.body.event.eventDetails
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