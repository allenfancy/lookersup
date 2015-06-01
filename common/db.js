var mongoose = require('mongoose');
var dbUrl = require('./config').db;

exports.connect = function(callback){
	mongoose.connect(dbUrl);
};

exports.disconnect = function(callback){
	mongoose.disconenct(callback);
};

exports.setup = function(callback){
	callback(null);
}