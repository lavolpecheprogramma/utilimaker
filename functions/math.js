var math = {};

math.clamp = function(value, min, max) {
	return min < max
		? (value < min ? min : value > max ? max : value)
		: (value < max ? max : value > min ? min : value)
}

math.getRandom = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

math.normalize = function (x, min, max){
	return (x-min)/(max-min)
}

module.exports = math;