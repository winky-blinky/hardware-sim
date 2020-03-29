
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var http = require('http');
const httpServer = http.Server(app)
var io = require('socket.io')(httpServer);
var Promise = require('promise');

const PORT = 5000;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

var socket;
io.on('connection', function (s) {
	console.log("CONNECTED")
	socket = s;
});

const lights = require('./lights.json');

const winky_blinky = require('./winky_blinky.json');
app.get('/winky_blinkies/:id', function (req, res) {
  res.status(200).send(winky_blinky)
})

app.get('/lights', function (req, res) {
  res.status(200).send(lights)
})

app.get('/lights/:id', function (req, res) {
	const results = lights.objects.filter((light) => { return req.params.id == light.id });
	!results.length ? res.status(404).send("Not found.") : res.send( results[0] );
});

app.put('/lights/:id', function (req, res) {
	console.log("/lights/" + req.params.id);
	console.log(JSON.stringify(req.body));

	var light = lights.objects.find(l => { return req.params.id == l.id });
	if(light) {
		light = {...light, ...req.body};
		lights.objects = lights.objects.map(l => l.id == light.id ? {...l, ...light} : l );
		console.log("emitting data: " + light.color);
		new Promise((resolve, reject) => {
			io.local.emit('drop', light);
		}).then(() => {
			console.log("emitted");
			resolve();
		});
		res.status(200).send(light);
	} else {
		res.status(404).send("Not found.");
	}
});

httpServer.listen(PORT, function() {
	console.log('Server running on port ' + PORT);
});

httpServer.on('error', err => {
	console.log(err);
})
