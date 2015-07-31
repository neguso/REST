var restify = require('restify'),
    q = require('q');
var keys = require('../src/keys.js');

module.exports = {

	checkKey: function(req)
	{
		var key = req.query.key;
		if(typeof req.query.key === 'undefined' || req.query.key.length === 0)
			key = req.header('Application-Key');
		if(typeof key === 'undefined' || key.length === 0)
			throw new restify.errors.BadRequestError('Application key missing.');
		var app = keys.get(key);
		if(app === null)
			throw new restify.errors.BadRequestError('Invalid application key.');
	},

	checkAuth: function(req)
	{
    var defer = q.defer();


    return defer.promise();
	}

};
