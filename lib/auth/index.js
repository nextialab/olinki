'use strict';

const jwt = require('jsonwebtoken');

exports.auth = function (req, res, next) {
    let token = req.header('Authorization', '');
    console.log(token);
    if (token !== '') {
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (!err) {
                req.user = decoded;
                next();
            } else {
                console.log(err);
                res.status(403).json({error: 'Forbidden'});
            }
        });
    } else {
        res.status(401).json({error: 'Not authorized'});
    }
}