//set packages to use
var request = require('request');
var fs=require('fs');

// Set the headers
var headers = {
    };

// Configure the ticket request
var options = {
    url: 'http://sasbap.demo.sas.com/SASLogon/v1/tickets',
    method: 'POST',
    headers: headers,
    body:'username=sasdemo&password=Orion123'
    };

// Start the ticket request
request(options, function (error, response, body) {
    //console.log(response.statusCode+' '+response.reason);
    //console.log(JSON.stringify(response));
    if (!error && response.statusCode == 201) {
        // Print out the response body
        console.log(response.headers.location);
        //gather the ticket
        var ticket = response.headers.location.substring(response.headers.location.indexOf('tickets/')+8);
    	console.log(ticket);
		//use the ticket to get authorization ticket
 		request({
			url: 'http://sasbap.demo.sas.com/SASLogon/v1/tickets/'+ticket,
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'text/plain'},
			body: 'service=http%3A%2F%2Fsasbap.demo.sas.com%2FSASFactoryMinerServices%2Frest'
			//would like to use this URL to get real_ticket
			//body: 'service=http%3A%2F%2Fsasbap.demo.sas.com%2FSASFactoryMinerServices%2Frest%2Fprojects'

			}, function (error, response, body) {
				console.log(response.headers);
				console.log(body);
				var real_ticket=body;

				//call segmentSummaryReport to get variable frequency and segment status data
				request({
					url: 'http://sasbap.demo.sas.com/SASFactoryMinerServices/rest/?ticket='+real_ticket,
					method: 'GET',
					headers: {'Accept':  'application/vnd.sas.collection+json'},
					}, function (error, response, body) {
					   //console.log(response.headers);
					   //console.log(body);
				       var response_body=JSON.parse(body);
				       var data=response_body.items[0].data;
				       //console.log(data);
				       var output='';
				       for(var i=0;i<data.length;i++)
				       {
						output+=data[i].dataMap.name+','+data[i].dataMap.count+'\r\n';
						}
						console.log(output);

						//fs.writeFile("./test.csv", output, function(err) {
						//    if(err) {
						//        return console.log(err);
						//    }
//
						//    console.log("The file was saved!");
						//});
				    });
			}
		);
 	}
});



