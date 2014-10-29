// Simple HTTP Server implementation that responds back with a
// JSON Object containing a random number whenever invoked

var http = require('http')
var port = process.env.PORT || 1337;

http.createServer(function(request, response) {

  var rnd = randomIntInc(1, 6);
  var body = { rnd: rnd }
  console.log('Random service invoked. Rnd #: ' + rnd); // Log request for visibility

  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));

}).listen(port);

// Simple method that simulates a dice and returns a number
// from and including low, to and including high.
function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}