from SupportClasses import *
from JQLServer import DataBase
from json import dumps
from random import choice


app = SocketHandler('localhost', 8765)
MainDB = DataBase('maindb')
Rooms = {}

async def sendmsg(type,message,sock): await sock.send(type+'|~~|'+message)

def GenerateCode():
	chars = 'abcdefghijklmnopqrstuvwxyz1234567890'
	code = ''.join([choice(chars) for i in range(6)]).upper()
	while code in Rooms.keys(): code = ''.join([choice(chars) for i in range(6)]).upper()
	return code

@app.route('login')
async def login(content, websocket):
	u,p = content.split('|~|')

	if MainDB.CheckLogin(u,p):
		await sendmsg('true',MainDB.GetLogin(u).uuid,websocket)
	else:
		await sendmsg('false','',websocket)


@app.route('createroom')
async def createroom(content, websocket):
	newcode = GenerateCode()
	Rooms[newcode] = Room(newcode,content,websocket)
	await sendmsg('createdroom',newcode,websocket)


@app.route('joinroom')
async def joinroom(content, websocket):
	...


@app.route('leaveroom')
async def leaveroom(content, websocket):
	...

@app.route('info')
async def getuserinfo(content, websocket):
	type,value = content.split('|~|')
	await websocket.send('info|~~|'+dumps(MainDB.GetLogin(type,value).SafeSerialize(), indent=4))

@app.route('sendmove')
async def sendmove(content, websocket):
	sender,id1,id2 = content.split('|~|')
	for k,r in Rooms.items():
		if sender in r.users:
			r.SendMove(sender,id1,id2)

app.run()


import http.server
import socketserver
import threading


PORT = 80

class Server(http.server.SimpleHTTPRequestHandler):
	def do_GET(self):
		if self.path == "/":
			self.path = "/index.html"
		return http.server.SimpleHTTPRequestHandler.do_GET(self)

Handler = Server
def main():
	with socketserver.TCPServer(("", PORT), Handler) as httpd:
		print("Serving at port", PORT)
		httpd.serve_forever()
	

if __name__ == "__main__": 
	x = threading.Thread(target=main)
	x.start()
	app.run()