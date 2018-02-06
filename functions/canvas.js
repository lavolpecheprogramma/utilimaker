var canvas = {};

canvas.createCanvas = function(append, parent){
	var c = document.createElement('canvas');
	if(append){ parent.appendChild(c); }
	return { domEl: c, ctx: c.getContext("2d") }
}

canvas.cleanCanvas = function(c){
	c.ctx.clearRect(0, 0, c.c_w, c.c_h);
}

canvas.setCanvasDimensions = function(c,w,h) {
	c.domEl.width  = w;
	c.domEl.height = h; 
	c.domEl.style.width  = w+'px';
	c.domEl.style.height = h+'px';
	c.c_w = w;
	c.c_h = h;
};

canvas.setCanvasStyle = function(canvas, style){
	if(style.fillStyle){
		canvas.ctx.fillStyle = style.fillStyle;
	}
	if(style.strokeStyle){
		canvas.ctx.strokeStyle = style.strokeStyle;
	}
	if(style.lineWidth){
		canvas.ctx.lineWidth = style.lineWidth;
	}
}

canvas.drawCircle = function(canvas, data, factor){
	/*
		data = {
			center: {
				x: 0,// normalized x percentage between 0 and 1
				y: 0 // normalized y percentage between 0 and 1
			},
			radius: 10 // radius
		}
		factor: 0.5 // factor to modify radius
	*/
	if(!radius) { radius = 1; }
	canvas.ctx.beginPath();
	canvas.ctx.arc( Math.floor(canvas.c_w*data.center.x), Math.floor(canvas.c_h*data.center.y), Math.floor(data.radius * factor), 0, 2 * Math.PI, false);
	canvas.ctx.stroke();
}

canvas.drawEllipsis = function(canvas, data, factor){
	/*
		data = {
			center: {
				x: 0,// normalized x percentage between 0 and 1
				y: 0 // normalized y percentage between 0 and 1
			},
			radius: {
				x: 0,// radius value on x
				y: 0 // radius value on y
			},
		}
		factor: 0.5 // factor to modify radius and angle
	*/
	if(!radius) { radius = 1; }
	canvas.ctx.beginPath();
	canvas.ctx.ellipse(Math.floor(canvas.c_w*data.center.x), Math.floor(canvas.c_h*data.center.y), Math.floor(data.radius.x * factor), Math.floor(data.radius.y * factor) , (45 * Math.PI/180)* factor, 0, 2 * Math.PI);
	canvas.ctx.stroke();
}

canvas.drawRect = function(canvas, data, freqs){
	/*
		data = {
			center: {
				x: 0,// normalized x percentage between 0 and 1
				y: 0 // normalized y percentage between 0 and 1
			},
			width: 10,
			height: 10
		}
	*/
	canvas.ctx.beginPath();
	canvas.ctx.rect(Math.floor(canvas.c_w*data.center.x), Math.floor(canvas.c_h*data.center.y), data.width, data.height)
	canvas.ctx.stroke();
}

canvas.drawXorPlus = function(canvas, info, freqs){
	canvas.ctx.beginPath();

	var settings = {
		x: Math.floor(canvas.c_w * info.center.x),
		y: Math.floor(canvas.c_h * info.center.y),
		radius: Math.floor(info.width/2)
	}
	canvas.ctx.beginPath();

    canvas.ctx.moveTo(settings.x - settings.radius, settings.y - settings.radius);
    canvas.ctx.lineTo(settings.x + settings.radius, settings.y + settings.radius);

    canvas.ctx.moveTo(settings.x + settings.radius, settings.y - settings.radius);
    canvas.ctx.lineTo(settings.x - settings.radius, settings.y + settings.radius);

    canvas.ctx.stroke();
}
canvas.drawPoly = function(canvas, info, factor){
	var poly= info.points;
	var w = canvas.c_w*factor;
	var h = canvas.c_h*factor;
	w = canvas.c_w; h=canvas.c_h;

	canvas.ctx.beginPath();
	if(info.inverse){
		canvas.ctx.moveTo(Math.floor(canvas.c_w - w * poly[0]), Math.floor(canvas.c_h - h * poly[1]));
		for( item=2 ; item < poly.length-1 ; item+=2 ){
			canvas.ctx.lineTo( Math.floor(canvas.c_w - w * poly[item]) , Math.floor(canvas.c_h - h * poly[item+1]) )
		}
	}else{
		canvas.ctx.moveTo(Math.floor(w * poly[0]), Math.floor( h * poly[1]));
		for( item=2 ; item < poly.length-1 ; item+=2 ){
			canvas.ctx.lineTo( Math.floor(w * poly[item]) , Math.floor(h * poly[item+1]) )
		}
	}
	canvas.ctx.closePath();
	canvas.ctx.fill();
}

canvas.drawBezier = function(canvas, info, factor){
	var w = canvas.c_w*factor;
	var h = canvas.c_h*factor;
	// w =1;h=1;
	var ppts = info.points;

	canvas.ctx.beginPath();
	canvas.ctx.moveTo(Math.floor(w *ppts[0]), Math.floor(h* ppts[1]));
	
	for (var i = 2; i < ppts.length - 3; i++) {
		var c = Math.floor((w *ppts[i] + w *ppts[i + 2]) / 2);
		var d = Math.floor((h *ppts[i+1] + h *ppts[i + 3]) / 2);
		
		canvas.ctx.quadraticCurveTo(Math.floor(w *ppts[i]), Math.floor(h*ppts[i+1]), c, d);
		if(i == ppts.length - 4){
			canvas.ctx.quadraticCurveTo(c,d, Math.floor(w *ppts[0]), Math.floor(h* ppts[1]));
		}
	}
	
	canvas.ctx.stroke();
}

canvas.copyCanvas = function(canvasTo, canvasesFrom, options){
	var opts = options || {};
	var c_w = canvasTo.c_w;
	var c_h = canvasTo.c_h;

	var opacity = opts.opacity || 1;
	var zoomSpeed = opts.zoomSpeed || 0;
	var blurForceX = opts.forceX || 0;
	var blurForceY = opts.forceY || 0;

	var scaleX = 1 + (0.025*zoomSpeed*blurForceX);
	var scaleY = 1 + (0.025*zoomSpeed*blurForceY);
	var offsetFactorX = scaleX < 1 ? -0.5 : 0.5;
	var offsetFactorY = scaleY < 1 ? -0.5 : 0.5;

	var scaledWidth = Math.floor(c_w*scaleX), scaledHeight = Math.floor(c_h*scaleY);
	var offset = {
		x: Math.floor((scaledWidth - c_w) * offsetFactorX),
		y: Math.floor((scaledHeight - c_h) * offsetFactorY)
	};

	
	canvasTo.ctx.globalAlpha = opacity;
	if(canvasesFrom instanceof Array){
		for (var i = 0; i < canvasesFrom.length; i++) {
			canvasTo.ctx.drawImage(canvasesFrom[i].domEl, 0, 0, c_w, c_h, -offset.x, -offset.y, scaledWidth, scaledHeight );
		}
	}else{
		canvasTo.ctx.drawImage(canvasesFrom.domEl, 0, 0, c_w, c_h, -offset.x, -offset.y, scaledWidth, scaledHeight );
	}
}

canvas.glitchCanvas = function(canvas, options){
	var numGlitch = options.numGlitch || 4;
	var maxHorizOffset = options.maxHorizOffset || 20;
	var c_w = canvas.c_w;
	var c_h = canvas.c_h;

	for (var i = 0; i < numGlitch; i++)  {
		var x = Utils.math.getRandom(5, c_w),
			y = Utils.math.getRandom(5, c_h),
			w = Utils.math.getRandom(5, c_w*0.25),
			h = Utils.math.getRandom(5, c_w*0.25);

	    var horizOffset = Utils.math.getRandom(-Math.abs(maxHorizOffset), maxHorizOffset);
	    canvas.ctx.drawImage(canvas.domEl, x, y, w, h, x+horizOffset, y+horizOffset, w, h);
	}
}

module.exports = canvas;