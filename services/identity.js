var restify = require('restify');

var keys = require('../src/keys.js');
var utils = require('./utils.js');
var $auth = require('./identity.auth.js');
var $get = require('./identity.get.js');


function respond(req, res, next)
{
	try
	{
		// check application key
		utils.checkKey(req);

		// execute requested action
		if(typeof req.params.action === 'undefined' || req.params.action === '')
			throw new restify.errors.BadRequestError('Service action not specified.');
		switch(req.params.action)
		{
			case 'auth': handle_auth(req.query.user, req.query.password, req.query.token); break;
			case 'get': handle_get(); break;
			default:
				return next(new restify.errors.BadRequestError('Invalid service action.'));
		}
	}
	catch(err)
	{
		return next(err);
	}


	function handle_auth(user, password)
	{
		try
		{
			res.json($auth(user, password));
			next();
		}
		catch(err)
		{
			next(err);
		}
	}
	
	function handle_get(filter, order, skip, take, fields)
	{
		try
		{
			// check authentication
			var token = utils.checkAuth(req);
			
			res.json($get(token, filter, order, skip, take, fields));
			next();
		}
		catch(err)
		{
			next(err);
		}
	}
}
module.exports = respond;

respond.configure = function()
{
}

