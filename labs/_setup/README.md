Setup
=====
In this lab, we will help you get your computer, your Tessel and your Microsoft Azure account all setup. After this lab is done you should have the tools you need installed on your computer, a connection to your Tessel and an active account on Microsoft Azure.

Setup your Microsoft Azure Subscription
---------------------------------------

If you already have an activate Microsoft Azure Subscription you can skip ahead to the next section.

Here are the steps we would recommend you to go through in order to setup your Microsoft Azure subscription:

* Browse to http://azure.com and familiarize yourself with the site. All official information about Microsoft can be find from this site, so make sure you bookmark it and return here whenever you need more information about Microsoft Azure.

* Time to create an account:

  * Watch the instructive [video](http://azure.microsoft.com/en-us/documentation/videos/sign-up-for-microsoft-azure/) (only a few minutes) that shows and explains the process of setting up a subscription. If you have a MSDN Subscription make sure you notice the part about activating your MSDN Benefits, that will get you a lot of extra included resources, so make sure you use it.

  * Now press the green button "Try it now" (text might be different in other languages) on Microsoft Azure Start Page, located at http://azure.com to start the process of signing up for an own subscription.

  * When your subscription is provisioned you can login to the management portal directly using any of these two links:

    * [manage.windowsazure.com](http://manage.windowsazure.com) - Old Portal (still useful)
    * [portal.azure.com](http://portal.azure.com) - New Portal

If everything has gone according to plans you should now have an active Microsoft Azure subscription.

Configure your computer
-----------------------

Now that your Azure Subscription is setup, it's time to setup your computer for easy access to Azure and your Tessel device. Microsoft's operating system of choice is Windows, but Microsoft Azure runs several operating systems and most of these labs will work on all the major computer operating systems so make sure you follow the guide that is relevant for your computer.

### Install Node.js

Both the cross platform tools for Microsoft Azure, as well as the Tessel microprocessor uses Node.js as a runtime, so we will start by installing that on your computer. There are many different ways of installing Node.js and it differs somewhat from operating system to operating system. A popular way of installing Node.js are by invoking a packet manager from the terminal/console window. Most of these packet managers and the commands needed to install Node.js are described [here](https://github.com/joyent/node/wiki/installing-node.js-via-package-manager) if that is how you want to install it. Otherwise head over to the [official Node.js site](http://nodejs.org/) and download the installer for your operating system.

When you have installed Node.js, open up a terminal/console window and enter the following command in order to verify the setup:

    c:\> node --version
    v0.8.20

If everything works, Node.js should respond with the installed version of Node.js that at the time of writing this was version 0.8.20.

### Install Microsoft Azure Command Line Interface

Many things in Microsoft Azure can be managed by browsing to any of the management portals we described above, but sometimes it's quicker or more effective to manage your subscription directly from the console window. Microsoft Azure comes with a cross platform tool, Azure-CLI, built on top of Node.js that let you manage many of the features in Azure directly by typing commands. Since we have Node.js installed by now, installing the Azure-CLI is as easy as invoking the Node Packet Manager, NPM with the following command:

	c:\> npm install -g azure-cli

The command will download and install Azure-CLI globally in the system (i.e. not locally in the current folder) and once it's installed you should be able invoke the following command in order to check the version you just installed:

	c:\> azure --version
	0.8.10 (node: 0.10.32)

If you ever need help with Azure-CLI go to the terminal/console windows and enter:

	c:\> azure

... and Azure-CLI will respond with a help page the gives you basic information about what you can do from there on.

Next we want to connect your computer and user with your subscription in Microsoft Azure. This is done by associating a certificate with your subscription and the current user on your machine. Fortunately this process is highly automated and can be done by Azure-CLI. Follow these steps to download and import the publishsettings file associated with your account:

	C:\> azure account download

Your default browser will open and you might need to sign in to the portal in order to download the publishsettings file. If so, login and the download will start. Make a note of where you save the publishsettings file, since you will provide that path in the next step.

	C:\> azure account import <put path to your publishsettings file here>

If everything succeeded you have now connected the current user to your Azure Subscription(s). Enter the following command in order to verify that the connection is established correctly.

	C:\> azure account list

Azure-CLI will respond with a list of Azure subscriptions attached to the current user. Done!

### Install Tessel

Follow the official install guidance to setup and connect your computer with your Tessel device. Since you already have installed Node.js, you don't need to do that again, but otherwise follow the instructions to install the tools and update your Tessel's Firmware. On Windows and OSX that is often as easy as:

	npm install -g tessel
	tessel update

### Clone or download content of this GitHub repository (optional but recommended)

The labs provided here uses a combination of text documentation and provided sample code. In order to have all documentation and all necessary sample files locally on your computer, we strongly recommend you to clone (using [Git](http://git-scm.com/)) or download all content in this repository locally on your computer.

Summary
-------

By now you should have:

* An active Microsoft Azure Subscription
* Azure-CLI installed and connected to your Azure Subscription
* The tools and a working connection with your Tessel
