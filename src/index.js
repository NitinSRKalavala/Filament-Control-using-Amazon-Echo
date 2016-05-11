var APP_ID = "amzn1.echo-sdk-ams.app.089033ed-7d95-4535-b4b3-54e0978041c3";

var mqtt    = require('mqtt');
var client;

var Mood_Color = ['red', 'blue', 'green', 'yellow', 'white'];
var Temp_Warmth = ['hot', 'warm', 'daylight', 'cool', 'normal', 'neutral']

var AlexaSkill = require('./AlexaSkill');

//Creating a child of Alexa
var WigWag = function() {
	AlexaSkill.call(this, APP_ID);
};

//Extend AlexaSkill
WigWag.prototype = Object.create(AlexaSkill.prototype);
WigWag.prototype.constructor = WigWag;

WigWag.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("WigWag onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
		
		
};

WigWag.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("WigWag onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to Wig Wag";
    var repromptText = "You can control the lights";
    response.ask(speechOutput, repromptText);
};

WigWag.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("WigWag onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

function sendBrightness(intent)
{
	var brightness = intent.slots.IncDec;		
    client.publish('wigwag', brightness.value);	
	client.end();
}

function sendMood(intent)
{
	var color = intent.slots.Color;
	var colorvalue = color.value;
    if(Mood_Color.indexOf(colorvalue.toLowerCase()) != -1 ){
	   return{
		   error: false,
		   color_mood: colorvalue
		 }
	}
	else{
		return{
			error: true
        }
	}
}

function sendTemp(intent)
{
	var temp = intent.slots.Warmth;
	var temp_value = temp.value;
    if(Temp_Warmth.indexOf(temp_value.toLowerCase()) != -1 ){
	   return{
		   error: false,
		   warmth_value: temp_value
		 }
	}
	else{
		return{
			error: true
        }
	}
}

WigWag.prototype.intentHandlers = {
	"Introduce": function(intent, session, response) {
		var speechOutput = "Hey there, I am Alexa. How are you guys doing?"
						   + "     "
		                   + "These guys here have programmed me, to control the wig wag lights."
						   + "     "
						   + "It has been wonderful to work with them and they are awesome!"
						   + "     "
						   + "Enjoy the presentation!";
		response.tell(speechOutput);
	},
	"OnOff": function(intent, session, response) {
		var toggle = intent.slots.Turn;
		var toggle_value = toggle.value;
		var daySlot = intent.slots.Day;
		var timeSlot = intent.slots.Time;
		
	    if (daySlot && daySlot.value) {
			var day = daySlot.value;
		} else {
			day = "none";
		}
		if (timeSlot && timeSlot.value) {
			var time = timeSlot.value;			
		} else {
			time = "none";
		}
		response.tell("Turning the lights " + toggle_value);
		client.publish('wigwag', toggle_value.toLowerCase() + " " + day + " " + time);
		client.end();
		},
    "Brightness": function(intent, session, response) {
		response.tell("Changing the brightness");
		sendBrightness(intent);		
		},
    "Mood": function(intent, session, response) {
		var mood = sendMood(intent),
		    speechOutput;
		var daySlot = intent.slots.Day;
		var timeSlot = intent.slots.Time;
		
	    if (daySlot && daySlot.value) {
			var day = daySlot.value;
		} else {
			day = "none";
		}
		if (timeSlot && timeSlot.value) {
			var time = timeSlot.value;			
		} else {
			time = "none";
		}
		
		if (mood.error == true){
		   speechOutput = "Try a different mood";
		   client.end();
		   response.tell(speechOutput);
		   return;
		}
		else{
		  response.tell("Changing the mood" );
		  client.publish('wigwag', mood.color_mood + " " + day + " " + time);	
		  client.end();
		}
		},
	"Temperature": function(intent, session, response) {
		var tmp = sendTemp(intent),
		    speechOutput;
        if (tmp.error == true){
		   speechOutput = "Try a different temperature";
		   client.end();
		   response.tell(speechOutput);
		   return;
		}
		else{
			response.tell("Changing the temperature");
			client.publish('wigwag', tmp.warmth_value);	
		    client.end();
		}
		},
	"SensibleLight": function(intent, session, response) {
		response.tell("Reading the sensor tag");
		client.publish('wigwag', 'sense');		
		client.end();
		}
	};
		
exports.handler = function(event, context){
    var wigwag = new WigWag();
    client  = mqtt.connect('mqtt://test.mosca.io');
	client.on('connect',function(){
		wigwag.execute(event, context);
	});
}	