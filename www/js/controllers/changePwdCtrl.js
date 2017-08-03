driverApp.controller('changePwdCtrl', function($scope, $state,$ionicPopup,$ionicPlatform,$cordovaSQLite,driverAppFactory,$window) {

$scope.doLogin = function(ChangePwd,CurrPwd){
    $scope.ChangePassJson = {};
    $scope.ChangePassJson.token= window.localStorage.getItem("token");
    $scope.ChangePassJson.currentpassword = CurrPwd;
    console.log($scope.CurPassword);
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
        else if(result.err == "present password is invalid/not matching"){
            var alertpopup  = $ionicPopup.alert({
                title:'Error',
                template:'Current Password is invalid'
            });
        }
        else{
             var alertpopup  = $ionicPopup.alert({
                title:'Error',
                template:result.err
            });
        }
        
    });
}


});