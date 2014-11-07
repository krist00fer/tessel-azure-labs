Uploading structured data to Azure Table Storage
================================================
Microsoft Azure provides several services that makes great sense to use directly from your Tessel device. Creating custom APIs using Mobile Services, Azure Websites or Virtual Machines might be the first you think about, but several other services could be used on their own or together with those custom APIs. Azure Table Storage is a NoSQL Database hosted in Azure for you, designed to handle massive amount of structured data and load. Having your clients make direct calls to Azure Table Storage will offload your other services. While offloading other services, you will have to do other tradeoffs instead. Since the clients are writing data directly to Azure Table Storage, you lose some of the control of the data that get pushed to your service and you have to handle that in other ways, like using an asynchronous pattern to validate and clean up data. Still, if storing structured data is what you are looking to do, then you should definitively consider Azure Table Storage and this lab will give you a taste of it.

During this lab you’ll build a (fake) weather monitor device that registers and sends temperature and humidity information to the cloud.

Prerequisites
-------------
In order to successfully complete this lab you need to:

* Have successfully setup your Azure Subscription, your development environment and your Tessel according to instructions outlined in the [Setup Lab](../_setup).
* Optional: It's not necessary but the lab [Creating and Calling a Custom REST API with Azure Mobile Services](../mobile-services) will provide additional information about how you can create and host a custom RESTful Web API on Azure Mobile Services. Doing that lab before this one might be beneficial.

Instructions
------------
Azure Table is one of the services in the overall service called Azure Storage. By default Azure Table is secured and you can't access it without the storage account name and key. The storage account name should be considered public knowledge, but the storage account key should be handled with extreme care and is something you shouldn't share with any external clients. If you do get your hand on a valid storage account name and key you are in fact administrator of that storage account and can create, ready, update and delete tables and data stored in the tables. In fact since you with those credential have full administrative rights to the storage account you can also execute requests against the other services included in Azure Storage, such as Blobs, Queues and Files. So handing out the storage account key to any client that are not under your direct control is an extremely important “Anti Pattern” (something you shouldn’t do) to know about.

So if we shouldn’t give away the storage account key, how can we then have external clients access services within a Storage Account?

The good news is that you can use a technique that is called: [Shared Access Signature, SAS](http://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-shared-access-signature-part-1/). With SAS you can give out temporary usage rights to different resources in a Storage Account. For example, you can generate a SAS that gives a client temporary rights to create, read, update or delete data in a specific table in Azure Tables. Sounds all good, right? The problem here is that you need the storage account name and key in order to generate the SAS, hence it has to be generated at a safe and controlled location such as in a service controlled by you.

### Execution flow

In this lab we’re going to host a small service on Microsoft Azure Mobile Services that will provide your tessel with a SAS that in turn will grant the Tessel with the ability to write directly to Azure Table Storage.

1. Tessel calls API to retrieve SAS that gives write access to Azure Storage Table. The SAS expires after a certain amount of time, so the Tessel will keep track on time from now on.
2. SAS is saved locally on the Tessel device and is used for several writes directly against Azure Table Storage.
3. If SAS times out then we start all over at number 1 again.

### Setting up Azure

There are two components we need to setup in Azure to have everything working: storage and hosting.

#### Create a storage account

During this part of the lab we are going to use the Azure-CLI (Azure x-Plat Tools), even though you can easily do the same thing using the management portal if you want to.

Open a terminal/console windows. Execute the following commands to gain some insights into what we are trying to do next.

	azure storage account -–help
	azure storage account create --help

When you are ready, execute the following command to create a new storage account. Replace <name> with a globally unique name that you want to use. The command will fail if the name is already taken, so chose something creative or just try again until you find something unique. You can also change the location to whatever datacenter you feel like using. Often the recommendation is to put your storage account in the same datacenter as your other services in order to reduce lag and expenses related to data transfers between datacenters, but in this lab you can chose whatever location you feel appropriate.

	azure storage account create –location “North Europe” <name>

If everything is successful you should now have a new storage account created. Remember the name you used and use it whenever we refer to the name of your storage account. In order to access that storage account we need to retrieve the storage account key. Execute the following command to retrieve the keys.

	azure storage account keys list –help
	azure storage account keys list <name>

Sample output

	PS C:\dev\tessel-azure-labs> azure storage account keys list tesselazure
	info:    Executing command storage account keys list
	+ Getting storage account keys
	data:    Primary ZF2po8rCJk.....DATA-REMOVED-FROM-SAMPLE....4rrt5EN2lK1k2hA==
	data:    Secondary lo+nGo/W.....DATA-REMOVED-FROM-SAMPLE....Pt1orNXRnJjZA7g2w==
	info:    storage account keys list command OK

These keys can only be accessed if you are administrator of the Azure Subscription that hosts the particular Storage Account and those keys should be handled with care. Don’t give them away to anyone you don’t trust and don’t save them on uncontrolled devices or clients. With any of these keys you have full control over that specific storage account. Copy and save the primary key to somewhere safe on your computer for now, we’ll be using it soon again. You can always retrieve the keys again later by executing the same command or though visiting the management portal. If you need to you can also create new keys, but that will invalidate any other keys already out there.

Throughout this lab we’ll be calling into this Storage Account through some tools and mane of those tools (including Azure-CLI) accepts they name and key of your storage account as input parameters, but they also accept them saved in Environment Variables. The process of saving values in Environment Variables differs some through different operating systems and terminal/command windows/shells. Here are some examples and if you are using another operating system or shell, please search the Internet for information about how to set Environment Variables. Setting environment variables according to this will not persist your changes so if you open a new terminal/command window, restart your computer, etc. your information will be forgotten:

	// Windows - Command Prompt
	> set <name> = <value>

	// Windows – PowerShell
	> $env:<name> = <value>

	// OS X (Mac) - Terminal
	> export <name> = <value>

	// Linux - Bash
	> export <name> = <value>

Set the Environment Variables: AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY to the name of your storage account and the access key to that storage account respectively.


	// Windows – Command Prompt
	> set AZURE_STORAGE_ACCOUNT = <storage-account>
	> set AZURE_STORAGE_ACCESS_KEY = <key>

	// Windows – PowerShell
	> $env:AZURE_STORAGE_ACCOUNT = <storage-account>
	> $env:AZURE_STORAGE_ACCESS_KEY = <key>

	// OS X / Linux
	> export AZURE_STORAGE_ACCOUNT = <storage-account>
	> export AZURE_STORAGE_ACCESS_KEY = <key>

If you by any reason don't succeed or don't want to set the Environment Variables you can also add the storage account name and key manually wherever that is needed, but from now on this lab description assumes the storage account name and key are set.

#### Create and test table in Azure Table Storage

Azure Table Storage is one of several sub storage systems in Azure Storage. In order to have the Tessel write directly to a table in the storage system we will pre-create the table and also introduce a small sample tool to read and write some test data from that table.

Open a terminal/console window. Make sure you have downloaded/cloned/copied the contents of this lab locally on your computer and change directory to the "tool" directory.

	cd tool

In this directory you'll fine a Node.js app ([app.js](tool/app.js)). We are going to use this app, but first we need to install required Node Modules. The required Node Modules for this project are described in the [package.json](tool/package.json) file and Node.js provides an easy tool for downloading and installing those dependencies. Install the required module(s) by executing the following command

	npm install

If everything went according to plans you should now be able to execute the following command

	> node app

	Table Storage Tool, TST
	  for lab: UPLOADING STRUCTURED DATA TO AZURE TABLE STORAGE

	usage: node tst <create | insert | read | delete> [azureStorageAccount] [azureStorageAccessKey]

	Azure storage access need to be provided as parameters or through the following environment
	variables. Look-up how you set Environment Variables for your operating system or pass in
	the credentials as parameters

	Currently using:
	  AZURE_STORAGE_ACCOUNT    : tesselazure
	  AZURE_STORAGE_ACCESS_KEY : ZF2po8rCJk.....DATA-REMOVED-FROM-SAMPLE....4rrt5EN2lK1k2hA==

We will use this tool during the rest of this lab to:

* create table 'weatherlogs'
* insert sample data in table 'weatherlogs'
* read data from table 'weatherlogs'
* delete table 'weatherlogs' and all data within

If you have successfully set the Environment Variables AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY the values will be shown by the tool. If not, you can provide those parameters to this tool manually according to the shown syntax.

Execute the following command to create a new Azure Table in your currently referenced storage account:



#### Create and host the SAS Service

As we talked about before, we need a controlled place where we create and hand out the SAS that will be used for direct access against Azure Table Storage, so we’ll start by creating that service.

There are several choices where you can host services in Microsoft Azure, such as:

* Mobile Services
* Websites
* WebRoles
* Virtual Machines
	* Windows
	* Linux
* App container, such as Dockers
* etc.

During this lab we will build simple REST API with Node.js and host it in Mobile Services. And if it wasn’t enough with alternatives, there are also plenty of deployment alternatives when it comes to Mobile Services, such as:

* Manually through the [Management Portal](http://manage.windowsazure.com)
* Through Azure-CLI (Azure x-Plat Tools) (The lab “[Creating and Calling a Custom REST API with Azure Mobile Services](../mobile-services)” uses this approach)
* Through Git
* Automatically through integration with a build server, like [Visual Studio Online](http://visualstudio.com)

During this lab we will setup and create the lab using the functionality provided to us through the portal.

Summary
-------
(Include a short summary that explains what has been done during the lab. Use a couple of sentences, bullets and other, but don't explain the full lab once again)

(OTHER - REMOVE THIS SECTION)
-----------------------------
(Put whatever code files is needed for the lab directly in the lab's folder or if necessary in sub folders. Also update the main README.md file located in the "labs-folder" and link to this new lab. Make sure to spell check the lab using English US settings.)
