class Piece {
	constructor(team,type,id) {
		this.team = team;
		this.type = type; // Just the Letter
		this.image = team + StandardAbb[type]; // e.g BKing 
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
		this.Mapper = {'8':0,'7':1,'6':2,'5':3,'4':4,'3':5,'2':6,'1':7,'a':0,'b':1,'c':2,'d':3,'e':4,'f':5,'g':6,'h':7};
	}

	SetSquare(id,tm,te) { this.grid[this.Mapper[id[1]]][this.Mapper[id[0]]] = new Piece(tm,te,id) }
	GetSquare(id) { return this.grid[this.Mapper[id[1]]][this.Mapper[id[0]]]; }
	MakeMove(id1,id2) { 
		this.grid[this.Mapper[id2[1]]][this.Mapper[id2[0]]] = this.grid[this.Mapper[id1[1]]][this.Mapper[id1[0]]];
		this.grid[this.Mapper[id1[1]]][this.Mapper[id1[0]]] = null;
		let x = document.getElementById(id1);
		let y = document.getElementById(id2);
		y.innerHTML = x.innerHTML;
		x.innerHTML = "";
		y.firstChild.style.opacity = '1';
		this.turn = this.turn === "White" ? "Black" : "White";
	}

	CheckWin() {
		BlackCheck = false;
		WhiteCheck = false;
		AllPlayable = [];
		for (row in this.grid) {
			for (thing in row) {
				CalculateValidPoints(thing.id,)
			}
		}
	}
}