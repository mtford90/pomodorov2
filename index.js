var app = require('./server')
    , conf = require('./dev.config');

app.use(express.static(conf.compilation.dir + '/public'));

app.get('/', function (req, res) {
    res.sendFile(conf.compilation.dir + '/public/index.html');
});
app.listen(conf.port);