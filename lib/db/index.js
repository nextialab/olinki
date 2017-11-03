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
    return query(`insert into repos (repo, repo_uri, status) values ('${name}', '${uri}', 'idle')`);
};

exports.getAllRepos = function () {
    return query('select * from repos');
}

exports.getRepo = function (name) {
    return query(`select * from repos where repo='${name}'`);
}

exports.updateRepoStatus = function (name, state) {
    return query(`update repos set status='${state}' where repo='${name}'`)
}

exports.disconnect = function (done) {
    state.pool.end((err) => {
        done(err);
    });
};