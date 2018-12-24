const User = require('../models/User');
const GlobalEvent = require('../models/GlobalEvent');
const Editor = require('../models/Editor');
const EventRequest = require('../models/EventRequest');

const config = require('../config');

module.exports = (app) => {

    app.put('/globalCal', async (req, res) => {

        let response = {};

        const { username, token } = req.body,
            user = await User.findOne({ username: username, token: token });

        let { event } = req.body;

        if (user) {

            event.postedBy = username;

            if (user.permission == 'admin') {
                if (event.place) {
                    if (event.category) {
                        if (event.title) {
                            if (config.getCategories().includes(event.category)) {
                                if (config.getPlaces().includes(event.place)) {
                                    const new_global_event = await GlobalEvent.create(event);
            
                                    response = {
                                        success: 'true',
                                        message: 'אירוע נוצר בהצלחה',
                                        globalEvent: new_global_event
                                    };
            
                                } else {
            
                                    response = {
                                        success: 'false',
                                        message: 'אנא בחר מיקום חוקי'
                                    };
            
                                }
                            } else {
            
                                response = {
                                    success: 'false',
                                    message: 'אנא בחר קטגוריה חוקית'
                                };
            
                            }
                        } else {

                            response = {
                                success: 'false',
                                message: 'אנא ספק כותרת'
                            };

                        }
                    } else {

                        response = {
                            success: 'false',
                            message: 'אנא ספק קטגוריה'
                        };

                    }
                } else {

                    response = {
                        success: 'false',
                        message: 'אנא ספק מיקום'
                    };

                }
                
            } else {

                const editor = await Editor.findOne({ username: username });

                if (editor) {
                    if (editor.category.includes(event.category)) {

                        if (event.place) {
                            if (event.category) {
                                if (event.title) {
                                    if (config.getCategories().includes(event.category)) {
                                        if (config.getPlaces().includes(event.place)) {

                                            const new_global_event = await GlobalEvent.create(event);

                                            response = {
                                                success: 'true',
                                                message: 'אירוע נוצר בהצלחה',
                                                globalEvent: new_global_event
                                            };

                                        } else {

                                            response = {
                                                success: 'false',
                                                message: 'אנא בחר מיקום חוקי'
                                            };

                                        }
                                    } else {

                                        response = {
                                            success: 'false',
                                            message: 'אנא בחר קטגוריה חוקית'
                                        };

                                    }
                                } else {

                                    response = {
                                        success: 'false',
                                        message: 'אנא ספק כותרת'
                                    };

                                }
                            } else {

                                response = {
                                    success: 'false',
                                    message: 'אנא ספק קטגוריה'
                                };

                            }
                        } else {

                            response = {
                                success: 'false',
                                message: 'אנא ספק מיקום'
                            };
                            
                        }
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

        const { username, token, event, reason } = req.body,
            { title, start, end, description, category, place } = event,
            user = await User.findOne({ username: username, token: token }),
            id = req.params.id;

        if (user) {

            const editor = await Editor.findOne({ username: username });

            if (editor || user.permission == 'admin') {

                let global_event_to_update = await GlobalEvent.findById({ _id: id });

                if (global_event_to_update) {
                    if (user.permission == 'admin') {

                        if (title) global_event_to_update.title = title;
                        if (start) global_event_to_update.start = start;
                        if (end) global_event_to_update.start = start;
                        if (description) global_event_to_update.description = description;
                        if (category) global_event_to_update.category = category;
                        if (place) global_event_to_update.place = place;

                        await global_event_to_update.save();

                        await EventRequest.deleteMany({ event_id: id });

                        response = {
                            success: 'true',
                            message: 'אירוע נערך',
                            event: global_event_to_update
                        };

                    } else if (reason) {

                        const request_already_exists = await EventRequest.findOne({ event_id: id });

                        if (request_already_exists) {

                            response = {
                                success: 'false',
                                message: 'בקשה עריכה לאירוע זה כבר קיימת'
                            };

                        } else {
                            if (editor.category.includes(global_event_to_update.category)) {

                                const event_request = await EventRequest.create({
                                    event_id: global_event_to_update._id,
                                    title: title,
                                    start: start,
                                    end: end,
                                    description: description,
                                    update: true,
                                    reason: reason,
                                    editorRequesting: username
                                });

                                response = {
                                    success: 'true',
                                    message: 'בקשת עריכה נשמרה בהצלחה',
                                    request: event_request
                                };

                            } else {

                                response = {
                                    success: 'false',
                                    message: 'לא קיימת הרשאה לקטגוריה זו'
                                };

                            }
                        }

                    } else {

                        response = {
                            success: 'false',
                            message: 'אנא ספק סיבה לעריכה'
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

    app.delete('/globalCal/:id', async (req, res) => {

        let response = {};

        const { username, token, reason } = req.body;
            user = await User.findOne({ username: username, token: token }),
            id = req.params.id;

        if (user) {

            let editor = await Editor.findOne({ username: username });

            if (editor || user.permission == 'admin') {

                const global_event_to_delete = await GlobalEvent.findById({ _id: id });

                if (global_event_to_delete) {
                    if (user.permission == 'admin') {

                        await global_event_to_delete.remove();

                        await EventRequest.deleteMany({ event_id: id });

                        response = {
                            success: 'true',
                            message: 'אירוע נמחק בהצלחה'
                        };

                    } else if (editor.category.includes(global_event_to_delete.category)) {
                        const { id, title, start, end, description } = global_event_to_delete;
                        if (reason) {

                            const request_already_exists = await EventRequest.findOne({ event_id: id });

                            if (request_already_exists) {

                                response = {
                                    success: 'false',
                                    message: 'בקשה עריכה לאירוע זה כבר קיימת'
                                };

                            } else {

                                const event_request = await EventRequest.create({
                                    event_id: id,
                                    event_title: title,
                                    start: start,
                                    end: end,
                                    description: description,
                                    delete: true,
                                    reason: reason,
                                    editorRequesting: editor.username
                                });

                                response = {
                                    success: 'true',
                                    message: 'בקשת עריכה נשמרה בהצלחה',
                                    request: event_request
                                };
                            }
                        } else {

                            response = {
                                success: 'false',
                                message: 'אנא ספק סיבה למחיקה'
                            };

                        }
                    } else {

                        response = {
                            success: 'false',
                            message: 'לא קיימת הרשאה לקטגוריה זו'
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

        const { username, token } = req.body,
            category_name = req.params.category_name,
            user = await User.findOne({ username: username, token: token });

        if (user && user.permission == 'editor') {

            let editor = await Editor.findOne({ username: username });

            if (editor) {

                let category_index = -1;

                editor.category.forEach((category, index) => {
                    if (category == category_name) {
                        category_index = index;
                    }
                });

                if (category_index < 0) {

                    editor.category.push(category_name);

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

        const { username, token } = req.body,
            category_name = req.params.category_name,
            user = await User.findOne({ username: username, token: token });

        if (user && user.permission == 'editor') {

            let editor = await Editor.findOne({ username: username });

            if (editor) {

                let category_index = -1;

                editor.category.forEach((category, index) => {
                    if (category == category_name) {
                        category_index = index;
                    }
                });

                if (category_index >= 0) {
                    editor.category.splice(category_index, 1);

                    await editor.save();

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