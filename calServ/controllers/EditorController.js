const User = require('../models/User');
const GlobalEvent = require('../models/GlobalEvent');
const RegisterRequest = require('../models/RegisterRequest');

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
                title: req.body.title,
                start: req.body.start,
                end: req.body.end,
                description: req.body.description,
                postedBy: user.username,
                category: req.body.category,
                place: req.body.place
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
    app.post('/globalCal/:id', (req, res) => {
        
    });

    // delete global event
    app.delete('/globalCal/:id', (req, res) => {

    });

    // update category

}