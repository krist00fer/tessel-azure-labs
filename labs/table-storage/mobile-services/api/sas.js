var azure = require('azure-storage');
var tableSvc = azure.createTableService();

// Custom RESTful Web API
// Function get is automatically invoked whenever a HTTP GET Request
// are targeting the url corresponding to this API, i.e:
// http://[mymobileservicename].azure-mobile.net/api/[nameofapi]

exports.get = function(request, response) {
    console.log('SAS get request from uniqueId:' + request.query.uniqueId);
        
    // SAS is created to be valid for 5 minutes, but we will aks the client
    // to refresh during smaller periods in order to be sure that the client
    // always have a valid SAS. This value is just a hint that get sent back
    // to the calling client and you should never trust that the client refreshes
    // after a certain time, just because you've asked it to do so. The SAS
    // is valid for 5 minutes still and can't be ignored by the client.
    var refreshPeriod = 60;
    
    var startDate = new Date();
    var expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 5);
    startDate.setMinutes(startDate.getMinutes() - 100);

    var sharedAccessPolicy = {
        AccessPolicy: {
            Permissions: azure.BlobUtilities.SharedAccessPermissions.WRITE,
//            Start: startDate,
            Expiry: expiryDate
        },
    };

    // var token = blobService.generateSharedAccessSignature(containerName, blobName, sharedAccessPolicy);
    // var sasUrl = blobService.getUrl(containerName, blobName, token);
    
    var sas = tableSvc.generateSharedAccessSignature('mytable', sharedAccessPolicy);
    var host = tableSvc.host;
    
    var result = {
        host: host,
        sas: sas,
        refreshPeriod: refreshPeriod
    };
    
    response.send(statusCodes.OK, result);
};