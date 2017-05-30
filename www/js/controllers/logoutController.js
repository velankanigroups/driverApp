driverApp.controller('logoutController', function($rootScope,$scope, $http, $cordovaSQLite, $state, $interval, $ionicPopup,$window) {
	chkImei();
	var confirmPopup = $ionicPopup.confirm({
        title: 'Logout',
        template: 'Are you sure?'
     });
	
     confirmPopup.then(function(res) {
        if(res) {
           console.log('Sure!');
           $scope.user = {};
       	$scope.user.token = localStorage.getItem("token");
       	$scope.user.imei = imeiNumber;
       	//alert(JSON.stringify($scope.user));
           $http({
             method  : 'POST',		  
             url     : apiURL+'driver/app/logout',
       	  data    : JSON.stringify($scope.user), 
       	  headers : { 'Content-Type': 'application/json' }
            })
       	  .success(function(data) {		  
       		  	  if (angular.isDefined($rootScope.callEventsAPI)) {
       					$interval.cancel($rootScope.callEventsAPI);
       				}
       		        var query = "DELETE FROM Token WHERE token = (?)";
       		        $cordovaSQLite.execute(db, query, [token]).then(function(res) {
       		            //alert("Delete in DB -> " + JSON.stringify(res));
       		            //alert("Token Deleted");
       		        }, function (err) {
       		            //alert(err);
       		        }); 
       		       
       		        var query_eventdelete = "DELETE FROM EventNotification";
       		        $cordovaSQLite.execute(db, query_eventdelete, []).then(function(res) {
       		            //alert("Deleted all data in Notification -> " + JSON.stringify(res));
       		            //alert("Token Deleted");
       		        }, function (err) {
       		            //alert(err);
       		        });
       		        
       		        var query_delete_eventcount = "DELETE FROM EventNotification_Count";
       		        $cordovaSQLite.execute(db, query_delete_eventcount, []).then(function(res) {
       		            //alert("Deleted all data in Notification -> " + JSON.stringify(res));
       		            //alert("Token Deleted");
       		        }, function (err) {
       		            //alert(err);
       		        });
       		        var query_tripdelete = "DELETE FROM TripNotification";
       		        $cordovaSQLite.execute(db, query_tripdelete, []).then(function(res) {
       		            //alert("Deleted all data in Notification -> " + JSON.stringify(res));
       		            //alert("Token Deleted");
       		        }, function (err) {
       		            //alert(err);
       		        });
       		        
       		        var query_delete_tripcount = "DELETE FROM TripNotification_Count";
       		        $cordovaSQLite.execute(db, query_delete_tripcount, []).then(function(res) {
       		            //alert("Deleted all data in Notification -> " + JSON.stringify(res));
       		            //alert("Token Deleted");
       		        }, function (err) {
       		            //alert(err);
       		        });
	       		   var query_delete_Ongoing = "DELETE FROM onGoingTrip";
	    		        $cordovaSQLite.execute(db, query_delete_Ongoing, []).then(function(res) {
	    		            //alert("Deleted all data in Notification -> " + JSON.stringify(res));
	    		            //alert("Token Deleted");
	    		        }, function (err) {
	    		            //alert(err);
	    		        });
       	        $state.go('login');	  
             })
             .error(function(data, status, headers, config) {
           	  //alert("Logout err -> " + JSON.stringify(data));
              console.log(JSON.stringify(data));
           	  console.log(status);
           	  console.log(headers);
           	  console.log(config);
       	  });
        } else {
           console.log('Not sure!');
           $window.history.go(-1);       
        }
     });
     function chkImei(){
 		console.log("==========================>>>>>>>>>>>>>>> IMEI Operation <<<<<<<<<<<<<<================================================");
 		//alert("check IMEI");
 		  /*fetch the IMEI stored while loading*/
 		  var query ="SELECT * FROM Device_IMEI";
 		  $cordovaSQLite.execute(db, query, []).then(function(res) {
 			  //console.log(res);
 			  //console.log(JSON.stringify(res));
 			  imeiNumber =res.rows.item(0).imei;
 			 //alert(imeiNumber);
 		  },function(err){
 			  console.log(err);
 		  });  
 	}
});