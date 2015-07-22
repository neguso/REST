var frisby = require('frisby');
var server = 'http://localhost:8080';

frisby.create('Test service without action and key')
	.get(server + '/identity')
	.expectStatus(400).expectHeaderContains('content-type', 'application/json')
	.expectJSON({
		code: 'BadRequestError'
	})
	.toss();

frisby.create('Test service without action and key')
	.get(server + '/identity/')
	.expectStatus(400).expectHeaderContains('content-type', 'application/json')
	.expectJSON({
		code: 'BadRequestError'
	})
	.toss();

frisby.create('Test service without action')
	.get(server + '/identity?key=test-key')
	.expectStatus(400).expectHeaderContains('content-type', 'application/json')
	.expectJSON({
		code: 'BadRequestError'
	})
	.toss();

frisby.create('Test service with unknown action')
	.get(server + '/identity/nope?key=test-key')
	.expectStatus(400).expectHeaderContains('content-type', 'application/json')
	.expectJSON({
		code: 'BadRequestError'
	})
	.toss();

frisby.create('Test corect action without key')
	.get(server + '/identity/auth')
	.expectStatus(400).expectHeaderContains('content-type', 'application/json')
	.expectJSON({
		code: 'BadRequestError'
	})
	.toss();

frisby.create('Test [auth] action with missing required parameters')
	.get(server + '/identity/auth?key=test-key')
	.expectStatus(409).expectHeaderContains('content-type', 'application/json')
	.expectJSON({
		code: 'MissingParameter'
	})
	.toss();

frisby.create('Test [auth] action with unknown parameters')
	.get(server + '/identity/auth?key=test-key&a=&b=')
	.expectStatus(409).expectHeaderContains('content-type', 'application/json')
	.expectJSON({
		code: 'MissingParameter'
	})
	.toss();

frisby.create('Test [auth] action with wrong parameters value')
		.get(server + '/identity/auth?key=test-key&user=&password=')
	.expectStatus(409).expectHeaderContains('content-type', 'application/json')
	.expectJSON({
		code: 'InvalidArgument'
	})
	.toss();

frisby.create('Test [auth] action with wrong parameters value')
	.get(server + '/identity/auth?key=test-key&token=')
	.expectStatus(409).expectHeaderContains('content-type', 'application/json')
	.expectJSON({
		code: 'InvalidArgument'
	})
	.toss();

frisby.create('Test [auth] action with valid parameters value')
	.get(server + '/identity/auth?key=test-key&user=ovidiu.negus@accesa.eu&password=V@rzamulta05')
	.expectStatus(200).expectHeaderContains('content-type', 'application/json')
	.expectJSON({
		status: 'success',
		//token: function(val) { return val.length > 0 },
		identity: 'ovidiu.negus@accesa.eu'
	})
	.toss();

frisby.create('Test [auth] action with valid parameters value and disabled key')
	.get(server + '/identity/auth?key=test-key-disabled&user=a&password=a')
	.expectStatus(400).expectHeaderContains('content-type', 'application/json')
	.expectJSON({
		code: 'BadRequestError'
	})
	.toss();
