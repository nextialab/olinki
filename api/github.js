'use strict';

var express = require('express');
var GitHub = require('github-api');
var Git = require('nodegit');
var db = require('../lib/db');

var router = express.Router();

router.get('/repos', function (req, res, next) {
    const gh = new GitHub();
    let user = gh.getUser(process.env.GITUSER);
    user.listRepos().then((response) => {
        res.json(response.data);
    }).catch((err) => {
        console.log(err);
        res.json(err);
    })
});

router.post('/repos/clone', function (req, res, next) {
    var uri = 'nodegit/' + req.body.name;
    Git.Clone(req.body.repourl, uri).then((repo) => {
        return db.insertRepo(req.body.name, uri);
    }, (err) => {
        console.log(err);
        res.status(500).json({error: 'could not clone repo'});
    }).then(() => {
        res.json({message: 'ok'});
    }, (err) => {
        console.log(err);
        res.status(500).json({error: 'could not update db'});
    });
});

module.exports = router;