var express = require('express'),
    app = express();

app.use(express.compress());
app.use(express.static('bower_components'));
app.use(express.static('test/e2e'));

module.exports = app;