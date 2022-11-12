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
	"R":"Rook",
	"N":"Knight"
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

const Mapper = {'8':0,'7':1,'6':2,'5':3,'4':4,'3':5,'2':6,'1':7,'a':0,'b':1,'c':2,'d':3,'e':4,'f':5,'g':6,'h':7}

function ChangeSquare(id,Pce) { Positions[Mapper[id[1]]][Mapper[id[0]]] = Pce }

const ChessGrid = document.getElementById('MainGrid');
const Letters = {0:'a',1:'b',2:'c',3:'d',4:'e',5:'f',6:'g',7:'h'}; 	// Maps list indexes to chess grid square id's
for (let x = 0; x < 64; x++) { 										// Creates all 64 grid squares
	let y = document.createElement('div'); 							// Creates a div element
	y.className = 'GridSquare'; 									// Gives it the GridSquare classname
	y.draggable = true; 											// Enables the HTML5 Drag and Drop API
	let tid = `${Letters[x%8]}${8-Math.floor(x/8)}`; 				// Creates the square id
	y.id = tid; 													// Assigns the id to the div
	if (tid in Locals) { 											// Checks if the square requires a piece to be initially placed on it
		let z = document.createElement('img'); 						// Creates an image element 
		z.src = `../Images/Pieces/${Locals[tid]}.png`; 				// Sets the image source to the corresponding piece image
		z.className = 'PieceIcon'; 									// Gives it the PieceIcon classname
		y.appendChild(z); 											// Adds the image to the div
		ChangeSquare(tid,PieceNames[Locals[tid]]); 					// Adds the piece to the Positions array
	}
	ChessGrid.appendChild(y); 										// Adds the GridSquare to the overall Board 
}

// ====================================================================
// ==================-- Drag Handling Start --=========================
// ====================================================================

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
		let xnums = [-2,-1,0,1,2]; // The width  of the square to check within
		let ynums = [-2,-1,0,1,2]; // The height of the square to check within

		let fp = GRef[0]; // The x grid reference of the original piece
		let sp = GRef[1]; // The y grid reference of the original piece

		xnums.forEach((x) => {
			ynums.forEach((y) => {
				let newx = (TheStuff[fp]+x); // The x value of the next point we're checking
				let newy = (parseInt(sp)+y); // The y value of the next point we're checking

				let dx = Math.abs(TheStuff[fp]-newx); // X distance from original
				let dy = Math.abs(parseInt(sp)-newy); // Y distance from original

				let pyth = ((dx*dx)+(dy*dy)); // Pythagorean theorem for distance from initial piece coords to new coords, Will be 5 if both dx and dy are 2 and 1, either way round

				if ( // If the new coords are within the grid, and is the correct distance away
						newx >= 0 &&
						newx <= 7 &&
						newy >= 1 &&
						newy <= 8 &&
						pyth == 5
					) { 
					if  ( // If the square is empty, or has an opponent piece
							(document.getElementById(`${TheStuff[newx]}${newy}`).hasChildNodes() == false) ||
							( 
								document.getElementById(`${TheStuff[newx]}${newy}`).hasChildNodes() == true &&
								document.getElementById(`${TheStuff[newx]}${newy}`).firstChild.src.split('/')[5].split('.')[0][0] != pname[0]
							) 
					    )  {
						possible.push(`${TheStuff[newx]}${newy}`);
					}
				}

			});
		});
	
	} else if (PieceNames[pname] == 'Bishop') {

	} else if (PieceNames[pname] == 'Rook') {
		let fp = TheStuff[GRef[0]]; 
		let sp = parseInt(GRef[1]); 

		var uip; // uip Stands for Uninpaired, used to stop checking squares in a direction once a piece is found to be blocking the path

		uip = true;
		for (let x = 1; x < 9; x++) { 	// Checks all squares to the right of the piece
			let newx = fp+x;
			let newy = sp;

			if ( newx >= 0 && newx <= 7 ) { 
				if (document.getElementById(`${TheStuff[newx]}${newy}`).hasChildNodes() == true) { uip = false; }
				if (uip) {
					if  (
							(document.getElementById(`${TheStuff[newx]}${newy}`).hasChildNodes() == false) ||
							( 
								document.getElementById(`${TheStuff[newx]}${newy}`).hasChildNodes() == true &&
								document.getElementById(`${TheStuff[newx]}${newy}`).firstChild.src.split('/')[5].split('.')[0][0] != pname[0]
							) 
						)  {
						possible.push(`${TheStuff[newx]}${newy}`);
					}
				}
			}
		}								// End of right check
		uip = true;
		for (let x = -1; x > -9; x--) { 	// Checks all squares to the left of the piece
			let newx = fp+x;
			let newy = sp;

			if ( newx >= 0 && newx <= 7 ) { 
				if (document.getElementById(`${TheStuff[newx]}${newy}`).hasChildNodes() == true) { uip = false; }
				if (uip) {
					if  (
							(document.getElementById(`${TheStuff[newx]}${newy}`).hasChildNodes() == false) ||
							( 
								document.getElementById(`${TheStuff[newx]}${newy}`).hasChildNodes() == true &&
								document.getElementById(`${TheStuff[newx]}${newy}`).firstChild.src.split('/')[5].split('.')[0][0] != pname[0]
							) 
						)  {
						possible.push(`${TheStuff[newx]}${newy}`);
					}
				}
			}
		} 								// End of left check
		uip = true;
		for (let y = 1; y < 9; y++) { 	// Checks all squares above the piece
			let newx = fp;
			let newy = sp+y;
			
			if ( newy >= 1 && newy <= 8 ) {
				if (document.getElementById(`${TheStuff[newx]}${newy}`).hasChildNodes() == true) { uip = false; }
				if (uip) {
					if  (
							(document.getElementById(`${TheStuff[newx]}${newy}`).hasChildNodes() == false) ||
							( 
								document.getElementById(`${TheStuff[newx]}${newy}`).hasChildNodes() == true &&
								document.getElementById(`${TheStuff[newx]}${newy}`).firstChild.src.split('/')[5].split('.')[0][0] != pname[0]
							) 
						)  {
						possible.push(`${TheStuff[newx]}${newy}`);
					}
				}
			}
		} 								// End of up check
		uip = true;
		for (let y = -1; y > -9; y--) { 	// Checks all squares below the piece
			let newx = fp;
			let newy = sp+y;
			
			if ( newy >= 1 && newy <= 8 ) { 
				if (document.getElementById(`${TheStuff[newx]}${newy}`).hasChildNodes() == true) { uip = false; }
				if (uip) {
					if  (
							(document.getElementById(`${TheStuff[newx]}${newy}`).hasChildNodes() == false) ||
							( 
								document.getElementById(`${TheStuff[newx]}${newy}`).hasChildNodes() == true &&
								document.getElementById(`${TheStuff[newx]}${newy}`).firstChild.src.split('/')[5].split('.')[0][0] != pname[0]
							) 
						)  {
						possible.push(`${TheStuff[newx]}${newy}`);
					}
				}
			}
		} // End of down check

	} else if (PieceNames[pname] == 'Queen') {
		let xnums = [-1,0,1];
		let ynums = [-1,0,1];

		let fp = GRef[0];
		let sp = GRef[1];

		xnums.forEach(function (x) {
			ynums.forEach(function (y) {
				let newx = (TheStuff[fp] + x);
				let newy = parseInt(sp) + y;
				if ( // If the new coords are within the grid
						newx >= 0 &&
						newx <= 7 &&
						newy >= 1 &&
						newy <= 8
					) { 
					if  ( // If the square is empty, or has an opponent piece
							(document.getElementById(`${TheStuff[newx]}${newy}`).hasChildNodes() == false) ||
							( 
								document.getElementById(`${TheStuff[newx]}${newy}`).hasChildNodes() == true &&
								document.getElementById(`${TheStuff[newx]}${newy}`).firstChild.src.split('/')[5].split('.')[0][0] != pname[0]
							) 
					    )  {
						possible.push(`${TheStuff[newx]}${newy}`);
					}
				}
			});
		});
	} else if (PieceNames[pname] == 'King') {
		
	}

	possible.forEach(function (item) {
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

// ====================================================================
// ===================-- Drag Handling Stop --=========================
// ====================================================================

// https://www.chessprogramming.org/Minimax
// https://www.chessprogramming.org/Negamax
// https://www.chessprogramming.org/Make_Move
// https://www.chessprogramming.org/Unmake_Move