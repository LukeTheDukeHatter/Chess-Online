import websockets
import asyncio

class SocketHandler:
	def __init__(self, address:str='localhost', port:int=8765):
		self.address = address
		self.port = port
		self.Paths = {}

	def route(self, type):
		def decorator(f):		
			self.Paths[type] = f
			return f
		return decorator

	async def handler(self, websocket):
		async for message in websocket:
			type, content = message.split('|~~|')

			await self.Paths[type](content,websocket)

	async def main(self):
		async with websockets.serve(self.handler, self.address, self.port):
			await asyncio.Future()

	def run(self):
		print('Socket Server started on port: '+str(self.port))
		asyncio.run(self.main())

class ChessBoard:
	def __init__(self):

		Locals = {"a8":"BRook","b8":"BKnight","c8":"BBishop","d8":"BKing","e8":"BQueen","f8":"BBishop","g8":"BKnight","h8":"BRook",
				"a7":"BPawn","b7":"BPawn","c7":"BPawn","d7":"BPawn","e7":"BPawn","f7":"BPawn","g7":"BPawn","h7":"BPawn",
				"a1":"WRook","b1":"WKnight","c1":"WBishop","d1":"WKing","e1":"WQueen","f1":"WBishop","g1":"WKnight","h1":"WRook",
				"a2":"WPawn","b2":"WPawn","c2":"WPawn","d2":"WPawn","e2":"WPawn","f2":"WPawn","g2":"WPawn","h2":"WPawn"}

		self.Turn = 'W'
		self.board = [[{'name':Locals[self.cti((j,i))],'moved':False} if self.cti((j,i)) in Locals else {'name':' ','moved':True} for i in range(8)] for j in range(8)]

	def move_piece(self, s, e):
		start = self.itc(s)
		end = self.itc(e)
		self.board[end[0]][end[1]], self.board[start[0]][start[1]] = self.board[start[0]][start[1]], {'name':' ','moved':True}
		self.board[end[0]][end[1]]['moved'] = True

	def set_piece(self,type,id):
		coord = self.itc(id)
		self.board[coord[0]][coord[1]]['name'] = type

	def itc(self,i): return (8-int(i[1]),ord(i[0])-97)
	def cti(self,r): return chr(r[1]+97) + str(8-r[0])

	def display(self):
		PieceNames = {"WKing": "King","WQueen": "Queen","WRook": "Rook","WBishop": "Bishop","WKnight": "Knight","WPawn": "Pawn","BKing": "King","BQueen": "Queen","BRook": "Rook","BBishop": "Bishop","BKnight": "Knight","BPawn": "Pawn", " ":" "}
		StandardAbb = {"Q": "Queen","Queen": "Q","K": "King","King": "K","P": "Pawn","Pawn": "P","B": "Bishop","Bishop": "B","R": "Rook","Rook": "R","N": "Knight","Knight": "N"," ":" "}
		for y in self.board:
			for x in y:
				print(StandardAbb[PieceNames[x['name']]], end=' ')
			print()

	def dictorize(self):
		datadict = {}
		for y in range(len(self.board)):
			for x in range(len(self.board[y])):
				datadict[self.cti((y,x))] = {'type':self.board[y][x]['name'],'moved':self.board[y][x]['moved']}
		return datadict

	def moved(self): self.Turn = 'B' if self.Turn == 'W' else 'W'


class Room():
	def __init__(self,code,uid,usock):
		self.code = code
		self.leader = uid
		self.users = {uid:usock}
		self.board = ChessBoard()

	async def start(self,uid):
		if uid == self.leader:
			for k,v in self.users.items():
				await v.send('started|~~|')

	async def SendMove(self,uid,id1,id2):
		self.board.move_piece(id1,id2)
# 		self.board.display()
		for u in self.users:
			if u != uid:
				await self.users[u].send('move|~~|'+id1+'|~|'+id2)

	async def Promote(self,id,type):
		self.board.set_piece(type,id)
# 		self.board.display()

		for u in self.users.keys():
			await self.users[u].send('promote|~~|'+id+'|~|'+type)


