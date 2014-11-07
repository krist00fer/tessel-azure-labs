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
(Describe the lab here. Divide the lab into logical parts in order for the participant to easily follow along. If possible, describe the steps in the lab using steps that are platform agnostic, i.e. it should work using whatever operating system you want. If possible use Azure-CLI to manage Windows Azure, but also explain how to use the portal if you feel it adds extra value or visibility. Remember that the portal(s) are changing faster than Azure-CLI, so the labs will be easier to maintain if we use Azure-CLI and since the Tessel's programming tools are used from the console, we might as well stick with it as much as possible. The preferred programming language on the server and client side should be JavaScript if possible in order to keep complexity of setup to a minimum.)

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



Summary
-------
(Include a short summary that explains what has been done during the lab. Use a couple of sentences, bullets and other, but don't explain the full lab once again)

(OTHER - REMOVE THIS SECTION)
-----------------------------
(Put whatever code files is needed for the lab directly in the lab's folder or if necessary in sub folders. Also update the main README.md file located in the "labs-folder" and link to this new lab. Make sure to spell check the lab using English US settings.)
