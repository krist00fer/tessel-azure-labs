// var tessel = require('tessel');
var http = require('https');

// Replace the [servicename] with the name of the mobile service
// your are connecting to.
var sasApiUrl = "https://tesselazuremobile.azure-mobile.net/api/sas";

console.log();
console.log('weather-client');
console.log('--------------');
console.log();


// getSas(function() {
// 	var fakeWeatherData = getFakeWeatherData();
// });


// Call service to retreive SAS
console.log('main - calling service to retreive SAS');
var uniqueId = "123-456-789";
var fullSasApiUrl = sasApiUrl + '?uniqueId=' + uniqueId;


httpGetJSON(fullSasApiUrl, function(error, result) {
	if (!error) {
		console.log('main - ...');
		console.log('  host:', result.host);
		console.log('  sas:', result.sas);
		console.log('  refreshPeriod:', result.refreshPeriod);
	} else {
		console.error('error -', error.message);
	}
});



function httpGetJSON(url, callback) {
	http.get(url, function(res) {
		var body = '';

		res.on('data', function(data) {
			console.log('httpGetJSON - data received');
			body += data;
		});

		res.on('end', function() {
			console.log('httpGetJSON - all data received');
			callback(null, JSON.parse(body));
		});

	}).on('error', function (err) {
		// An error occurred while calling url
		callback(err, null);
	});
}

