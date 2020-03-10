
const request = new XMLHttpRequest();
var winky_blinky;
const X0 = 20
const Y0 = 20

function drawLight(context, x, y, color) {
	const gradient = context.createRadialGradient(x+X0, y+Y0, 2, x+X0, y+Y0, 8);
	gradient.addColorStop(0, color);
	gradient.addColorStop(1, "rgba(0,0,0,0)");
	context.fillStyle = gradient;
	context.fillRect(x+X0-5, y+Y0-5, 16, 16);
}

function paintBackground(ctx, w, h) {
	ctx.fillStyle = '#202020';
	ctx.fillRect(0, 0, 140, 120);
}

function drawBoard(context, winky_blinky) {
	winky_blinky.board.forEach(light => {
		context.beginPath();
		context.arc(light.x + X0, light.y + Y0, 5, 0, 2 * Math.PI, false);
		context.fillStyle = "#303030";
		context.lineWidth = 1;
		context.fill();
		// context.stroke();
	});
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
			drawBoard(context, winky_blinky);
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
