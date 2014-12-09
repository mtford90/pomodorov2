var EventEmitter = require('events');

var e = new EventEmitter();
e.on('change', function (elem) {
    e.last = elem;
});
module.exports = e;