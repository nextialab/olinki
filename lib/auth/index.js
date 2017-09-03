'use strict';

exports.loggedin = function (redirect) {
    return function (req, res, next) {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            res.redirect(redirect);
        }
        next();
    }
} 

exports.loggedout = function (redirect) {
    return function (req, res, next) {
        if (req.isAuthenticated && req.isAuthenticated()) {
            res.redirect(redirect);
        }
        next();
    }
}