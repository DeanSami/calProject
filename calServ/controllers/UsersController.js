const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const config = require('../config');

const User = require('../models/User');
const Event = require('../models/Event');
const GlobalEvent = require('../models/GlobalEvent');
const RegisterRequest = require('../models/RegisterRequest');

module.exports = (app) => {

    app.post('/categories', (req, res) => {
        res.json(config.getCategories());
    });

    app.post('/register',
        check('username').isEmail().withMessage('שם משתמש חייב להיות מייל תקני'),
        check('password').isLength({ min: 6 }).withMessage('סיסמא חייבת להיות לפחות באורך 6'),
        async (req, res) => {

            let response = {};

            const errors = validationResult(req);

            if (errors.isEmpty()) {

                const user = await User.findOne({ username: req.body.username });
                if (user) {
                    response = {
                        success: 'false',
                        message: 'משתמש כבר רשום'
                    }
                } else if (req.body.password == req.body.password2) {
                    await User.create({
                        username: req.body.username,
                        password: req.body.password,
                        fullname: req.body.fullname
                    });
                    if (req.body.editor) {
                        await RegisterRequest.create({
                            username: req.body.username,
                            password: req.body.password,
                            fullname: req.body.fullname,
                            category: req.body.category,
                            experience: req.body.experience
                        });
                        response = {
                            success: 'true',
                            message: 'מעביר לדף ראשי, בקשה להיות עורך תוכן נרשמה במערכת וממתינה לאישור מנהל'
                        }
                    } else {
                        response = {
                            success: 'true',
                            message: 'מעביר לדף ראשי'
                        }
                    }
                } else {
                    response = {
                        success: 'false',
                        message: 'סיסמאות לא תואמות'
                    }
                }
            } else {
                response = {
                    success: 'false',
                    message: errors.array()[0].msg
                }
            }
            res.json(response)
        }
    );

    app.post('/login', async (req, res) => {

        let response = {};

        const user = await User.findOne({ username: req.body.username });

        if (user) {

            if (req.body.password == user.password) {

                let cert = fs.readFileSync('private.key');
                let token = await jwt.sign({ username: user.username, loggedInAt: Date.now().toString() }, cert, { algorithm: 'RS256', expiresIn: '1h' });

                user.loggedInAt.push(Date.now());
                user.token = token;
                await user.save();
                let msg = 'ברוך הבא, ';
                msg += user.username;
                response = {
                    success: 'true',
                    message: msg,
                    username: user.username,
                    token: token,
                    permission: user.permission
                }
            } else {
                response = {
                    success: 'false',
                    message: 'סיסמאות לא תואמות'
                }
            }
        } else {
            response = {
                success: 'false',
                message: 'לא נמצא אימייל'
            }
        }
        res.json(response);
    });

    app.post('/calendar', async (req, res) => {
        let response = {};

        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {

            let events = await Event.find().where('owner').equals(user.username).exec();
            let user_events = [];
            events.forEach((event) => {
                user_events.push(event);
            });
            let theyPermit = [];
            for (let i = 0; i < user.theyPermit.length; i++) {
                permited_user = await User.findOne( { _id: user.theyPermit[i] } );
                if (permited_user) {
                    theyPermit.push(permited_user.username);
                }
            }
            response = {
                success: 'true',
                message: 'הנך מועבר ליומן',
                events: user_events,
                globalEvents: user.globalEvents,
                theyPermit: theyPermit
            }
        } else {
            response = {
                success: 'false',
                message: 'שגיאת משתמש'
            }
        }
        res.json(response);
    });

    app.post('/calendar/:permited_uname', async (req, res) => {
        let response = {};

        let user_editing = await User.findOne({ username: req.body.username, token: req.body.token });
        let user_permiting = await User.findOne( {username: req.params.permited_uname});
        if (user_permiting && user_editing) {
            if (user_editing.theyPermit.indexOf(user_permiting._id) >= 0 && user_permiting.iPermit.indexOf(user_editing._id) >= 0) {
                let events = await Event.find().where('owner').equals(user_permiting.username).exec();
                let user_events = [];
                events.forEach((event) => {
                    user_events.push(event);
                });
                let theyPermit = [];
                for (let i = 0; i < user_editing.theyPermit.length; i++) {
                    user_that_permited = await User.findOne( { _id: user_editing.theyPermit[i] } );
                    if (user_that_permited) {
                        theyPermit.push(user_that_permited.username);
                    }
                }
                response = {
                    success: 'true',
                    message: 'הנך מועבר ליומן',
                    events: user_events,
                    globalEvents: user_permiting.globalEvents,
                    theyPermit: theyPermit
                }
            } else {
                response = {
                    success: 'false',
                    message: 'שגיאת משתמש'
                }
            }
        }
        res.json(response);
    });

    app.post('/globalCal', async (req, res) => {
        let response = {};
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            let events = await GlobalEvent.find();
            let global_events = []
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
        } else {
            response = {
                success: 'false',
                message: 'שגיאת משתמש'
            };
        }
        res.json(response);
    });

    app.post('/globalCal/pull/:id', async (req, res) => {
        let response = {};
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            let event = await GlobalEvent.findById(req.params.id);
            if (event) {
                let exist = false;
                user.globalEvents.forEach((event) => {
                    if (req.params.id == event._id) {
                        exist = true;
                    }
                });
                if (!exist) {
                    user.globalEvents.push(event);
                    await user.save();
                    response = {
                        success: 'true',
                        message: 'אירוע גלובלי נוסף בהצלחה ליומן אישי'
                    }
                } else {
                    response = {
                        success: 'false',
                        message: 'אירוע קיים כבר ביומן האישי'
                    }
                }
            } else {
                response = {
                    success: 'false',
                    message: 'שגיאה בבחירת אירוע'
                }
            }
        } else {
            response = {
                success: 'false',
                message: 'שגיאה בהרשאות'
            }
        }
        res.json(response);
    });

    app.put('/calendar', async (req, res) => {
        let response = {};
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            let event = await Event.create({
                title: req.body.event.title,
                start: req.body.event.start,
                end: req.body.event.end,
                description: req.body.event.description,
                owner: user.username
            });
            response = {
                success: 'true',
                message: 'אירוע נוצר בהצלחה',
                event: event
            }
        } else {
            response = {
                success: 'false',
                message: 'שגיאת משתמש'
            }
        }
        res.json(response);
    });

    app.put('/calendar/:permited_uname', async (req, res) => {
        let response = {};
        let user_editing = await User.findOne({ username: req.body.username, token: req.body.token });
        let user_permiting = await User.findOne( {username: req.params.permited_uname});
        if (user_permiting && user_editing) {
            if (user_editing.theyPermit.indexOf(user_permiting._id) >= 0 && user_permiting.iPermit.indexOf(user_editing._id) >= 0) {
                let event = await Event.create({
                    title: req.body.event.title,
                    start: req.body.event.start,
                    end: req.body.event.end,
                    description: req.body.event.description,
                    owner: user_permiting.username
                });
                response = {
                    success: 'true',
                    message: 'אירוע נוצר בהצלחה',
                    event: event
                }
            } else {
                response = {
                    success: 'false',
                    message: 'שגיאת משתמש'
                }
            }
        }
        res.json(response);
    });

    app.delete('/calendar/:id', async (req, res) => {
        let response = {};
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            let event = await Event.findOne({ _id: req.params.id });
            if (event) {
                if (event.owner == user.username) {
                    await Event.deleteOne({ _id: req.params.id });
                    response = {
                        success: 'true',
                        message: 'אירוע נמחק בהצלחה'
                    };
                }
            } else {
                let event_index = -1;
                user.globalEvent.forEach((event, index) => {
                    if (event._id == req.params.id) {
                        event_index = index;
                    }
                });
                if (event_index >= 0) {
                    user.globalEvents.splice(event_index, 1);
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
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            let event = await Event.findOne({ _id: req.params.id });
            if (event) {
                if (event.owner == user.username) {
                    if (req.body.event.title) event.title = req.body.event.title;
                    if (req.body.event.start) event.start = req.body.event.start;
                    if (req.body.event.end) event.end = req.body.event.end;
                    if (req.body.event.description) event.description = req.body.event.description;
                    await event.save();
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

    app.post('/givepermissions', async (req, res) => {
        let response = {};
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            let permited = await User.findOne({ username: req.body.permiteduname });
            if (permited) {
                let is_permited = false;
                user.iPermit.forEach(permited_id => {
                    if (permited_id.equals(permited._id)) {
                        is_permited = !is_permited
                    }
                });
                if (!is_permited) {
                    user.iPermit.push(permited._id);
                    permited.theyPermit.push(user._id);
                    await permited.save();
                    await user.save();
                    response = {
                        success: 'true',
                        message: 'הרשאה ניתנה בהצלחה'
                    }
                } else {
                    response = {
                        success: 'false',
                        message: 'למשתמש זה כבר קיימת הרשאה'
                    }
                }
            } else {
                response = {
                    success: 'false',
                    message: 'משתמש לא נמצא'
                }
            }
        } else {
            response = {
                success: 'false',
                message: 'שגיאת משתמש'
            }
        }
        res.json(response);
    });

    app.delete('/removepermission/:id', async (req, res) => {
        let response = {};
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            let permited = await User.find({_id: req.params.id}).catch(() => {});
            if (permited) {
                let permited_index = -1;
                user.iPermit.forEach((permited_id, index) => {
                    if (permited_id.equals(permited._id)) {
                        permited_index = index;
                    }
                });
                if (permited_index >= 0) {
                    user.iPermit.splice(permited_index, 1);
                    await user.save();
                    response = {
                        success: 'true',
                        message: 'הרשאה הוסרה בהצלחה'
                    }
                } else {
                    response = {
                        success: 'false',
                        message: 'משתמש לא נמצא ברשימת מורשים'
                    }
                }
            } else {
                response = {
                    success: 'false',
                    message: 'שגיאה במציאת משתמש'
                }
            }
        } else {
            response = {
                success: 'false',
                message: 'שגיאת משתמש'
            }
        }
        res.json(response);
    });
}