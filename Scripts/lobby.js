if (document.cookie) {
	var daCookie = getCookie('uid')
	if (daCookie) {
	} else {
		window.location.href = 'login.html';
	}
} else {
	window.location.href = 'login.html';
}

const socket = new WebSocket('ws://localhost:8765');

socket.onopen = () => { send('selfinfo',`uuid|~|${getCookie('uid')}`); console.log('Connected') };

function send(type,message) { socket.send(type+'|~~|'+message); }

let roomTemplate = `
<h1>Welcome to the lobby, {{Username}}</h1>
<h2>Your room code is: <b style="text-transform: uppercase;">{{RoomCode}}</b></h2>
<br>
<h2>Currently Connected:</h3>
<h3>{{User1}}</h3>
<h3>{{User2}}</h3>

<button style="margin-top: 1.5em;" id="startbutton">Start game!</button>
`;

let initTemplate = `
<h1>Welcome, {{Username}}</h1>
<button id='newrb'>Create a new Room!</button>
<form id='joinroomform'>
	<input type="text" name="room" placeholder="Room ID" pattern="[A-Za-z0-9]{6}"/>
	<input type="submit" value="Join Room"/>
</form>
`;

function renderHome(username) { return initTemplate.replace('{{Username}}', username); }

socket.onmessage = (e) => {
	let MidBox = document.getElementById('Holder');
	let [type, data] = e.data.split('|~~|');

	console.log(type);
	console.log(data);

	if (type === 'selfinfo') {
		let userdata = JSON.parse(data);
		let hasRoomId = getCookie('roomid');

		if (hasRoomId) {
			send('joinroom', `${getCookie('uid')}|~|${hasRoomId.toUpperCase()}`);
		} else {
			MidBox.innerHTML = renderHome(userdata['Username']);

			document.getElementById('joinroomform').addEventListener('submit', (e) => {
				e.preventDefault();
				let roomform = document.getElementById('joinroomform');
				let roomid = roomform.elements['room'].value;
				send('joinroom', `${getCookie('uid')}|~|${roomid.toUpperCase()}`);
			});

			document.getElementById('newrb').addEventListener('click', () => { send('createroom', getCookie('uid')); });
		}
	} else if (type === 'createdroom') {
		send('joinroom', getCookie('uid') + '|~|' + data);
	} else if (type === 'joinedroom') {
		let jsondata = JSON.parse(data);

		let leadername = jsondata['leader'];
		let code = jsondata['code'];
		let followername = jsondata['follower'];
		let ownname = jsondata['self'];

		setCookie('roomid', code);

		MidBox.innerHTML = roomTemplate.replace('{{User1}}', leadername).replace('{{User2}}', followername).replace('{{RoomCode}}', code).replace('{{Username}}', ownname);
		document.getElementById('startbutton').addEventListener('click', () => { send('startgame', getCookie('roomid') + '|~|' + getCookie('uid')); });
	} else if (type === 'otherjoined') {
		MidBox.innerHTML = MidBox.innerHTML.replace('Waiting for user', data);
		document.getElementById('startbutton').addEventListener('click', () => { send('startgame', getCookie('roomid') + '|~|' + getCookie('uid')); });
	} else if (type === 'started') {
		window.location.href = 'index.html';
	}
}

