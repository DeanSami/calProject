const User = require('../models/User');
const GlobalEvent = require('../models/GlobalEvent');
const Editor = require('../models/Editor');
const EventRequest = require('../models/EventRequest');

const config = require('../config');

module.exports = (app) => {

    app.put('/globalCal', async (req, res) => {
        let response = {};
        let user = await User.findOne({ username: req.body.username, token: req.body.token, permission: 'editor' });
        let editor = await Editor.findOne({ username: req.body.username });
        if (user && editor) {
            if (editor.category.includes(req.body.event.category) &&
                config.getCategories().includes(req.body.event.category)) {
                if (req.body.title && req.body.event.category && req.body.event.place) {
                    let new_global_event = await GlobalEvent.create({
                        title: req.body.event.title,
                        start: req.body.event.start,
                        end: req.body.event.end,
                        description: req.body.event.description,
                        postedBy: user.username,
                        category: req.body.event.category,
                        place: req.body.event.place
                    });
                    response = {
                        success: 'true',
                        message: 'אירוע גלובלי חדש נוצר',
                        globalEvent: new_global_event
                    };
                } else {
                    response = {
                        success: 'false',
                        message: 'שדות חסרים'
                    };
                }
            } else {
                response = {
                    success: 'false',
                    message: 'שגיאת קטגוריה',
                };
            }
        } else {
            response = {
                success: 'false',
                message: 'שגיאת הרשאות',
            };
        }
        res.json(response);
    });

    app.post('/globalCal/:id', async (req, res) => {
        let response = {};
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            let global_event = await GlobalEvent.findById({ _id: req.params.id });
            if (global_event) {
                let editor = await Editor.findOne({ username: user.username });
                if (editor) {
                    if (editor.category.includes(global_event.category)) {
                        await EventRequest.create({
                            event_id: global_event._id,
                            title: req.body.event.title,
                            start: req.body.event.start,
                            end: req.body.event.end,
                            description: req.body.event.description,
                            update: true,
                            reason: req.body.reason,
                            editorRequesting: editor.username
                        });
                        response = {
                            success: 'true',
                            message: 'בקשת עריכה נשמרה בהצלחה'
                        };
                    } else {
                        response = {
                            success: 'false',
                            message: 'לא קיימת הרשאה לקטגוריה זו'
                        };
                    }
                } else {
                    response = {
                        success: 'false',
                        message: 'שגיאת הרשאות'
                    };
                }
            } else {
                response = {
                    success: 'false',
                    message: 'לא נמצא אירוע'
                };
            }
        } else {
            response = {
                success: 'false',
                message: 'שגיאת משתמש'
            };
        }
    });

    app.delete('/globalCal/:id', async (req, res) => {
        let response = {};
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            let global_event = await GlobalEvent.findById({ _id: req.params.id });
            if (global_event) {
                let editor = await Editor.findOne({ username: user.username });
                if (editor) {
                    if (editor.category.includes(global_event.category)) {
                        await EventRequest.create({
                            event_id: global_event._id,
                            delete: true,
                            reason: req.body.reason,
                            editorRequesting: editor.username
                        });
                        response = {
                            success: 'true',
                            message: 'בקשת עריכה נשמרה בהצלחה'
                        };
                    } else {
                        response = {
                            success: 'true',
                            message: 'לא קיימת הרשאה לקטגוריה זו'
                        };
                    }
                } else {
                    response = {
                        success: 'true',
                        message: 'שגיאת הרשאות'
                    };
                }
            } else {
                response = {
                    success: 'true',
                    message: 'לא נמצא אירוע'
                };
            }
        } else {
            response = {
                success: 'true',
                message: 'שגיאת משתמש'
            };
        }
        res.json(response);
    });

    app.put('/category/:category_name', async (req, res) => {
        let response = {};
        let user = await User.findOne( { username: req.body.username, token: req.body.token });
        if (user && user.permission == 'editor') {
            let editor = await Editor.findOne({ username: user.username });
            if (editor) {
                let category_index = -1;
                editor.category.forEach((category, index) => {
                    if (category == req.params.category_name) {
                        category_index = index;
                    }
                });
                if (category_index < 0) {
                    editor.category.push(req.params.category_name);
                    response = {
                        success: 'true',
                        message: 'קטגוריה נוספה'
                    };
                } else {
                    response = {
                        success: 'false',
                        message: 'קטגוריה כבר קיימת'
                    };
                }
            } else {
                response = {
                    success: 'false',
                    message: 'שגיאת הרשאות'
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

    app.delete('/category/:category_name', async (req, res) => {
        let response = {};
        let user = await User.findOne( { username: req.body.username, token: req.body.token });
        if (user && user.permission == 'editor') {
            let editor = await Editor.findOne({ username: user.username });
            if (editor) {
                let category_index = -1;
                editor.category.forEach((category, index) => {
                    if (category == req.params.category_name) {
                        category_index = index;
                    }
                });
                if (category_index >= 0) {
                    editor.category.splice(category_index, 1);
                    response = {
                        success: 'true',
                        message: 'קטגוריה הוסרה'
                    };
                } else {
                    response = {
                        success: 'false',
                        message: 'שגיאה בבחירת קטגוריה'
                    };
                }
            } else {
                response = {
                    success: 'false',
                    message: 'שגיאת הרשאות'
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