// Custom RESTful Web API
// Function get is automatically invoked whenever a HTTP GET Request
// are targeting the url corresponding to this API, i.e:
// http://[mymobileservicename].azure-mobile.net/api/[nameofapi]

exports.get = function(request, response) {
    var rnd = randomIntInc(1, 6); // Get a random number from 1 to 6
    console.log('Random GET invoked. Rnd #: ' + rnd); // Log request for visibility

    // Use the response object to send back HTTP 200 OK
    // and a JSON object containing the random number.
    response.send(statusCodes.OK, { "rnd": rnd} );
};

// Simple method that simulates a dice and returns a number
// from and including low, to and including high.
function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}