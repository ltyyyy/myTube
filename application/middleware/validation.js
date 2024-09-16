var validator = require('validator');
var db = require('../conf/database');

module.exports = {
    usernameCheck: function (req, res, next) {
        var { username } = req.body;
        username = username.trim();
        if (!validator.isLength(username, { min: 3 })) {
            req.flash("error", `username must be 3 or more characers`);
        } else if (!/[a-zA-Z]/.test(username.charAt(0))) {
            req.flash("error", `username must begin with a character`);
        }

        if (req.session.flash.error) {
            res.redirect('/register');
        } else {
            next();
        }

    },
    passwordCheck: function (req, res, next) {
        var { password } = req.body;
        if (!validator.isLength(password, { min: 8 })) {
            req.flash("error", `Your password must contain 8 or more characters`);
        } else if (!/[A-Z]/.test(password)) {
            req.flash("error", `Your password must contain at least 1 upper case letter`);
        } else if (!/[0-9]/.test(password)) {
            req.flash("error", `Your password must contain 1 number`);
        } else if (!/[/\*\-\+\!@\#\$\^\&~\[\]]/.test(password)) {
            req.flash("error", `Your password must contain 1 of the following special characters: / * - + ! @ # $ ^ & ~ [ ]`);
        }

        if (req.session.flash.error) {
            res.redirect('/register');
        } else {
            next();
        }
    },

    confirmpasswordCheck: function (req, res, next) {
        var { confirmpassword } = req.body;
        var { password } = req.body;

        if (confirmpassword !== password) {
            req.flash("error", "Comfirm Password must be same as Password");
        }

        if (req.session.flash.error) {
            res.redirect('/register');
        } else {
            next();
        }
    },

    isUsernameUnique: async function (req, res, next) {
        var { username } = req.body;
        try {
            // check username unique
            var [rows, fields] = await db.execute(`SELECT id from users where username=?;`, [username]);
            if (rows && rows.length > 0) {
                req.flash("error", "The username has already been registered.")
                return res.redirect('/register');
            } else {
                next();
            }

        } catch (error) {
            next(error);
        }
    },
    isEmailUnique: async function (req, res, next) {
        var { email } = req.body;
        try {
            // check email unique
            var [rows, fields] = await db.execute(`SELECT id from users where email=?;`, [email]);
            if (rows && rows.length > 0) {
                req.flash("error", "The email has already been registered.")
                return res.redirect('/register');
            } else {
                next();
            }

        } catch (error) {
            next(error);
        }

    },
};