from SupportClasses import *

app = SocketHandler('localhost', 8765)

@app.route('login')
async def login(content, websocket):
	u,p = content.split('|~|')
	print(u,p)


@app.route('createroom')
async def createroom(content, websocket):
	...


@app.route('joinroom')
async def joinroom(content, websocket):
	...


@app.route('leaveroom')
async def leaveroom(content, websocket):
	...

app.run()