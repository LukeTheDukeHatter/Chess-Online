// Need to make it join a game and start moving pieces
if (document.cookie) {
	if (getCookie('uid') && getCookie('roomid')) { // Has both
		console.log('Valid cookies found');
	} else {
		if (getCookie('uid')) { // Has only uid
			window.location.href = 'lobby.html';
		} else {
			deleteCookie('roomid');
			window.location.href = 'login.html'; // Has no cookies or only roomid
		}
	}
} else {
	window.location.href = 'login.html';
}

let socket = new WebSocket('ws://localhost:8765');
function send(type,message) { socket.send(type+'|~~|'+message); }

socket.onopen = () => { send('joingame',getCookie('roomid')+'|~|'+getCookie('uid') ) };
socket.onclose = (e) => { setTimeout(() => { socket = new WebSocket('ws://localhost:8765'); }, 1000) }

const PieceNames = {
	"WKing": "King",
	"WQueen": "Queen",
	"WRook": "Rook",
	"WBishop": "Bishop",
	"WKnight": "Knight",
	"WPawn": "Pawn",
	"BKing": "King",
	"BQueen": "Queen",
	"BRook": "Rook",
	"BBishop": "Bishop",
	"BKnight": "Knight",
	"BPawn": "Pawn"
}
const StandardAbb = {
	"Q": "Queen",
	"Queen": "Q",
	"K": "King",
	"King": "K",
	"P": "Pawn",
	"Pawn": "P",
	"B": "Bishop",
	"Bishop": "B",
	"R": "Rook",
	"Rook": "R",
	"N": "Knight",
	"Knight": "N"
}
const Letters = { // Maps list indexes to chess grid square letters
	0: 'a',
	1: 'b',
	2: 'c',
	3: 'd',
	4: 'e',
	5: 'f',
	6: 'g',
	7: 'h'
};

const ChessGrid = document.getElementById('MainGrid');
let GameBoard = new Board();
let items = document.querySelectorAll('.GridSquare');
let CurrentTeam = '';
var CurrentMove = '';

function SwapMove() { CurrentMove = CurrentMove === 'W' ? 'B' : 'W'; }

function RefreshDragging() {
	if (CurrentMove === CurrentTeam) {
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
	} else {
		document.querySelectorAll('.GridSquare').forEach( item => {
			item.removeEventListener('dragstart', handleDragStart);
			item.removeEventListener('dragend', handleDragEnd);
		});
	}
}

function ResetItemSelector() { items = document.querySelectorAll('.GridSquare'); }

function GenerateGrid(Locals,MovedGrid) {

	for (let x = 0; x < 64; x++) { 																	// Creates all 64 grid squares
		let y = document.createElement('div'); 														// Creates a div element
		let tid = CurrentTeam === "W" ? `${Letters[x%8]}${8-Math.floor(x/8)}` : `${Letters[8-(x%8)-1]}${Math.floor(x/8)+1}`; // Creates the square ID
		y.className = 'GridSquare'; 																// Gives it the GridSquare classname
		y.id = tid; 																				// Assigns the ID to the div
		y.draggable = true; 																		// Enables the HTML5 Drag and Drop API for all squares
		if (tid in Locals) { 																		// Checks if the square requires a piece to be initially placed on it
			let z = document.createElement('img'); 													// Creates an image element
			z.src = `../Images/Pieces/${Locals[tid]}.png`; 											// Sets the image source to the corresponding piece image
			z.className = 'PieceIcon';
			z.classList.add(Locals[tid].endsWith('King') ? `${Locals[tid][0]}King` : `${Locals[tid][0]}TeamPiece`);

			z.Moved = MovedGrid[tid]; 																// Sets the Moved property to false, used for initial piece movement
			y.appendChild(z); 																		// Adds the image to the div
			GameBoard.SetSquare(tid,Locals[tid][0],StandardAbb[PieceNames[Locals[tid]]]); 			// Adds the piece to the Positions array
		}
		ChessGrid.appendChild(y); 																	// Adds the GridSquare to the overall Board
	}

	RefreshDragging();
	ResetItemSelector();

	items.forEach( item => {
		item.addEventListener('drop', handleDrop);
		item.addEventListener('dragover', handleDragOver);
		item.addEventListener('dragenter', handleDragEnter);
		item.addEventListener('dragleave', handleDragLeave);
	})
}

let dragSrcEl;

function handleDragStart(e) {

	this.firstChild.style.opacity = '0.4';

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

		if (this.hasChildNodes()) {
			if (this.firstChild.src.endsWith(`${CurrentTeam === "W" ? "B" : "W"}King.png`)) {
				send('win',getCookie('uid'));
				alert('You win by king capture!');
				deleteCookie('roomid');
				window.location.href='lobby.html';
			}
		}


		GameBoard.MakeMove(dragSrcEl.id, this.id);
		socket.send('sendmove|~~|'+getCookie('uid')+"|~|"+dragSrcEl.id+"|~|"+this.id);
		this.firstChild.Moved = true;

		let TCM = FindCheckMate();

		if (TCM !== false) {
			if (TCM === CurrentTeam) {
				alert('You win by checkmate!');
				deleteCookie('roomid');
				window.location.href = 'lobby.html';
			} else {
				alert('You have lost by checkmate.');
				deleteCookie('roomid');
				window.location.href='lobby.html';
			}
		}

		let CheckSquare = CurrentTeam === 'W' ? '8' : '1';
		if (this.id[1] === CheckSquare) {
			if (this.hasChildNodes()) {
				if (this.firstChild.src.endsWith(`${CurrentTeam}Pawn.png`)) {
					let vo = ['rook','bishop','queen','knight'];
					let c = '';
					while (!vo.includes(c)) {
						c = prompt('What would you like to promote your pawn to? (Rook, Bishop, Queen, Knight)').toLowerCase();
					}
					send('promote',`${getCookie('uid')}|~|${this.id}|~|${CurrentTeam}${c.charAt(0).toUpperCase() + c.slice(1)}`);
				}
			}

		}

		SwapMove();
		RefreshDragging();
	}
	
	items.forEach( (item) => { item.classList.remove('valid'); });

	RefreshDragging();

	dragSrcEl = null;

	return false;

}

socket.onmessage = (e) => {
	let [type,data] = e.data.split('|~~|');

	if (type === 'move') {
		let [id1,id2] = data.split('|~|');
		GameBoard.MakeMove(id1,id2);
		SwapMove();
		RefreshDragging();

		let TCM = FindCheckMate();

		if (TCM !== false) {
			if (TCM === CurrentTeam) {
				send('removeroom',getCookie('roomid'));
				alert('You win by checkmate!');
				deleteCookie('roomid');
				window.location.href = 'lobby.html';
			} else {
				send('removeroom',getCookie('roomid'));
				alert('You have lost by checkmate.');
				deleteCookie('roomid');
				window.location.href='lobby.html';
			}
		}

	} else if (type === 'gamedata') {
		let jsondata = JSON.parse(data);
		CurrentTeam = jsondata['team'];
		CurrentMove = jsondata['turn'];

		let CG = {};
		let MG = {};

		Object.entries(jsondata['cgrid']).forEach(entry => {
			const [key, value] = entry;
			if (value['type'] !== " ") {
				CG[key] = value['type']
				MG[key] = value['moved'];
			}
		});

		GenerateGrid(CG,MG);
	} else if (type === 'promote') {
		let [id,type] = data.split('|~|');
		GameBoard.SetSquare(id,type[0],type.slice(1))
		let sq = document.getElementById(id);
		sq.firstChild.src = `../Images/Pieces/${type}.png`;
	} else if (type === 'loss') {
		alert('You have lost.');
		deleteCookie('roomid');
		window.location.href='lobby.html';
	} else if (type === 'abortjoin') {
		deleteCookie('roomid');
		window.location.href='lobby.html';
	} else if (type === 'abort') {
		alert('The other player has left, you win by forfeit.');
		deleteCookie('roomid');
		window.location.href='lobby.html';
	}
}