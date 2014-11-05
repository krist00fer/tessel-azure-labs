var https = require('https');
var crypto = require('crypto');
var moment = require('moment');

// Event Hubs parameters
var namespace = 'RobEichDevEventHub-ns';
var hubname ='demoeventhub';
var devicename = 'mytessel';
 
// Payload to send
var payload = '{\"Temperature\":\"37.0\",\"Humidity\":\"0.4\"}';
 
// Shared access key (from Event Hub configuration)
var my_key_name = 'EventHubKey';
var my_key = 'mlHhCj6aAVgILAtwrxqnBSL5pfa5yJD3nhbN8CrTWZ0=';
 
// Full Event Hub publisher URI
var my_uri = 'https://' + namespace + '.servicebus.windows.net' + '/' + hubname + '/publishers/' + devicename + '/messages';
 
 
// function create_sas_token(uri, key_name, key)
// {
//     // Token expires in one hour
//     var expiry = moment().add(1, 'months').unix();
//     //var expiry = '1415185462';
//     console.log(expiry);
 
//     var string_to_sign = encodeURIComponent(uri) + '\n' + expiry;
//     var hmac = crypto.createHmac('sha256', key);
//     hmac.update(string_to_sign);
//     var signature = hmac.digest('base64');
//     var token = 'SharedAccessSignature sr=' + encodeURIComponent(uri) + '&sig=' + encodeURIComponent(signature) + '&se=' + expiry + '&skn=' + key_name;
 
//     return token;
// }
 
//var my_sas = create_sas_token(my_uri, my_key_name, my_key)
var my_sas = 'SharedAccessSignature sr=https%3A%2F%2FRobEichDevEventHub-ns.servicebus.windows.net%2Fdemoeventhub%2Fpublishers%2Fmytessel%2Fmessages&sig=cmwmWeUD%2FBvXC%2FnzgPqbe1Kx4TB8NrksSZrOQK%2FjbaA%3D&se=1417774602&skn=EventHubKey';
 
// Send the request to the Event Hub
 
var options = {
  hostname: namespace + '.servicebus.windows.net',
  port: 443,
  path: '/' + hubname + '/publishers/' + devicename + '/messages',
  method: 'POST',
  headers: {
    'Authorization': my_sas,
    'Content-Length': payload.length,
    'Content-Type': 'application/atom+xml;type=entry;charset=utf-8'
  }
};

//console.log(options);
 
var req = https.request(options, function(res) {
  console.log("statusCode: ", res.statusCode);
  //console.log("headers: ", res.headers);
 
  res.on('data', function(d) {
    process.stdout.write(d);
  });
});
 
req.on('error', function(e) {
  console.log('error');
  console.error(e);
});
 
req.write(payload);
req.end();
