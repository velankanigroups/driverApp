driverApp.controller('tripCtrl', function ($rootScope, $scope, $state,
	$ionicLoading, $timeout, $ionicPopup, $ionicPlatform, $interval, $window, driverAppFactory,
	driverAppService) {



	$ionicPlatform.registerBackButtonAction(function (event) {
		console.log("yourcheckhere1");
		if (true) {
			console.log("yourcheckhere2");
			$ionicPopup.confirm({
				title: 'System warning',
				template: 'are you sure you want to exit?'
			}).then(function (res) {
				console.log("yourcheckhere3");
				if (res) {
					console.log("yourcheckhere4");
					ionic.Platform.exitApp();
				}
			})
		}
	}, 100);

	$interval.cancel($rootScope.listTrip);
	$scope.token = localStorage.getItem("token");
	$scope.yoData = false;
	$scope.noData = true;
	$scope.historyNotAvailable = true;
	$scope.hist = {};
	$scope.hist.startDate = new Date();
	$scope.hist.endDate = $scope.hist.startDate;
	var now = new Date(), maxDate = now.toISOString().substring(0, 10);
	var past = $scope.hist.startDate, minDAte = past.toISOString().substring(0, 10);
	document.getElementById('start_alarm_Dt').setAttribute('max', maxDate);
	console.log(" ************************* " + $scope.hist.startDate);
	$scope.minm = new Date($scope.hist.startDate).getTime();
	// var today=$scope.hist.startDate;
	// var dd = today.getDate();
	// var mm = today.getMonth()+1; //January is 0!
	// var yyyy = today.getFullYear();
	// 	if(dd<10){
	//        dd='0'+dd
	//    } 
	//    if(mm<10){
	//        mm='0'+mm
	//    } 

	// today = yyyy+'-'+mm+'-'+dd;
	console.log(minDAte + " timestamp " + $scope.minm);
	document.getElementById('end_alarm_Dt').setAttribute('min', minDAte);


	$scope.changeToDate = function () {
		var past = $scope.hist.startDate, minDAte = past.toISOString().substring(0, 10);
		document.getElementById('end_alarm_Dt').setAttribute('min', minDAte);
	}


	$scope.location = function (lat, long) {
		$scope.latforloc = lat;
		$scope.longforloc = long;
		$scope.modal.show();
	};

	$scope.toggleTripInfo = function (trip) {
		if ($scope.isTripShown(trip)) {
			$scope.shownTrip = null;
		} else {
			$scope.shownTrip = trip;
		}
	};
	var windowHeight = (window.screen.availHeight - 180);
	windowHeight = windowHeight + "px";
	$scope.availableScroller = {
		"height": windowHeight
	}
	$scope.isTripShown = function (trip) {
		return $scope.shownTrip === trip;
	};
	$timeout(function () {
		$scope.today();
	});

	$scope.today = function () {

		// setting start date
		var std = new Date(new Date().getTime());
		std.setHours(0);
		std.setMinutes(0);
		std.setSeconds(01);
		var sts = std.getTime();
		// setting end date
		var d = new Date(new Date().getTime());
		d.setHours(23);
		d.setMinutes(59);
		d.setSeconds(59);
		var ets = d.getTime();
		$scope.hist.startDate = new Date();
		// calling api
		tripHistoryApiCall(sts, ets);

	};
	$scope.showTripHistory = function (hist) {
		// console.log(JSON.stringify(hist));
		$scope.currentDate = new Date();
		$scope.day = document.getElementById("start_alarm_Dt").value;
		var past = $scope.hist.startDate, minDAte = past.toISOString().substring(0, 10);
		document.getElementById('end_alarm_Dt').setAttribute('min', minDAte);
		console.log(minDAte);
		// console.log(JSON.stringify(hist));
		var stVal = document.getElementById("start_alarm_Dt").value;
		var stVal1 = document.getElementById("end_alarm_Dt").value;
		// var edVal=document.getElementById("end_alarm_Dt").value;
		var startDate = stVal;// hist.startDate;
		var endDate = stVal1;// hist.endDate;
		// var devID = hist.searchDeviceModel.devid;
		var myStDate = startDate.split("-");
		var newStDate = myStDate[1] + "/" + myStDate[0] + "/" + myStDate[2];
		var std = new Date(new Date(stVal).getTime());
		std.setHours(0);
		std.setMinutes(0);
		std.setSeconds(01);
		var sts = std.getTime();

		var myEdDate = endDate.split("-");
		var newEdDate = myEdDate[1] + "/" + myEdDate[0] + "/" + myEdDate[2];
		var d = new Date(new Date(stVal1).getTime());
		d.setHours(23);
		d.setMinutes(59);
		d.setSeconds(59);
		var ets = d.getTime();
		// console.log(sts);
		// console.log(ets);
		tripHistoryApiCall(sts, ets);
	};
	$scope.open = function (latlng) {
		console.log(JSON.stringify(latlng));
		cordova.InAppBrowser.open('http://maps.google.com/?q=' + latlng.lat + ',' + latlng.long, '_blank', 'location=yes');
	}
	function tripHistoryApiCall(sts, ets) {
		$ionicLoading.show({
			template: 'Loading!...'
		});
		$scope.alarmHistoryjson = {};
		$scope.alarmHistoryjson.token = localStorage.getItem("token");
		$scope.alarmHistoryjson.sts = sts;
		$scope.alarmHistoryjson.ets = ets;

		// $scope.alarmHistoryjson.trip_id = "TN70AD1011_1484716484933";
		console.log(JSON.stringify($scope.alarmHistoryjson));
		driverAppFactory.callApi("POST", apiURL + "driver/app/trip_history", $scope.alarmHistoryjson, function (result) {
			console.log(JSON.stringify(result));
			$ionicLoading.hide();
			if(result.msg){
				console.log("hghghg");
			}
			if (result.msg != "history data not found") {
				$scope.historyNotAvailable = false;
				angular.forEach(result.data, function (resultItem) {
					if (resultItem.status == "R" || resultItem.status == "D") {
						$rootScope.ongoingStatus = true;
					}

				})
				var histData = result.data;
				var data_len = histData.length;
				var i = 0;
				var flag = 0;
				while (i < data_len) {
					console.log(i);
					if (histData[i].status == "R" || histData[i].status == "D" || histData[i].status == "F" || histData[i].status == "C") {
						console.log(histData[i].status);
						flag = 1;
						$scope.updateStatus();
						break;
					}
					i++;
				}
				if (flag == 0) {
					$scope.historyNotAvailable = true;
				}
				$scope.th_data = result;
				console.log($scope.th_data);
			} else if (result.err === 'Invalid  User') {
				$rootScope.invalidUser();
			}
			else if (result.err == "Expired Session") {
				$interval.cancel($rootScope.callEventsAPI);
				$rootScope.invalidUser();
				$state.go('login');
			}
			else {
				$scope.historyNotAvailable = true;
			}

		});
	}
	$scope.updateStatus = function () {
		//alert("history available");
		$scope.historyNotAvailable = false;
	}
	$scope.tripEventHistoryApiCall = function (trip_id) {
		$ionicLoading.show({
			template: 'Loading!...'
		});
		$scope.eventHistoryjson = {};
		$scope.eventHistoryjson.token = localStorage.getItem("token");
		$scope.eventHistoryjson.trip_id = trip_id;
		// $scope.alarmHistoryjson.trip_id = "TN70AD1011_1484716484933";
		console.log(JSON.stringify($scope.eventHistoryjson));
		driverAppFactory.callApi("POST", apiURL
			+ "driver/app/trip_event_history", $scope.eventHistoryjson,
			function (result) {
				$ionicLoading.hide();
				// console.log("API REs :: "+JSON.stringify(result));
				if (result.data != "Events not found for this trip") {
					$scope.teh_data = result;
					$scope.vehicle = result.data.vehicle_num;
					$scope.eventsAvail = true;
				} 
				else{
					var alertPopup = $ionicPopup.alert({
						title: 'Notification Details',
						template: 'No Events'
					});
					$scope.eventsAvail = false;
					alertPopup.then(function (res) {
						console.log('Success');
					});
				}


				if(error.err == "Invalid  User") {
					$rootScope.invalidUser();
				}
				else if(error.err == "Expired Session") {
					$interval.cancel($rootScope.callEventsAPI);
					$rootScope.invalidUser();
					$state.go('login');
				}
				
			});
	}
	/* .......................................................................................................... */
	$scope.toggleEventInfo = function (trip) {
		if ($scope.isEventShown(trip)) {
			$scope.shownEvent = null;
		} else {
			$scope.shownEvent = trip;
		}
	};
	$scope.isEventShown = function (trip) {
		return $scope.shownEvent === trip;
	};
	$scope.getEventImgSrc = function (type) {
		switch (type) {
			case "0":
				return "../www/img/pat.png";
				break;
			case "3":
				return "../www/img/bat.png";
				break;
			case "4":
				return "../www/img/spe.png";
				break;
			case "5":
				return "../www/img/geo.png";
				break;
			case "7":
				return "../www/img/cat.png";
				break;
		}
	}
	$scope.getEventName = function (type) {
		console.log(type);
		switch (type) {
			case "0":
				console.log(type);
				return "PANIC";

				break;
			case "3":
				return "BATTERY";
				break;
			case "4":
				return "OVER SPEED";
				break;
			case "5":
				return "CROSSED GEO FENCE";
				break;
			case "7":
				return "CABLE INTERRUPT";
				break;
		}
	}
	/**
	 * On click of EventNotification 1) Show popup modal with details
	 */
	$scope.showEventNotifyPop = function (event) {
		driverAppService.giveAddress(event.lat, event.long, function (address) {
			console.log(JSON.stringify(event));
			var alertPopup = $ionicPopup.alert({
				title: 'Notification Details',
				template: 'Event Name :'
				+ driverAppService.getEventName(event.alarm_type)
				+ '<br>Event Location:<br>' + address
				+ '<br> Date & Time:'
				+ driverAppService.getDateTime(event.ts)
			});
			alertPopup.then(function (res) {
				console.log('Success');
			});
		});

	};
	/*
	 * ..........................................................Service
	 * calls.....................................
	 */
	$scope.getTimeService = function (ts) {
		return driverAppService.getTime(ts);
	}
	$scope.getAddressService = function (lt, lg) {
		console.log(lt, lg);
		driverAppService.giveAddress(lt, lg, function (addressValue) {
			return addressValue;
		})
	}

	$scope.givelt = function (lat, lng) {
		var geocoder = new google.maps.Geocoder();
		var latlng = new google.maps.LatLng(lat, lng);
		//$scope.GeocodeAdd();
		console.log(lat, lng);

		// $scope.GeocodeAdd = function(){
		//     i++;
		console.log("geocodeAdd");
		geocoder.geocode({ 'latLng': latlng }, function (results, status) {
			console.log(results, status);
			if (status == google.maps.GeocoderStatus.OK) {

				if (results[1]) {
					return results[1].formatted_address;
				} else {
					return 'Location not found';
				}
			}
			else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
				console.log("OVER_QUERY_LIMIT");
				setTimeout(function () {
					$scope.givelt(lat, lng);
				}, 3000);

			}
			else {
				return 'Location not found';
			}

		});
		//};
	};
});