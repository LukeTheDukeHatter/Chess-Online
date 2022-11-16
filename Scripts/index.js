// Select Piece Starting Positions

const Locals = {"a8":"BRook","b8":"BKnight","c8":"BBishop","d8":"BQueen","e8":"BKing","f8":"BBishop","g8":"BKnight","h8":"BRook",
				"a7":"BPawn","b7":"BPawn","c7":"BPawn","d7":"BPawn","e7":"BPawn","f7":"BPawn","g7":"BPawn","h7":"BPawn",
		  		"a1":"WRook","b1":"WKnight","c1":"WBishop","d1":"WQueen","e1":"WKing","f1":"WBishop","g1":"WKnight","h1":"WRook",
				"a2":"WPawn","b2":"WPawn","c2":"WPawn","d2":"WPawn","e2":"WPawn","f2":"WPawn","g2":"WPawn","h2":"WPawn"};

const CurrentTeam = 'W';

// const DefaultLocationRows = {
// 	"BlackRow1":["BRook","BKnight","BBishop","BQueen","BKing","BBishop","BKnight","BRook"],
// 	"BlackRow2":["BPawn","BPawn",  "BPawn",  "BPawn", "BPawn","BPawn",  "BPawn",  "BPawn"],
// 	"WhiteRow1":["WRook","WKnight","WBishop","WQueen","WKing","WBishop","WKnight","WRook"],
// 	"WhiteRow2":["WPawn","WPawn",  "WPawn",  "WPawn", "WPawn","WPawn",  "WPawn",  "WPawn"]
// }

const Mapper = {'8':0,'7':1,'6':2,'5':3,'4':4,'3':5,'2':6,'1':7,'a':0,'b':1,'c':2,'d':3,'e':4,'f':5,'g':6,'h':7}

const PieceNames = {"WKing":"King","WQueen":"Queen","WRook":"Rook","WBishop":"Bishop","WKnight":"Knight","WPawn":"Pawn","BKing":"King","BQueen":"Queen","BRook":"Rook","BBishop":"Bishop","BKnight":"Knight","BPawn":"Pawn"}
		
const StandardAbb = {
	"Q":"Queen",
	"K":"King",
	"P":"Pawn",
	"B":"Bishop",
	"R":"Rook",
	"N":"Knight",
	"Queen":"Q",
	"King":"K",
	"Pawn":"P",
	"Bishop":"B",
	"Rook":"R",
	"Knight":"N"
}

class Piece {
	constructor(team,type,id) {
		this.team = team;
		this.type = type;
		this.image = team + StandardAbb[type];
		this.dead = false;
		this.hasMoved = false;
		this.id = id;
	}
}

class Board {
	constructor() {
		this.grid = [
			[null,null,null,null,null,null,null,null],
			[null,null,null,null,null,null,null,null],
			[null,null,null,null,null,null,null,null],
			[null,null,null,null,null,null,null,null],
			[null,null,null,null,null,null,null,null],
			[null,null,null,null,null,null,null,null],
			[null,null,null,null,null,null,null,null],
			[null,null,null,null,null,null,null,null]
		]
		this.pieces = {};
		this.selected = null;
		this.turn = "White";
		this.moves = [];
		this.possibleMoves = [];
		this.check = false;
		this.checkmate = false;
		this.Mapper = {'8':0,'7':1,'6':2,'5':3,'4':4,'3':5,'2':6,'1':7,'a':0,'b':1,'c':2,'d':3,'e':4,'f':5,'g':6,'h':7}
	}

	SetSquare(id,tm,te) { this.grid[Mapper[id[1]]][this.Mapper[id[0]]] = new Piece(tm,te,id) }
	GetSquare(id) { return this.grid[Mapper[id[1]]][this.Mapper[id[0]]]; }
	MakeMove(id1,id2 ) { 
		this.grid[Mapper[id2[1]]][this.Mapper[id2[0]]] = this.grid[Mapper[id1[1]]][this.Mapper[id1[0]]];
		this.grid[Mapper[id1[1]]][this.Mapper[id1[0]]] = null;
	}
}

var GameBoard = new Board();



const ChessGrid = document.getElementById('MainGrid');

const Letters = {0:'a',1:'b',2:'c',3:'d',4:'e',5:'f',6:'g',7:'h'}; 								// Maps list indexes to chess grid square letters

for (let x = 0; x < 64; x++) { 																	// Creates all 64 grid squares
	let y = document.createElement('div'); 														// Creates a div element
	let tid = CurrentTeam == "W" ? `${Letters[x%8]}${8-Math.floor(x/8)}` : `${Letters[x%8]}${Math.floor(x/8)+1}`; // Creates the square id
	y.className = tid in Locals ? 'GridSquare ' + Locals[tid][0] + 'team' : 'GridSquare'; 		// Gives it the GridSquare classname
	y.id = tid; 																				// Assigns the id to the div
	y.draggable = true; 																		// Enables the HTML5 Drag and Drop API for all squares
	if (tid in Locals) { 																		// Checks if the square requires a piece to be initially placed on it
		let z = document.createElement('img'); 													// Creates an image element 
		z.src = `../Images/Pieces/${Locals[tid]}.png`; 											// Sets the image source to the corresponding piece image
		z.className = 'PieceIcon'; 											// Sets the image classname to PieceIcon and the piece type
		y.appendChild(z); 																		// Adds the image to the div
		GameBoard.SetSquare(tid,Locals[tid][0],StandardAbb[PieceNames[Locals[tid]]]); 			// Adds the piece to the Positions array
	}
	ChessGrid.appendChild(y); 																	// Adds the GridSquare to the overall Board 
}

function RefreshDragging() {																	
	document.querySelectorAll('.GridSquare').forEach( item => {
		if ( item.hasChildNodes() ) {
			if ( !isOpposingPiece( item.id, CurrentTeam ) ) {
				item.addEventListener('dragstart', handleDragStart);
				item.addEventListener('dragend', handleDragEnd);

			}
		} else {
			item.removeEventListener('dragstart', handleDragStart);
			item.removeEventListener('dragend', handleDragEnd);
		}
	})
}

RefreshDragging();

// ====================================================================
// ==================-- Drag Handling Start --=========================
// ====================================================================

let items = document.querySelectorAll('.GridSquare');

items.forEach( item => {
	item.addEventListener('drop', handleDrop);
	item.addEventListener('dragover', handleDragOver);
	item.addEventListener('dragenter', handleDragEnter);
	item.addEventListener('dragleave', handleDragLeave);
})


function handleDragStart(e) {

	this.firstChild.style.opacity = '0.4'

	dragSrcEl = this;
  
	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/html', this.innerHTML);

	let GRef = this.id;

	let pname = this.firstChild.src.split('/').slice(-1)[0].split('.')[0];

	let possible = CalculateValidPoints(GRef, pname);

	possible.forEach( (item) => { document.getElementById(item).classList.add('valid'); });
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
		// dragSrcEl.innerHTML = this.innerHTML;
		GameBoard.MakeMove(dragSrcEl.id, this.id);
		dragSrcEl.innerHTML = null;
	    this.innerHTML = e.dataTransfer.getData('text/html');
		this.firstChild.style.opacity = '1'
	}
	
	items.forEach(function (item) {
		item.classList.remove('valid');
	});

	RefreshDragging();

	return false;
}

// ====================================================================
// ===================-- Drag Handling Stop --=========================
// ====================================================================

// https://www.chessprogramming.org/Minimax
// https://www.chessprogramming.org/Negamax
// https://www.chessprogramming.org/Make_Move
// https://www.chessprogramming.org/Unmake_Move




// https://pawnbreak.com/how-to-capture-pieces/#:~:text=The%20rule%20is%20simple%3A%20if,the%20Knight%2C%20and%20the%20King.
// https://www.jimmyvermeer.com/rules.html#:~:text=This%20rule%20is%20enforced%20even,piece%20you%20touched%2C%20if%20possible.
// https://levelup.gitconnected.com/chess-python-ca4532c7f5a4#:~:text=If%20its%20free%20that%20space,then%20that%20piece%20becomes%20killable.
// https://www.google.com/search?q=chess+when+is+a+piece+killable&rlz=1C1GCEA_enGB981GB981&oq=chess+when+is+a+piece+killable&aqs=chrome..69i57j33i160l2j33i22i29i30.5169j0j7&sourceid=chrome&ie=UTF-8



// ====================================================================
// Connect to websocket 
// ====================================================================


// var socket = new WebSocket('ws://localhost:8765');
// socket.onopen = () => {
// 	console.log('Connected to websocket server');
// 	socket.send('Hello from client');
// };