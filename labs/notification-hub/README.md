Send Push Notification to Mobile with Notification Hubs
=============
In this lab you will learn how to send push notification to a mobile device, Windows Phone or Android, directly from tessel.
This lab demonstrate how to use Azure Notification Hub with the Notification Hubs REST API.
This lab uses the tessel.io with the <a href="http://start.tessel.io/modules/ambient">ambient module</a>. We modified the ambient sample, when ever something happens with sound it will send a push notification to all registered mobile devices.
You can choose between developing Android mobile app OR Windows Phone mobile app.

Prerequisites
-------------
In order to successfully complete this lab you need to:

* Have successfully setup your Azure Subscription, your development environment and your Tessel according to instructions outlined in the [Setup Lab](../_setup).
* You have a tessel ambient module and its configured acording to: <a href="http://start.tessel.io/modules/ambient">Tessel ambient module</a>
* For Android App:
	* Google Developers Account (Only in case of the chossing Android App, for Windows Phone app we will use 		unauthenticated push notifications)
	* Eclipse with Android SDK
* For Windows Phone App:
	* Visual Studio with Windows Phone SDK

Instructions
------------
In Part 1 of this lab you will make your first steps using Notification Hubs. You will learn how to create a new namespace for Notification Hub and configure it to work the push notification providers like GCM (Google Cloud Messaging) and MPNS (Microsoft Push Notification Service). Additionally you will create a mobile app that will register to the services and recive the push notifications. You can choose to build an Android app, a Windws Phone app or both.
In part 2 of this lab you will create a SAS Token, later you will use this token to authenticate from the Tessel device to Notification Hub.
In part 3 you will create the node.js code that will run on the Tessel device to send push notifications. In part 4 of this lab you will run the code and recive the notifications on your mobile phone.

Please note in some cases reciving push notification is not avilable with running emulators and you will need to run your mobile app on a real mobile device.

The source code for this lab contains two folders:
* Tessel - the node.js code to run on the Tessel device.
* VSProject - a Visual Studio solution with two projects:
  * GeneratSAS to generate the SAS Token in part 2
  * PhoneApp1 - a sample for a Windows Phone app registered to recieve push notifications

### Part 1 - Create the mobile app ready to recive push notification from Azure Notification Hub
* For Android App follow instructions on: <a href="http://azure.microsoft.com/en-us/documentation/articles/notification-hubs-android-get-started/">Get started with Notification Hubs - Android</a>
* For Windows Phone App follow instructions on: <a href="http://azure.microsoft.com/en-us/documentation/articles/notification-hubs-windows-phone-get-started/">Get started with Notification Hubs - Windows Phone</a>


### Part 2 - Get the SAS Token
Applications can authenticate to Microsoft Azure Service Bus (including Notification Hubs) using either Shared Access Signature (SAS) authentication, or by authenticating through the Microsoft Azure Active Directory Access Control (also known as Access Control Service or ACS).
For the simplicity we will use in this lab SAS authentication. For detail about SAS Authentication read: <a href="http://msdn.microsoft.com/en-us/library/azure/dn170477.aspx">Shared Access Signature Authentication with Service Bus</a> 
In this part we will first generate the SAS Token, then you can paste the token string in your node.js code run on the tessel for authentication.

#### Part 2.1 Get the SAS Token with GenerateSAS.exe

The source code for this lab includes a C# Console application to generate the SAS Token.
You can either just run the GenerateSAS.exe tool located in <folder-downloaded-the-labs>\tessel-azure-labs\labs\notification-hub\VSProject\GenerateSAS\bin\Debug
OR
You can open the project in Visual Studio, the .sln file is located in <folder-downloaded-the-labs>\tessel-azure-labs\labs\notification-hub\VSProject\ then build and run the GenerateSAS project.

* You have to provide the following information:
  * What is your service bus namespace? this is your Service Bus namespace
  * What is the path? this is your hub name
  * What existing shared access policy would you like to use to generate your SAS - set for DefaultFullSharedAccessSignature
  * What is that policy's shared access key (primary or secondary)? take this from the Azure portal, under Service Bus -> Notificatio Hubs -> your hub -> connection information. copy the SharedAccessKey part only copied from the value for your DefaultFullSharedAccessSignature.
  * When should this expire (MM/DD/YY HH, GMT)? empty value will set it for 10/31/2020 12:00
* Copy the complete output string, this is your SAS Token. Save this string, you will have to paste it later in your node.js code

#### Part 2.1
(Text in part two point one goes here)

#### Part 2.2
(Text in part two point two goes here)

### Part 3 - Edit the ambient_notificationhub_sas.js file
From this lab folder open the file Tessel\ambient_notificationhub_sas.js in a text editor.

#### Part 3.1 - Set the NotificationHub Parameters
Edit the details in lines 13-15 under the NotificationHub parameters section.
in line 13 edit your namespace, in line 14 edit your hub name.
In line 15 paste your SAS Token you generated in part 2.1

	
	// NotificationHub Parameters
	var NotificationHubNS = '<your ServiceBus namespace>.servicebus.windows.net'
	var hubName = '<Your hub name>'; 
	var Key = '<Your SAS Key generated by the SAS tool>';


#### Part 3.2 - Look at the sendNotification function
The ambient_notificationhub_sas.js file contain two functions for sending notifications:
* sendNotificationAndroid(message) - For sending push notifications to Android with GCM
* sendNotificationWP(message) - For sending push notifications to Windows Phone with MPNS 


In both cases the function gets a message and sends it as a push notification using the Notification Hub REST API. Lets take a look at the code for the sendNotificationAndroid function. 

	
	function sendNotificationAndroid(message) {
	
    var options = {
        hostname: NotificationHubNS,
        port: 443,
        path: '/' + hubName + '/' + 'messages/' + '?api-version=2013-08',
        method: 'POST',
        headers: {
            'Authorization': Key,
            'Content-Type': 'application/xml;charset=utf-8',
            'ServiceBusNotification-Format' : 'gcm', 
        }
    };

    var req = https.request(options, function (res) {
        console.log("sendNotificationAndroid:statusCode: ", res.statusCode);
        console.log("sendNotificationAndroid:headers: ", res.headers);	

		res.setEncoding('utf8');
        res.on('data', function (d) {
            
        });
    });

    req.on('error', function (e) {
        console.error(e);
    });
	
	var data = '{"data":{"message":"' + message + '"}}';
    req.write(data);
    req.end();
    }


#### Part 3.3 - Choose your own platform
When something happens with sounds both sendNotificationAndroid and sendNotificationWP functions are being called.
In case you are interested in sending notification only to Android or only to Windows Phone please put in comment the function you do not want to be called.

	ambient.on('sound-trigger', function(data) {
      console.log("Something happened with sound: ", data);
      sendNotificationWP("Something happened with sound");
	  sendNotificationAndroid("Something happened with sound");

### Part 4 - running ambient_notificationhub_sas.js
Open node.js command prompt and nevigate to the Tessel\ambient_notificationhub_sas.js. Make sure the tessel is connected to wifi by running: 

	tessel wifi -l
If tessel is not connected to wifi connect it using the command:

	tessel wifi -n "network name" -p "password"

Run the ambient_notificationhub_sas.js

	tessel run ambient_notificationhub_sas.js

When the app is running clap or make some noise near the tessel device. You should get a push notification on your mobile device and the app should display the status code recived from calling the Notification Hub REST API.

	sendNotificationWP:headers:  {
	date : Fri, 07 Nov 2014 20:40:01 GMT,
	transfer-encoding : chunked,
	content-type : application/xml; charset=utf-8,
	server : Microsoft-HTTPAPI/2.0
	}
	sendNotificationAndroid:statusCode:  201
	sendNotificationAndroid:headers:  {
	date : Fri, 07 Nov 2014 20:40:03 GMT,
	transfer-encoding : chunked,
	content-type : application/xml; charset=utf-8,
	server : Microsoft-HTTPAPI/2.0
	}
	
	

Summary
-------
You have just created an Notification Hub inside of Service Bus and used it to send push notification to a mobile device, later you learned how to send a push notification message directly from the Tessel device using the Notification Hub REST API. 

Now, go ahead and play around with the solution. Think about all the notifications you can send from Tessel to mobile devices, you can use the GenerateSAS.exe tool to generate SAS token to additional Azure services like Service Bus Queues, Topics and Events Hub. Good luck!


Additional Resources
-----------------------------
(Put whatever code files is needed for the lab directly in the lab's folder or if necessary in sub folders. Also update the main README.md file located in the "labs-folder" and link to this new lab. Make sure to spell check the lab using English US settings.)
