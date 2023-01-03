// Select Piece Starting Positions

if (document.cookie) {
	if (getCookie('uid') && getCookie('roomid')) {
		console.log('Valid cookies found');
	} else {
		if (getCookie('uid')) {
			window.location.href = 'lobby.html';
		} else if (getCookie('roomid')) {
			setCookie('roomid' , '');
		}
		window.location.href = 'login.html';
	}
} else {
	window.location.href = 'login.html';
}


const Locals = {"a8":"BRook","b8":"BKnight","c8":"BBishop","d8":"BQueen","e8":"BKing","f8":"BBishop","g8":"BKnight","h8":"BRook",
				"a7":"BPawn","b7":"BPawn","c7":"BPawn","d7":"BPawn","e7":"BPawn","f7":"BPawn","g7":"BPawn","h7":"BPawn",
		  		"a1":"WRook","b1":"WKnight","c1":"WBishop","d1":"WQueen","e1":"WKing","f1":"WBishop","g1":"WKnight","h1":"WRook",
				"a2":"WPawn","b2":"WPawn","c2":"WPawn","d2":"WPawn","e2":"WPawn","f2":"WPawn","g2":"WPawn","h2":"WPawn"};


var CurrentTeam = 'B';

const PieceNames = {"WKing":"King","WQueen":"Queen","WRook":"Rook","WBishop":"Bishop","WKnight":"Knight","WPawn":"Pawn","BKing":"King","BQueen":"Queen","BRook":"Rook","BBishop":"Bishop","BKnight":"Knight","BPawn":"Pawn"}

const StandardAbb = {
	"Q":"Queen","Queen":"Q",
	"K":"King","King":"K",
	"P":"Pawn","Pawn":"P",
	"B":"Bishop","Bishop":"B",
	"R":"Rook","Rook":"R",
	"N":"Knight","Knight":"N"
}


var GameBoard = new Board();

const ChessGrid = document.getElementById('MainGrid');

const Letters = {0:'a',1:'b',2:'c',3:'d',4:'e',5:'f',6:'g',7:'h'}; 								// Maps list indexes to chess grid square letters

for (let x = 0; x < 64; x++) { 																	// Creates all 64 grid squares
	let y = document.createElement('div'); 														// Creates a div element
	let tid = CurrentTeam == "W" ? `${Letters[x%8]}${8-Math.floor(x/8)}` : `${Letters[8-(x%8)-1]}${Math.floor(x/8)+1}`; // Creates the square id
	y.className = tid in Locals ? 'GridSquare ' + Locals[tid][0] + 'team' : 'GridSquare'; 		// Gives it the GridSquare classname
	y.id = tid; 																				// Assigns the id to the div
	y.draggable = true; 																		// Enables the HTML5 Drag and Drop API for all squares
	if (tid in Locals) { 																		// Checks if the square requires a piece to be initially placed on it
		let z = document.createElement('img'); 													// Creates an image element 
		z.src = `../Images/Pieces/${Locals[tid]}.png`; 											// Sets the image source to the corresponding piece image
		z.className = 'PieceIcon'; 																// Sets the image classname to PieceIcon and the piece type
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

function ResetBoard() {
	items = document.querySelectorAll('.GridSquare');
}


items.forEach( item => {
	item.addEventListener('drop', handleDrop);
	item.addEventListener('dragover', handleDragOver);
	item.addEventListener('dragenter', handleDragEnter);
	item.addEventListener('dragleave', handleDragLeave);
})

var dragSrcEl;

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

	items.forEach( (item) => { item.classList.remove('valid'); });
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
		GameBoard.MakeMove(dragSrcEl.id, this.id);
		socket.send('sendmove|~~|'+getCookie('uid')+"|~|"+dragSrcEl.id+"|~|"+this.id)
	}
	
	items.forEach( (item) => { item.classList.remove('valid'); });

	RefreshDragging();

	dragSrcEl = null;

	return false;
}

// ====================================================================
// ===================-- Drag Handling Stop --=========================
// ====================================================================


// ====================================================================
// =====================-- Connect to websocket --=====================
// ====================================================================

const socket = new WebSocket('ws://localhost:8765');

function send(type,message) { socket.send(type+'|~~|'+message); }


socket.onopen = () => { 
	send()
};


socket.onmessage = (e) => {
	var type,data = e.data.split('|~~|');
	if (type == 'move') {
		var id1,id2 = data.split('|~|');
		GameBoard.MakeMove(id1,id2);
	}
}