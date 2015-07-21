var restify = require('restify');
var config = require('./globals.js');
var config = require('./config.js');


var server = restify.createServer();
server.use(restify.queryParser());

var $identity = require('./services/identity.js');
server.get('/identity', $identity);
server.get('/identity/:action', $identity);



server.listen(config.server.port, function() {
  console.log('%s listening at %s', server.name, server.url);
});
