'use strict';

var express = require('express');
var GitHub = require('github-api');
var Git = require('nodegit');

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
    Git.Clone(req.body.repourl, "nodegit").then((repo) => {
        res.json({message: 'ok'});
    }, (err) => {
        console.log(err);
        res.status(500).json({error: 'could not clone repo'});
    });
});

module.exports = router;