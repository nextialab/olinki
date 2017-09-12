const mysql = require('mysql');

var state = {
    pool: null
}

var query = function (query) {
    return new Promise((resolve, reject) => {
        state.pool.query(query, function (err, results, fields) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    results: results,
                    fields: fields
                });
            }
        });
    });
}

exports.connect = function() {
    return new Promise((resolve, reject) => {
        state.pool = mysql.createPool({
            host: process.env.DBHOST,
            user: process.env.DBUSER,
            password: process.env.DBPASS,
            database: process.env.DBNAME
        });
        if (state.pool) {
            resolve();
        } else {
            reject(new Error('could not connect'));
        }
    });
};

exports.query = query;

exports.insertRepo = function (name, uri) {
    return query(`insert into repos (repo, repo_uri) values ('${name}', '${uri}')`);
};

exports.disconnect = function (done) {
    state.pool.end((err) => {
        done(err);
    });
};