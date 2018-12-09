const User = require('../models/User');
const GlobalEvent = require('../models/GlobalEvent');
const RegisterRequest = require('../models/RegisterRequest');
const Editor = require('../models/Editor');
const EventRequest = require('../models/EventRequest');

module.exports = (app) => {

    // REGISTER POST - checks validity of username input and if valid put them to DB
    app.post('/editor/register', async (req, res) => {
        let response = {
            success: "false"
        }

        // check if username doesnt exist in DB
        let rr = await RegisterRequest.findOne({ username: req.body.username });
        if (rr) {
            response.msg = "בקשה עבור משתמש זה כבר נרשמה";
        } else {
            let user = await User.findOne({ username: req.body.username });
            if (user) {
                response.msg = "משתמש זה כבר רשום";
            } else if (req.body.password == req.body.password2) {
                response.success = "true";
                let newRequest = new RegisterRequest({
                    username: req.body.username,
                    password: req.body.password,
                    fullname: req.body.fullname,
                    category: req.body.category,
                    experience: req.body.experience
                });
                response.msg = "בקשה נרשמה במערכת וממתינה לאישור מנהל";
                newRequest.save((err) => {
                    if (err) throw err;
                });
            } else {
                response.msg = "סיסמאות לא תואמות";
            }
        }
        res.json(response);
    });

    // add global event
    app.put('/globalCal', async (req, res) => {
        let response = {
            success: 'false'
        };
        let user = await User.findOne({ username: req.body.username, token: req.body.token, permission: 'editor' });
        if (user) {
            let newGlobalEvent = new GlobalEvent({
                title: req.body.event.title,
                start: req.body.event.start,
                end: req.body.event.end,
                description: req.body.event.description,
                postedBy: user.username,
                category: req.body.event.category,
                place: req.body.event.place
            });
            let promise = await newGlobalEvent.save();
            if (promise) {
                response.success = 'true';
                response.message = 'אירוע גלובלי חדש נוצר';
            }
        } else {
            response.message = 'שגיאת הרשאות';
        }
        res.json(response);
    });

    // edit global event
    app.post('/globalCal/:id', async (req, res) => {
        let response = {
            success: "false"
        };
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            let gEvent = await GlobalEvent.findById({_id: req.params.id});
            if (gEvent) {
                let editor = await Editor.findOne({username: user.username});
                if (editor) {
                    if (editor.category.includes(gEvent.category)) {
                        let newEventRequest = await new EventRequest({
                            _id: gEvent._id,
                            title: req.body.event.title,
                            start: req.body.event.start,
                            end: req.body.event.end,
                            description: req.body.event.description,
                            update: true,
                            reason: req.body.reason,
                            editorRequesting: editor.username
                        }).save();

                        if (newEventRequest) {
                            response.success = 'true';
                            response.message = 'בקשת עריכה נשמרה בהצלחה';
                        }
                    } else {
                        response.message = 'לא קיימת הרשאה לקטגוריה זו';
                    }
                } else {
                    response.message = 'שגיאת הרשאות';
                }
            } else {
                response.message = "לא נמצא אירוע";
            }
        } else {
            response.message = 'שגיאת משתמש';
        }
        res.json(response);
    });

    // delete global event
    app.delete('/globalCal/:id', async (req, res) => {
        let response = {
            success: "false"
        };
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            let gEvent = await GlobalEvent.findById({_id: req.params.id});
            if (gEvent) {
                let editor = await Editor.findOne({username: user.username});
                if (editor) {
                    if (editors.category.includes(gEvent.category)) {
                        let newEventRequest = new EventRequest({
                            _id: gEvent._id,
                            title: req.body.event.title,
                            start: req.body.event.start,
                            end: req.body.event.end,
                            description: req.body.event.description,
                            delete: true,
                            reason: req.body.reason,
                            editorRequesting: editor.username
                        });
                        if (newEventRequest) {
                            response.success = 'true';
                            response.message = 'בקשת עריכה נשמרה בהצלחה';
                        }
                    } else {
                        response.message = 'לא קיימת הרשאה לקטגוריה זו';
                    }
                } else {
                    response.message = 'שגיאת הרשאות';
                }
            } else {
                response.message = "לא נמצא אירוע";
            }
        } else {
            response.message = 'שגיאת משתמש';
        }
        res.json(response);
    });
}