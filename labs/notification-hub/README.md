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
* <a href="http://start.tessel.io/modules/ambient">ambient module</a>
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
* For Windows Phine App follow instructions on: <a href="http://azure.microsoft.com/en-us/documentation/articles/notification-hubs-windows-phone-get-started/">Get started with Notification Hubs - Windows Phone</a>


### Part 2 - Get the SAS Token
Applications can authenticate to Microsoft Azure Service Bus (including Notification Hubs) using either Shared Access Signature (SAS) authentication, or by authenticating through the Microsoft Azure Active Directory Access Control (also known as Access Control Service or ACS).
For the simplicity we will use in this lab SAS authentication. For detail about SAS Authentication read: <a href="http://msdn.microsoft.com/en-us/library/azure/dn170477.aspx">Shared Access Signature Authentication with Service Bus</a> 
In this part we will first generate the SAS Token, then you can paste the token string in your node.js code run on the tessel for authentication.

* Get the SAS Token with GenerateSAS.exe
The source code for this lab includes a C# Console application to generate the SAS Token.
You can either just run the GenerateSAS.exe tool located in <folder-downloaded-the-labs>\tessel-azure-labs\labs\notification-hub\VSProject\GenerateSAS\bin\Debug
OR
You can open the project in Visual Studio, the .sln file is located in <folder-downloaded-the-labs>\tessel-azure-labs\labs\notification-hub\VSProject\ then build and run the GenerateSAS project.
* (Bullet two)
  * (Bullet two point one)
  * (Bullet two point two)

#### Part 2.1
(Text in part two point one goes here)

#### Part 2.2
(Text in part two point two goes here)

#### Part 3
(Text in part three goes here)

	// Use comments in code only if code is otherwise confusing.
	// We want the code to be as good and clean written that it
	// is self-explanatory and doesn't need comments. Still don't
	// be afraid to use comments if needed.

	code.indent(tab); // Indent code with 4 spaces (or tab) to have it appear as code

Summary
-------
(Include a short summary that explains what has been done during the lab. Use a couple of sentences, bullets and other, but don't explain the full lab once again)

(OTHER - REMOVE THIS SECTION)
-----------------------------
(Put whatever code files is needed for the lab directly in the lab's folder or if necessary in sub folders. Also update the main README.md file located in the "labs-folder" and link to this new lab. Make sure to spell check the lab using English US settings.)
