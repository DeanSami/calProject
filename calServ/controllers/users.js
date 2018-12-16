const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const fs = require('fs');

let User = require('../models/User');
let Event = require('../models/Event');

const dbURI = "mongodb://deanz:D305622375m@ds117334.mlab.com:17334/calendarproject"

mongoose.connect(dbURI, { useNewUrlParser: true });

let UsersRouter = express.Router();

// REGISTER GET - gets register page
UsersRouter.get('/register', (req, res) => {
    let response = {
        success: "true",
        msg: "register.html"
    };
    res.json(response);
});

// REGISTER POST - checks validity of username input and if valid put them to DB
UsersRouter.post('/register', async (req, res) => {
    let response = {
        success: "false"
    }

    let password2 = req.body.password2;
    let userDetails = {
        username: req.body.username,
        password: req.body.password,
        fullname: req.body.fullname,
        permission: 'user',
        registeredAt: Date.now()
    }
    
    // check if username doesnt exist in DB
    let user = await User.findOne({username: userDetails.username});
        if (user) {
            response.msg = "משתמש כבר רשום";
        }
        else if (userDetails.password == password2) {
            response.success = "true";
            let newUser = new User({
                username: userDetails.username,
                password: userDetails.password,
                fullname: userDetails.fullname,
                permission: 'user',
                registeredAt: Date.now(),
                token: null
            });
            await newUser.save();
            response.msg = "משתמש חדש נרשם";
        } else {
            response.msg = "סיסמאות לא תואמות";
        }
    res.json(response)
});

// LOGIN GET - gets the login page
UsersRouter.get('/login', (req, res) => {
    let response = {
        success: "true",
        msg: "login.html"
    };
    res.json(response);
});

// LOGIN POST - should create new token and save it, both server and client side
UsersRouter.post('/login', async (req, res) => {
    var response = {
        success: "false"
    };
    let user = await User.findOne({ username: req.body.username });
    if (user) {
        if (req.body.password == user.password) {
            let cert = fs.readFileSync('private.key');
            let token = await jwt.sign({username: user.username, loggedInAt: Date.now().toString() }, cert, { algorithm: 'RS256', expiresIn: '1h'});
            if (token) {
                user.loggedInAt.push({loginTime: Date.now()});
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

// CAL GET - returns all events of requesting user
UsersRouter.get('/calendar', async (req, res) => {
    let username = req.body.username;
    let userToken = req.body.token;
    let user = await User.findOne({username: username, token: userToken});
    let response = {
        success: "false"
    };
    if (user) {
        let events = await Event.find().where('owner').equals(user._id).exec();
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
UsersRouter.post('/calendar', async (req, res) => {
    let response = {
        success: "false"
    };
    let user = await User.findOne({username: req.body.username, token: req.body.token});
    if (user) {
        let newEvent = new Event({
            title: req.body.title,
            start: req.body.start,
            end: req.body.end,
            eventDetails: req.body.eventDetails,
            owner: user._id
        });
        let promise = await newEvent.save();
        if (promise) response.success = "true";
    }
    res.json(response);
});

// USER DELETE EVENT
UsersRouter.delete('/calendar/:id', async (req, res) => {
    let response = {
        success: "false"
    };
    let user = await User.findOne({username: req.body.username, token: req.body.token});
    if (user) {
        let event = await Event.findOne({_id: req.params.id});
        if (event) {
            if (event.owner == user._id) {
                Event.deleteOne({_id: req.params.id}).exec();
                response.success = "true";
            }
        }
    }
    res.json(response);
});

// USER UPDATE EVENT
UsersRouter.post('/calendar/:id', async (req, res) => {
    let response = {
        success: "false"
    }
    let user = await User.findOne({username: req.body.username, token: req.body.token});
    if (user) {
        let event = await Event.findOne({_id: req.params.id});
        
        if (event) {
            if (event.owner == user._id) {
                Event.findOneAndUpdate({_id: req.params.id}, {
                title: req.body.event.title,
                start: req.body.event.start,
                end: req.body.event.end,
                eventDetails: req.body.event.eventDetails
                }).exec();
                response.success = "true";
            }
        }
    }
    res.json(response);
});

// USER GIVE PERMISSIONS
UsersRouter.post('/givepermissions', async (req, res) => {
    let response = {
        success: "false"
    };
    let user = await User.findOne({username: req.body.username, token: req.body.token});
    if (user) {
        user.iPermit.push(req.body.permitedUserID);
        user.save();
        response.success = "true";
    }
    res.json(response);
});

UsersRouter.delete('/removepermission/:id', async (req, res) => {
    let response = {
        success: "false"
    };
    let user = await User.findOne({username: req.body.username, token: req.body.token});
    if (user) {
        let index = user.iPermit.indexOf(req.params.id);
        user.iPermit.splice(index, 1);
        user.save();
        response.success = "true";
    }
    res.json(response);
});

module.exports = UsersRouter;