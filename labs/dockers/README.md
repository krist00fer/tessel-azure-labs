Calling a RESTful service from your Tessel  running in a Docker container on Linux in an Azure VM.
=============
In this lab we will run a RESTful service in a Docker container and call it from our Tessel. This lab builds on the Websites lab and the clientside code is identical. On the server side we provision a Docker containers in a Linux VM. 
(Enter a short description of what the lab will go through here. Approximately 5-10 sentences.)

Prerequisites
-------------
In order to successfully complete this lab you need to:

* Have successfully setup your Azure Subscription, your development environment and your Tessel according to instructions outlined in the [Setup Lab](../_setup).
* Installers for 
* (Add other prerequisites here)
* (If the lab uses features, tools or languages that are only available on certain operating systems make sure you specify them here, i.e. PowerShell, Visual Studio, C#, etc.)
* (...)

Instructions
------------
(Describe the lab here. Divide the lab into logical parts in order for the participant to easily follow along. If possible, describe the steps in the lab using steps that are platform agnostic, i.e. it should work using whatever operating system you want. If possible use Azure-CLI to manage Windows Azure, but also explain how to use the portal if you feel it adds extra value or visibility. Remember that the portal(s) are changing faster than Azure-CLI, so the labs will be easier to maintain if we use Azure-CLI and since the Tessel's programming tools are used from the console, we might as well stick with it as much as possible. The preferred programming language on the server and client side should be JavaScript if possible in order to keep complexity of setup to a minimum.)

### Part 1: Setting up a Docker client
(Text in part one goes here)

### Part 2: Running a Docker host in Azure
(Text in part two goes here)

* (Bullet one)
* (Bullet two)
  * (Bullet two point one)
  * (Bullet two point two)

#### Part 2.1
(Text in part two point one goes here)

#### Part 2.2
(Text in part two point two goes here)

#### Part 3: Deploying a RESTful service in a Docker container.
(Text in part three goes here)

	// Use comments in code only if code is otherwise confusing.
	// We want the code to be as good and clean written that it
	// is self-explanatory and doesn't need comments. Still don't
	// be afraid to use comments if needed.

	code.indent(tab); // Indent code with 4 spaces (or tab) to have it appear as code

#### Part 4: Calling the service from a Tessel.

Summary
-------
During this lab we have seen that with Docker we can containerize our deployments and thus make more efficient use of our cloud resources in Azure. Containerization enables us to run our application components (API's, Sites, Databases etc.) in lightweight isolated runtimes that are very easy to deploy, interconnect and move to wherever whenever we wish. Containerization can be considered the next step in Platform as a Service and with Azure this scenario is fully supported with Linux and in the near future on Windows VM's as well.
