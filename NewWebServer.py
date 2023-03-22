from SupportClasses import *
from JQLServer import DataBase
from MailServer import MailServer

import threading
from flask import Flask, redirect, url_for, send_file, send_from_directory, abort
from json import dumps
from random import choice
from json import dumps

# ====================================================================
# ====================-- Socket Receiver Server --====================
# ====================================================================


app = SocketHandler('localhost', 8765)
MainDB = DataBase('maindb')
MessageSystem = MailServer("--email--", "--password--")
Rooms = {}
CodesWaiting = {}

async def sendmsg(type: str, message: str, sock): await sock.send(type + '|~~|' + message)


def GenerateCode():
	chars = 'abcdefghijklmnopqrstuvwxyz1234567890'
	code = ''.join([choice(chars) for i in range(6)]).upper()
	while code in Rooms.keys(): code = ''.join([choice(chars) for i in range(6)]).upper()
	return code


@app.route('login')
async def login(content, websocket):
	u, p = content.split('|~|')

	if MainDB.CheckLogin(u, p):
		await sendmsg('true', MainDB.GetLogin('email', u)['uuid'], websocket)
	else:
		await sendmsg('false', '', websocket)


@app.route('signup')
async def signup(content, websocket):
	e, u, p = content.split('|~|')

	faults = []

	if MainDB.LoginExists(e):
		faults.append('Email already in use. ')
	if len(u) < 8 or len(u) > 16:
		faults.append('Username is too ' + 'short' if len(u) < 8 else 'long')

	# Password checking
	pf = 0
	if len(p) < 8:
		faults.append('Password is too short')
	if len(p) > 50:
		faults.append('Password is too long')

	psc, pnc, pcc = 0, 0, 0

	for c in p:
		if c in '!@#$%&*<>/?(){}[]-=_+~':
			psc += 1
		elif c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
			pcc += 1
		elif c in '0123456789':
			pnc += 1

	tfs = []
	if psc == 0:
		tfs.append('Symbol')
	if pnc == 0:
		tfs.append('Number')
	if pcc == 0:
		tfs.append('Capital Letter')

	if len(tfs) > 0:
		faults.append('Password needs at least one ')

		if len(tfs) == 1:
			faults[-1] += tfs[0] + '.'
		elif len(tfs) == 2:
			faults[-1] += tfs[0] + ', and ' + tfs[1] + '.'
		elif len(tfs) == 3:
			faults[-1] += tfs[0] + ', ' + tfs[1] + ', and ' + tfs[2] + '.'

	if len(faults) > 0:
		await websocket.send('false|~~|' + '\n'.join(faults))
	else:
		twofactorcode = MainDB.Generate2FACode(e).lower()
		CodesWaiting[twofactorcode] = (e,u,p)
		MessageSystem.SendEmail(e, 'Email Verification Code', twofactorcode)
		# MainDB.AddLogin(e, u, p)
		await websocket.send('Stage1True|~~|Completed')

@app.route('signupcode')
async def signup2f(content, websocket):
	if content.lower() in CodesWaiting.keys():
		e,u,p = CodesWaiting[content.lower()]
		MainDB.AddLogin(e,u,p)
		del CodesWaiting[content.lower()]
		await websocket.send('Stage2True|~~|Completed')
	else:
		await websocket.send('Stage2False|~~|Failed')


@app.route('createroom')
async def createroom(content, websocket):
	newcode = GenerateCode()
	await sendmsg('createdroom', newcode, websocket)


@app.route('joinroom')
async def joinroom(content, websocket):
	userid, roomid = content.split('|~|')

	if roomid in Rooms.keys() and not userid in Rooms[roomid].users.keys():  # Add user to room
		Rooms[roomid].users[userid] = websocket
		Followername = MainDB.GetLogin('uuid', userid).Username
		ownuser = Followername
	elif roomid in Rooms.keys() and userid in Rooms[roomid].users.keys():  # Update users websocket<<
		Rooms[roomid].users[userid] = websocket
		Followername = MainDB.GetLogin('uuid', [x for x in Rooms[roomid].users.keys() if x != Rooms[roomid].leader][0])['Username']
		ownuser = MainDB.GetLogin('uuid', userid).Username
	else:  # create room and set user as leader
		Rooms[roomid] = Room(roomid, userid, websocket)
		Followername = 'Waiting for user'
		ownuser = MainDB.GetLogin('uuid', userid).Username

	Leadername = MainDB.GetLogin('uuid', Rooms[roomid].leader).Username
	await sendmsg('joinedroom', '''{"code":"--RoomCode--","leader":"--Leader--","follower":"--Follower--","self":"--ownuser--"}'''.replace('--RoomCode--', roomid).replace('--Leader--', Leadername).replace('--Follower--',Followername).replace('--ownuser--', ownuser), websocket)

	for k, v in Rooms[roomid].users.items():
		if k != userid:
			await sendmsg('otherjoined', Followername, v)


@app.route('leaveroom')
async def leaveroom(content, websocket):
	...


@app.route('selfinfo')
async def getselfuserinfo(content, websocket):
	type, value = content.split('|~|')
	await websocket.send('selfinfo|~~|' + dumps(MainDB.GetLogin(type, value, safe=True)))


@app.route('info')
async def getuserinfo(content, websocket):
	type, value = content.split('|~|')
	await websocket.send('info|~~|' + dumps(MainDB.GetLogin(type, value, safe=True)))


@app.route('startgame')
async def start(content, websocket):
	roomid, uid = content.split('|~|')
	await Rooms[roomid].start(uid)


@app.route('joingame')
async def joingame(content, websocket):
	roomid, userid = content.split('|~|')

	if roomid in Rooms.keys():
		if userid in Rooms[roomid].users.keys():
			Rooms[roomid].users[userid] = websocket

			ownuser = MainDB.GetLogin('uuid', userid).Username

			Leadername = MainDB.GetLogin('uuid', Rooms[roomid].leader).Username

			team = 'W' if ownuser == Leadername else 'B'

			roomdata = Rooms[roomid].board.dictorize()
			cturn = Rooms[roomid].board.Turn

			await sendmsg('gamedata',f"{'{'}\"self\":\"{ownuser}\",\"turn\":\"{cturn}\",\"team\":\"{team}\",\"cgrid\":{dumps(roomdata).replace('False', 'false').replace('True', 'true')} {'}'}", websocket)
		else:
			await sendmsg('abortjoin', 'User not within room', websocket)
	else:
		await sendmsg('abortjoin', 'Invalid RoomID', websocket)


@app.route('sendmove')
async def sendmove(content, websocket):
	sender, id1, id2 = content.split('|~|')

	for k, r in Rooms.items():
		if sender in r.users:
			await r.SendMove(sender, id1, id2)
			r.board.moved()


@app.route('promote')
async def promotepiece(content, websocket):
	sender, id, type = content.split('|~|')

	for k, r in Rooms.items():
		if sender in r.users.keys():
			await r.Promote(id, type)


@app.route('win')
async def won(content, websocket):
	sender = content

	for k, r in Rooms.copy().items():
		if sender in r.users.keys():
			for x in r.users.keys():
				if x != sender:
					await sendmsg('loss', 'a', Rooms[k].users[x])
			del Rooms[k]


@app.route('abort')
async def abort(content, websocket):
	sender = content

	for k, r in Rooms.copy().items():
		if sender in r.users.keys():
			for x in r.users.keys():
				if x != sender:
					await sendmsg('abort', 'a', Rooms[k].users[x])
			del Rooms[k]


@app.route('removeroom')
async def removeroom(content, websocket):
	if content in Rooms.keys():
		del Rooms[content]


# ===================-- Flask Library Web Server --===================

fapp = Flask(__name__)


@fapp.route('/robots.txt')
def robots(): return 'no'


@fapp.route('/favicon.ico')
def favicon(): return 'img'


@fapp.route('/<path:filename>')
def serve_file(filename):
	if not ('Databases' in filename):
		return send_from_directory('.', filename)
	else:
		abort(403, description="Access denied")


def main():
	fapp.run()


if __name__ == "__main__":
	x = threading.Thread(target=main)
	x.start()
	app.run()
