var Utils = {}; 
Utils.MATH = {}; 
Utils.MATH.clamp = function (value, min, max) {
	return min < max
		? (value < min ? min : value > max ? max : value)
		: (value < max ? max : value > min ? min : value)
} 
Utils.MATH.getRandom = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
} 
module.exports = Utils; 
