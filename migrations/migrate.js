'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const db = require('../lib/db');

fs.readFile(path.join(__dirname, '1.sql'), 'utf8', (err, contents) => {
    if (err) {
        console.log(err);
    } else {
        let queries = contents.split(';')
            .filter(query => query.length > 0)
            .map(query => query.trim() + ';');
        db.connect().then(() => {
            return queries.reduce((p, query) => p.then(() => db.query(query)), Promise.resolve());
        }).then(() => {
            console.log('migrated');
            db.disconnect(() => console.log('disconnected'));
        }).catch((err) => {
            console.log(err);
        });
    }
});