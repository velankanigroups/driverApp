angular.module('starter.controllers',['ionic'])
.controller('AppCtrl', function($ionicPlatform,$scope,$rootScope,$ionicModal,$ionicPopup,$cordovaSQLite,$timeout,$interval,$state,driverAppFactory,driverAppService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
	/*Driver Detail*/
	$scope.driverInfoJson={};
	$scope.driverInfoJson.token=localStorage.getItem("token");
	console.log(JSON.stringify($scope.driverInfoJson));
	driverAppFactory.callApi("POST",apiURL+"driver/info",$scope.driverInfoJson,function(result){
		console.log(">>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
		console.log(JSON.stringify(result));
		console.log(">>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
		if(result!=null){
			if(!result.hasOwnProperty("err")){
				$scope.driverInfo=result;
			}
		}
		else{
			var alertPopup = $ionicPopup.alert({
			       title: 'Notification Details',
		    	   template: 'Connectivity Problem!..'
		   });
		     alertPopup.then(function(res) {
		          console.log('Success');
		          ionic.Platform.exitApp();
		   });
		}
		
			
	});
	$scope.tripNotifyLength=0;
	$scope.eventNotifyLength=0;
	$scope.eventNotificationsAvailable=false;
	$scope.tripNotificationsAvailable=false;
	var showTripLength;
	var showEventLength;
	$rootScope.callEventsAPI;
	/*
	 * Interval function calling every 10 secs the rt_events api for notification iniside app
	 * for alarm data 
	 * 		a)eventInsertRecursive,callEventInsertFunction 
	 * 		b)fetchEventTable
	 * 		c)fetchEventCountTable
	 * 		c)fetchEventCountTableUpdate
	 * for trip data
	 * 		a)tripInsertRecursive,callTripInsertFunction 
	 * 		b)fetchTripTable
	 * 		c)fetchTripCountTable
	 * 		c)fetchTripCountTableUpdate*/
	$rootScope.callEventsAPI=$interval(function(){
		tripEventNotification();
		},10*1000);
		function tripEventNotification(){
			$scope.driverEventsJson={};
			$scope.driverEventsJson.token=localStorage.getItem("token");			       
			driverAppFactory.callApi("POST",apiURL+"driver/app/rt_events",$scope.driverEventsJson,function(result){
				//console.log(JSON.stringify(result));
				if(result.err!="Invalid User"){
					if(result.alarm_data.length>0){
						$scope.eventNotificationsAvailable=true;
						showEventLength=result.alarm_data.length;
						//$scope.eventsForNow=result.alarm_data.sort(driverAppService.SortByTs);
						event_Data=result.alarm_data.sort(driverAppService.SortByTs)
						console.log(JSON.stringify(event_Data));
						var j=0;
						eventInsertRecursive();
						function eventInsertRecursive(){
							if(j>=event_Data.length){
								return;
							}
							executeEventNotification(event_Data[j].devid,event_Data[j].lat,event_Data[j].long,event_Data[j].ts,event_Data[j].alarm_type,event_Data[j].velocity,event_Data[j].volt,event_Data[j].vehicle_model,event_Data[j].vehicle_num,function(eventDetails){
								callEventInsertFunction(eventDetails,function(){
									j++;
									eventInsertRecursive();
									fetchEventTable();
								})	
							})
						}
						function executeEventNotification(devid,lat,long,ts,alarm_type,velocity,volt,vehicle_model,vehicle_num,objEventDetails){
							var query = "SELECT id FROM EventNotification";
					        $cordovaSQLite.execute(db, query, []).then(function(res) {
					        	var row_length = res.rows.length;
					        	var eventDetails = {};
					        	eventDetails.devid=devid;
					        	eventDetails.lat=lat;
					        	eventDetails.long=long;
					        	eventDetails.ts=ts;
					        	eventDetails.alarm_type=alarm_type;
					        	eventDetails.velocity=velocity;
					        	eventDetails.volt=volt;
					        	eventDetails.vehicle_model=vehicle_model;
					        	eventDetails.vehicle_num=vehicle_num;
					        	eventDetails.row_length=row_length;
					        	objEventDetails(eventDetails);	   
					    }, function (err) {
					    	console.log(err);
					       });      		
						}
						fetchEventCountTableUpdate();
					}
					else{
						console.log("NO ALARM");
						fetchEventTable();
						fetchTripCountTable();
					}
					if(result.trips.length>0){
						$scope.tripNotificationsAvailable=true;					
						showTripLength=result.trips.length;
						trip_Data=result.trips.sort(driverAppService.SortByts);
						console.log(trip_Data);
						var i=0;
						tripInsertRecursive();
						function tripInsertRecursive(){			
							if(i>=trip_Data.length){
					  		return;
							}
							var html = "<table><thead><tr><td>Customer Name</td><td>Contact</td></tr></thead>";
						    for (var custInc = 0; custInc < trip_Data[i].customers.length; custInc++) {
						        html+="<tr>";
						        html+="<td>"+trip_Data[i].customers[custInc].name+"</td>";
						        html+="<td>"+trip_Data[i].customers[custInc].cn+"</td>";        
						        html+="</tr>";
						    }
						    html+="</table>";
						    trip_Data[i].customers=html	
						    executeTripNotification(trip_Data[i].trip_id,trip_Data[i].trip_name,trip_Data[i].status,trip_Data[i].customers,trip_Data[i].td_end_point.name,trip_Data[i].td_end_point.lat,trip_Data[i].td_end_point.long,trip_Data[i].td_end_point.ts,trip_Data[i].td_start_point.name,trip_Data[i].td_start_point.lat,trip_Data[i].td_start_point.long,trip_Data[i].td_start_point.ts, function(tripDetails){
							callTripInsertFunction(tripDetails, function(){
								i++;
								tripInsertRecursive();
								fetchTripTable();
							});
					  	});
					  	}
						function executeTripNotification(trip_id,trip_name,trip_status,customers,td_end_point_name,td_end_point_lat,td_end_point_long,td_end_point_ts,td_start_point_name,td_start_point_lat,td_start_point_long,td_start_point_ts, objTripDetails){
					        var query = "SELECT id FROM TripNotification";
					        $cordovaSQLite.execute(db, query, []).then(function(res) {
					        	var row_length = res.rows.length;
					        	var tripDetails = {};
					        	tripDetails.trip_id=trip_id;
					            tripDetails.trip_name=trip_name;
					            tripDetails.status =trip_status;
					            tripDetails.customers =customers;
					            tripDetails.td_end_point_name =td_end_point_name;
					            tripDetails.td_end_point_lat =td_end_point_lat;
					            tripDetails.td_end_point_long =td_end_point_long;
					            tripDetails.td_end_point_ts =td_end_point_ts;
					            tripDetails.td_start_point_name =td_start_point_name;
					            tripDetails.td_start_point_lat =td_start_point_lat;
					            tripDetails.td_start_point_long =td_start_point_long;
					            tripDetails.td_start_point_ts=td_start_point_ts;
					        	tripDetails.row_length = row_length;
					        	objTripDetails(tripDetails);	   
					    }, function (err) {
					    	console.log(err);
					       });      			        
						}
						fetchTripCountTableUpdate();					
					}
					else{					
						console.log("NO TRIPS NOTIFICATION");
						fetchTripTable();
						fetchTripCountTable();
					}
				}
				else{
			    	alert(result.err);
					$interval.cancel($rootScope.callEventsAPI);
			    	clearDB();	
			    	$state.go('login');
				}
			});
		}	
	
	/*=============================================>>>>>>>>>>>>>>>>db calls<<<<<<<<<<<<==============================================*/
		function callEventInsertFunction(eventDetails,callback){
			if(eventDetails.row_length<=4){
				var query_insert = "INSERT INTO EventNotification (devid,lat,long,ts,alarm_type,velocity,volt,vehicle_model,vehicle_num) VALUES (?,?,?,?,?,?,?,?,?)";
		        $cordovaSQLite.execute(db, query_insert, [eventDetails.devid,eventDetails.lat,eventDetails.long,eventDetails.ts,eventDetails.alarm_type,eventDetails.velocity,eventDetails.volt,eventDetails.vehicle_model,eventDetails.vehicle_num]).then(function(res) {
		        	//console.log("INSERTED 1,2,3,4,5>>>>>>" + JSON.stringify(res));
		        	callback();
		        }, function (err) {
		        	//console.log("Insert in DB err 1,2,3,4,5 -> " + JSON.stringify(err));
		        });
			}
			else{
				 var query_select = "SELECT id FROM EventNotification ORDER BY ROWID ASC LIMIT 1";
			        $cordovaSQLite.execute(db, query_select, []).then(function(res) {
			           for(var i = 0; i < res.rows.length; i++) {
			        	   var select_id = res.rows.item(i).id;
			        	   var query_delete = "DELETE FROM EventNotification where id = ?";
			        	   $cordovaSQLite.execute(db, query_delete, [select_id]).then(function(res) {
			        	   //console.log("deleted first id from db" + JSON.stringify(res));
			        	   }, function (err) {
			        		   console.log("deleted first id from db error" + err);
					        });
			           }
			           var query_insert = "INSERT INTO EventNotification (devid,lat,long,ts,alarm_type,velocity,volt,vehicle_model,vehicle_num) VALUES (?,?,?,?,?,?,?,?,?)";
	 		        $cordovaSQLite.execute(db, query_insert, [eventDetails.devid,eventDetails.lat,eventDetails.long,eventDetails.ts,eventDetails.alarm_type,eventDetails.velocity,eventDetails.volt,eventDetails.vehicle_model,eventDetails.vehicle_num]).then(function(res) {
	 		        	//console.log("INSERTED new row after deleting first from db>>>>>>" + JSON.stringify(res));
	 		        	callback();
	 		        }, function (err) {
	 		        	//console.log("INSERTING new row after deleting first from db err2 -> " + JSON.stringify(err));
	 		        });   
			           
			        }, function (err) {
			        	console.log("select first id from db error" + err);
			        });
			}
		}
		//=========== Method for creating final json array to show in UI ============     
	    function fetchEventTable(){
	    	var notify_Db = [];
	        var query = "SELECT * FROM EventNotification";
	        $cordovaSQLite.execute(db, query, []).then(function(res) {
	            if(res.rows.length > 0) {
	            for(var i=0;i<res.rows.length;i++){
	            	//console.log("SELECTED -> " + JSON.stringify(res.rows.item(i)));
	            	notify_Db.push(res.rows.item(i));
	            	//console.log(JSON.stringify(notify_Db));
	            	$scope.notifyEvents = notify_Db;
	            	//console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Notify Events>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+JSON.stringify($scope.notifyEvents));
	            	$scope.eventNotificationsAvailable = true;
					$scope.noEventNotifications = false;
	            }
	            } 
	            else {
	            	$scope.eventNotificationsAvailable = false;
					$scope.noEventNotifications = true;
	            	//console.log("No results found");
	            }
	        }, function (err) {
	        	console.log(JSON.stringify(err));
	        });
	    };
	    
	//=========== Method for getting the notification count from sqlite db if no notification from server============ 	    
	    function fetchEventCountTable(){
	    	var query = "SELECT * FROM EventNotification_Count";
	        $cordovaSQLite.execute(db, query, []).then(function(res) {
	            if(res.rows.length > 0) {
	            for(var i=0;i<res.rows.length;i++){
	            	var select_count = res.rows.item(0).eventnotificationCount;
	            	$scope.eventNotifyLength = select_count;
	            }
	            } else {
	            }
	        }, function (err) {
	        	console.log(JSON.stringify(err));
	        });	
	    }
	    
	//=========== Method for getting the notification count from sqlite db if notification available form server============   
	    function fetchEventCountTableUpdate(){
	    	var query = "SELECT * FROM EventNotification_Count";
	        $cordovaSQLite.execute(db, query, []).then(function(res) {
	            if(res.rows.length > 0) {
	            for(var i=0;i<res.rows.length;i++){
	            	var select_count = res.rows.item(0).eventnotificationCount;
	            	//alert(JSON.stringify(select_count));
	            	var add_select_count = select_count + showEventLength;
	            	//alert(JSON.stringify(add_select_count));
	            	var query_update_length = "UPDATE EventNotification_Count SET eventnotificationCount = "+add_select_count;
	    	        $cordovaSQLite.execute(db, query_update_length, []).then(function(res) {
	    	        	console.log("UPDATED length in db >>>>>>" + JSON.stringify(res));
	    	        }, function (err) {
	    	        	console.log("UPDATE length in DB err  -> " + JSON.stringify(err));
	    	        });
	            }
	            } else {
	            	var query_insert_length = "INSERT INTO EventNotification_Count (eventnotificationCount) VALUES (?)";
	    	        $cordovaSQLite.execute(db, query_insert_length, [showEventLength]).then(function(res) {
	    	        	console.log("INSERTED length in db >>>>>>" + JSON.stringify(res));
	    	        	var query = "SELECT * FROM EventNotification_Count";
	    	        	$cordovaSQLite.execute(db, query, []).then(function(res) {
	    		            if(res.rows.length > 0) {
	    		            for(var i=0;i<res.rows.length;i++){
	    		            	var select_count = res.rows.item(0).eventnotificationCount;
	    		            	$scope.eventNotifyLength = select_count;
	    		            }
	    		           }
	    		        }, function (err) {
	    		        	console.log(JSON.stringify(err));
	    		        });	
	    	        }, function (err) {
	    	        	console.log("Insert length in DB err  -> " + JSON.stringify(err));
	    	        });
	            }
	        }, function (err) {
	        	console.log(JSON.stringify(err));
	        });	  	       
	   }
	   
	  //=========== Deleting notification count from sqlite db ============ 
	    $scope.deleteEventNotificationLength = function(){
	    	$scope.eventNotifyLength = "";
	    	var query_delete = "DELETE FROM EventNotification_Count";
	        $cordovaSQLite.execute(db, query_delete, []).then(function(res) {
	            //alert("Deleted all data in Notification_Count -> " + JSON.stringify(res));
	            //alert("Token Deleted");
	        }, function (err) {
	            //alert(err);
	        });
	    }
		
	    /**      
		  * On click of EventNotification
		  * 1) Show popup modal with details
		*/
		$scope.showEventNotifyPopup = function(event) {
			driverAppService.giveAddress(event.lat,event.long,function(address){
				console.log(JSON.stringify(event));
			     var alertPopup = $ionicPopup.alert({
					       title: 'Notification Details',
				    	   template: 'Event Name :'+driverAppService.getEvent(event.alarm_type)+'<br>Event Location:<br>'+address+'<br> Date & Time:'+driverAppService.getDateTime(event.ts)
				   });
				     alertPopup.then(function(res) {
				          console.log('Success');
				   });
			});
			     		    
	   };

	function callTripInsertFunction(tripDetails,callback){
		if(tripDetails.row_length<=4){
			var query_insert = "INSERT INTO TripNotification (trip_id,trip_name,status,customers,td_end_point_name,td_end_point_lat,td_end_point_long,td_end_point_ts,td_start_point_name,td_start_point_lat,td_start_point_long,td_start_point_ts) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
	        $cordovaSQLite.execute(db, query_insert, [tripDetails.trip_id,tripDetails.trip_name,tripDetails.status,tripDetails.customers,tripDetails.td_end_point_name,tripDetails.td_end_point_lat,tripDetails.td_end_point_long,tripDetails.td_end_point_ts,tripDetails.td_start_point_name,tripDetails.td_start_point_lat,tripDetails.td_start_point_long,tripDetails.td_start_point_ts]).then(function(res) {
	        	//console.log("INSERTED 1,2,3,4,5>>>>>>" + JSON.stringify(res));
	        	callback();
	        }, function (err) {
	        	console.log("Insert in DB err 1,2,3,4,5 -> " + JSON.stringify(err));
	        });
		}
		else{
			 var query_select = "SELECT id FROM TripNotification ORDER BY ROWID ASC LIMIT 1";
		        $cordovaSQLite.execute(db, query_select, []).then(function(res) {
		           for(var i = 0; i < res.rows.length; i++) {
		        	   var select_id = res.rows.item(i).id;
		        	   var query_delete = "DELETE FROM TripNotification where id = ?";
		        	   $cordovaSQLite.execute(db, query_delete, [select_id]).then(function(res) {
		        	   //console.log("deleted first id from db" + JSON.stringify(res));
		        	   }, function (err) {
		        		   console.log("deleted first id from db error" + err);
				        });
		           }
		           var query_insert = "INSERT INTO TripNotification (trip_id,trip_name,status,customers,td_end_point_name,td_end_point_lat,td_end_point_long,td_end_point_ts,td_start_point_name,td_start_point_lat,td_start_point_long,td_start_point_ts) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
 		        $cordovaSQLite.execute(db, query_insert, [tripDetails.trip_id,tripDetails.trip_name,tripDetails.status,tripDetails.customers,tripDetails.td_end_point_name,tripDetails.td_end_point_lat,tripDetails.td_end_point_long,tripDetails.td_end_point_ts,tripDetails.td_start_point_name,tripDetails.td_start_point_lat,tripDetails.td_start_point_long,tripDetails.td_start_point_ts]).then(function(res) {
 		        	//console.log("INSERTED new row after deleting first from db>>>>>>" + JSON.stringify(res));
 		        	callback();
 		        }, function (err) {
 		        	console.log("INSERTING new row after deleting first from db err2 -> " + JSON.stringify(err));
 		        });   
		           
		        }, function (err) {
		        	console.log("select first id from db error" + err);
		        });
		}
	}	
	//=========== Method for creating final json array to show in UI ============     
    function fetchTripTable(){
    	var notify_Db = [];
        var query = "SELECT * FROM TripNotification";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
            for(var i=0;i<res.rows.length;i++){
            	//console.log("SELECTED -> " + JSON.stringify(res.rows.item(i)));
            	notify_Db.push(res.rows.item(i));
            	//console.log(JSON.stringify(notify_Db));
            	$scope.notifyTrips = notify_Db;
            	$scope.tripNotificationsAvailable = true;
				$scope.noTripNotifications = false;
            }
            } 
            else {
            	$scope.tripNotificationsAvailable = false;
				$scope.noTripNotifications = true;
            	//console.log("No results found");
            }
        }, function (err) {
        	console.log(JSON.stringify(err));
        });
    };
    
//=========== Method for getting the notification count from sqlite db if no notification from server============ 	    
    function fetchTripCountTable(){
    	var query = "SELECT * FROM TripNotification_Count";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
            for(var i=0;i<res.rows.length;i++){
            	var select_count = res.rows.item(0).tripnotificationCount;
            	$scope.tripNotifyLength = select_count;
            }
            } else {
            }
        }, function (err) {
        	console.log(JSON.stringify(err));
        });	
    }
    
//=========== Method for getting the notification count from sqlite db if notification available form server============   
    function fetchTripCountTableUpdate(){
    	var query = "SELECT * FROM TripNotification_Count";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
            for(var i=0;i<res.rows.length;i++){
            	var select_count = res.rows.item(0).tripnotificationCount;
            	//alert(JSON.stringify(select_count));
            	var add_select_count = select_count + showTripLength;
            	//alert(JSON.stringify(add_select_count));
            	var query_update_length = "UPDATE TripNotification_Count SET tripnotificationCount = "+add_select_count;
    	        $cordovaSQLite.execute(db, query_update_length, []).then(function(res) {
    	        	console.log("UPDATED length in db >>>>>>" + JSON.stringify(res));
    	        }, function (err) {
    	        	console.log("UPDATE length in DB err  -> " + JSON.stringify(err));
    	        });
            }
            } else {
            	var query_insert_length = "INSERT INTO TripNotification_Count (tripnotificationCount) VALUES (?)";
    	        $cordovaSQLite.execute(db, query_insert_length, [showTripLength]).then(function(res) {
    	        	console.log("INSERTED length in db >>>>>>" + JSON.stringify(res));
    	        	var query = "SELECT * FROM TripNotification_Count";
    	        	$cordovaSQLite.execute(db, query, []).then(function(res) {
    		            if(res.rows.length > 0) {
    		            for(var i=0;i<res.rows.length;i++){
    		            	var select_count = res.rows.item(0).tripnotificationCount;
    		            	$scope.tripNotifyLength = select_count;
    		            }
    		           }
    		        }, function (err) {
    		        	console.log(JSON.stringify(err));
    		        });	
    	        }, function (err) {
    	        	console.log("Insert length in DB err  -> " + JSON.stringify(err));
    	        });
            }
        }, function (err) {
        	console.log(JSON.stringify(err));
        });	  	       
   }
   
  //=========== Deleting notification count from sqlite db ============ 
    $scope.deleteTripNotificationLength = function(){
    	$scope.$broadcast('triplist', { message: "list Trip" });
    	$scope.tripNotifyLength = "";
    	var query_delete = "DELETE FROM TripNotification_Count";
        $cordovaSQLite.execute(db, query_delete, []).then(function(res) {
            //alert("Deleted all data in Notification_Count -> " + JSON.stringify(res));
            //alert("Token Deleted");
        }, function (err) {
            //alert(err);
        });
    }
    /**      
	  * On click of TripNotification
	  * 1) Show popup modal with details
	*/
	$scope.showTripNotifyPopup = function(trip) {
		driverAppService.giveAddress(trip.td_end_point_lat,trip.td_end_point_long,function(address){
			var alertPopup = $ionicPopup.alert({
			       title: 'Notification Details',
		    	   template: 'Trip ID:'+trip.trip_id+'<br>Trip Status:'+driverAppService.showStatus(trip.status)+'<br> Trip Customers:'+trip.customers+'<br> Trip Address:'+address
		   });
		     alertPopup.then(function(res) {
		          console.log('Success');
		   });
		});
   };

	/*internal Service call*/
	$scope.getDateTime=function(ts){
		return driverAppService.getDateTime(ts);
	}
	$scope.getTimeService=function(ts){
		return driverAppService.getTime(ts);
	}
	$scope.getDateService=function(ts){
		return driverAppService.getDate(ts);
	}
	$scope.getStatus=function(val){
		return driverAppService.showStatus(val);
	}
	
	function clearDB(){		
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
	      $state.go('login');
	}	    
});

