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


    request(options, function (error, response, body){
        //console.log(response.statusCode+' '+response.reason);
        //console.log(JSON.stringify(response));
        if (!error && response.statusCode == 201)
        {

            // Print out the response body
            console.log(response.headers.location);
            var ticket = response.headers.location.substring(response.headers.location.indexOf('tickets/')+8);
        	console.log(ticket);

    		//use the ticket to get authorization ticket
     		request({
    			url: 'http://sasbap.demo.sas.com/SASLogon/v1/tickets/'+ticket,
    			method: 'POST',
    			headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'text/plain'},
    			//body: 'service=http%3A%2F%2Fsasbap.demo.sas.com%2FSASFactoryMinerServices%2Frest%2Fprojects%2Fff8080814f99c510014fb83e6e466ef0%2FsegmentSummaryReports'
    			body: 'service=http%3A%2F%2Fsasbap.demo.sas.com%2FSASMicroAnalyticServuce%2Frest%2Fmodules'
       					  },
    			function (error, response, body)
    				{
    				console.log(response.headers);
    				console.log(body);
				var real_ticket=body;

				//parse project id
					request({
						url: 'http://sasbap.demo.sas.com/SASMicroAnalyticsService/rest/projects?ticket='+real_ticket,
						method: 'GET',
						headers: {'Accept':  'application/vnd.sas.collection+json'},
						}, function (error, response, body)
							{
						   console.log(response.headers);
						   //console.log(body);
						   var response_project=JSON.parse(body);
							//var project_response_list=response_project.items;
						    //var project_list='';
						    //Create a list of all the projects in the sytem and their details
						   //for(var i=0;i<project_response_list.length;i++) {
							//+=i+','+project_response_list[i].id+','+project_response_list[i].memberName+','+project_response_list[i].displayName+','+project_response_list[i].createdTimestamp+'\r\n';
							}

							// //enter your search project
							// var project_search=process.argv[2];
							// //var project_search='NYC_POC1';
							// //search for the projectid for the selected project
							// var number = '';
							// for(var i=0;i<project_response_list.length;i++){
							// 	if(project_response_list[i].displayName == project_search)
							// 		{ number =i;}
							// 	//console.log(number);
							//}
							// var search_project_id = project_response_list[number].id;
							// //return project id for desired project to be entered into the next call
							// console.log(search_project_id);
					);
				});
	}
});
