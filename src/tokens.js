var storage = require('node-persist'),
		uuid = require('node-uuid'),
		q = require('q');

var config = require('../config.js');


storage.initSync({
	dir: config.token.dir
});

function init()
{
	var defer = q.defer();
}

module.exports = {

	new: function(identity)
	{
		var now = new Date();
		var token = {
			token: uuid.v4(),
			expire: new Date(now.getFullYear(), now.getMonth(), now.getDate() + config.token.lifetime),
			identity: identity
		};
		storage.setItemSync(token.token, token);
		return token;
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
