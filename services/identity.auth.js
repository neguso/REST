var restify = require('restify'),
    ldap = require('ldapjs'),
    q = require('q');

var tokens = require('../src/tokens.js');
var config = require('../config.js');


module.exports = function(user, password, token)
{
	if(typeof user !== 'undefined' || typeof password !== 'undefined')
		return auth(user, password);
	return check(token);
}


function auth(user, password)
{
	var defer = q.defer();
	
	try
	{
    // check for missing parameters
    var missing = [];
    if(typeof user === 'undefined')
      missing.push('user');
    if(typeof password === 'undefined')
      missing.push('password');
    
    if(missing.length > 0)
      throw new restify.errors.MissingParameterError('Parameters missing: [{missing}].'.interpolate({ missing: missing.join(', ') }));
    
    // check for wrong parameters value
    if(user.length === 0)
      throw new restify.errors.InvalidArgumentError('Invalid argument: [user].');

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
        tokens.new(user)
        .then(function(result)
        {
          defer.resolve({
            status: 'success',
            token: result.token,
            expires: result.expires,
            identity: result.identity
          });
        })
        .catch(function(err)
        {
          defer.reject(new restify.errors.InternalServerError('Error creating token: {error}'.interpolate({ error: err.name })));
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


function check(token)
{
	var defer = q.defer();

	try
	{
    // check for missing parameters
    if(typeof token === 'undefined')
      throw new restify.errors.MissingParameterError('Parameters missing: [token].');
    
    // check for wrong parameters value
    if(token.length === 0)
      throw new restify.errors.InvalidArgumentError('Invalid argument: [token].');
		
    tokens.get(token)
    .then(function(result)
    {
      if(result === null)
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
    })
    .catch(function(err)
    {
      defer.reject(new restify.errors.InternalServerError('Error reading token: {error}'.interpolate({ error: err.name })));
    });		
	}
  catch (err)
	{
		defer.reject(err);
	}

	return defer.promise;
}
