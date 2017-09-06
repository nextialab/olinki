'use strict';

var express = require('express');
var GitHub = require('github-api');

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

module.exports = router;