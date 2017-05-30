driverApp.service('driverAppService', function($ionicPopup) {
	var savedData;
	this.showStatus=function(status_code){		
		var status;
		switch (status_code){
			case 'S':
			status='Scheduled';			
			break;
			case 'R':
			status='Running';
			break;
			case 'D':
			status='Dropped';
			break;
			case 'F':
			status='Finished';
			break;
			case 'C':
			status='Cancelled';
			break;

		}

		return status;
	};
	this.getEvent=function(event_type){		
		var event;
		switch (event_type){
			case 'PAT':
				event='PANIC ALARM';			
			break;
			case 'BAT':
				event='BATTERY ALARM';
			break;
			case 'overspeed':
				event='Over Speed ALARM';
			break;
			case 'geofence':
				event='Crossed Geo Fence ALARM';
			break;
			case 'CAT':
				event='Tracker Connection Interrupt ALARM';
			break;

		}

		return event;
	};
	this.getEventName=function(type){
		switch (type) {
		case "0":
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
	  };
	this.saveData = function(data) {
		savedData= data;
	};
	this.getData = function() {
		return savedData;
	};
	this.getCurrentTimeStamp=function(){
		return new Date().getTime();
	};	
	this.SortByts=function(x,y){
		/*console.log(x.td_start_point.ts);
		console.log(y.td_start_point.ts);*/
		return ((x.td_start_point.ts == y.td_start_point.ts) ? 0 : ((x.td_start_point.ts > y.td_start_point.ts) ? 1 : -1 ));
	};
	this.SortByTs=function(x,y){
		/*console.log(x.td_start_point.ts);
		console.log(y.td_start_point.ts);*/
		return ((x.ts == y.ts) ? 0 : ((x.ts > y.ts) ? 1 : -1 ));
	};
	this.getDateTime = function(ts) {		
		var d = new Date(Number(ts));
		//console.log(d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear());
		var monthVal = d.getMonth() + 1;
		monthVal=monthVal<10 ?'0'+monthVal:monthVal;
		var hours = d.getHours();
		  var minutes = d.getMinutes();
		  var ampm = hours >= 12 ? 'pm' : 'am';
		  hours = hours % 12;
		  hours = hours ? hours : 12; // the hour '0' should be '12'
		  minutes = minutes < 10 ? '0'+minutes : minutes;
		  var strTime = hours + ':' + minutes + ' ' + ampm;
		return d.getDate() + "/" + monthVal + "/"
				+ d.getFullYear() + " "
				+ strTime;
	};
	this.getDate = function(ts) {		
		var d = new Date(Number(ts));
		//console.log(d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear());
		var monthVal = d.getMonth() + 1;
		monthVal=monthVal<10 ?'0'+monthVal:monthVal;
		var hours = d.getHours();
		  var minutes = d.getMinutes();
		  var ampm = hours >= 12 ? 'pm' : 'am';
		  hours = hours % 12;
		  hours = hours ? hours : 12; // the hour '0' should be '12'
		  minutes = minutes < 10 ? '0'+minutes : minutes;
		  var strTime = hours + ':' + minutes + ' ' + ampm;
		return d.getDate() + "/" + monthVal + "/"
				+ d.getFullYear();
	};
	this.getTime = function(ts) {		
		var d = new Date(Number(ts));
		//console.log(d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear());		
		var hours = d.getHours();
		  var minutes = d.getMinutes();
		  var ampm = hours >= 12 ? 'pm' : 'am';
		  hours = hours % 12;
		  hours = hours ? hours : 12; // the hour '0' should be '12'
		  minutes = minutes < 10 ? '0'+minutes : minutes;
		  var strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
	};
	this.giveAddress=function(lt,lg, cb){
		var geocoder = new google.maps.Geocoder();
		var latLng = new google.maps.LatLng(lt,lg);
		geocoder.geocode({       
		        latLng: latLng     
		        }, 
		        function(responses) 
		        {     
		           if (responses && responses.length > 0) 
		           {    
		        	   cb(responses[0].formatted_address);
		        	   
		           } 
		           else 
		           {   
		        	   cb("Address not found for lat:" +lt+ ", long:" +lg);
		           }   
		        }
		);
	};
	this.showIonicAlert=function(titleVal,msg){
		var alertPopup = $ionicPopup.alert({
		       title: titleVal,
	    	   template: msg
	     		});
		     alertPopup.then(function(res) {
		     			console.log('Success');
		     });
	};
});