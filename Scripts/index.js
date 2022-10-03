// Select Piece Starting Positions
const Locals = {"a8":"BRook","b8":"BKnight","c8":"BBishop","d8":"BKing","e8":"BQueen","f8":"BBishop","g8":"BKnight","h8":"BRook","a7":"BPawn","b7":"BPawn","c7":"BPawn","d7":"BPawn","e7":"BPawn","f7":"BPawn","g7":"BPawn","h7":"BPawn",
		  		"a1":"WRook","b1":"WKnight","c1":"WBishop","d1":"WKing","e1":"WQueen","f1":"WBishop","g1":"WKnight","h1":"WRook","a2":"WPawn","b2":"WPawn","c2":"WPawn","d2":"WPawn","e2":"WPawn","f2":"WPawn","g2":"WPawn","h2":"WPawn"};

const PieceNames = {"WKing":"King","WQueen":"Queen","WRook":"Rook","WBishop":"Bishop","WKnight":"Knight","WPawn":"Pawn",
					"BKing":"King","BQueen":"Queen","BRook":"Rook","BBishop":"Bishop","BKnight":"Knight","BPawn":"Pawn"}

const StandardAbb = {
	"Q":"Queen",
	"K":"King",
	"P":"Pawn",
	"B":"Bishop",
	"R":"Rook"
}

class Piece {
	constructor(team,type) {
		this.team = team;
		this.type = type;
		this.image = type
	}
}

const PossibleMoves = {
	"King": ['-1:-1', '-1:0', '-1:1', '0:-1', '0:0', '0:1', '1:-1', '1:0', '1:1'],
	"Queen": {'*':15},
	"Rook": {'F':15,'B':15,'L':15,'R':15},
	"Bishop": {'DFL':15,'DFR':15,'DBL':15,'DBR':15},
	"Knight": {},
	"Pawn": {}
}



var Positions = [
	['','','','','','','',''],
	['','','','','','','',''],
	['','','','','','','',''],
	['','','','','','','',''],
	['','','','','','','',''],
	['','','','','','','',''],
	['','','','','','','',''],
	['','','','','','','','']
];

const Mapper = {'8':0,'7':1,'6':2,'5':3,'4':4,'3':5,'2':6,'1':7,
				'a':0,'b':1,'c':2,'d':3,'e':4,'f':5,'g':6,'h':7}

function ChangeSquare(id,Pce) { Positions[Mapper[id[1]]][Mapper[id[0]]] = Pce }

const ChessGrid = document.getElementById('MainGrid');
const Letters = {0:'a',1:'b',2:'c',3:'d',4:'e',5:'f',6:'g',7:'h'};
for (let x = 0; x < 64; x++) {
	let y = document.createElement('div');
	y.className = 'GridSquare';
	y.draggable = true;
	let tid = `${Letters[x%8]}${8-Math.floor(x/8)}`;
	y.id = tid;

	if (tid in Locals) {
		let z = document.createElement('img');
		z.src = `../Images/Pieces/${Locals[tid]}.png`;
		z.className = 'PieceIcon';

		y.appendChild(z);

		ChangeSquare(tid,PieceNames[Locals[tid]]);
	}

	ChessGrid.appendChild(y);
	console.log
}

// Drag handling start

let items = document.querySelectorAll('.GridSquare');

function handleDragStart(e) {
	this.firstChild.style.opacity = '0.4'

	dragSrcEl = this;
  
	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/html', this.innerHTML);

	let GRef = this.id;
	let TheStuff = {'a':0,'b':1,'c':2,'d':3,'e':4,'f':5,'g':6,'h':7,0:'a',1:'b',2:'c',3:'d',4:'e',5:'f',6:'g',7:'h'};
	let Order = ['a','b','c','d','e','f','g','h']

	pname = this.firstChild.src.split('/')[5].split('.')[0];

	let possible = []

	if (PieceNames[pname] == 'Pawn') {
	
	} else if (PieceNames[pname] == 'Knight') {
	
	} else if (PieceNames[pname] == 'Bishop') {

	} else if (PieceNames[pname] == 'Rook') {
	
	} else if (PieceNames[pname] == 'Queen') {

	} else if (PieceNames[pname] == 'King') {
		let xnums = [-1,0,1];
		let ynums = [-1,0,1];

		let fp = GRef[0];
		let sp = GRef[1];

		xnums.forEach(function (x) {
			ynums.forEach(function (y) {
				let newx = (TheStuff[fp] + x);
				let newy = parseInt(sp) + y;
				console.log(newy);
				if (newx >= 0 && newx <= 7 && newy >= 1 && newy <= 8) {
					possible.push(`${TheStuff[newx]}${newy}`);
				}
				console.log(possible);
			});
		});
	}

	possible.forEach(function (item) {
		console.log(item);
		document.getElementById(item).classList.add('valid');
		console.log('item');
	});

}

function handleDragEnd(e) {
	this.firstChild.style.opacity = '1';

	items.forEach(function (item) {
		item.classList.remove('valid');
	});
}
function handleDragOver(e) {
	e.preventDefault();
	return false;
}
function handleDragEnter(e) { this.classList.add('over'); }
function handleDragLeave(e) { this.classList.remove('over'); }

function handleDrop(e) {
	e.stopPropagation();
  
	if (dragSrcEl !== this && this.classList.contains('valid')) {
	  dragSrcEl.innerHTML = this.innerHTML;
	  this.innerHTML = e.dataTransfer.getData('text/html');
	  this.firstChild.style.opacity = '1'
	}
	
	items.forEach(function (item) {
		item.classList.remove('valid');
	});

	return false;
  }

items.forEach(function(item) {
	item.addEventListener('dragstart', handleDragStart);
	item.addEventListener('dragover', handleDragOver);
	item.addEventListener('dragenter', handleDragEnter);
	item.addEventListener('dragleave', handleDragLeave);
	item.addEventListener('dragend', handleDragEnd);
	item.addEventListener('drop', handleDrop);
});

// Drag handling end