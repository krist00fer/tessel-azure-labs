Uploading structured data to Azure Table Storage
================================================
Microsoft Azure provides several services that makes great sense to use directly from your Tessel device. Creating custom APIs using Mobile Services, Azure Websites or Virtual Machines might be the first you think about, but several other services could be used on their own or together with those custom APIs. Azure Table Storage is a NoSQL Database hosted in Azure for you, designed to handle massive ammount of structured data and load. If storing structured data is what you are looking to do, then you should definitively consider Azure Table Storage and this lab will give you a taste of it.

Prerequisites
-------------
In order to successfully complete this lab you need to:

* Have successfully setup your Azure Subscription, your development environment and your Tessel according to instructions outlined in the [Setup Lab](../_setup).
* Optional: It's not necessary but the lab [Creating and Calling a Custom REST API with Azure Mobile Services](../mobile-services) will provide additional information about how you can create and host a custom RESTful Web API on Azure Mobile Services. Doing that lab before this one might be beneficial.

Instructions
------------
Azure Table is one of the services in the overall service called Azure Storage. By default Azure Table is secured and you can't access it without the storage account name and key. The storage account name should be considered public knowledge, but the storage account key should be handled with extreme care and is something you shouldn't share with any external clients. If you do get your hand on a valid storage account name and key you are in fact administrator of that storage account and can create, ready, update and delete tables and data stored in the tables. In fact since you with those credential have full administrative rights to the storage account you can also execute requests against the other services included in Azure Storage, such as Blobs, Queues and Files. So handing out the storage account key to any client that are not under your direct control is an extremely important “Anti Pattern” (something you shouldn’t do) to know about.

So if we shouldn’t give away the storage account key, how can we then have external clients access services within a Storage Account?

The good news is that you can use a technique that is called: [Shared Access Signature, SAS](http://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-shared-access-signature-part-1/). With SAS you can give out temporary usage rights to different resources in a Storage Account for example, you can generate a SAS that gives a client temporary rights to create, read, update or delete data in a specific table in Azure Tables. Sounds all good, right? The problem here is that you need the storage account name and key in order to generate the SAS, hence it has to be generated at a safe and controlled location such as in a service controlled by you.






Using platform services like Azure Table Storage directly from any type of client might give you some advantages, but it's important that you understand how they work and what the benefits and drawbacks are. For example:

* Using Azure Table Storage directly from the clients will offload any other frontend server you might use and/or have implemented, since the traffic does no longer have to go through those services, but directly to the native Azure services. Hence you don't have to scale your other services to take that load. On the other hand: even if Azure Table Storage scales automatically to handle the load you put on it, it does have limits and if you reach those limits (i.e. there is a limit of incomming data and API calls per storage account in Microsoft Azure) you might have a more complex solution at hand where you have to manually scale out across several storage accounts


Targeting services like Azure Table Storage directly from a client (or device) gives you both some pros and some cons. It is important that you understand them both in order to create the optimal service:

Pros:

* Off loads any other service you might use or have implemented
* Built in authentication
* Simple and easy to use API allready in place
* Scalable and managed backend provided as a service

Cons:

* 




### Part 1
(Text in part one goes here)

### Part 2
(Text in part two goes here)

* (Bullet one)
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
