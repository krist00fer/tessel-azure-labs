var tessel = require('tessel');
var http = require('http');

// Replace the [websitename] with the name of the website
// your are connecting to.
var apiUrl = "https://[websitename].azurewebsites.net";

console.log();
console.log('blinky-websites');
console.log('----------------------');
console.log('check: your tessel should be connected to wifi (orange led)');
console.log('check: make sure you have changed the url to your service');
console.log('using: ', apiUrl);
console.log();
console.log('press the config-button on your tessel to invoke service call');

tessel.button.on('press', function(time) {
	console.log('main - button pressed');

	httpGetJSON(apiUrl, function(err, obj) {
		if (!err) {
			console.log('main - received random number:', obj.rnd);
			console.log('main - flashing led %d times', obj.rnd);

			blink(1, obj.rnd, function() {
				console.log('main - done');
				console.log();
			});
		}
		else {
			console.error('error -', err.message);
		}
	});
});

function httpGetJSON(url, callback) {
	http.get(url, function(res) {
		var body = '';

		res.on('data', function(data) {
			console.log('httpGetJSON - data received', data);
			body += data;
		});

		res.on('end', function() {
			console.log('httpGetJSON - all data received', body);
			callback(null, JSON.parse(body));
		});

	}).on('error', function (err) {
		// An error occurred while calling url
		callback(err, null);
	});
}

function blink(ledNo, noTimes, callback) {
	if (noTimes > 0) {
		var led = tessel.led[ledNo].output(0);
		var lightOnDelay = 500;
		var lightOffDelay = 1000;

		console.log('blink - turning on led (%d)', noTimes);
		led.write(true);
		setTimeout(function(){
			console.log('blink - turning off led');
			led.write(false);
			setTimeout(blink, lightOffDelay, ledNo, noTimes - 1, callback);
		}, lightOnDelay);	
	}
	else {
		callback();
	}
}