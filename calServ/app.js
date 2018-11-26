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
    res.end('הרשמה');
});

// REGISTER POST - checks validity of username input and if valid put them to DB
app.post('/register', (req, res) => {
    let password2 = req.body.password2;
    let userDetails = {
        username: req.body.username,
        password: req.body.password,
        fullname: req.body.fullname,
        permission: 'user',
        registeredAt: Date.now()
    }
    
    // check if username doesnt exist in DB
    User.findOne({username: userDetails.username}, (err, user) => {
        if (user) res.end('משתמש כבר רשום');
        else if (userDetails.password != password2) {
                res.end('סיסמאות לא תואמות');
            } else {
                let newUser = new User({
                    username: userDetails.username,
                    password: userDetails.password,
                    fullname: userDetails.fullname,
                    permission: 'user',
                    registeredAt: Date.now(),
                    token: null
                });
                newUser.save((err) => {
                    if (err) throw err;
                    res.end('משתמש חדש נרשם');
                });
            }
        }
    );
});

// LOGIN GET - gets the login page
app.get('/login', (req, res) => {
    res.end('דף התחברות');
});

// LOGIN POST - should create new token and save it, both server and client side
app.post('/login', async (req, res) => {
    var response = {
        success: "false"
    };
    
    let user = await User.findOne({ username: req.body.username });
    if (user) {
        user.loggedInAt.push({loginTime: Date.now()});
        
        let cert = fs.readFileSync('private.key');
        let token = await jwt.sign({username: user.username, loggedInAt: Date.now().toString() }, cert, { algorithm: 'RS256', expiresIn: '1h'});

        if (token) {
            user.token = token;
            response.token = token;
            response.username = user.username;
            response.success = "true";
        }
        user.save((err) => {
            if (err) throw err;
        });
    }
    res.status(200).header("Access-Control-Allow-Origin", "*").header("Content-Type", "application/json").json(response);
});


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
app.post('/calendar', (req, res) => {
    let newEvent = new Event({
        eventName: req.body.eventName,
        eventStart: req.body.eventStart,
        eventEnd: req.body.eventEnd,
        eventDetails: req.body.eventDetails,
        owner: req.body.user._id
    });
    newEvent.save((err) => {
        if (err) res.send('שגיאה');
        else res.send('אירוע חדש נוצר');
    })
});

// USER EDIT EVENT
app.post('/calendar/:id', (req, res) => {
    let event;
    req.user.userEvents.forEach((element) => {
        if (element._id == req.params.id) event = element;
    });
    if (event != null) {
        event.eventName = req.body.eventName;
        event.eventStart = req.body.eventStart;
        event.eventEnd = req.body.eventEnd;
        event.eventDetails = req.body.eventDetails;
    }
    req.user.save((err) => {
        if (err) res.end('שגיאה');
        else res.end('עודכן');
    })
});

// USER DELETE EVENT
app.delete('/calendar/:id', (req, res) => {
    db.collections.users.update(
        { _id: req.user._id },
        { $unset: { userEvents: { _id: req.params.id } } }
    );
    res.end('נמחק');
});

app.listen(app.get('port'), () => {
    console.log('Server is listening on ' + app.get('port'));
});