/*  var apiURL="http://220.227.124.134:8052/"//public dev IP
	var apiURL="http://10.1.71.40:8052/";//local machine
	var apiURL="http://220.227.124.134:8040/"//testing server public IP	
  	var apiURL="http://220.227.124.134:8050/"//SMOKE testing server public IP	
  	var apiURL="http://220.227.124.134:8058/"//dev server for driver app
*/
var apiURL="http://220.227.124.134:8058/"//dev server for driver app
//var apiURL="http://10.1.72.90:9020/"//dev server for driver app arun machine
var token;//  =  window.localStorage.getItem( ‘token’ );	
var driver_id;//="DRV_1";
var imeiNumber;
var myPlace = {lat: 12.850167, lng: 77.660329}; 
var db = null;