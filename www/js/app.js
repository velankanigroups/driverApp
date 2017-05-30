// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var driverApp = angular.module('starter', [ 'ionic','ngCordova', 'starter.controllers' ]);

driverApp.run(function($ionicPlatform,$ionicPopup,$cordovaSQLite,$state,$rootScope) {
	
	//App Initialization Starts...............................................
	
	
	$ionicPlatform.ready(function() {
		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Welcome Ionic<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)		
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
		
		document.addEventListener("deviceready", onDeviceReady, false);
	      function onDeviceReady() {
	        
	        console.log("result = "+device.uuid);
	        dbOperation(function(){
	        	var uuid=device.uuid;
		        var query_insert = "INSERT INTO Device_IMEI (imei) VALUES (?)";
	  	        $cordovaSQLite.execute(db, query_insert, [uuid]).then(function(res) {
	  	            console.log("imei inserted into db ");
	  	        }, function (err) {
					
	  	        });				
		    	setTimeout(function(){ callForToken(); }, 5*1000);
		    });	        
	      }
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
	});
	
	
	 
	//App Initialization Ends........................................................
	
	//DB Operation Starts............................................................
	
	function dbOperation(cb) {
		console.log("==========================>>>>>>>>>>>>>>> DB Operation <<<<<<<<<<<<<<================================================");
		db = $cordovaSQLite.openDB({name:"my.db",iosDatabaseLocation:'default'});
	    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Device_IMEI (imei varchar)");
	    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Token (token varchar)");
	    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS EventNotification (id integer primary key,devid varchar, lat float, long float,ts integer,alarm_type varchar, velocity float,volt float,vehicle_model varchar,vehicle_num varchar)");
	    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS EventNotification_Count (eventnotificationCount integer)");
	    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS TripNotification (id integer primary key,trip_id varchar,trip_name varchar,status varchar,customers varchar,td_end_point_name varchar,td_end_point_lat float,td_end_point_long float,td_end_point_ts integer,td_start_point_name varchar,td_start_point_lat float,td_start_point_long float,td_start_point_ts integer)");
	    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS TripNotification_Count (tripnotificationCount integer)");
	    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS onGoingTrip (tripid varchar primary key,tripData blob)");
		cb();
	}
	
	//Fetching Token from DataBase...........................................................
	
	function callForToken(){
		console.log("==========================>>>>>>>>>>>>>>> TOKEN Operation <<<<<<<<<<<<<<================================================");
		
		var query = "SELECT * FROM Token";
	    $cordovaSQLite.execute(db, query, []).then(function(res) {
	  
	    if(res.rows.length > 0) {
	    	chkImei();
	    	$state.go('app.scheduled');
	     		  
	    	  } else {
	    		  
	    		  chkImei();
	    		  $state.go('login');
	     	   } 
	     }, function (err) {
	     console.error(err);
	     });
	}

	//Checking IMEI ..........................................................................
	
	function chkImei(){
		console.log("==========================>>>>>>>>>>>>>>> IMEI Operation <<<<<<<<<<<<<<================================================");
		
		  var query ="SELECT * FROM Device_IMEI";
		  $cordovaSQLite.execute(db, query, []).then(function(res) {
			  imeiNumber =res.rows.item(0).imei;
			 
		  },function(err){
			  console.log(err);
		  });  
	}
});





driverApp.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
	$httpProvider.interceptors.push(function($rootScope, $q) {
		return {
			request : function(config) {
				config.timeout = 1000;
				return config;
			},
			responseError : function(rejection) {
				switch (rejection.status) {
				case 408:
					console.log('connection timed out');
					break;
				}
				return $q.reject(rejection);
			}
		}
	});
	
$stateProvider.state('app', {
		cache : false,
		url : '/app',
		abstract : true,
		templateUrl : 'templates/menu.html',
		controller : 'AppCtrl'
	}).state('app.scheduled', {
		cache : false,
		url : '/scheduled',
		views : {
			'menuContent' : {
				templateUrl : 'templates/scheduled.html',
				controller : 'scheduledController'
			}
		}
	}).state('app.ongoing', {
		cache : false,
		url : '/ongoing',
		views : {
			'menuContent' : {
				templateUrl : 'templates/ongoing.html',
				controller : 'onGoingController'
			}
		}
	}).state('app.tripsData', {
		cache : false,
		url : '/tripsData',
		views : {
			'menuContent' : {
				templateUrl : 'templates/trip_history.html',
				controller : 'tripCtrl'
			}
		}
	/*}).state('app.changePwd', {
		cache : false,
		url : '/changePwd',
		views : {
			'menuContent' : {
				templateUrl : 'templates/changePwd.html',
				controller : 'changePwdCtrl'
			}
		}*/
	}).state('app.logout', {
		cache : false,
		url : '/logout',
		views : {
			'menuContent' : {				
				controller : 'logoutController'
			}
		}		
	}).state('app.event_notifications', {
		cache: false,
	    url: '/event_notifications',
	    views: {
	      'menuContent': {
	        templateUrl: 'templates/event_notifications.html',	        
	      }
	    }
	  }).state('app.trip_notifications', {
		cache: false,
	    url: '/trip_notifications',
	    views: {
	      'menuContent': {
	        templateUrl: 'templates/trip_notifications.html',	        
	      }
	    }
	  })
	  .state('login', {
		cache : false,
		url : '/login',
		templateUrl : "templates/login.html",
		controller : 'LoginCtrl'
	});
	// if none of the above states are matched, use this as the fallback
	/*window.localStorage.setItem( "token", "ONkxmVZzH4z7gCRU");
	$urlRouterProvider.otherwise('/app/tripsData');*/
	console.log("Token From Storage>>>>>"+localStorage.getItem("token"));
	if(window.localStorage.getItem("token")!==null){
		$urlRouterProvider.otherwise('/scheduled');
	}else{
		$urlRouterProvider.otherwise('/login');
	}
	
});
