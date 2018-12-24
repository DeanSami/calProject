const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const config = require('../config');

const User = require('../models/User');
const RegisterRequest = require('../models/RegisterRequest');

module.exports = (app) => {

    app.get('/categories', (req, res) => {
        res.json(config.getCategories());
    });

    app.post('/canActivate', async (req, res) => {

        let response = {};

        const { username, token } = req.body;

        user = await User.findOne({ username: username, token: token });

        if (user) {

            response = {
                success: 'true',
                username: username,
                permission: user.permission
            };

        } else {

            response = {
                success: 'false'
            };

        }

        res.json(response);

    });

    app.post('/register', [
        check('username').isEmail().withMessage('שם משתמש חייב להיות מייל תקני'),
        check('password').isLength({ min: 6 }).withMessage('סיסמא חייבת להיות לפחות באורך 6')
    ],
        async (req, res) => {

            let response                                                                  = {},
                { username, password, password2, fullname, editor, category, experience } = req.body;

            const errors = validationResult(req);

            if (errors.isEmpty()) {

                const user = await User.findOne({ username: username });

                if (user) {

                    response = {
                        success: 'false',
                        message: 'משתמש כבר רשום'
                    };

                } else if (password == password2) {

                    await User.create({
                        username: username,
                        password: password,
                        fullname: fullname
                    });

                    if (editor) {
                        if (category && experience) {

                            await RegisterRequest.create({
                                username: username,
                                password: password,
                                fullname: fullname,
                                category: category,
                                experience: experience
                            });

                            response = {
                                success: 'true',
                                message: 'מעביר לדף ראשי, בקשה להיות עורך תוכן נרשמה במערכת וממתינה לאישור מנהל'
                            };

                        } else {

                            response = {
                                success: 'false',
                                message: 'אנא מלא את כל השדות עבור הרשמת עורך תוכן'
                            };

                        }
                    } else {

                        response = {
                            success: 'true',
                            message: 'מעביר לדף ראשי'
                        };

                    }
                } else {

                    response = {
                        success: 'false',
                        message: 'סיסמאות לא תואמות'
                    };

                }
            } else {

                response = {
                    success: 'false',
                    message: errors.array()[0].msg
                };

            }

            res.json(response);

        });

    app.post('/login', async (req, res) => {

        let response = {};

        const { username, password }    = req.body,
                user                    = await User.findOne({ username: username });

        if (user) {

            if (password == user.password) {

                const   cert    = fs.readFileSync('private.key'),
                        token   = await jwt.sign({ username: user.username, loggedInAt: Date.now().toString() }, cert, { algorithm: 'RS256', expiresIn: '1h' }),
                        msg = 'ברוך הבא, '.concat(username);

                user.loggedInAt.push(Date.now());
                user.token = token;

                await user.save();

                response = {
                    success: 'true',
                    message: msg,
                    username: username,
                    token: token,
                    permission: user.permission
                };

            } else {

                response = {
                    success: 'false',
                    message: 'סיסמאות לא תואמות'
                };

            }
        } else {

            response = {
                success: 'false',
                message: 'לא נמצא אימייל'
            };

        }

        res.json(response);
        
    });

}