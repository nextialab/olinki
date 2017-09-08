'use strict';

require('dotenv').config();

const bcrypt = require('bcryptjs');
const express = require('express');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const auth = require('./lib/auth');
const path = require('path');

const user = {
    id: 1,
    name: process.env.ACCOUNT
}

const PORT = 8080;
const HOST = '0.0.0.0';

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

const app = express();

app.use(require('cookie-parser')());
app.use(require('express-session')({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'dist/bundles')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.get('/app', auth.loggedin('/login'), (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/app.html'));
});

app.get('/login', auth.loggedout('/app'), (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/login.html'));
});

app.post('/login', require('body-parser').urlencoded({ extended: true }), passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/app');
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.use('/api', require('body-parser').json(), auth.loggedjson('forbidden'), require('./api/github'));

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);