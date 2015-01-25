var serveStatic = require('serve-static'),
    http = require('http'),
    finalhandler = require('finalhandler'),
    serve = serveStatic('bin/public', {'index': ['index.html']});

var server = http.createServer(function (req, res) {
    var done = finalhandler(req, res);
    serve(req, res, done);
});

server.listen(process.env['PORT'] || 8080);