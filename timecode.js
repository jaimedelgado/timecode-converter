/**
*	Author: Jaime Delgado Linares
*	
*	This library converts between frame counts and a SMPTE timecode string representation. It supports frame rates between 25fps and 30DF.
*	The input format is <framerate> <value>. 
*	* <framerate> can be 25fps or 30DF
*	* <value> can be a positive number or a timecode (hours:minutes:seconds:frames) if the framerate is 25fps or (hours:minutes:seconds;frames) if *	the framerate is 30DF
*		
*/

//Reads a given file and writes the result in the explorer
function readTextFile(file)
{
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", file, false);
	rawFile.onreadystatechange = function(){
		if(rawFile.readyState === 4){
			if(rawFile.status === 200 || rawFile.status == 0){
				var allText = rawFile.responseText;
				var lines = allText.split("\n");
				for( i=0; i<lines.length-1; i++){
					var line = lines[i];
					document.write(convert(line)+"</br>");
				}
		    	}
		}
	}
    	rawFile.send(null);
}

//Main function that converts the input to the expected output
function convert(input){
	var inputSplit = input.split(" ");
	var frameRate = getFrameRate(inputSplit[0]);
	var value = inputSplit[1];
	var output = toTimeCode(frameRate, Number(value));
	if (output == -1 ) {
		output = toFrameCount(frameRate, value);
		if (output == -1 ) {
			return "WrongInput";
		}else {
			return output;
		}
	}else {
		return output;
	}
}

// Parse frame rate input. Returns -1 if error
function getFrameRate(input){
	if ( input.toUpperCase() == "25FPS" ){
		return 25;
	}else if ( input.toUpperCase() == "30DF" ){
		return 29.97;
	}else{
		return -1;
	}
}

//Calculates timecode string representation given the framerate and framenumber. Returns -1 if error
function toTimeCode (frameRate, frameNumber){
	var is = Number.isInteger(frameNumber);
	if (Number.isInteger(frameNumber) && frameNumber >= 0){
		var frames = Math.round(frameNumber % frameRate);
		var seconds = Math.floor((frameNumber / frameRate) % 60);
		var minutes = Math.floor(((frameNumber / frameRate) / 60) % 60);
		var hours = Math.floor(((frameNumber / frameRate) / 60) / 60);	
		var aux = ":";		
		if (frameRate == 29.97 ) { 
			aux = ";"; 
		}
		return  ("0" + hours).slice (-2) + ":" + 
			("0" + minutes).slice (-2) + ":" + 
			("0" + seconds).slice (-2) + aux + 
			("0" + frames).slice (-2); 	
	} else {
		return -1;
	}
}

//Calculates frame count given a timecode string representation. Returns -1 if error
function toFrameCount (frameRate, timeCode){
	if (frameRate == 25) { 
		return toFrameCount25fps(frameRate, timeCode); 
	} else if(frameRate == 29.97) {
		return toFrameCount30DF(frameRate, timeCode);
	}
}

//Calculates frame count given a timecode string representation with frameRate=25. Returns -1 if error
function toFrameCount25fps(frameRate, timeCode){
	var timeCodeSplit = timeCode.split(":");
	var frames = parseInt(timeCodeSplit[3]);
	var seconds = parseInt(timeCodeSplit[2]);
	var minutes = parseInt(timeCodeSplit[1]);
	var hours = parseInt(timeCodeSplit[0]);
	if(isCorrect(frames,frameRate,"frames") && 
		isCorrect(seconds,frameRate,"seconds") &&
		isCorrect(minutes,frameRate,"minutes") &&
		isCorrect(hours,frameRate,"hours")){
		return frames + seconds*frameRate + minutes*frameRate*60 + hours*frameRate*60*60;
	}else{
		return -1;
	}
} 

//Calculates frame count given a timecode string representation with frameRate=30. Returns -1 if error
function toFrameCount30DF(frameRate, timeCode){
	var timeCodeSplit = timeCode.split(":");
	var frames = parseInt(timeCode.split(";")[1]);
	var seconds = parseInt(timeCodeSplit[2]);
	var minutes = parseInt(timeCodeSplit[1]);
	var hours = parseInt(timeCodeSplit[0]);
	if(isCorrect(frames,frameRate,"frames") && 
		isCorrect(seconds,frameRate,"seconds") &&
		isCorrect(minutes,frameRate,"minutes") &&
		isCorrect(hours,frameRate,"hours")){
		return Math.round(frames + seconds*frameRate + minutes*frameRate*60 + hours*frameRate*60*60);
	}else{
		return -1;
	}
} 

//Checks if a number of a timecode string representation is correct given the number, the frameRate and the type (frames, seconds, minutes, or hours)
function isCorrect(number, frameRate, type){
	if (type == "frames"){
		if(Number.isInteger(number) && number >= 0 && number < frameRate) {
			return true;
		}else{
			return false;
		}
	} else if(type == "hours"){
		if(Number.isInteger(number) && number >= 0 && number < 100) {
			return true;
		}else{
			return false;
		}
	} else {
		if(Number.isInteger(number) && number >= 0 && number < 60) {
			return true;
		}else{
			return false;
		}
	}
}
