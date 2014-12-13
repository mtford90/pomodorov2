var q = require('q'),
    PouchDB = window.PouchDB;

if (!PouchDB) {
    throw Error('No PouchDB!')
}

module.exports = new PouchDB('pomodoro');