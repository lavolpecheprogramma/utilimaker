var geometry = {};

geometry.calculateDelta = function(p1,p2){
    return {
    	x: p2.x - p1.x,
    	y: p2.y - p1.y
    }
}
geometry.distancePoints = function (x1,x2,y1,y2){
	var a = x1 - x2
	var b = y1 - y2

	return Math.sqrt( a*a + b*b );
}

geometry.calculateCenterBetweenPoints = function(p1, p2){
	var delta = Utils.geometry.calculateDelta(p1,p2);
	delta.x = delta.x/2;
	delta.y = delta.y/2;
	return {
		x: p2.x - delta.x,
		y: p2.y - delta.y
	}
}

geometry.radians = function(degrees) {
  return degrees * Math.PI / 180;
}

// Converts from radians to degrees.
geometry.degrees = function(radians) {
  return radians * 180 / Math.PI;
}

geometry.generateShape = function(vertex){
	generatedPoint = {
		points: [],
		min:{ x:999999999999, y:999999999999 },
		max:{ x:0, y:0 },
	};
	
	for (var i = 0; i < vertex; i++) {
		var x = Math.random();
		var y = Math.random();
		
		generatedPoint.points.push(x);
		generatedPoint.points.push(y);

		if(generatedPoint.min.x > x){ generatedPoint.min.x = x; }
		if(generatedPoint.max.x < x){ generatedPoint.max.x = x; }
		if(generatedPoint.min.y > y){ generatedPoint.min.y = y; }
		if(generatedPoint.max.y < y){ generatedPoint.max.y = y; }
	}

	generatedPoint.center = Utils.geometry.calculateCenterBetweenPoints(generatedPoint.min, generatedPoint.max);
	return generatedPoint;
}

module.exports = geometry;