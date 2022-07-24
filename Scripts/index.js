const ChessGrid = document.getElementById('MainGrid');
const Letters = {0:'a',1:'b',2:'c',3:'d',4:'e',5:'f',6:'g',7:'h'};
for (let x = 0; x < 64; x++) {
	let y = document.createElement('div');
	y.className = 'GridSquare';
	y.id = `${Letters[x%8]}${8-Math.floor(x/8)}`;
	ChessGrid.appendChild(y);
	console.log
}