'use strict';

var express = require('express');
var GitHub = require('github-api');
var Git = require('nodegit');
var db = require('../lib/db');

var router = express.Router();

router.get('/', function (req, res, next) {
    const gh = new GitHub();
    let user = gh.getUser(process.env.GITUSER);
    Promise.all([
        user.listRepos(),
        db.getAllRepos()
    ]).then((responses) => {
        var gitrepos = responses[0].data;
        var locrepos = responses[1].results;
        var repos = gitrepos.map((repo) => {
            var status = "waiting";
            var cloned = locrepos.find(local => local.name == repo.name);
            if (cloned) {
                status = cloned.status;
            }
            return {
                name: repo.name,
                html_url: repo.html_url,
                status: status
            }
        });
        res.json(repos);
    }).catch((err) => {
        console.log(err);
        res.json(err);
    });
});

router.post('/clone', function (req, res, next) {
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