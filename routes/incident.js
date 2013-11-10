/*
 * GET incidents.
 */
var CarlinReport = require('./../models/CarlinReport')
	, convertResult;

convertResult = function(result) {
	return {
		id: result._id,
		mode: result.mode,
		weather: result.weather,
		time: result.time,
		created_at: result.created_at,
		updated_at: result.updated_at,
		coords: result.coords
	}
};

exports.list = function(req, res){
	if (req.body.latitude && req.body.longitude) {
		CarlinReport.find({geo: { $nearSphere: [req.body.latitude, req.body.longitude], $maxDistance: 0.01} }, function(err, data) {
			if (err) {
				res.send(err);
			}

			var results = [];
			for (var i in data) {
				var obj = data[i];

				results.push(convertResult(obj));
			}

			res.send(results);
		});
	} else {
		CarlinReport.find().exec(function(err, data){
			if (err) {
				res.send(err);
			}

			var results = [];
			for (var i in data) {
				var obj = data[i];

				results.push(convertResult(obj));
			}

			res.send(results);
		});	
	}
};

exports.get = function(req, res){
	CarlinReport.findById(req.params.id, function(err, data){
		if (err) {
			res.send(err);
		}
		res.send(convertResult(data));
	});	
};

exports.del = function(req, res){
	CarlinReport.findByIdAndRemove(req.params.id, function(err, data){
		if (err) {
			res.send(err);
		}
		res.send();
	});	
};

exports.post = function(req, res){
	var body = req.body;

	if (body.latitude && body.longitude) {
		body.coords = [body.latitude, body.longitude];
	}

	var data = {
	    'mode': body.mode
	    , 'time': body.time
	    , 'weather': body.weather
	    , 'email': body.email
	    , 'coords': body.coords
	    , 'created_at': new Date()
	    , 'updated_at': new Date()
	    , 'address': body.address
	};
	
	var cr = new CarlinReport(data);
	cr.save(function (err, data) {
		if (err || !data) {
			res.send(err);
		}
		res.send(convertResult(cr));
	});
};

exports.put = function(req, res){
	CarlinReport.findByIdAndUpdate(req.params.id, req.body, function(err, cr) {
  		if (err) {
			res.send(err);
  		} else {
			res.send(convertResult(cr));
  		}
	});
};
