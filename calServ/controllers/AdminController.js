const User = require('../models/User');
const Event = require('../models/Event');
const Editor = require('../models/Editor');
const RegisterRequest = require('../models/RegisterRequest');

module.exports = (app) => {

    app.post('/admin/requests', async (req, res) => {
        let response = {
            success: 'false'
        };
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            if (user.permission == 'admin') {
                response.success = 'true';
                let requests = await RegisterRequest.find();
                response.requests = requests;
            } else {
                response.message = 'הרשאות חסרות'
            }
        } else {
            response.message = 'שגיאה';
        }
        res.json(response);
    });

    app.post('/admin/requests/:id', async (req, res) => {
        let response = {
            success: 'false'
        };
        let user = await User.findOne({ username: req.body.username, token: req.body.token });
        if (user) {
            if (user.permission == 'admin') {
                let request = await RegisterRequest.findById(req.params.id);
                if (request) {
                    response.success = 'true';
                    if (req.body.approve == 'true') {
                        let newUser = new User({
                            username: request.username,
                            password: request.password,
                            fullname: request.fullname,
                            permission: 'editor'
                        });
                        newUser.save((err) => {
                            if (err) return err;
                        });
                        let newEditor = new Editor({
                            username: request.username,
                            category: request.category
                        });
                        newEditor.save((err) => {
                            if (err) return err;
                        });
                    } else {
                        response.message = 'הבקשה נשללה';
                    }
                    await RegisterRequest.deleteOne({ _id: request._id });
                } else {
                    response.message = 'שגיאה במציאת הבקשה';
                }
            } else {
                response.message = 'הרשאות חסרות';
            }
        } else {
            res.message = 'שגיאה';
        }
        res.json(response);
    })
}