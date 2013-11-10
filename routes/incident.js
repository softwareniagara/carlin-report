/*
 * GET incidents.
 */
var CarlinReport = require('./../models/CarlinReport');

exports.list = function(req, res){
	CarlinReport.find().exec(function(err, data){
		res.send(data);
	});	
};

exports.get = function(req, res){
	CarlinReport.findById(req.params.id, function(err, data){
		if (err) {
			res.send('Incident not found');
		}
		res.send(data);
	});	
};

exports.del = function(req, res){
	CarlinReport.findByIdAndRemove(req.params.id, function(err, data){
		if (err) {
			res.send('Remove failed');
		}
		res.send();
	});	
};

exports.post = function(req, res){
	var body = req.body;
	var data = {
	    'mode': body.mode
	    , 'time': body.time
	    , 'weather': body.weather
	    , 'email': body.email
	    , 'coords': body.coords
	    , 'created_at': new Date()
	    , 'updated_at': new Date()
	}
	
	var cr = new CarlinReport(data);
	cr.save(function (err) {
		if (err) {
			res.send('Post failed');
		}
	});

	res.send(cr);
};

exports.put = function(req, res){
	CarlinReport.findByIdAndUpdate(req.params.id, req.body, function(err, cr) {
  		if (err) {
			res.send(err);
  		} else {
			res.send(cr);
  		}
	});
};
