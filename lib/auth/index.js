'use strict';

const user = {
    id: 1,
    name: process.env.ACCOUNT
}

exports.passport = function (app) {
    const bcrypt = require('bcryptjs');
    const passport = require('passport');
    const Strategy = require('passport-local').Strategy;
    passport.use('local', new Strategy((username, password, done) => {
        if (process.env.ACCOUNT === username) {
            bcrypt.compare(password, process.env.PASSWORD, (err, res) => {
                if (res) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            });
        } else {
            done(null, false);
        }
    }));
    passport.serializeUser((user, done) => { done(null, user.id); });
    passport.deserializeUser((id, done) => {
        if (id == user.id) {
            done(null, user);
        } else {
            done(new Error('Invalid user'));
        }
    });
    app.use(passport.initialize());
    app.use(passport.session());
    return passport;
}

exports.loggedin = function (redirect) {
    return function (req, res, next) {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            res.redirect(redirect);
        } else {
            next();
        }
    }
} 

exports.loggedout = function (redirect) {
    return function (req, res, next) {
        if (req.isAuthenticated && req.isAuthenticated()) {
            res.redirect(redirect);
        } else {
            next();
        }
    }
}

exports.loggedjson = function (message) {
    return function (req, res, next) {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            res.status(403).json({message: message});
        } else {
            next();
        }
    }
}