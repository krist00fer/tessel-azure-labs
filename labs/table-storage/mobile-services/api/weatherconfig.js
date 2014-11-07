var azure = require('azure-storage');
var tableSvc = azure.createTableService();

// http://<mymobileservicename>.azure-mobile.net/api/table_connection_info?deviceId=<deviceId>

exports.get = function(request, response) {
    // Handle incomming request to retrieve weather configuration
                
    // Set default configuration values

    var configRefreshPeriod = 300; // seconds
    var sasExpiryPeriod = 500; // seconds
    var measurementPeriod = 15; // seconds
    var uploadPeriod = 60; // seconds
    
    // Override default values if other values have been set using the management portal

    if (process.env.CONFIG_REFRESH_PERIOD) { configRefreshPeriod = process.env.CONFIG_REFRESH_PERIOD; }
    if (process.env.SAS_EXPIRY_PERIOD) { sasExpiryPeriod = process.env.SAS_EXPIRY_PERIOD; }
    if (process.env.MEASUREMENT_PERIOD) { measurementPeriod = process.env.MEASUREMENT_PERIOD; }
    if (process.env.UPLOAD_PERIOD) { uploadPeriod = process.env.UPLOAD_PERIOD; }
    
    var deviceId = request.query.deviceId;
    
    if (authorizeDevice(deviceId)) {    
        console.info('Authorized request:', deviceId);
        
        // Create the Shared Access Signature according to configuration
    
        var now = new Date();
        var sasExpiryDate = new Date(now);
        sasExpiryDate.setSeconds(now.getSeconds() + sasExpiryPeriod);
    
        var sharedAccessPolicy = {
            AccessPolicy: {
                Permissions: azure.BlobUtilities.SharedAccessPermissions.WRITE,
                Expiry: sasExpiryDate
            },
        };
        
        var sas = tableSvc.generateSharedAccessSignature('mytable', sharedAccessPolicy);
        
        // Register the address of the Storage Account
    
        var host = tableSvc.host;
        
        // Return configuration to caller
    
        var config = {
            authorized: true,
            configRefreshPeriod: configRefreshPeriod,
            measurementPeriod: measurementPeriod,
            uploadPeriod: uploadPeriod,
            host: host,
            sas: sas,
        };
        
        response.send(statusCodes.OK, config);
    } else {
        console.warn('Unauthorized request:', deviceId);
        
        // deviceId wasn't allowed to access
        
        response.send(statusCodes.UNAUTHORIZED, {
            authorized: false,
            message: 'deviceId was not provided or has been refused access'
        });
    }
};

function authorizeDevice(deviceId) {
    // Implement logic to check if device is allowed to send data or not

    // WARNING! This is just a sample implementation and does not by any
    // means show how authentication and authorization of devices should
    // be handled.

    // For this lab, approve all deviceIds as long as it is provided
    
    if (deviceId) {
        return true;
    } else {
        return false;
    }
}