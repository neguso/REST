var storage = require('node-persist'),
		uuid = require('node-uuid'),
		q = require('q');
var config = require('../config.js');

storage.initSync({ dir: config.token.dir });

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
		
    storage.setItem(token.token, token, function(err)
    {
      if(err)
        defer.reject(err);
      else
        defer.resolve(token);
    });
		
		return defer.promise;
	},

	get: function(token)
	{
    var defer = q.defer();

		if(typeof token === 'undefined' || token === null)
			return null;
    
    var o = storage.getItem(token, function(err, value)
    {
      if(err)
        defer.reject(err);
      else
        defer.resolve(typeof value === 'undefined' ? null : value);      
    });

    return defer.promise;
	}
};
