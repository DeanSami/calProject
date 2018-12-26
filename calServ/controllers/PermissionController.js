const User = require('../models/User');
const Event = require('../models/Event');

module.exports = (app) => {

    app.post('/permitedCalendar/getEvents/:permited_uname', async (req, res) => {

        let response = {};

        const { username, token }   = req.body,
                permited_uname      = req.params.permited_uname,
                user_editing        = await User.findOne({ username: username, token: token }),
                user_permiting      = await User.findOne( {username: permited_uname});

        if (user_permiting && user_editing) {

            if (user_editing.theyPermit.indexOf(user_permiting._id) >= 0 && user_permiting.iPermit.indexOf(user_editing._id) >= 0) {

                const   events      = await Event.find().where('owner').equals(user_permiting.username).exec();
                let     user_events = [];

                events.forEach((event) => {
                    user_events.push(event);
                });

                const msg = "האירועים של ".concat(user_permiting.username).concat(' התווספו ליומן');

                response = {
                    success: 'true',
                    message: msg,
                    events: user_events
                };

            } else {

                response = {
                    success: 'false',
                    message: 'שגיאת משתמש'
                };

            }
        }

        res.json(response);

    });

    app.put('/permitedCalendar/:permited_uname', async (req, res) => {

        let response = {};

        const { username, token , event}            = req.body,
                { title, start, end, description }  = event,
                permited_uname                      = req.params.permited_uname,
                user_editing                        = await User.findOne({ username: username, token: token }),
                user_permiting                      = await User.findOne( {username: permited_uname});

        if (user_permiting && user_editing) {
            if (user_editing.theyPermit.indexOf(user_permiting._id) >= 0 && user_permiting.iPermit.indexOf(user_editing._id) >= 0) {

                const event = await Event.create({
                    title: (title)?title:'',
                    start: start,
                    end: end,
                    description: description,
                    owner: user_permiting.username
                });

                response = {
                    success: 'true',
                    message: 'אירוע נוצר בהצלחה',
                    event: event
                };

            } else {

                response = {
                    success: 'false',
                    message: 'שגיאת משתמש'
                };

            }
        }

        res.json(response);

    });

    app.post('/permitedCalendar/givepermissions', async (req, res) => {
        
        const { username, token, permiteduname } = req.body;

        let response    = {},
            user        = await User.findOne({ username: username, token: token });

        if (user) {

            let permited = await User.findOne({ username: permiteduname });

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
                    };

                } else {

                    response = {
                        success: 'false',
                        message: 'למשתמש זה כבר קיימת הרשאה'
                    };

                }
            } else {

                response = {
                    success: 'false',
                    message: 'משתמש לא נמצא'
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

    app.delete('/permitedCalendar/removepermission/:username_to_remove', async (req, res) => {

        let response = {};

        const { username, token } = req.body,
                username_to_remove = req.params.username_to_remove;

        let user = await User.findOne({ username: username, token: token });

        if (user) {

            let permited = await User.findOne({ username: username_to_remove });

            if (permited) {

                const permited_index = user.iPermit.findIndex(id => id.equals(permited._id));

                if (permited_index > -1) {

                    
                    user.iPermit.splice(permited_index, 1);
                    
                    const permiting_index = permited.theyPermit.findIndex(id => id.equals(user._id));

                    if (permiting_index > -1) {
                        permited.theyPermit.splice(permiting_index, 1);
                        await permited.save();
                    }
                    
                    await user.save();
                    
                    response = {
                        success: 'true',
                        message: 'הרשאה הוסרה בהצלחה'
                    };


                } else {

                    response = {
                        success: 'false',
                        message: 'משתמש לא נמצא ברשימת מורשים'
                    };

                }
            } else {

                response = {
                    success: 'false',
                    message: 'שגיאה במציאת משתמש'
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