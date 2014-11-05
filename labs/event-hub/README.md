Using EventHubs for sending telemetry data at high scale
========================================================
Many modern solutions that intend to provide adaptive customer experiences or to improve products through continuous feedback and automated telemetry are faced with the challenge of how to securely and reliably ingest very large amounts of information from many concurrent publishers. Microsoft Azure Event Hubs is a managed platform service that provides a foundation for large-scale data ingestion in a broad variety of scenarios. Examples of such scenarios are behavior tracking in mobile apps, traffic information from web farms, in-game event capture in console games, or telemetry data collected from industrial machines or connected vehicles. The common role that Event Hubs plays in solution architectures is that it acts as the “front door” for an event pipeline, often called an event ingestor. An event ingestor is a component or service that sits between event producers and event consumers to decouple the production of an event stream from the consumption of those events.

You'll create a EventHub with the requiered configuration and security setting using the Microsoft Azure Portal or custom code using Visual Studio. Afterwards we will send telemetry from your Tessel microcontroller to the EventHub. 



Prerequisites
-------------
In order to successfully complete this lab you need to:

* Have successfully setup your Azure Subscription, your development environment and your Tessel according to instructions outlined in the [Setup Lab](../_setup).
* Have a Node.js version installed and running on your pc. If you have not yet installed Node.js just go to http://www.nodejs.org/ and click on the install button. 
* You can create and configure the EventHub by using the Azure portal. In this case you don't need any further prerequisites
* If you want to configure and create the EventHub by code an installation of Visual Studio with the Azure SDK is necessary. You can download a free version of Visual Studio from http://www.visualstudio.com/en-us/products/visual-studio-express-vs.aspx. The Azure SDK can be downloaded from http://azure.microsoft.com/en-us/downloads/
* If you want to see the messages which you have send to Event Hub, just to proove that your messages really arrived, you can use tools like the Service Bus Explorer. You can download the Service Bus Explorer from https://code.msdn.microsoft.com/windowsazure/Service-Bus-Explorer-f2abca5a. If you are running on a non Windows machine and want to use the Service Bus Explorer, how about just spinning up a virtual machine running windows in Azure and installig it there?


Instructions (using the Azure Portal to create an Event Hub)
------------------------------------------------------------

During this secition we will use the [Azure Portal](https://manage.windowsazure.com) for the creation and configuration of the EventHubs.
We will: 

* Create a new ServiceBus Namespace
* Create a new EventHub within the created ServiceBus Namespace
* Create the necessary credentials for accessing the EventHub

Later in the lab we will see how the same configuration can be done from a C# code within a console application running on-premise.

### Creating a new Azure ServiceBus namespace

* Start by logging in to the [Azure Portal](https://manage.windowsazure.com).
* Click "+ NEW", located in the lower left corner and select: App Services -> Service Bus -> Event Hub -> Quick Create
![Service Bus Creation Screenshot](images/01_CreateSBNamespace.png)
* Fill in a Event Hub Name of your choice (How about "YourInitials + EH")
* Select a region (because we are in Berlin we would recommend Europe North or Europe West but you are free to choose any other region)
* Fill in a Namespae Name or leave the automatically created name. This name will be part of the URI which uniquely identifies your Event Hub (How about "YourInitials + -ns")
* Click on "CREATE A NEW EVENT HUB"

After a while, you'll see "Active" in the status column of you new created EventHub

* Click on the name of your Event Hub in the column "Namespace Name"
* Familiarize yourself with the information you have in front of yourself. From here you have shortcuts to tutorials, tools etc.
* Click on "Event Hubs" at the top of the screen
![Event Hub Screenshot](images/02_ConfigureEventHub_01.png)
* Click on the name of the created Event Hub in the column "NAME"

You see now a dashboard which gives you more information concerning the created Event Hub like the connection string, the Event Hub Url etc.

* Click on "CONFIGURE" at the top of the page
![Event Hub Screenshot](images/02_ConfigureEventHub_02.png)

* You see information concerning the MESSAGE RETENTION (default is one day), the STATE of the Event Hub and the PARTITION COUNT
* In the lower part of the page you see a secition called "shared access policies". Within this section we create a new entry
* Just key in a new policy name (the name is up to you; How about "SendRights")
* Click "Save" at the bottom of the page
* Copy the "PRIMARY KEY" and store it for further usage

Congratulation! You have created and configured your first Event Hub using the Azure Portal


Instructions (Creating / Configuring Event Hub using C#)
--------------------------------------------------------

In this section we will create an Event Hub by using C# in an on-premise console application. Please be aware; this steps are not necessary if you have already created the Event Hub using the Azure Portal. We will reuse the already created Service Bus Namespace and will add a second Event Hub to the Namespace.

We will: 

* Create a new EventHub within the created ServiceBus Namespace
* Create the necessary credentials for accessing the EventHub

### Start Visual Studio

* Start Visual Studio on your computer (please ensure that you have the Azure SDK installed)
* Create a new Console application by clicking FILE -> NEW -> PROJECT and select "Console Application" from the screen
* Give the solution a meaningful name (How about: "MyEventHubCreator")
![Visual Studio Screenshot](images/04_CreateSolution.png)


### Writing the code to create the Event Hub
* After the solution is created for you, open the "Package Manager Console". If it isn't shown, go to VIEW -> OTHER WINDOWS -> PACKAGE MANAGER CONSOLE
* Key in: Install-Package WindowsAzure.ServiceBus and confirm by pressing Enter

The necessary Nuget packages to interact with Service Bus and Event Hub will be downloaded and added to your solution.

Let's start coding and let us create the Event Hub by code

* Replace your auto generated Main function with the code from [api/Program.cs](api/Program.cs).
* Replace "Please Provide Your ServiceBus Namespace" with the name of your Service Bus Namespace.
* Replace "Please Provide Your ServiceBus Shared Access Key" with the Shared Access Key from your Service Bus Namespace. You can find the key in the Azure Portal by clicking "CONNECTION INFORMATION" on the bottom of your page. Please take care that you request the connection information for the Service Bus Namespace and not for the already created Event Hub. 
![ServiceBus Connection Screenshot](images/05_GetConnectionInfo_01.png)
* The provided connection string looks similiar to:
	Endpoint=sb://robeichsb-ns.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=VaXjVOfZWDj47+bDtCzmbYfu2vt6+I=	
* Please copy the value of SharedAccessKey into your code
* Add the following two using statements to your code:

	using Microsoft.ServiceBus;
	using Microsoft.ServiceBus.Messaging;

* Build the application and step through the application

Contratulation! You have created your second Event Hub within a C# application.

### Connecting Tessel to the new created Event Hub

So now that we have a Event Hub ready for us to ingest data, let's call it from our Tessel. The sample code is located in the [tessel](tessel) folder. Just open the file [blinky-EventHub.js](tessel\blinky-EventHub.js). 

Familiarize yourself with the code and change the following values with the values you have provided during the creation/configuration of the Event Hub: 
	- namespace (It might look like '<<YourInitials>> + EH + <<-ns>>')
	- hubname (If you created the Event Hub with the provided C# code it's: 'demoeventhub'; If not it might be <<YourInitials>> + "EH")
	- eventHubAccessKeyName (If you created the Event Hub with the provided C# code it's: 'EventHubKey')

In order to secure the communication with the Event Hub we have to provide a so called "Shared Access Signature Token" in each request from the Tessel to the Event Hub. You can create such a "Shared Access Signature Token" with the Node.js application which is provided [here](tessel\CreateSASToken.js). 
Just provide the same values for namespace, hubname, eventHubAccessKeyName AND eventHubAccessKey that you used in the blinky-EventHub.js. You can find the value for eventHubAccessKey in the Azure portal (Just look in this tutorial for: "Copy the "PRIMARY KEY" and store it for further usage") or by re-running the C# code which created the Event Hub. It's the "primary Key" which is shown at the console window.

* Run the Node.Js application CreateSASToken.js locally on you PC and copy / paste the Shared Access Signature token which is shown at the console into your blinky-EventHub.js application. The Shared Access Signature token should be the value of the variable: createdSAS. Just take care that you remove CR/LF after you copied the signature from the console window.

* Locate in the blinky-EventHub.js code the line which is marked: "// Payload to send". This is the json formatted payload you are going to send to Event Hub. Change it  to whatever you like to send. 

* Now it's time to run your application. Just key in the following commands:

	cd tessel
	tessel run blinky-EventHub.js

You will see some output on the console and if everything works well you will see a http response code of <<201 Created>> meaning your request to Event Hub has been fulfilled and resulted in a new resource being created. 

Congratulation! You have finished the lab. 


### User Service Bus Explorer to see the results of your ingests

If you want to proove that your messages are "inside" of Event Hub and waiting for processing you can use "Service Bus Explorer" (look to the prerequisites seciton of this document). 
* Just start "Service Bus Explorer" and connect it using the Service Bus Connection string (provided by the Azure portal) to connect to the Service Bus Namespace. After the connection is sucessfull established you see your created Event Hub(s).
![Service Bus Explorer](images/06_SBExplorer_01.png)
* Identify the Partition which has a "End Sequence Number" different than -1 or 0 and "right click" on this partition
* Select "Create Partition Listener"
* In the new window click on "Start" in the right lower area.
![Service Bus Explorer](images/06_SBExplorer_02.png)
* If you now click on "Events" you can see all telemetry data which was send from your Tessel to the Event Hub.
![Service Bus Explorer](images/06_SBExplorer_03.png)


Summary
-------

You have just created an Event Hub inside of Service Bus and deployed a Node.js program to your Tessel that sends telemetry data to the Event Hub. 

Now, go ahead and play around with the solution. Tweak it, extend it, use it in a bigger context. Maybe you can host the creation of the Shared Access Signature in a Azure WebSite Rest Api and call it from the Tessel before you communicate with Event Hub. Good luck!


More information
----------------
Azure portal: https://manage.windowsazure.com
Azure portal preview: http://portal.azure.com
Azure Service Bus: http://azure.microsoft.com/en-us/documentation/services/service-bus/#node
Event Hubs: http://msdn.microsoft.com/en-us/library/azure/dn789972.aspx
Shared Access Signature: http://msdn.microsoft.com/en-us/library/azure/jj721951.aspx

