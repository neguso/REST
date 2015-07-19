var storage = require('node-persist');
var uuid = require('node-uuid');
var config = require('../config.js');

storage.initSync({ dir: '../.storage' });

module.exports = {

	create: function()
	{
		var now = new Date(), unique = uuid.v4();
		var token = {
			token: unique,
			expire: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10)
		};
		storage.setItemSync(unique, token);
		return token;
	},

	get: function(token)
	{
		storage.getItemSync(token);
	}

};