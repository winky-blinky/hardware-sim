const lights = require('./files/lights.json');
const uuid = require('uuid')

var id = uuid.v4();
id = id.substr(1, 7)

const board = [];
lights.lights.forEach((light, i) => {
	var led = {
		lightId: light.id,
		x: i%8 * 10 + 5,
		y: Math.floor(i/8) * 10 + 5
	};
	board.push(led);
})

const winky_blinky = {
	metaData: {
		id,
		installationName: process.argv[2] ? process.argv[2] : "",
		backgroundColor: 'darkGreen'
	},
		board: board
}
console.log(JSON.stringify(winky_blinky, undefined, 2));
