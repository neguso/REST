var storage = require('node-persist');
var uuid = require('node-uuid');
var q = require('q');

var config = require('../config.js');




module.exports = {
	
	new: function(identity)
	{
		var defer = q.defer();
		
		var now = new Date();
		var token = {
			token: uuid.v4(),
			expire: new Date(now.getFullYear(), now.getMonth(), now.getDate() + config.token.lifetime),
			identity: identity
		};
		
		init()
		.then(function(result)
		{
			storage.setItem(token.token, token, function(err)
			{
				if(err)
					defer.reject();
				else
					defer.resolve(token);
			});
		})
		.catch(function(error)
		{
			defer.reject();
		});
		
		return defer.promise;
	},
	
	get: function(token)
	{
		if(typeof token === 'undefined' || token === null)
			return null;
		
		var o = storage.getItem(token);
		if(typeof o === 'undefined')
			return null;
		else
			return o;
	}
};

function init()
{
	var defer = q.defer();
	
	storage.init({ dir: config.token.dir }, function(err)
	{
		if(err)
			defer.reject();
		else
			defer.resolve();
	});
	
	return defer.promise;
}
