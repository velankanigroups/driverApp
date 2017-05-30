driverApp.controller('LoginCtrl', function($scope, $state,$ionicPopup,$ionicPlatform,$cordovaSQLite,driverAppFactory,$window) {
	/* ============Disable Back Button============ */	
	var deregisterFirst = $ionicPlatform.registerBackButtonAction(
		      function() {
		    	  // alert("Back Disabled");
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
	
  $scope.LogIn = function(form,user) {	  
	  if(form.$valid){	  

				chkImei();  
				user.imei=imeiNumber;
				console.log(JSON.stringify(user));

				driverAppFactory.callApi("POST",apiURL+"driver/app/login",user,function(result){
					 console.log("calling login api");
					 console.log(JSON.stringify(result));

					if(result.hasOwnProperty("token")){

						console.log("token is = "+result.token);
						window.localStorage.setItem( "token", result.token);
						token=window.localStorage.getItem("token");
						token_login=window.localStorage.getItem("token");

						var query_insert = "INSERT INTO Token (token) VALUES (?)";
						$cordovaSQLite.execute(db, query_insert, [token_login]).then(function(res) {
							console.log("inserting token into db");
							$state.go("app.scheduled");	
						}, function (err) {
							// alert("Insert Token in DB err -> " +
							// JSON.stringify(err));
						});
					}					
					else if(result.err=="Some other User already logged in with same credentials."){ 
						  alert(result.err);		  	  		  
					}
					else if(result=="Unauthorized"){
						  alert("Unauthorized Credentials");
					}
				    else if(result.err=="Inactive"){
						  alert("User is Inactive. Please Contact Admin");
					}
				    else if(result=="null"){
						  alert("Service Down");
					}
					
				});  

	  } 
  };
  function chkImei(){
  	console.log("check IMEI");
  	  /* fetch the IMEI stored while loading */
  	  var query ="SELECT * FROM Device_IMEI";
  	  $cordovaSQLite.execute(db, query, []).then(function(res) {
  		  // console.log(res);
  		  // console.log(JSON.stringify(res));
  		  imeiNumber =res.rows.item(0).imei;
  		 // alert(imeiNumber);
  	  },function(err){
  		  console.log(err);
  	  });  
}
  
});