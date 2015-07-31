var restify = require('restify');
var mssql = require('mssql');
var q = require('q');

var config = require('../config.js');


module.exports = function(token, filter, order, skip, take, fields)
{

}


function check(user, password)
{
	// check for missing parameters
	var missing = []; 
	if(typeof user === 'undefined')
		missing.push('user');
	if(typeof password === 'undefined')
		missing.push('password');

	if(missing.length > 0)
		throw new restify.errors.MissingParameterError('Parameters missing: [{missing}].'.interpolate({ missing: missing.join(', ') }));

	// check for wrong values
	if(user.length === 0)
		throw new restify.errors.InvalidArgumentError('Invalid argument: [user].');
}