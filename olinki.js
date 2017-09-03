'use strict';

require('dotenv').config();

const bcrypt = require('bcrypt');
const express = require('express');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const auth = require('./lib/auth');

const user = {
    id: 1,
    name: process.env.USER
}

const PORT = 8080;
const HOST = '0.0.0.0';

passport.use(new Strategy((username, password, done) => {
    if (process.env.USER === username) {
        bcrypt.compare(password, process.env.PASSWORD).then((res) => {
            if (res) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    } else {
        return done(null, false);
    }
}));

passport.serializeUser((user, done) => { done(user.id); });
passport.deserializeUser((id, done) => {
    if (id == user.id) {
        done(null, user);
    }
});

const app = express();

app.use(require('cookie-parser'));
app.use(require('body-parser')());
app.use(require('express-session')({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send("home");
});

app.get('/app', auth.loggedin('/login'), (req, res) => {
    res.send('app');
});

app.get('/login', auth.loggedout('/app'), (req, res) => {
    res.send('login');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (res, req) => {
    res.redirect('/app');
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);