class Piece {
	constructor(team,type,id) {
		this.team = team;
		this.type = type;
		this.image = team + StandardAbb[type];
		this.dead = False;
		this.hasMoved = false;
		this.id = 0;
	}
}

class Board {
	constructor() {
		this.grid = [
			[Piece("B","R","a8"),Piece("B","N","b8"),Piece("B","B","c8"),Piece("B","K","d8"),Piece("B","Q","e8"),Piece("B","B","f8"),Piece("B","N","g8"),Piece("B","R","h8")],
			[Piece("B","P","a7"),Piece("B","P","b7"),Piece("B","P","c7"),Piece("B","P","d7"),Piece("B","P","e7"),Piece("B","P","f7"),Piece("B","P","g7"),Piece("B","P","h7")],
			[null,null,null,null,null,null,null,null],
			[null,null,null,null,null,null,null,null],
			[null,null,null,null,null,null,null,null],
			[null,null,null,null,null,null,null,null],
			[Piece("W","P","a2"),Piece("W","P","b2"),Piece("W","P","c2"),Piece("W","P","d2"),Piece("W","P","e2"),Piece("W","P","f2"),Piece("W","P","g2"),Piece("W","P","h2")],
			[Piece("W","R","a1"),Piece("W","N","b1"),Piece("W","B","c1"),Piece("W","K","d1"),Piece("W","Q","e1"),Piece("W","B","f1"),Piece("W","N","g1"),Piece("W","R","h1")]
		]
		this.pieces = {};
		this.selected = null;
		this.turn = "White";
		this.moves = [];
		this.possibleMoves = [];
		this.check = false;
		this.checkmate = false;
	}
}