var time = {};

time.secToMilli = function(seconds){
	return seconds*1000;
}
time.millisToMinutesAndSeconds = function(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	var decimals = ( ( (millis % 60000 / 1000) % 1 ) * 100).toFixed(0);
	if(decimals == 0 || decimals > 99){
		decimals = 1;
	}
	return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds + ":" + (decimals < 10 ? '0' : '') + decimals;
}

module.exports = time;