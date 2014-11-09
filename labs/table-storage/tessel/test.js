var http = require('https');
var ntp = require('ntp-client');

var host = 'tesselazure.table.core.windows.net';

// var host = {
// 	'primaryHost':'https://tesselazure.table.core.windows.net:443/',
// 	'secondaryHost':'https://tesselazure-secondary.table.core.windows.net:443/'
// };
var sas = 
	'se=2014-11-09T14%3A09%3A46Z&sp=a&sv=2014-02-14&tn=weatherlogs&sig=MwsXCdXK2dJ2jPLTHeLYJNeO669GvjnevVYiVBUAp%2FM%3D';

// AZURE_STORAGE_ACCOUNT = tesselazure
// AZURE_STORAGE_ACCESS_KEY = ZF2po8rCJkgLPDCpdAzSYtL0gqwoJDPuqhnX16706+MbRh2wl0dJYb4NfznnxJ77TlPqRro4rrt5EN2lK1k2hA==
// azureTable.setDefaultClient({
// 	accountUrl: host.primaryHost,
// 	accountName: 'tesselazure'
// });

// var entGen = azure.TableUtilities.entityGenerator;
// var tableService = azure.createTableServiceWithSas('https://tesselazure.table.core.windows.net:443/', sas);

console.log('What time is it?');
ntp.getNetworkTime(null, null, function(error, date) {

	console.log('date:', date);
	var deviceId = 'TM-00-04-f000da30-0061473d-36582586'; // tessel.deviceId
	var partitionKey = getPartitionKey(deviceId, date);;
	var rowKey = getRowKey(date);
	var temperature = getTemperature();
	var humidity = getHumidity();

	var weatherLog = {
		PartitionKey: partitionKey,
		RowKey: rowKey,
		Temperature: temperature,
		Humidity: humidity,
		MeasuredAt: date
	};

	console.log('weatherLog', JSON.stringify(weatherLog));

	// console.log('Createing tableClient');
	
	// var tableClient = azureTable.createClient({
	// 	accountUrl: host.primaryHost,
	// 	accountName: 'tesselazure',
	// 	accountKey: 'ZF2po8rCJkgLPDCpdAzSYtL0gqwoJDPuqhnX16706+MbRh2wl0dJYb4NfznnxJ77TlPqRro4rrt5EN2lK1k2hA=='
	// });

	console.log('Insert data');

	insertEntity('tesselazure', 'weatherlogs', sas, weatherLog);

	// tableClient.insertEntity('weatherlogs', weatherLog, function(error, data) {
	// 	if (!error) {
	// 		console.log('data inserted');
	// 	} else {
	// 		console.log('NOOOOOO!');
	// 		console.log(error);
	// 	}		
	// });
});


function getPartitionKey(deviceId, date) {
	var partitionKey =
			deviceId + '|' +
			date.getFullYear() +
			padLeft(date.getMonth() + 1, 2) +
			padLeft(date.getDate(), 2);

	return partitionKey;
}

function getRowKey(date) {
	// Generate a row key that sort the rows descending by
	// calculating number of seconds left on current day

	var secondsPerDay = 24 * 60 * 60;
	var secondsSinceMidnight = 
		date.getHours() * 3600 +
		date.getMinutes() * 60 +
		date.getSeconds();

	var secondsLeftToday = secondsPerDay - secondsSinceMidnight;
	var rowKey = padLeft(secondsLeftToday, 5);

	return rowKey;
}

function getTemperature() {
	// Fake implementation. Just returns a random number
	var temperature = Math.floor((Math.random() * 100) - 50);

	return temperature;
}

function getHumidity() {
	// Fake implementation. Just returns a random number
	var humidity = Math.floor((Math.random() * 100) + 1);

	return humidity;
}

function padLeft(i, n, str){
    return Array(n - String(i).length + 1).join(str||'0') + i;
}


function insertEntity(accountName, tableName, sas, entity)
{
	var hostName = accountName + '.table.core.windows.net';
	var jsonEntity = JSON.stringify(entity);
	var contentLength = jsonEntity.length;
	var path = '/' + tableName + '/' + '?' + sas;

	console.log('hostName:', hostName);
	console.log('path:', path);
	console.log();

  	var options = {
	    hostname: hostName,
	    port: 443,
	    path: path,
	    method: 'POST',
	    headers: {
	      	'Content-Length' : jsonEntity.length,
	      	'Content-Type' : 'application/json',
	      	'Accept' : 'application/json;odata=nometadata' // application/json;odata=[nometadata|minimalmetadata|fullmetadata]
	    }
  	};
 
  var req = http.request(options, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);
 
    res.on('data', function(d) {
    	console.log('data!!!!');
      	console.log(d.toString());
    });
  });
 
  req.on('error', function(e) {
    console.error(e);
  });
 
  req.write(jsonEntity);
 
  req.end();
}