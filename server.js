// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('nRsCsWZd6275etEh');

var isProduction = (process.env.NODE_ENV === 'production');
var port = (isProduction ? 80 : 8000);

var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	, incident = require('./routes/incident')
	, http = require('http')
	, path = require('path');

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || port);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
	// app.use(express.session({cookie: { path: '/', httpOnly: true, maxAge: null }, secret:'carpolinrert'}));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/incidents', incident.list);
app.get('/incidents/:id', incident.get);
app.post('/incidents', incident.post);
app.put('/incidents/:id', incident.put);
app.del('/incidents/:id', incident.del);

require('mongoose').connect('mongodb://localhost/carlinreport');

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
