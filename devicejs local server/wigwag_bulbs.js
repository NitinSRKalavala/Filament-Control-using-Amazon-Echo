var schedule = require('node-schedule');
var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://test.mosca.io');
var toggle_flag=1;
var bright = ['increase' , 'decrease', 'maximum', 'max', 'min', 'minimum', 'reduce'];
var color = ['blue' , 'red', 'yellow', 'green','white'];
var warmth = ['cool' , 'warm', 'daylight', 'normal', 'neutral', 'hot'];
var tym = [];
var dt = [];
var sched = [];

var brightness =0.5,
    color_flag =0,
    brightness_color = 0.5;

/*Function to handle requests for mood or color change*/
function colorCheck(input)
{
  switch(input){
        case 'red':
			dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('hsl', {h:1, s:1, l:0.5});
			dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('brightness',brightness_color);
			color_flag =1;
        break;
    	case 'yellow':
			dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('hsl', {h:0.15, s:1, l:0.5});
			dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('brightness',brightness_color);
			color_flag =1;        
		break;
    	case 'green':
			dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('hsl', {h:0.3, s:1, l:0.5});
			dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('brightness',brightness_color);
			color_flag =1;
		break;
    	case 'blue':
			dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('hsl', {h:0.5, s:1, l:0.5});
			dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('brightness',brightness_color);	
			color_flag =1;        
		break; 
		case 'white':
			dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('hsl', {h:0, s:0, l:1});
			dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('brightness',brightness);        
			color_flag =0;
		break;  
	}
}

/*Parsing the Date and Time for scheduling events*/
function parseDT(received)
{
    if((received[1]!='none') && (received[2]=='none')){
    	dt = received[1].toString().split("-");
    	tym[0] = "21";
    	tym[1] = "10";       
    }
    else if((received[1]=='none') && (received[2]!='none')){
		tym = received[2].toString().split(":");
		var date = new Date();
        dt[0] = date.getFullYear();
        var month = date.getMonth() + 1;       
        month = (month <10 ? "0" : "") + month;
        dt[1] = month;
		var day = date.getDate();       
        day = (day <10 ? "0" : "") + day;
        dt[2] = day;
    }
    else{
    	dt = received[1].toString().split("-");
		tym = received[2].toString().split(":");
    }
    
    sched[0] = parseInt(dt[0], 10);
    sched[1] = parseInt(dt[1], 10) - 1;
    sched[2] = parseInt(dt[2], 10);
    sched[3] = parseInt(tym[0], 10);
    sched[4] = parseInt(tym[1], 10);
    var job = new Date(sched[0], sched[1], sched[2], sched[3], sched[4], 0);        
    var j = schedule.scheduleJob(job, function(){
        if(received[0] == 'on' || received[0] == 'off'){
			dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').call(received[0]);
			if(received[0] == 'on')
				{toggle_flag = 1;}
			else{toggle_flag = 0;}
			console.log('This is a scheduled job');
        }
        else{
           colorCheck(received[0]); 
        }
    });
}

client.subscribe("wigwag");
client.on('message', function (topic, message){
console.log(message.toString());
var received = message.toString().split(" ");
var input = received[0];

/*Handle requests to turn on lights and to schedule it*/
if (input == 'on'){
	if((received[1]=='none') && (received[2]=='none')){
    	dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').call('on');
    	dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('brightness',brightness);
    	toggle_flag =1;
    }
    else if((received[1]!='none') || (received[2]!='none')){
       parseDT(received);
    }
  }
  
/*Handle requests to read sensor tag and adjust the profile based on that value*/  
else if (input == 'sense'){
	exec.exec('sh ~/Desktop/finalproject/shell.sh');
    console.log('Sensing!!!');
    sleep.sleep(10);
    var fs = require("fs");
    while(!fs.existsSync("myoutput.json")){
    }

	var contents = fs.readFileSync("myoutput.json");
	var jsonContent = JSON.parse(contents);
	console.log(jsonContent.d.light);
	var val = jsonContent.d.light;
	if(val > 500){
		dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('brightness',0.3);
		dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('K', '8000');
    }
	else if(val <= 500){
		dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('brightness',1);
		dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('K', '2000');
    }      	
}

/*Handle requests to turn off lights and to schedule it*/
else if ((input == 'off') && (toggle_flag==1)){
    if((received[1]=='none') && (received[2]=='none')){
        dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').call('off');
        toggle_flag=0;
      }
    else if((received[1]!='none') || (received[2]!='none')){
      parseDT(received);
    }
}
  
/*Handle reuests to change brightness*/
else if ( (toggle_flag == 1) && (bright.indexOf(input) != -1)){
	switch(input){
		case 'max':
		case 'maximum':
			if (color_flag == 0){
				brightness = 1;
				dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('brightness',1);
			}
			else{
				brightness_color=0.5;
				dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('brightness',0.5);
			}
		break;

		case 'min': 
		case 'minimum':
			dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('brightness',0.05);
		break;
    
		case 'decrease':
		case 'reduce':
			if (color_flag == 0){
				brightness = brightness - 0.2;
				dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('brightness',brightness);
			}
			else{
				brightness_color = brightness_color -0.1;
				dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('brightness',brightness_color);
			}
		break;
    
		case 'increase':
			if (color_flag == 0){
				brightness = brightness + 0.2;
				dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('brightness',brightness);
			}
			else{
				brightness_color = brightness_color + 0.1;
				dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('brightness',brightness_color);
			}
        break;
    }}
	
/*Handle requests to change color or mood and to schedule it*/
else if ( (toggle_flag == 1) && (color.indexOf(input) != -1)){
	if((received[1]=='none') && (received[2]=='none')){
		colorCheck(received[0]);
    }
    
    else if((received[1]!='none') || (received[2]!='none')){
          parseDT(received);
     } 
}
 
/*Handle requests to change color temperature*/ 
else if ( (toggle_flag == 1) && (warmth.indexOf(input) != -1)){
    color_flag =0;
	
    switch(input){
		
        case 'warm':
        	dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('K', '2000');
        break;
    	
		case 'neutral':
        case 'normal':
			dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('K', '4000');        
		break;
    	
		case 'cool':
        	dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('K', '8000');
        break;
    	
		case 'daylight':
        case 'hot':
        	dev$.selectByType('Core/Devices/Lighting/WigwagDevices/Filament').set('K', '6000');
        break;   
    }
}       
});
