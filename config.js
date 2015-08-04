module.exports = {
	
	token: {
		lifetime: 10,				// lifetime in days
		dir: '../.storage'	// storage folder
	},
	
	server: {
		port: 8081
	},
	
	ldap: {
		server: 'srv-dc-01'
	},
	
	aima: {
		server: 'localhost',
		database: 'PM',
		user: 'sa',
		password: '@ccesa01'
	}
	
};