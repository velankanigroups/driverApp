driverApp.controller('changePwdCtrl', function($scope, $state,$ionicPopup,$ionicPlatform,$cordovaSQLite,driverAppFactory,$window) {


$scope.hidePasswordMismatch = function(){
    console.log("calling cgange");
    if($scope.NewPassword === $scope.ReNewPassword){
        $scope.isMismatch = false;
    }else{
        $scope.isMismatch = true;
    }
}


$scope.doLogin = function(ChangePwd){
    $scope.ChangePassJson = {};
    $scope.ChangePassJson.token= window.localStorage.getItem("token");
    console.log(ChangePwd);

    $scope.ChangePassJson.newpassword = ChangePwd;
    driverAppFactory.callApi("POST",apiURL+"driver/app/changepwd",$scope.ChangePassJson,function(result){
        console.log(JSON.stringify(result));
        if(result.status == "Password  reset success"){
            var alertpopup  = $ionicPopup.alert({
                title:'Success',
                template:'Password reset is success'
            });
             $state.go("app.scheduled");
        }
        else if(result.err == "New password should not match with old password" ){
            var alertpopup  = $ionicPopup.alert({
                title:'Error',
                template:'New password should not match with old password'
            });
           
        }




    });
}


});