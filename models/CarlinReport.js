var validate = require('mongoose-validate');
var mongoose = require('mongoose');
var crSchema = mongoose.Schema({
    'mode': Number
    , 'time': Number
    , 'weather': Number
    , 'email':  { type: String, required: false, validate: [validate.email, 'invalid email address'] }
    , 'coords': []
    , 'created_at': Date
    , 'updated_at': Date
});
module.exports = mongoose.model('CarlinReport', crSchema);
