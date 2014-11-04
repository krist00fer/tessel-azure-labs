// AZURE_STORAGE_ACCOUNT: tesselazure
// AZURE_STORAGE_ACCESS_KEY: ZF2po8rCJkgLPDCpdAzSYtL0gqwoJDPuqhnX16706+MbRh2wl0dJYb4NfznnxJ77TlPqRro4rrt5EN2lK1k2hA==

var azure = require('azure-storage');

var validCommands = ['setup', 'read', 'delete'];

var command,
	azureStorageAccount,
	azureStorageAccessKey;

// Get command to execute
if (process.argv[2] && 
	validCommands.indexOf(process.argv[2].toLowerCase()) >= 0) {
	command = process.argv[2].toLowerCase();
}

// Get azure storage account to use
if (process.argv[3]) {
	azureStorageAccount = process.argv[3];
} else {
	azureStorageAccount = process.env.AZURE_STORAGE_ACCOUNT;
}

// Get azure storage access key to use
if (process.argv[4]) {
	azureStorageAccessKey = process.argv[4];
} else {
	azureStorageAccessKey = process.env.AZURE_STORAGE_ACCESS_KEY;
}

if (command && azureStorageAccount && azureStorageAccessKey) {
	if (command == 'setup') setupTable();
	if (command == 'read') readData();
	if (command == 'delete') deleteData();
}
else {
	// Incorrect or to little input parameters, show usage screen

	if (!azureStorageAccount) {
		azureStorageAccount = "(not currently set)";
	}

	if (!azureStorageAccessKey) {
		azureStorageAccessKey = "(not currently set)";
	}

	console.log();
	console.log('Admin tool for lab:');
	console.log('  -=UPLOADING STRUCTURED DATA TO AZURE TABLE STORAGE=-');
	console.log();
	console.log('usage: node app <setup | read | delete> [azureStorageAccount] [azureStorageAccessKey]')
	console.log();
	console.log('Azure storage access need to be provided as parameters or through the following environment');
	console.log('variables. Look-up how you set Environment Variables for your operating system or pass in');
	console.log('the credentials as parameters');
	console.log();
	console.log('Currently using:');
	console.log('  AZURE_STORAGE_ACCOUNT    :', azureStorageAccount);
	console.log('  AZURE_STORAGE_ACCESS_KEY :', azureStorageAccessKey);
	console.log();
}

function setupTable() {
	console.log();
	console.log('Setting up table in Azure Tables');
	console.log();

	process.env.AZURE_STORAGE_ACCOUNT = azureStorageAccount;
	
	// var tableService = azure.createTableService();
	// tableService.createTableIfNotExists('mytable', function(error, result, response){
	//   if(!error){
	//     // result contains true if created; false if already exists
	//   }
	// });

}

function readData() {
	console.log();
	console.log('Reading data from table');
	console.log();
}

function deleteData() {
	console.log();
	console.log('Deleting data from table');
	console.log();
}

