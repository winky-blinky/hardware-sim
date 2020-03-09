
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const PORT = 5000;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

var socket;
io.on('connection', function (s) {
	console.log("CONNECTED")
	socket = s;
});

const board = require('./board.json');
var lights = { objects: [] };
board.forEach(row => {
	row.forEach(led => {
		lights.objects.push(led);
	})
})

const winky_blinky = require('./winky_blinky.json');
app.get('/winky_blinky', function (req, res) {
  res.send(winky_blinky)
})

app.get('/lights', function (req, res) {
  res.send(lights)
})

app.get('/lights/:id', function (req, res) {
	const results = lights.objects.filter((light) => { return req.params.id == light.id });
	!results.length ? res.status(404).send("Not found.") : res.send( results[0] );
});

app.put('/lights/:id', function (req, res) {
	console.log("/lights/" + req.params.id);
	console.log(req.body);

	var light = lights.objects.find(l => { return req.params.id == l.id });
	if(light) {
		light = {...light, ...req.body};
		lights.objects = lights.objects.map(l => l.id == light.id ? {...l, ...light} : l );
		console.log("emitting data: " + light.color);
		io.local.emit('drop', light);
		res.status(202).send(light);
	} else {
		res.status(404).send("Not found.");
	}
});

http.listen(PORT, function() {
	console.log('Server running on port ' + PORT);
});
