from SupportClasses import *
from JQLServer import DataBase
from json import dumps





app = SocketHandler('localhost', 8765)

MainDB = DataBase('maindb')

@app.route('login')
async def login(content, websocket):
	u,p = content.split('|~|')

	if MainDB.CheckLogin(u,p):
		msg ='true|~~|'+MainDB.GetLogin(u).uuid
	else:
		msg = 'false|~~|'

	await websocket.send(msg)


@app.route('createroom')
async def createroom(content, websocket):
	...


@app.route('joinroom')
async def joinroom(content, websocket):
	...


@app.route('leaveroom')
async def leaveroom(content, websocket):
	...

@app.route('info')
async def getuserinfo(content, websocket):
	await websocket.send(dumps(MainDB.GetLogin(content).SafeSerialize(), indent=4))

app.run()