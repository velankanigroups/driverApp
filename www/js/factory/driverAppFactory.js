driverApp.factory('driverAppFactory', function($http) {
	// console.log("entered the factory");
	return {
		callApi : function(para1, para2, para3, callback) {			
			return $http({
				method : para1,
				url : para2,
				data : para3,
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function(data) {
				console.log(">>>>>>>>>> PARAM1"+para1);
				console.log(">>>>>>>>>> PARAM2"+para2);
				console.log(">>>>>>>>>> PARAM3"+JSON.stringify(para3));
				callback(data);
				// console.log(data);
			}).error(function(data,status,config,headers) {
				console.log(">>>>>>>>>> PARAM1"+para1);
				console.log(">>>>>>>>>> PARAM2"+para2);
				console.log(">>>>>>>>>> PARAM3"+JSON.stringify(para3));
				console.log(data);
				console.log(status);
				console.log(headers);
				console.log(config);
				callback(data);				
				/*var respTime = new Date().getTime() - startTime;
				console.log(respTime,headers.timeout);
				if(respTime >= headers.timeout){
            		//time out handeling
            		alert("server timeout");
		        } else{
		            //other error hanndling
		        }*/
   			});
		}
	};

});
