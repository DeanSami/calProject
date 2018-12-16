const User = require('../models/User');
const Editor = require('../models/Editor');
const RegisterRequest = require('../models/RegisterRequest');
const EventRequest = require('../models/EventRequest');

module.exports = (app) => {

    app.post('/admin/requests', async (req, res) => {
        let response = {};
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            if (user.permission == 'admin') {

                let register_requests = await RegisterRequest.find();
                let event_requests = await EventRequest.find();

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
                }
            }
        } else {
            response = {
                success: 'false',
                message: 'שגיאת נתוני משתמש'
            }
        }
        res.json(response);
    });

    app.post('/admin/requests/:id', async (req, res) => {
        let response = {};
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            if (user.permission == 'admin') {
                if (req.body.approve == 'true') {
                    let request;
                    request = await RegisterRequest.findById(req.params.id);
                    if (request) {
                        approved_user = await User.findOne({ username: request.username });
                        if (approved_user) {
                            approved_user.permission = 'editor'
                            await approved_user.save();
                        }
                        await Editor.create({
                            username: request.username,
                            category: request.category
                        });
                        await RegisterRequest.deleteOne({ _id: req.params.id });
                        response = {
                            success: 'true',
                            message: 'בקשה אושרה, ומשתמש הפך לעורך תוכן'
                        }
                    } else {
                        request = await EventRequest.findById(req.params.id);
                        if (request) {
                            if (request.update) {
                                await GlobalEvent.findByIdAndUpdate(request.event_id, {
                                    title: request.title,
                                    start: request.start,
                                    end: request.end,
                                    description: request.description,
                                    category: request.category,
                                    place: request.place,
                                    editedLastBy: request.editorRequesting
                                });
                                await EventRequest.deleteOne({ _id: req.params.id });
                                response = {
                                    success: 'true',
                                    message: 'עריכת אירוע גלובלי אושר ועבר ליומן הגלובלי'
                                }
                            } else {
                                await GlobalEvent.findByIdAndDelete(request.event_id);
                                response = {
                                    success: 'true',
                                    message: 'מחיקת אירוע גלובלי אושרה'
                                }
                            }
                        } else {
                            response = {
                                success: 'true',
                                message: 'שגיאה במציאת הבקשה'
                            }
                        }
                    }
                } else {
                    await RegisterRequest.deleteOne({ _id: req.params.id });
                    await EventRequest.deleteOne({ _id: req.params.id });
                    response = {
                        success: 'true',
                        message: 'הבקשה נשללה'
                    }
                }
            } else {
                response = {
                    success: 'false',
                    message: 'הרשאות חסרות'
                }
            }
        } else {
            response = {
                success: 'false',
                message: 'שגיאה במציאת משתמש'
            }
        }
        res.json(response);
    });
}