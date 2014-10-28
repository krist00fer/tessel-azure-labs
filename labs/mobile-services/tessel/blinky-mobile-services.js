var tessel = require('tessel');
var http = require('http');

console.log('Press the config-button on your Tessel to invoke service call');

// Replace the [servicename] with the name of the mobile service
// your are connecting to.
// var apiUrl = "https://[servicename].azure-mobile.net/api/random";
var apiUrl = "https://tesselazuremobile.azure-mobile.net/api/random";

tessel.button.on('press', function(time) {
	console.log('button pressed');

	httpGetJSON(apiUrl, function(err, obj) {
		if (!err) {
			console.log('Random number:', obj.rnd);
		}
		else {
			console.error('error -', err.message);
		}
	});

	// http.get(apiUrl, function(res) {
	// 	console.log('# statusCode', res.statusCode);

	// 	if (res.statusCode == 200) {
	// 		var body = '';

	// 		res.on('data', function(data) {
	// 			console.log('# data received', data);
	// 			body += data;
	// 		});

	// 		res.on('end', function() {
	// 			console.log('# end');
	// 			console.log(body);

	// 			var jsonResult = JSON.parse(body);

	// 			console.log('Random number', jsonResult.rnd);
	// 		});
	// 	}
	// 	else {
	// 		console.log('# unexpected statusCode returned');
	// 	}
	// }).on('error', function (err) {
	// 	console.log('not ok -', err.message, 'error event');
	// });
});

function httpGetJSON(url, callback) {
	http.get(url, function(res) {
		var body = '';

		res.on('data', function(data) {
			console.log('info - data received', data);
			body += data;
		});

		res.on('end', function() {
			console.log('info - all data received', body);
			callback(null, JSON.parse(body));
		});

	}).on('error', function (err) {
		// An error occurred while calling url
		callback(err, null);
	});
}