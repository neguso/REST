var keys = {
	'test-key': { enabled: true },
	'test-key-disabled': { enabled: false },
	'aima-secret': {
		enabled: true,
		name: 'AIMA Mobile Application'
	}
};

module.exports = {

	get: function(key) {
		if(keys.hasOwnProperty(key) && keys[key].enabled)
			return keys[key];
		return null;
	}	
	
};
