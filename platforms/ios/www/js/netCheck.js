var db = null;
var batsInternet = angular.module('batsInternet', ['ionic', 'ngCordova']);
batsInternet.controller('checkInternet', function ($ionicPlatform, $scope, $rootScope, $cordovaNetwork, $cordovaSQLite, $ionicPopup, $window, $interval) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    db = $cordovaSQLite.openDB({ name: "my.db", iosDatabaseLocation: 'default' });
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Device_IMEI (imei varchar)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Token (token varchar)");
  });
  $scope.internetAvailable = false;
  $scope.interCheckInterval = $interval(function () {
    console.log("checking Internet connection in netCheck");
    var type = $cordovaNetwork.getNetwork()
    // alert("type " + type);
    var isOnline = $cordovaNetwork.isOnline()
    //alert("isOnline " + isOnline);
    var isOffline = $cordovaNetwork.isOffline()
    //alert("isOffline " + isOffline);    
    // listen for Online event
    $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
      var onlineState = networkState;
      /* alert("redirecting to login page");
      $window.location.redirect='index.html';*/
      pingNetConnection();

    }); +
      // listen for Offline event
      $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
        var offlineState = networkState;
      });
    if (isOnline) {
      $scope.internetAvailable = true;
      console.log("internet available" + $scope.internetAvailable);
      $interval.cancel($scope.interCheckInterval);
      $window.location.href = 'index.html';
    }
  }, 10 * 1000);


  function pingNetConnection() {
    console.log("ping network calling");
    var xhr = new XMLHttpRequest();
    var file = 'http://220.227.124.134:8054/images/404.png';
    var r = Math.round(Math.random() * 10000);
    xhr.open('HEAD', file + "?subins=" + r, false);
    try {
      xhr.send();
      if (xhr.status >= 200 && xhr.status < 304) {
        //alert("true");
      } else {
        $ionicPopup.confirm({
          title: 'No Internet Connection',
          content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
        })
          .then(function (result) {
            ionic.Platform.exitApp();
          });
      }
    } catch (e) {
      $ionicPopup.confirm({
        title: 'No Internet Connection',
        content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
      })
        .then(function (result) {
          ionic.Platform.exitApp();
        });
    }
  }
  



  $scope.refresh = function () {
    //alert("checking Internet connection in netCheck");
    var type = $cordovaNetwork.getNetwork()
    // alert("type " + type);
    var isOnline = $cordovaNetwork.isOnline()
    //alert("isOnline " + isOnline);
    var isOffline = $cordovaNetwork.isOffline()
    //alert("isOffline " + isOffline);    
    // listen for Online event
    $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
      var onlineState = networkState;
      /* alert("redirecting to login page");
     $window.location.redirect='index.html';*/
    });
    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
      var offlineState = networkState;
    });
    if (isOnline) {
      //alert("redirecting");
      $window.location.href = 'index.html';
      //navigator.app.loadUrl("file:///android_asset/www/net.html");
    }
    else {
      $ionicPopup.confirm({
        title: 'No Internet Connection',
        content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
      });
    }      //alert("checked Internet connection");    
  }
});