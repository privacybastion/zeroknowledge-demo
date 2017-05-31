# Zero Knowledge

This code-base is the demo for a talk by [Ben Dechrai](https://github.com/bendechrai). The talk synopsis:

> We've all read the news; we're being surveilled as a massive level. Governments are indiscriminately collecting data, and storing it for years. Even if we trust our governments, this creates a honey-pot of information that criminals would love to get their hands on.
> 
> SSL certificates and encryption are important for data transport, and yet even some of the bigger companies don't get it right. Encryption is hard, and it's not end-user friendly, but the tide is changing.
> 
> What if your business needs to work with the data? End-to-end encryption between users isn't an option. How can we increase security and privacy, when we need to see our users' data? The principle of datensparsamkeit, to store only what you absolutely need, is still subject to concern if there's a data breach.
> 
> This talk discusses the options for end-to-end communications encryption in web applications, as well as ways of securely and anonymously handling and distributing sensitive information between users, without allowing the raw data to give anything away.

## Tech

There are two sites here; a profile server and a transaction server. Each is a standalone Laravel application, and can be run simply by running `php artisan serve` in each.

For a better demo experience, rather than running each on http://127.0.0.1:xxxx/, you might like to add two entries in to your hosts file, such as http://profile.example:xxxx/ and http://transaction.example:yyyy/. You could go a step further and run a local web server in order to get rid of the port numbers.