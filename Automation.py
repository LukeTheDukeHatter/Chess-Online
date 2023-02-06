from SupportClasses import ChessBoard

MainBoard = ChessBoard()

Heuristics = {
	'Pawn': 10,
	'Knight': 30,
	'Bishop': 30,
	'Rook': 50,
	'Queen': 90,
	'King': 900
}


def square_empty(id: str) -> bool:
	Grefx, Grefy = MainBoard.itc(id)
	return MainBoard.board[Grefy][Grefx]["name"] == ' '


def square_enemy(id: str) -> bool:
	Grefx, Grefy = MainBoard.itc(id)
	return MainBoard.board[Grefy][Grefx]["name"][0] == 'W'


def PossibleMoves(id: str) -> list:
	Grefx, Grefy = MainBoard.itc(id)
	direction_of_travel: int = -1

	ptype: str = MainBoard.board[Grefy][Grefx]["name"][:1]
	pname: str = MainBoard.board[Grefy][Grefx]["name"][1:]

	possible_moves = []

	if pname == 'Pawn':
		for pos in [1, -1]:
			if square_enemy(MainBoard.cti((Grefy + direction_of_travel, Grefx + pos))):
				possible_moves.append(MainBoard.cti((Grefy + direction_of_travel, Grefx + pos)))
			print(MainBoard.cti((Grefy + direction_of_travel, Grefx + pos)))

		if square_empty(MainBoard.cti((Grefy + direction_of_travel, Grefx))):
			possible_moves.append(MainBoard.cti((Grefy + direction_of_travel, Grefx)))

	elif pname == 'Knight':
		pass
	elif pname == 'Bishop':
		pass
	elif pname == 'Rook':
		pass
	elif pname == 'Queen':
		pass
	elif pname == 'King':
		pass

	return possible_moves


from random import choice

to_take = choice(PossibleMoves('b7'))

MainBoard.display()
MainBoard.move_piece('b7', to_take)
print('#'*50)
MainBoard.display()
