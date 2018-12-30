const User = require('../models/User');
const Editor = require('../models/Editor');
const RegisterRequest = require('../models/RegisterRequest');
const EventRequest = require('../models/EventRequest');
const GlobalEvent = require('../models/GlobalEvent');
const RejectedRequest = require('../models/RejectedRequest');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (app) => {

    app.post('/admin/requests', async (req, res) => {

        let response = {};

        const { username, token } = req.body,
            user = await User.findOne({ username: username, token: token });
        if (user) {
            if (user.permission == 'admin') {

                const register_requests = await RegisterRequest.find(),
                    event_requests = await EventRequest.find();

                response = {
                    success: 'true',
                    message: 'בקשות התקבלו בהצלחה',
                    register_requests: register_requests,
                    event_requests: event_requests
                }

            } else {

                response = {
                    success: 'false',
                    message: 'הרשאות חסרות'
                };

            }
        } else {

            response = {
                success: 'false',
                message: 'שגיאת נתוני משתמש'
            };

        }

        res.json(response);

    });

    app.post('/admin/requests/:id', async (req, res) => {

        let response = {},
            request;

        const { username, token, approve } = req.body,
            user = await User.findOne({ username: username, token: token }),
            request_id = req.params.id;

        if (user) {
            if (user.permission == 'admin') {
                if (approve == 'true') {

                    request = await RegisterRequest.findById(request_id);

                    if (request) {

                        let approved_user = await User.findOne({ username: request.username });

                        if (approved_user) {

                            approved_user.permission = 'editor';

                            await approved_user.save();

                        }

                        await Editor.create({
                            username: request.username,
                            category: request.category
                        });

                        await RegisterRequest.deleteOne({ _id: request_id });

                        response = {
                            success: 'true',
                            message: 'בקשה אושרה, ומשתמש הפך לעורך תוכן'
                        };

                    } else {

                        request = await EventRequest.findById(request_id);

                        if (request) {

                            const { event_id, title, start, end, description, allDay, category, place, update } = request,
                                editedLastBy = request.editorRequesting;

                            if (update) {

                                await GlobalEvent.findByIdAndUpdate(event_id, {
                                    title: title,
                                    allDay: allDay,
                                    start: start,
                                    end: end,
                                    description: description,
                                    category: category,
                                    place: place,
                                    editedLastBy: editedLastBy
                                });

                                await EventRequest.deleteOne({ _id: request_id });

                                response = {
                                    success: 'true',
                                    message: 'עריכת אירוע גלובלי אושר ועבר ליומן הגלובלי'
                                };

                            } else {

                                await GlobalEvent.findByIdAndDelete(event_id);

                                await EventRequest.deleteMany({ event_id: event_id });

                                response = {
                                    success: 'true',
                                    message: 'מחיקת אירוע גלובלי אושרה'
                                };

                            }
                        } else {

                            response = {
                                success: 'false',
                                message: 'שגיאה במציאת הבקשה'
                            };

                        }
                    }
                } else {
                    const event_request_rejected = await EventRequest.findById(request_id)
                    if (event_request_rejected) {
                        const { event_id, title, start, end, description, postedBy, category, place, editedLastBy, update, reason, editorRequesting } = event_request_rejected
                        const rejected = await RejectedRequest.create({
                            event_id: event_id,
                            title: title,
                            start: start,
                            end: end,
                            description: description,
                            postedBy: postedBy,
                            category: category,
                            place: place,
                            editedLastBy: editedLastBy,
                            update: update,
                            delete: (update == null) ? true : update,
                            reason: reason,
                            editorRequesting: editorRequesting
                        });

                        if (rejected) {
                            let editor = await Editor.findOne({ username: editorRequesting });
                            if (editor) {
                                editor.declinedRequests.push(rejected._id);
                                await editor.save();
                            }
                        }
                    }
                    await RegisterRequest.deleteOne({ _id: request_id });
                    await EventRequest.deleteOne({ _id: request_id });

                    response = {
                        success: 'true',
                        message: 'הבקשה נשללה'
                    };

                }
            } else {

                response = {
                    success: 'false',
                    message: 'הרשאות חסרות'
                };

            }
        } else {

            response = {
                success: 'false',
                message: 'שגיאה במציאת משתמש'
            };

        }

        res.json(response);

    });

    app.post('/admin/getusers', async (req, res) => {

        let response = {};

        const { username, token } = req.body,
            user = await User.findOne({ username: username, token: token });

        if (user) {
            if (user.permission == 'admin') {

                const users = await User.find();

                response = {
                    success: 'true',
                    users: users
                };

            } else {

                response = {
                    success: 'false',
                    message: 'חסרות הרשאות'
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

    app.post('/admin/getuser/:username_to_fetch', async (req, res) => {

        let response = {};

        const { username, token } = req.body,
            user = await User.findOne({ username: username, token: token }),
            username_to_fetch = req.params.username_to_fetch;

        if (user) {
            if (user.permission == 'admin') {

                const user = await User.findOne({ username: username_to_fetch });

                if (user) {
                    response = {
                        success: 'true',
                        user: user
                    };

                } else {

                    response = {
                        success: 'false',
                        message: 'שגיאה במציאת משתמש'
                    };

                }

            } else {

                response = {
                    success: 'false',
                    message: 'חסרות הרשאות'
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

    app.post('/admin/updateuser/:username_to_edit', async (req, res) => {

        let response = {};

        const { username, token, edit_info } = req.body,
            { password, fullname } = edit_info;
        user = await User.findOne({ username: username, token: token }),
            username_to_edit = req.params.username_to_edit;

        if (user) {
            if (user.permission == 'admin') {

                const user = await User.findOne({ username: username_to_edit });

                if (user) {

                    if (password) user.password = bcrypt.hashSync(password, saltRounds);
                    if (fullname) user.fullname = fullname;

                    await user.save();

                    response = {
                        success: 'true',
                        message: 'משתמש נערך בהצלחה'
                    };

                } else {

                    response = {
                        success: 'false',
                        message: 'שגיאה במציאת משתמש'
                    };

                }

            } else {

                response = {
                    success: 'false',
                    message: 'חסרות הרשאות'
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

    app.delete('/admin/deleteuser/:username_to_delete', async (req, res) => {
        let response = {};

        const { username, token } = req.body;
        user = await User.findOne({ username: username, token: token }),
            username_to_delete = req.params.username_to_delete;

        let user_to_delete = await User.findOne({ username: username_to_delete });

        if (user) {
            if (user.permission == 'admin') {

                if (user_to_delete) {

                    await User.deleteOne({ username: username_to_delete });

                    response = {
                        success: 'true',
                        message: 'משתמש נמחק בהצלחה'
                    };

                } else {

                    response = {
                        success: 'false',
                        message: 'שגיאה במציאת משתמש'
                    };

                }

            } else {

                response = {
                    success: 'false',
                    message: 'חסרות הרשאות'
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