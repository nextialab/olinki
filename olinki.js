'use strict';

require('dotenv').config();

const express = require('express');
const auth = require('./lib/auth');
const path = require('path');
const db = require('./lib/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

global.__root = path.resolve(__dirname);

const PORT = 8080;
const HOST = '0.0.0.0';

db.connect().then(() => {
    console.log('mysql connected');
}, (err) => {
    console.log(err);
});

const app = express();

app.use(express.static(path.join(__dirname, 'dist/bundles')));
app.use(require('body-parser').json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.post('/login', (req, res) => {
    console.log('requesting token');
    if (req.body.username === process.env.ACCOUNT) {
        bcrypt.compare(req.body.password, process.env.PASSWORD, (err, match) => {
            if (match) {
                jwt.sign({user: req.body.username}, process.env.SECRET_KEY, (err, token) => {
                    if (!err) {
                        console.log(token);
                        res.json({token: token});
                    } else {
                        res.status(500).json({error: 'Could not generate token'});
                    }
                });
            } else {
                res.status(401).json({error: 'Password does not match'});
            }
        });
    } else {
        res.status(404).json({error: 'User not found'});
    }
});

app.use('/api/repos', auth.auth, require('./api/github'));
app.use('/api/docker', auth.auth, require('./api/docker'));

app.listen(PORT, HOST);

process.on('SIGINT',  () => {
    db.disconnect(() => { console.log('mysql disconnected'); });
});

console.log(`Running on http://${HOST}:${PORT}`);