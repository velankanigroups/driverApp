driverApp.directive('reverseStart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        link: function ($scope, element, attrs) {
            var i=1;
            var geocoderS = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(attrs.lat, attrs.lng);
            //$scope.GeocodeAdd();
            $scope.GeocodeAdd = function(){
                i++;
                console.log("geocodeAdd");
                geocoderS.geocode({ 'latLng': latlng }, function (results, status) {
                    console.log(results,status);
                if (status == google.maps.GeocoderStatus.OK) {

                    if (results[1]) {
                        element.text(results[1].formatted_address); 
                    } else {
                        element.html('Location not found');
                    }
                } 
                else if(status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT){
                    console.log("OVER_QUERY_LIMIT");
                    
                    setTimeout(function() {
                $scope.GeocodeAdd();
                    }, 3000);
                     
                }
                else {
                    element.html('Location not found'); 
                }
                
            });
        };
        
            
            $scope.GeocodeAdd();

           
        },
        replace: true
    }
});


driverApp.directive('reverseDrop', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        link: function ($scope, element, attrs) {
            var i=1;
            var geocoderD = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(attrs.lat, attrs.lng);
            //$scope.GeocodeAdd();
            $scope.GeocodeAdd = function(){
                i++;
                console.log("geocodeAdd");
                geocoderD.geocode({ 'latLng': latlng }, function (results, status) {
                    console.log(results,status);
                if (status == google.maps.GeocoderStatus.OK) {

                    if (results[1]) {
                        element.text(results[1].formatted_address); 
                    } else {
                        element.html('Location not found');
                    }
                } 
                else if(status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT){
                    console.log("OVER_QUERY_LIMIT");
                    
                    setTimeout(function() {
                $scope.GeocodeAdd();
                    }, 2000);
                     
                }
                else {
                    element.html('Location not found'); 
                }
                
            });
        };
        
            
            $scope.GeocodeAdd();

           
        },
        replace: true
    }
});

driverApp.directive('reverseEnd', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        link: function ($scope, element, attrs) {
            var i=1;
            var geocoderE = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(attrs.lat, attrs.lng);
            //$scope.GeocodeAdd();
            $scope.GeocodeAdd = function(){
                i++;
                console.log("geocodeAdd");
                geocoderE.geocode({ 'latLng': latlng }, function (results, status) {
                    console.log(results,status);
                if (status == google.maps.GeocoderStatus.OK) {

                    if (results[1]) {
                        element.text(results[1].formatted_address); 
                    } else {
                        element.html('Location not found');
                    }
                } 
                else if(status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT){
                    console.log("OVER_QUERY_LIMIT");
                    
                    setTimeout(function() {
                $scope.GeocodeAdd();
                    }, 3000);
                     
                }
                else {
                    element.html('Location not found'); 
                }
                
            });
        };
        
            
            $scope.GeocodeAdd();

           
        },
        replace: true
    }
});





// driverApp.directive('pwCheck',function(){
//     return {
//       require: 'ngModel',
//       link: function (scope, elem, attrs, ctrl) {
//         var firstPassword = '#' + attrs.pwCheck;
//         elem.add(firstPassword).on('keyup', function () {
//           scope.$apply(function () {
//             var v = elem.val()===$(firstPassword).val();
//             ctrl.$setValidity('pwmatch', v);
//           });
//         });
//       }
//     }
// });