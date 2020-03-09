const uuid = require('uuid');

const lights = [];
for(i=0; i<5; ++i) {
	var row = []
	lights.push(row);
	for(j=0; j<21; ++j) {
		if(j==10) {
			row = [];
			lights.push(row);
		}
		row.push( { id: uuid.v4(), color: 'white', on: 'true' } );
	}
}
console.log(JSON.stringify(lights));
