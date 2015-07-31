var restify = require('restify');
var ldap = require('ldapjs');
var q = require('q');

var config = require('../config.js');
var tokens = require('../src/tokens.js');


module.exports = function(user, password, token)
{
	if(typeof user !== 'undefined' || typeof password !== 'undefined')
		return auth1(user, password);
	return auth2(token);
}

function auth1(user, password)
{
	var defer = q.defer();
	
	try
	{
		// check parameters
		check1(user, password);

		// autheticate user
		var client = ldap.createClient({ url: 'ldap://' + config.ldap.server });
		client.bind(user, password, function(err, data)
		{
			if(err)
			{
				if(err.name === 'InvalidCredentialsError')
					defer.resolve({ status: 'fail' });
				else
					defer.reject(new restify.errors.InternalServerError('LDAP server error: {error}'.interpolate({ error: err.name })));
			}
			else
			{
				// create token
				var t = tokens.new(user);
				defer.resolve({
					status: 'success',
					token: t.token,
					expires: t.expires,
					identity: t.identity
				});
			}
		});
	}
  catch (err)
	{
		defer.reject(err);
	}

	return defer.promise;
}

function check1(user, password)
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


function auth2(token)
{
	var defer = q.defer();

	try
	{
		// check parameters
		check2(token);
		
		var t = tokens.get(token);
		if(t === null)
		{
			defer.resolve({ status: 'invalid' });
		}
		else
		{
			defer.resolve({
				status: 'valid',
				token: t.token,
				expires: t.expires
			});
		}
	}
  catch (err)
	{
		defer.reject(err);
	}

	return defer.promise;
}

function check2(token)
{
	// check for missing parameters
	if(typeof token === 'undefined')
		throw new restify.errors.MissingParameterError('Parameters missing: [token].');
	
	// check for wrong values
	if(token.length === 0)
		throw new restify.errors.InvalidArgumentError('Invalid argument: [token].');
}
