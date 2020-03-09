
var request = new XMLHttpRequest();
var winky_blinky;

function drawLight(context, x, y, color) {
	console.log("drawing light: ", x, y);
	context.fillStyle = color;
	context.fillRect(x, y, 10, 10);
	context.stroke();
}

document.addEventListener("DOMContentLoaded", function() {
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var width = window.innerWidth;
	var height = window.innerHeight;

	canvas.width = width;
	canvas.height = height;

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
