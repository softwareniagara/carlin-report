// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('nRsCsWZd6275etEh');

/*
var isProduction = (process.env.NODE_ENV === 'production');
var http = require('http');
var port = (isProduction ? 80 : 8000);
*/
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/carlinreport');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	var crSchema = mongoose.Schema({
	    "mode": Number
	    , "time": Number
	    , "weather": Number
	    , "email": String
	    , "coords": []
	    , "created_at": Date
	    , "updated_at": Date
	});
	var CarlinReport = mongoose.model('CarlinReport', crSchema);
	var cr = new CarlinReport({
	    "mode": 1
	    , "time": 2
	    , "weather": 3
	    , "email": "test@test.com"
	    , "coords": [100,100]
	    , "created_at": new Date()
	    , "updated_at": new Date()
	});
	cr.save(function (err) {
	  // if (err) // TODO handle the error
	});
});

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , incident = require('./routes/incident')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 8000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/incidents', incident.list);
app.post('/incidents', incident.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

/*
http.createServer(function (req, res) {
  // http://blog.nodeknockout.com/post/35364532732/protip-add-the-vote-ko-badge-to-your-app
}).listen(port, function(err) {
  if (err) { console.error(err); process.exit(-1); }

  // if run as root, downgrade to the owner of this file
  if (process.getuid() === 0) {
    require('fs').stat(__filename, function(err, stats) {
      if (err) { return console.error(err); }
      process.setuid(stats.uid);
    });
  }

  console.log('Server running at http://0.0.0.0:' + port + '/');
});

*/
