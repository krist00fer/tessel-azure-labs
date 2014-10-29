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

Azure Mobile Services provides you with an architecture and a service to host highly scalable rest services. Easily accessible from phones, tablets, web pages, computers and Tessel microcontrollers. You can create your own Mobile Service directly through the [portal](http://manage.windowsazure.com) or by using the Azure cross platform tools, Azure-CLI. In this lab we will mainly use the command line tools.

### Creating a new Azure Mobile Service

Open a terminal/console Window (PowerShell Window will work just fine as well if you are using Windows) and invoke the following command to ask for help on how to create a new Mobile Service:

	azure mobile create --help

*Tip: You can always add --help to azure-cli commands in order to get help*

Briefly make yourself familiar with the help page and then run the following command to get a list of locations where Mobile Services currently is available:

	azure mobile locations

 Execute the following command where you replace [servicename] [sqlAdminUsername] and [sqlAdminPassword] with values that you decide for yourself. Servicename must be globally unique so make sure you come up with something unique and feel free to use another location if that takes you closer to your end users.

	azure mobile create [servicename] [sqlAdminUsername] [sqlAdminPassword] --location 'North Europe'

This will create your own instance of Azure Mobile Services in the datacenter of your choice. By default, if you don't specify anything else, we also tell Azure Mobile Services to build the service using JavaScript/Node.js and that fit us just fine since the Tessel is programmed using JavaScript. Make sure you remember your servicename, sqladminusername, sqladminpassword and your location for future use. 

Let's create a really simple REST API named "random" that responds with a random number whenever you GET data from the corresponding URL. The following commands creates and updates the permissions for our service.

	azure mobile api create --help
	azure mobile api create [servicename] random --permissions get=public

This creates a placeholder for us to upload/write our own JavaScript/Node.js code. By setting the --permissions flag to get=public, we open up the service for being accessed without any authentication using the HTTP GET Verb.

For this lab, we have provided you with a simple implementation of the random service so you don't even have to write that one on your own. Have a look at the file [api/random.js](api/random.js) and familiarize yourself with what it does.

Time to upload the implementation of our RESTful Service. Make sure you replace api/random.js with the actual path to the file if your current path isn't the root of this lab. **Note: api/random refers to the API we want to update and "-f api/random.js" points out the file that we should use to update the api with**

	azure mobile script upload --help
	azure mobile script upload [servicename] api/random -f api/random.js

That's it! You have now created and hosted your RESTful Web Service in Azure Mobile Services and can call it by invoking a GET HTTP Request against http://[servicename].azure-mobile.net/api/random . One way of doing that is to enter that URL in your favorite browser and press enter. Each time you reload that page you should get a JSON Object back with a random value of the attribute "rnd". Execute the following commands:

	azure mobile log --help
	azure mobile log [servicename]

You'll see a list of the last 10 logs that has been written from within your API.

### Connecting Tessel to our Custom API in mobile services

So now that we have a custom RESTful Web API, let's call it from our Tessel. The sample code is located in the [tessel](tessel) folder. Familiarize yourself with the code and change the URL to point to your custom API, then:

	cd tessel
	tessel run blinky-mobile-services.js

You will see some output on the console and when you are told to press the config-button (close to the orange led on your Tessel), do so and your Tessel will call your custom API hosted on Azure Mobile Services. When the random number returns, the Tessel will flash its led as many times as the random number said.

### Browse to the Azure portal

All of this lab has been done without using either of the two portals, currently available to manage your Azure account. Now, take some time and browse to the [Azure Portal at http://manage.windowsazure.com](http://manage.windowsazure.com) and explore the section for Mobile Services and see if you can find your newly created service there.

Challenges:

* Update your RESTful API using the portal so the service never return the number 3 (or any number)
* Find the logs you've been written using the portal
* Call out to any other service, in Azure our outside, from within your custom API code

Summary
-------
You have just created Node.js RESTful API, hosted it on Azure Mobile Services and then deployed a Node.js program to your Tessel that calls out to the cloud and receives random numbers.

Now, go ahead and play around with the solution. Tweak it, extend it, use it in a bigger context. Good luck!
