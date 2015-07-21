var restify = require('restify');
var ldap = require('ldapjs');

var config = require('../config.js');


module.exports = function(user, password, token)
{
	if(typeof user !== 'undefined' || typeof password !== 'undefined')
		return auth1(user, password);
	return auth2(token);
}

function auth1(user, password)
{
	check1(user, password);

	var client = ldap.createClient({ url: 'ldap://' + config.ldap.server });
	client.bind(user, password, function(err, data) {
		if(err)
		{
			if(err.name === 'InvalidCredentialsError')
				return { status: 'fail' };

			throw new restify.errors.InternalServerError('LDAP server error: {error}'.interpolate({ error: err.name }));
		}

		var t = tokens.new(user);
		res.send({
			status: 'success',
			token: t.token,
			expires: t.expires,
			identity: t.identity
		});
	});
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
	check2(token);

	if(token === 'varza')
		return {
			status: 'valid',
    	expires: new Date(2015, 6, 1)
		};
	else
		return {
			status: 'invalid'
		};
}

function check2(token)
{
	// check for missing parameters
	if(typeof token === 'undefined')
		throw new restify.errors.MissingParameterError('Parameters missing: [token].');
}
