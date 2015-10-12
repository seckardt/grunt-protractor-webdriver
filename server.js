var express = require('express'),
	compression = require('compression'),
	app = express();

app.use(compression());
app.use(express.static('bower_components'));
app.use(express.static('test/e2e'));

module.exports = app;
