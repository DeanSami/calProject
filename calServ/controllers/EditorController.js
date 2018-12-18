const User = require('../models/User');
const GlobalEvent = require('../models/GlobalEvent');
const Editor = require('../models/Editor');
const EventRequest = require('../models/EventRequest');

const config = require('../config');

module.exports = (app) => {

    app.put('/globalCal', async (req, res) => {
        let response = {};
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        let editor = await Editor.findOne({ username: req.body.username });
        if (user || editor) {
            if (user.permission == 'editor' || user.permission == 'admin') {
                if ((user.permission == 'admin' || editor.category.includes(req.body.event.category)) &&
                    config.getCategories().includes(req.body.event.category)) {
                    if (req.body.event.title && req.body.event.category && req.body.event.place) {
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
        } else {
            response = {
                success: 'false',
                message: 'שגיאת משתמש'
            };
        }
        res.json(response);
    });

    app.post('/globalCal/:id', async (req, res) => {
        let response = {};
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            let editor = await Editor.findOne({ username: user.username });
            if (editor || user.permission == 'admin') {
                let global_event = await GlobalEvent.findById({ _id: req.params.id });
                if (global_event) {
                    if (user.permission == 'admin') {
                        global_event.title = req.body.event.title;
                        global_event.start = req.body.event.start;
                        global_event.end = req.body.event.end;
                        global_event.description = req.body.event.description;
                        global_event.category = req.body.event.category;
                        global_event.place = req.body.event.place;
                        await global_event.save();
                        response = {
                            success: 'true',
                            message: 'אירוע נערך',
                            globalEvent: global_event
                        }
                    } else if (editor.category.includes(global_event.category)) {
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
                    message: 'שגיאת משתמש'
                };
            }
        } else {
            response = {
                success: 'false',
                message: 'לא נמצא אירוע'
            };
        }
        res.json(response);
    });

    app.delete('/globalCal/:id', async (req, res) => {
        let response = {};
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            let editor = await Editor.findOne({ username: user.username });
            if (editor || user.permission == 'admin') {
                let global_event = await GlobalEvent.findById({ _id: req.params.id });
                if (global_event) {
                    if (user.permission == 'admin') {
                        await global_event.remove();
                        response = {
                            success: 'true',
                            message: 'אירוע נמחק בהצלחה'
                        };
                    } else if (editor.category.includes(global_event.category)) {
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
                            success: 'false',
                            message: 'לא קיימת הרשאה לקטגוריה זו'
                        };
                    }
                    if (user.permission == 'admin') {
                        await GlobalEvent.findByIdAndDelete(global_event._id);
                        response = {
                            success: 'true',
                            message: 'אירוע נמחק בהצלחה'
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
                    message: 'שגיאת הרשאות'
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
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
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
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
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