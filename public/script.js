
var request = new XMLHttpRequest();
var winky_blinky;

function drawLight(context, x, y, color) {
	const gradient = context.createRadialGradient(x+8, y+8, 2, x+8, y+8, 8);
	gradient.addColorStop(0, color);
	gradient.addColorStop(1, "rgba(255,255,255,0.1)");
	context.fillStyle = gradient;
	context.fillRect(x, y, 16, 16);
}

function drawRect(context, x, y, color) {
	console.log("drawing light: ", x, y);
	context.fillStyle = color;
	context.fillRect(x, y, 10, 10);
	context.stroke();
}

function paintBackground(ctx, w, h) {
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, w, h);
}

document.addEventListener("DOMContentLoaded", function() {
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var width = window.innerWidth;
	var height = window.innerHeight;

	canvas.width = width;
	canvas.height = height;

	paintBackground(context, width, height);

	request.open("GET", "http://localhost:5000/winky_blinky");
	request.send();
	request.onload = () => {
		if(request.status === 200) {
			winky_blinky = JSON.parse(request.response);
		}
	}
	var socket = io.connect();

	socket.on('drop', function(data) {
		console.log('captured emitted data ' + JSON.stringify(data));
		winky_blinky.board.find(e => {
			if(e.id == data.id) {
				drawLight(context, e.x, e.y, data.color);
			}
		});
	});
});
