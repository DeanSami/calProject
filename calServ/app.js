const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');

let User = require('./models/User');
let Event = require('./models/Event');

const dbURI = "mongodb://deanz:D305622375m@ds117334.mlab.com:17334/calendarproject"

mongoose.connect(dbURI, { useNewUrlParser: true });

let db = mongoose.connection;

let app = express();

app.set('port', process.env.PORT || 3000);

// parse application/json
app.use(bodyParser.json());

app.use(cors());

// REGISTER GET - gets register page
app.get('/register', (req, res) => {
    let response = {
        success: "true",
        msg: "register.html"
    };
    res.json(response);
});

// REGISTER POST - checks validity of username input and if valid put them to DB
app.post('/register', async (req, res) => {
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
app.get('/login', (req, res) => {
    let response = {
        success: "true",
        msg: "login.html"
    };
    res.json(response);
});

// LOGIN POST - should create new token and save it, both server and client side
app.post('/login', async (req, res) => {
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
app.get('/calendar', async (req, res) => {
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
app.post('/calendar', async (req, res) => {
    let response = {
        success: "false"
    };
    let user = await User.findOne({username: req.body.username, token: req.body.token});
    if (user) {
        let newEvent = new Event({
            eventName: req.body.eventName,
            eventStart: req.body.eventStart,
            eventEnd: req.body.eventEnd,
            eventDetails: req.body.eventDetails,
            owner: user._id
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
app.post('/calendar/:id', async (req, res) => {
    let response = {
        success: "false"
    }
    let user = await User.findOne({username: req.body.username, token: req.body.token});
    if (user) {
        let event = await Event.findOne({_id: req.params.id});
        
        if (event) {
            if (event.owner == user._id) {
                Event.findOneAndUpdate({_id: req.params.id}, {
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
    let user = await User.findOne({username: req.body.username, token: req.body.token});
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
    let user = await User.findOne({username: req.body.username, token: req.body.token});
    if (user) {
        let index = user.iPermit.indexOf(req.params.id);
        user.iPermit.splice(index, 1);
        user.save();
        response.success = "true";
    }
    res.json(response);
});

app.listen(app.get('port'), () => {
    console.log('Server is listening on ' + app.get('port'));
});