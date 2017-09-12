'use strict';

require('dotenv').config();

const db = require('../lib/db');

db.connect().then(() => {
    return db.query('create table repos(id int auto_increment primary key, repo text, repo_uri text);');
}).then(() => {
    console.log('migrated');
    db.disconnect(() => { console.log('mysql disconnected'); });
}).catch((err) => {
    console.log(err);
});