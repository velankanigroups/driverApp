/*
On Going trips screen is rendered in this js file
*/
driverApp.controller('onGoingController', function($scope,$rootScope,$ionicPopup,$ionicPlatform,$state,$cordovaSQLite,$cordovaGeolocation,$interval,driverAppFactory,driverAppService) {
	var deregisterFirst = $ionicPlatform.registerBackButtonAction(
		      function() {
		    	  //alert("Back Disabled");
				  ionic.Platform.exitApp();
		      }, 100
		    );
	//$scope.$on('$destroy', deregisterFirst);
	
	$ionicPlatform.registerBackButtonAction(function(event) {
		 console.log("yourcheckhere1");
			if (true) { 
				console.log("yourcheckhere2");
			  $ionicPopup.confirm({
				title: 'System warning',
				template: 'are you sure you want to exit?'
			  }).then(function(res) {
				  console.log("yourcheckhere3");
				if (res) {
					console.log("yourcheckhere4");
				  ionic.Platform.exitApp();
				}
			  })
			}
   }, 100);
	
	var onGoingMap;	
	$interval.cancel($rootScope.listTrip);
	$scope.myLocation={};
	$scope.tripData = {};
	$scope.tripNotOngoing=true;
	//$scope.tripData = {"status":"R","trip_id":"TN70AD1011_1485945663002", "ts":"1485926693907","td_start_point":{"lat":"12.850128","long":"77.660008"},"td_end_point":{"lat":"13.198635","long":"77.706593"}};
	
	  $scope.select = function() {
        var query = "SELECT tripData FROM onGoingTrip";
        $cordovaSQLite.execute(db, query).then(function(res) {
            if(res.rows.length > 0) {
				var temp = {};
				
				temp = res.rows.item(0).tripData;
				$scope.tripData = angular.fromJson(temp);
                console.log("SELECTED -> " +  $scope.tripData);
                console.log("SELECTEDddd -> " +  res.rows.item(0));
				
                $scope.tripNotOngoing=false;
				$scope.initOnGoingMap();
				
            } else {
            	$scope.tripNotOngoing=true;
                console.log("No results found"+JSON.stringify(res));
            }
        }, function (err) {
            console.error(err);
        });
    }
	  
	var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
	  
	  function routeService(source,destination){
		  
		var request = {
            origin : source,
            destination : destination,
			//provideRouteAlternatives: true,
            travelMode : google.maps.TravelMode.DRIVING
        };
       directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
		if (directionsDisplay != null) {
			directionsDisplay.setMap(null);
			directionsDisplay.setMap(onGoingMap);
		}else{
			directionsDisplay.setMap(onGoingMap);
		}
		  
        //directionsDisplay.setMap(onGoingMap);
	};
	
	/******************************/	  
function update(){
	console.log("inside update");
	
	var query = "SELECT tripData FROM onGoingTrip";
        $cordovaSQLite.execute(db, query).then(function(res) {
            if(res.rows.length > 0) {
				var temp = {};
				console.log("inside select");
				temp = res.rows.item(0).tripData;
				$scope.tripData = angular.fromJson(temp);
				$scope.tripData.status = "D";
				var jts = JSON.stringify($scope.tripData);
                var updateQuery = "UPDATE onGoingTrip SET tripData = '"+jts+"'";
				$cordovaSQLite.execute(db, updateQuery).then(function(res) {
					console.log("inside update query");
           		 if(res) {
				
					console.log("updated" + res);
					 //alert("updated "+res);
				   } else {
            			alert("Not Updated"+JSON.stringify(res));
            		}
       			}, function (err) {
            		console.error(err);
      			   });
				
               
				
            } else {
            	$scope.tripNotOngoing=true;
                console.log("No results found"+JSON.stringify(res));
            }
        }, function (err) {
            console.error(err);
        });
		
}/***********************/
	$scope.initOnGoingMap=function(){
		
		/***************************************************************************/
		
		/***************************************************************************/
		//$scope.tripData=driverAppService.getData();
		
		if($scope.tripData.status=="D"){
			$scope.start="active";
  			$scope.drop="active";
  			$scope.button = "END TRIP";
  			$scope.dropCustomer=false;
  			$scope.endTrip=true;
  			$scope.case="active";
			$scope.destination = new google.maps.LatLng($scope.tripData.td_end_point.lat,$scope.tripData.td_end_point.long);
    		$scope.source = new google.maps.LatLng($scope.tripData.td_destination.lat,$scope.tripData.td_destination.long);
		}
		else if($scope.tripData.status=="R"){
			
			console.log("trip_data m kuchh gadbad hai");
			$scope.dropCustomer=true;
			$scope.endTrip=false;
			$scope.button = "DROP PASSENGER";
			
			//$scope.tripData=driverAppService.getData();
			$scope.source = new google.maps.LatLng($scope.tripData.td_start_point.lat,$scope.tripData.td_start_point.long);
    		$scope.destination = new google.maps.LatLng($scope.tripData.td_destination.lat,$scope.tripData.td_destination.long);
		}
		
		console.log("my destination "+$scope.source+"  "+$scope.destination)
		onGoingMap = new google.maps.Map(document.getElementById('onGoingMap'), {
			zoom : 10,
			center : {
				lat : $scope.tripData.td_start_point.lat,
				lng : $scope.tripData.td_start_point.long
			}
		});	
		//current location marked
		var marker = new google.maps.Marker({
          position: $scope.source,
          map: onGoingMap,
        });
		
		routeService($scope.source,$scope.destination);
        
        /*******************************Route Service**************************************/
    	
		//adding watch option to locate the device.................................................
		
		var watchOptions = {
    	    	timeout : 1000,
   			    enableHighAccuracy: false // may cause errors if true
  			};
		
		
		var watch = $cordovaGeolocation.watchPosition(watchOptions);
			watch.then(
				 null,
			 function(err) {
				 console.log(err);
			 },
			function(position) {
				$scope.getlocationParam();
				
				setMarkerPosition(marker);
				 var lat  = position.coords.latitude
				 var long = position.coords.longitude
				 console.log("lat : "+lat+" long : "+long);
		});
		$scope.getCurrentLocation();
	};	
	
	
	
	/***********************************************ngoint function ends*****************************************************************/	
	//location marker...........................
	 function setMarkerPosition(marker) {
           marker.setPosition(
                        new google.maps.LatLng(
                           $scope.myLocation.lt,
                            $scope.myLocation.lg)

                    );
       };
		
		
	$scope.getCurrentLocation=function(){
				var options = {
				  enableHighAccuracy: true,
				  timeout: 5000,
				  maximumAge: 0
				};
				function success(pos) {
				  var crd = pos.coords;
				  console.log('Your current position is:');
				  console.log(`Latitude : ${crd.latitude}`);
				  console.log(`Longitude: ${crd.longitude}`);
				  console.log(`More or less ${crd.accuracy} meters.`);
				  $scope.myLocation.lt=crd.latitude;
				  $scope.myLocation.lg= crd.longitude;
				};
				function error(err) {
				  console.warn(`ERROR(${err.code}): ${err.message}`);
				  
				};
		navigator.geolocation.getCurrentPosition(success, error, options);		
	};
	
	
	
	/***********************************************************************************************************/
	$scope.getlocationParam=function(){
		$scope.getCurrentLocation(function(result){
			console.log(result);
			if(result!="0"){new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				$scope.myLocation.lt=result.coords.latitude;
				$scope.myLocation.lg=result.coords.longitude;
			}
		});
	};
	$scope.dropedCustomer=function(){		
		$scope.getlocationParam();
		//$scope.select();
		$scope.dropCustomerJson={};
		$scope.dropCustomerJson.token=localStorage.getItem("token");		
		$scope.dropCustomerJson.trip_id=$scope.tripData.trip_id;
		$scope.dropCustomerJson.lat=$scope.myLocation.lt;
		$scope.dropCustomerJson.long=$scope.myLocation.lg;
		$scope.dropCustomerJson.ts=new Date().getTime();			
		driverAppFactory.callApi("POST",apiURL+"driver/app/trip_drop",$scope.dropCustomerJson,function(result){
  		console.log(JSON.stringify(result));  
  		if(result.status=="Dropped at Destination"){
  			var alertPopup = $ionicPopup.alert({
			       title: 'Notification Details',
		    	   template: result.status
		     		});
		     		alertPopup.then(function(res) {
		     			console.log('Success');
		     			update();
		      			$scope.start="active";
		      			$scope.drop="active";
		      			$scope.button = "END TRIP";
		    			$scope.tripData.status = "D";
		      			$scope.dropCustomer=false;
		      			$scope.endTrip=true;
		      			$scope.case="active";
		    			$scope.destination = new google.maps.LatLng($scope.tripData.td_end_point.lat,$scope.tripData.td_end_point.long);
		        		$scope.source = new google.maps.LatLng($scope.tripData.td_destination.lat,$scope.tripData.td_destination.long);
		    			routeService($scope.source,$scope.destination);
		     	});
  		}
  		else{  			
  			var resp_len=result.length;
  			console.log(JSON.stringify(result));
  				for(var i=0;i<resp_len;i++){
  					if(result[i].param=='lat' || result[i].param=='long'){
  						driverAppService.showIonicAlert('Geo Location','<label>Could\'nt get your Location</label><br><b>Please try again !...</b>');
  						break;
  					}  					
  				}
  			} 
		});	
	};	
	$scope.doEndTrip=function(){
		$scope.getlocationParam();
		$scope.endTripJson={};
		$scope.endTripJson.token=localStorage.getItem("token");		
		$scope.endTripJson.trip_id=$scope.tripData.trip_id;
		$scope.endTripJson.lat=$scope.myLocation.lt;
		$scope.endTripJson.long=$scope.myLocation.lg;
		$scope.endTripJson.ts=new Date().getTime();			
		driverAppFactory.callApi("POST",apiURL+"driver/app/trip_end",$scope.endTripJson,function(result){
  		console.log(JSON.stringify(result));  
  		if(result.status=="Trip Completed"){
			$scope.end="active";
  			//alert(result.status);  
			var query_eventdelete = "DELETE FROM onGoingTrip";
       		        $cordovaSQLite.execute(db, query_eventdelete, []).then(function(res) {
       		            //alert("Deleted all data in Notification -> " + JSON.stringify(res));
       		            //alert("Token Deleted");
       		     	var alertPopup = $ionicPopup.alert({
     			       title: 'Notification Details',
     		    	   template: result.status
       		     		});
       		     		alertPopup.then(function(res) {
       		     			console.log('Success');
       		     		$rootScope.ongoingStatus=false;
       		     		$state.go('app.scheduled'); 
       		     		});
       		        }, function (err) {
       		            //alert(err);
       		  });
			
  		}
  		else{
  			var resp_len=result.length;
				for(var i=0;i<resp_len;i++){
					if(result[i].param=='lat' || result[i].param=='long'){
						driverAppService.showIonicAlert('Geo Location','<label>Could\'nt get your Location</label><br><b>Please try again !...</b>');
						break;
					}  					
				}
  		}			
  		}); 	
	}
	$scope.centerOnMe = function() {
	    if(!$scope.onGoingMap) {
			console.log("my location");
	      return;
			
	    }
			$scope.loading = $ionicLoading.show({
	      content: 'Getting current location...',
	      showBackdrop: false
	    });

	    navigator.geolocation.getCurrentPosition(function(pos) {
	      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
	      $scope.loading.hide();
	    }, function(error) {
	      $window.alert('Unable to get location: ' + error.message);
	    });
	  };
		/****************************************************************************************/
		$scope.dummyFunction = function(){
			if($scope.button=="END TRIP"){
				$scope.doEndTrip();
			
			}else{
				$scope.dropedCustomer();
			}
		
		
		};
});