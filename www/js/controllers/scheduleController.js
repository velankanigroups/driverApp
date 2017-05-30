/*
* Driver App Scheduled Trips Screen gets rendered using this js file
>> api call driver/app/tripl_list ,list the latest trips
>> basic function	
		a)toggleTripInfo and isTripShown (show/hide single dropdown(with +,- symbol) at a time)
		b)showStatus calls a service which renders the trip status
		c)to show time getDateTime method calls the service for showing the formatted time
*/
driverApp.controller('scheduledController', function($rootScope,$scope,$rootScope,$cordovaSQLite,$ionicPopup,$ionicPlatform,$state,$interval,driverAppFactory,driverAppService) {
  	//console.log(token);
	var windowHeight=(window.screen.availHeight-200);
	windowHeight=windowHeight+"px";
	$scope.availableScroller={
			"height":windowHeight
	}
	$scope.trip_status="S";
	var deregisterFirst = $ionicPlatform.registerBackButtonAction(
		      function() {
		    	  //alert("Back Disabled");
				  ionic.Platform.exitApp();
		      }, 100
		    );
	
	
	
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
	
	//$scope.$on('$destroy', deregisterFirst);
	$scope.notrips=false;
	$rootScope.completedTripCount=0;
	/**-----------------------------------------------------------------------------------------------------------------------------
	 * 
	 * 														list trips
	 * 
	 * -----------------------------------------------------------------------------------------------------------------------------*/
	$scope.$on('triplist',function(event,args){
		$scope.listTrips();
	});
	$scope.listTrips=function(){
		//alert("list trips");
		$scope.triplistJson={}
	    $scope.triplistJson.token=window.localStorage.getItem("token");
	    $scope.s_token=$scope.triplistJson.token;
	    console.log(JSON.stringify($scope.triplistJson));
	    /**
	    	list trip
	    */
	  	driverAppFactory.callApi("POST",apiURL+"driver/app/trip_list",$scope.triplistJson,function(result){
	  		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
	  		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Trip List<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
	  		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
	  		console.log(JSON.stringify(result));
	  		if(result.err!="Invalid User"){
	  			if(result.msg!="trip list is empty"){
	  				$scope.notrips=false;
	  				$scope.displayScheduled=result.list;
	  	  	  		//console.log($scope.displayScheduled);
	  	  	  		for(var i=0;i<result.list.length;i++){
	  	  	  			if(result.list[i].status=="R" || result.list[i].status=="D"){
	  	  	  				$rootScope.ongoingStatus=true;
	  	  	  				driverAppService.saveData(result.list[i]);  
	  	  	  				console.log("Ongoing Trip");
	  	  	  				$scope.verifyTrip(result.list[i]);
	  	  	  			}
	  	  	  			if(result.list[i].status=="F"){
	  	  	  				$rootScope.completedTripCount++;
	  	  	  			}
	  	  	  		}
	  			}
	  			else{
	  				$scope.notrips=true;
	  			}
	  		}
	  	});	
	  	 $rootScope.listTrip=$interval(function(){
	     	$scope.listTrips();
	     },15*60*1000); 
	}
	/**-----------------------------------------------------
	 * 													Verfiy and Redirect to On Going Trip	
	 * 																		----------------------------------------------------*/
	$scope.verifyTrip=function(tripDetail){
		console.log(JSON.stringify(tripDetail));
		  var query = "SELECT tripData FROM onGoingTrip";
	        $cordovaSQLite.execute(db, query).then(function(res) {
	            if(res.rows.length > 0) {
	            	console.log("Data Available");
					//$state.go('app.ongoing');
	            } else {
	            	$interval.cancel($scope.listTrip);
	            	console.log("Data NOT Available");
	            	var query_insert = "INSERT INTO onGoingTrip(tripid,tripData) VALUES (?,?)";
	       		  	console.log(JSON.stringify(tripDetail));
	       		  	var temp =JSON.stringify(tripDetail);
	       	        $cordovaSQLite.execute(db, query_insert, [tripDetail.trip_id,temp]).then(function(res) {
	       	          //  alert("INSERTED>>>>>>"+JSON.stringify(res)+JSON.stringify(trip));
	       	         $state.go('app.ongoing'); 
	       	        }, function (err) {
	       	            alert("Insert Token in DB err -> " + JSON.stringify(err));
	       	        });	            		                
	            }
	        }, function (err) {
	            console.error(err);
	        });
	}
  	/*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleTripInfo = function(trip) {
    if ($scope.isTripShown(trip)) {
      $scope.shownTrip = null;
    } else {
      $scope.shownTrip = trip;
    }
  };
  $scope.isTripShown = function(trip) {
    return $scope.shownTrip === trip;
  };
  /*============================================>>>>>>>>>>>>>>>>Basic Service Usages point<<<<<==================================================*/
  $scope.showStatus=function(status_code){  	
  	return driverAppService.showStatus(status_code);
  }
  $scope.getDateTime=function(ts){
  	return driverAppService.getDateTime(ts);
  }
  $scope.getTimeService=function(ts){
	  return driverAppService.getTime(ts);
  }
  $scope.getAddressService=function(lt,lg){
	  driverAppService.giveAddress(lt,lg,function(addressValue){
		  return addressValue;  
	  })
  }
  $scope.startTrip=function(trip){        
    $scope.startTripJson={};
    $scope.startTripJson.token=localStorage.getItem("token");
    $scope.startTripJson.trip_id=trip.trip_id;
    $scope.startTripJson.lat=myPlace.lat;
    $scope.startTripJson.long=myPlace.lng;
    $scope.startTripJson.ts=driverAppService.getCurrentTimeStamp();    
     driverAppFactory.callApi("POST",apiURL+"driver/app/trip_start",$scope.startTripJson,function(result){
    	console.log(result);
      if(result.status=="Trip Started"){       
    	  var query_insert = "INSERT INTO onGoingTrip(tripid,tripData) VALUES (?,?)";
		  console.log(JSON.stringify(trip));
		  	trip.status="R";
		  console.log("i have something in me "+JSON.stringify(trip));
		  var temp =JSON.stringify(trip);
	        $cordovaSQLite.execute(db, query_insert, [trip.trip_id,temp]).then(function(res) {
	          //  alert("INSERTED>>>>>>"+JSON.stringify(res)+JSON.stringify(trip));
	        	console.log("INSERTED>>>>>>");
	        }, function (err) {
	            alert("Insert Token in DB err -> " + JSON.stringify(err));
	        });
		  trip.status="R";
	    driverAppService.saveData(trip);
	    $interval.cancel($scope.listTrip);
        $state.go('app.ongoing');  
      }
      else if(result.err=="Some Trip Already Running"){
    	  var alertPopup = $ionicPopup.alert({
		       title: 'Notification Details',
	    	   template: '<b>Some Trip is not completed yet</b>'
	   });
	     alertPopup.then(function(res) {
	          console.log('Success');
	   });
      }      
    });    
  }
});
