var restify = require('restify');

var keys = require('../src/keys.js');
var utils = require('./utils.js');

var $auth = require('./identity.auth.js');
var $get = require('./identity.get.js');


module.exports = function(req, res, next)
{
	try
	{
		// check application key
		utils.checkKey(req);
		
		// execute requested action
		if(typeof req.params.action === 'undefined' || req.params.action.length === 0)
			throw new restify.errors.BadRequestError('Service action not specified.');
		switch(req.params.action)
		{
			case 'auth': handle_auth(req.query.user, req.query.password, req.query.token); break;
      case 'get': handle_get(); break;
      //...
			default:
				return next(new restify.errors.BadRequestError('Invalid service action.'));
		}
	}
	catch (err)
	{
		return next(err);
	}
	
	
	function handle_auth(user, password, token)
	{
		$auth(user, password, token)
		.then(function(result)
		{
			res.json(result);
			next();
		})
		.catch(function(err)
		{
			next(err);
		});
	}
	
	function handle_get(filter, order, skip, take, fields)
	{
    utils.checkAuth(req)
    .then(function(result)
    {
      $get(filter, order, skip, take, fields)
      .then(function(result)
      {
        res.json(result);
        next();
      })
      .catch(function(err)
      {
        next(err);
      });
    })
    .catch(function(err)
    {
      next(err);
    });
	}
}
