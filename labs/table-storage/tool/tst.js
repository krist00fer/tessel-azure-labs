var azure = require('azure-storage');

var validCommands = ['create', 'insert', 'read', 'delete'];

var command;

// Get command to execute
if (process.argv[2] && 
	validCommands.indexOf(process.argv[2].toLowerCase()) >= 0) {
	command = process.argv[2].toLowerCase();
}

// If a storage account is passed in as a parameter, temporary set the environment variable to use that
if (process.argv[3]) {
	process.env.AZURE_STORAGE_ACCOUNT = process.argv[3];
} 

// If a storage access key is passed in as a parameter, temporary set the environment variable to use that
if (process.argv[4]) {
	process.env.AZURE_STORAGE_ACCESS_KEY = process.argv[4];
} 

if (command && process.env.AZURE_STORAGE_ACCOUNT && process.env.AZURE_STORAGE_ACCESS_KEY) {
	if (command == 'create') createTable();
	if (command == 'insert') insertData();
	if (command == 'read') readData();
	if (command == 'delete') deleteTable();
}
else {
	// Incorrect or to little input parameters, show usage screen

	if (!process.env.AZURE_STORAGE_ACCOUNT) {
		process.env.AZURE_STORAGE_ACCOUNT = "(not currently set)";
	}

	if (!process.env.AZURE_STORAGE_ACCESS_KEY) {
		process.env.AZURE_STORAGE_ACCESS_KEY = "(not currently set)";
	}

	console.log();
	console.log('Table Storage Tool, TST');
	console.log('  for lab: UPLOADING STRUCTURED DATA TO AZURE TABLE STORAGE');
	console.log();
	console.log('usage: node tst <create | insert | read | delete> [azureStorageAccount] [azureStorageAccessKey]')
	console.log();
	console.log('Azure storage access need to be provided as parameters or through the following environment');
	console.log('variables. Look-up how you set Environment Variables for your operating system or pass in');
	console.log('the credentials as parameters');
	console.log();
	console.log('Currently using:');
	console.log('  AZURE_STORAGE_ACCOUNT    :', process.env.AZURE_STORAGE_ACCOUNT);
	console.log('  AZURE_STORAGE_ACCESS_KEY :', process.env.AZURE_STORAGE_ACCESS_KEY);
	console.log();
}

function createTable() {
	console.log();
	console.log('Setting up table in Azure Tables');
	console.log();

	
	// Create a table service client. If not provided, the SDK will use storage account name and key
	// stored in the environment variables AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY.
	var tableService = azure.createTableService();
	tableService.createTableIfNotExists('weatherlogs', function(error, result, response){
	  if(!error){
	    // result contains true if created; false if already exists

	    if (result){
	    	console.log('- table weatherlogs created');
	    } else {
	    	console.log('- table weatherlogs already exists');
	    }
	  } else {
	  	// An error occured

	  	console.log("Unable to create table");
	  	console.log(error);

	  }

	  console.log();
	});
}

function insertData() {
	console.log();
	console.log('Insert sample data in table');
	console.log();

	var tableService = azure.createTableService();
	var entGen = azure.TableUtilities.entityGenerator;

	var tesselSerialNo = "123-4567-890";

	var now = new Date();

	var year = now.getUTCFullYear();
	var month = now.getUTCMonth() + 1;
	var day = now.getUTCDate();
	var hours = now.getUTCHours();
	var minutes = now.getUTCMinutes();
	var seconds = now.getUTCSeconds();

	var partitionKey = tesselSerialNo + '|' + year + '-' + addZero(month) + '-' + addZero(day);
	var rowKey = addZero(hours) + ':' + addZero(minutes) + ':' + addZero(seconds);

	// Generate random sample values for temperature and humidity
	var temperature = Math.floor((Math.random() * 100) - 50);
	var humidity = Math.floor((Math.random() * 100) + 1);

	console.log('PartitionKey      : ', partitionKey);
	console.log('RowKey            : ', rowKey);
	console.log('Temperature       : ', temperature);
	console.log('Humidity          : ', humidity);

	var weatherLog = {
		PartitionKey: entGen.String(partitionKey),
		RowKey: entGen.String(rowKey),
		Temperature: entGen.Int32(temperature),
		Humidity: entGen.Int32(humidity)
	};

	tableService.insertEntity('weatherlogs', weatherLog, function (error, result, response) {
	  if(!error){
	    // result contains the ETag for the new entity

	    console.log('Sample Weather Log inserted successfully in table weatherlogs');

	  } else {
	  	// An error occured

	  	console.log("Unable to insert data");
	  	console.log(error);

	  }

	  console.log();
	});
}

function readData() {
	console.log();
	console.log('Reading data from table');
	console.log();

	var tableService = azure.createTableService();
	var query = new azure.TableQuery().top(10);

	// console.log(tableService.queryEntities.toString());
	tableService.queryEntities('weatherlogs', query, null, function(error, result, response) {
		if (!error) {
			if (result.entries.length == 0)
			{
				console.log('Table weatherlogs does not contain any entries');
			} else {
				console.log('PartitionKey\t\t\tRowKey\t\tTemperature\tHumidity');
				console.log();

				result.entries.forEach(function (value, index, arr) {

					console.log(value.PartitionKey._ + '\t\t' + value.RowKey._ + '\t' + 
						value.Temperature._ + '\t\t' + value.Humidity._);
				});
			}
		} else {
	  	// An error occured

	  	console.log("Unable to read data");
	  	console.log(error);

	  }

	  console.log();
	});
}

function deleteTable() {
	console.log();
	console.log('Deleting data and table');
	console.log();
	
	// Create a table service client. If not provided, the SDK will use storage account name and key
	// stored in the environment variables AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY.
	var tableService = azure.createTableService();
	tableService.deleteTable('weatherlogs', function(error, response){
	  if(!error){

	    	console.log('- table weatherlogs deleted');

	  } else {
	  	// An error occured

	  	console.log("Unable to delete table");
	  	console.log(error);

	  }

	  console.log();
	});
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}