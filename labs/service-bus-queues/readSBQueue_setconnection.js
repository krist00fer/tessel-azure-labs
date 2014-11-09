

var azure = require('azure');

var sbConnection = '<your-servicebus-connection-string>';
var queue = '<your-queue-name>';
 
var serviceBusClient = azure.createServiceBusService(sbConnection);
setInterval(function () {
    //console.log("checking messages");
	receiveMessages();
}, 100);

function receiveMessages() {
    serviceBusClient.receiveQueueMessage(queue, function (error, message) {
        if (error) {
            //console.log(error);
        } else {           
            console.log(message);
        }
    });
}







