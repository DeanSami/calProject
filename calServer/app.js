const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');

let User = require('./models/User');
let Event = require('./models/Event');

mongoose.connect('mongodb://localhost/cal', { useNewUrlParser: true });

let db = mongoose.connection;

let app = express();

app.set('port', process.env.PORT || 3000);

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());

app.use(cors());

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport Init
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy((username, password, done) => {
    User.find({username: username}, (err, user) => {
        if (err) throw err;
        if (!user) {
            return done(null, false, { message: 'משתמש לא קיים'});
        }
        if (User.comparePassword(password, user[0].password)) {
            return done(null, user[0]);
        } else {
            return done(null, false, { message: 'סיסמא לא תואמת'});
        }
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.getUserById(id, (err, user) => {
        done(err, user);
    });
});

function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.end('בבקשה התחבר');
    }
};

function ensureUnAuthenticated (req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    } else {
        res.end('משתמש מחובר');
    }
};

// REGISTER
app.get('/register', ensureUnAuthenticated, (req, res) => {
    res.end('הרשמה');
});

app.post('/register', ensureUnAuthenticated, (req, res) => {
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
        else {
            if (userDetails.password != password2) {
                res.end('סיסמאות לא תואמות');
            } else {
                let newUser = new User({
                    username: userDetails.username,
                    password: userDetails.password,
                    fullname: userDetails.fullname,
                    permission: 'user',
                    registeredAt: Date.now()
                });
                User.createUser(newUser, (err) => {
                    if (err) res.end('שגיאה');
                    else res.end('משתמש נרשם');
                });
            }
        }
    })
});

// LOGIN
app.get('/login', ensureUnAuthenticated, (req, res) => {
    res.end('דף התחברות');
});

app.post('/login', async (req, res) => {
    let response = {
        success: "true"
    };
    
    let user = await User.getUserByUsername(req.body.username);
    if (user) {
        response.success = "false";
    }
    res.status(200).header("Access-Control-Allow-Origin", "*").header("Content-Type", "application/json").json(response);
});

// app.post('/login', passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login'}),(req, res) => {
//    res.end(message);
// });

// USER GET EVENTS
// app.get('/calendar', ensureAuthenticated, (req, res) => {
//     res.end('username:' + req.user.userEvents);
// });

app.get('/calendar', ensureAuthenticated, (req, res) => {
    let query = { owner: req.user._id };
    Event.find(query, (err, events) => {
        if (err) res.end("שגיאה");
        else {
            events.forEach((element) => {
                console.log(element);
            });
            res.end("סוף");
        }
    })
});

// USER ADD EVENT
app.post('/calendar', ensureAuthenticated, (req, res) => {
    let newEvent = new Event({
        eventName: req.body.eventName,
        eventStart: req.body.eventStart,
        eventEnd: req.body.eventEnd,
        eventDetails: req.body.eventDetails,
        owner: req.user._id
    });
    newEvent.save((err) => {
        if (err) res.send('שגיאה');
        else res.send('אירוע חדש נוצר');
    })
});

// USER EDIT EVENT
app.post('/calendar/:id', ensureAuthenticated, (req, res) => {
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
    // let event;
    // req.user.userEvents.forEach((element) => {
    //     if (element._id == req.params.id) event = element;
    // });
    // User.update(
    //     {_id : req.user._id},
    //     { $pull : { userEvents : { _id: req.params.id }}}
    // );
    db.collections.users.update(
        { _id: req.user._id },
        { $unset: { userEvents: { _id: req.params.id } } }
    );
    res.end('נמחק');
});

app.listen(app.get('port'), () => {
    console.log('Server is listening on ' + app.get('port'));
});