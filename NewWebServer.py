from SupportClasses import *
from JQLServer import DataBase

import threading
from flask import Flask, redirect, url_for, send_file, send_from_directory, abort
from json import dumps
from random import choice


# ====================================================================
# ====================-- Socket Reciever Server --====================
# ====================================================================


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
		await sendmsg('true',MainDB.GetLogin('uuid',u)['uuid'],websocket)
	else:
		await sendmsg('false','',websocket)

@app.route('signup')
async def signup(content, websocket):
    e,u,p = content.split('|~|')

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

    psc = 0
    pnc = 0
    pcc = 0
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

        if len(tfs == 1):
            faults[-1] += tfs[0] + '.'
        elif len(tfs) == 2:
            faults[-1] += tfs[0] + ', and ' + tfs[1] + '.'
        elif len(tfs) == 3:
            faults[-1] += tfs[0] + ', ' + tfs[1] + ', and ' + tfs[2] + '.'

    if len(faults) > 0:
        websocket.send('false|~~|' + ''.join(faults))
    else:
        MainDB.AddLogin(e,u,p)
        websocket.send('true|~~|Completed')



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


fapp = Flask(__name__)

# ====================================================================
# ===================-- Flask Library Web Server --===================
# ====================================================================

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


# @app.route('/post-reciever-w', methods=['GET', 'POST'])
# def recieve_withdrawal():
#     if request.method == 'POST':
#         User = request.form.get('Username')
#         Diamonds = request.form.get('Diamonds')