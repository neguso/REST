var keys = {
	'test-key': { name: '', enabled: true },
	'test-key-disabled': { name: '', enabled: false },
	'aima-secret': {
		name: 'AIMA Mobile Application',
		enabled: true		
	}
};

module.exports = {

	get: function(key) {
		if(keys.hasOwnProperty(key) && keys[key].enabled)
			return keys[key];
		return null;
	}	
	
};
