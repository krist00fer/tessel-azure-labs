Creating and Calling a Custom REST API with Azure Mobile Services
=================================================================

"With Mobile Services, it’s easy to rapidly build engaging cross-platform and native apps for iOS, Android, Windows or Mac, store app data in the cloud or on-premises, authenticate users, send push notifications, as well as add your custom backend logic in C# or Node.js."

During this hands on lab you'll learn how to create your own REST API and host it in Microsoft Azure Mobile Services and communicate with that service from your Tessel microcontroller.

Prerequisites
-------------
In order to successfully complete this lab you need to:

* Have successfully setup your Azure Subscription, your development environment and your Tessel according to instructions outlined in the [Setup Lab](../_setup).

Instructions
------------

Azure Mobile Services provides you with an architecture and a service to host highly scalable rest services. Easily accessable from phones, tablets, web pages, computers and Tessel microcontrollers. You can create your own Mobile Service directly through the [portal](http://manage.windowsazure.com) or by using the Azure cross platform tools, Azure-CLI. In this lab we will mainly use the command line tools.

### Creating a new Azure Mobile Service

Open a terminal/console Window (PowerShell Window will work just fine as well if you are using Windows) and invoke the following command to ask for help on how to create a new Mobile Service:

	azure mobile create --help

*Tip: You can always add --help to azure-cli commands in order to get help*

Briefly make yourself familiar with the help page and then run the following command to get a list of locations where Mobile Serivces currently is available:

	azure mobile locations

 Execute the following commande where you replace [servicename] [sqlAdminUsername] and [sqlAdminPassword] with values that you decide for yourself. Servicename must be globaly unique so make sure you come up with something unique and feel free to use another location if that takes you closer to your end users.

	azure mobile create [servicename] [sqlAdminUsername] [sqlAdminPassword] --location 'North Europe'

This will create your own instance of Azure Mobile Services in the datacenter of your choice. By default, if you don't specify anything else, we also tell Azure Mobile Serivces to build the service using JavaScript/Node.js and that fit us just fine since the Tessel is programmed using JavaScript. Make sure you remember your servicename, sqladminusername, sqladminpassword and your location for future use. 

Let's create a really simple REST API named "random" that responds with a random number whenever you GET data from the corresponding URL. The following commands creates and updates the permissions for our service.

	azure mobile api create --help
	azure mobile api create [servicename] random --permissions get=public

This creates a placeholder for us to upload/write our own JavaScript/Node.js code. By setting the --permissions flag to get=public, we open up the service for beeing accessed without any authentication using the HTTP GET Verb.

For this lab, we have provided you with a simple implementation of the random service so you don't even have to write that one on your own. Have a look at the file [api/random.js](api/random.js) and familiarize yourself with what it does.

Time to upload the implementation of our RESTful Service. Make sure you replace api/random.js with the actual path to the file if your current path isn't the root of this lab. **Note: api/random refers to the API we want to update and "-f api/random.js" points out the file that we should use to update the api with**

	azure mobile script upload --help
	azure mobile script upload [servicename] api/random -f api/random.js

That's it! You have now created and hosted your RESTful Web Service in Azure Mobile Services and can call it by invoking a GET HTTP Request against http://[servicename].azure-mobile.net/api/random . One way of doing that is to enter that URL in your favorite browser and press enter. Each time you reload that page you should get a JSON Object back with a random value of the attribute "rnd". Execute the following commands:

	azure mobile log --help
	azure mobile log [servicename]

You'll see a list of the last 10 logs that has been written from within your API.

Optional: Browse to the "old" [Azure Portal at http://manage.windowsazure.com](http://manage.windowsazure.com) and explore the section for Mobile Services and see if you can find your newly created service there.

Summary
-------
(Include a short summary that explains what has been done during the lab. Use a couple of sentences, bullets and other, but don't explain the full lab once again)

(OTHER - REMOVE THIS SECTION)
-----------------------------
(Put whatever code files is needed for the lab directly in the lab's folder or if necessary in sub folders. Also update the main README.md file located in the "labs-folder" and link to this new lab. Make sure to spell check the lab using English US settings.)
