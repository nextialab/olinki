'use strict';

require('dotenv').config();

const express = require('express');
const auth = require('./lib/auth');
const path = require('path');
const db = require('./lib/db');

const PORT = 8080;
const HOST = '0.0.0.0';

db.connect().then(() => {
    console.log('mysql connected');
}, (err) => {
    console.log(err);
});

const app = express();

app.use(require('cookie-parser')());
app.use(require('express-session')({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

const passport = auth.passport(app);

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

process.on('SIGINT',  () => {
    db.disconnect(() => { console.log('mysql disconnected'); });
});
process.on('SIGTERM', () => {
    db.disconnect(() => { console.log('mysql disconnected'); });
});

console.log(`Running on http://${HOST}:${PORT}`);