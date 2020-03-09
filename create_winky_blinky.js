const lights = require('./lights.json');

const board = [];
lights.forEach((row, i) => {
		row.forEach((light, j) => {
		var led = {
			id: light.id,
			x: (i%2 == 1 ? 0 : 5) + j * 10,
			y: i * 10
		};
		board.push(led);
	})
})

const winky_blinky = {
	id: '8c723198-19ef-46fb-93ca-71114cfd151f',
	installationName: 'Will\'s Mac',
	backgroundColor: 'white',
	board: board
}
console.log(JSON.stringify(winky_blinky, undefined, 2));
