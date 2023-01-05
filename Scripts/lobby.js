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

socket.onopen = () => { send('selfinfo',`uuid|~|${getCookie('uid')}`); };

function send(type,message) { socket.send(type+'|~~|'+message); }

let roomTemplate = `
<h1>Welcome to the lobby, {{Username}}</h1>
<h2>Your room code is: <b style="text-transform: uppercase;">{{RoomCode}}</b></h2>
<br>
<h2>Currently Connected:</h3>
<h3>{{User1}}</h3>
<h3><b style="color: transparent">{{User2}}</b></h3>

<button style="margin-top: 1.5em;">Start game!</button>
`;

let initTemplate = `
<h1>Welcome, {{Username}}</h1>
<button id='newrb'>Create a new Room!</button>
<form action="lobby.html" method="post" id='joinroomform'>
	<input type="text" name="room" placeholder="Room ID" pattern="[A-Za-z0-9]{6}"/>
	<input type="submit" value="Join Room"/>
</form>
`;

socket.onmessage = (e) => {

	var MidBox = document.getElementById('Holder');

	let [type, data] = e.data.split('|~~|');

	if (type === 'selfinfo') {

		let dadata = JSON.parse(data);
	
		let hasRoomId = getCookie('roomid');

		if (hasRoomId) {
			MidBox.innerHTML = roomTemplate.replace('{{User1}}', dadata['Username']).replace('{{Username}}', dadata['Username']).replace('{{RoomCode}}', hasRoomId);
		} else {
			// Render the init template
			MidBox.innerHTML = initTemplate.replace('{{Username}}', dadata['Username']);

			document.getElementById('joinroomform').addEventListener('submit', (e) => {
				e.preventDefault();
				let roomform = document.getElementById('joinroomform');
				let roomid = roomform.elements['room'].value;
				setCookie('roomid', roomid.toUpperCase());
				window.location.href = 'lobby.html';
			});

			document.getElementById('newrb').addEventListener('click', (e) => {
				socket.send('createroom|~~|'+getCookie('uid'));
			});

		}

	} else if (type === 'createdroom') {
		setCookie('roomid', data);
		send('joinroom', getCookie('uid') + '|~|' + data);
	} else if (type === 'joinedroom') {


		// It sends off the create room request to the server, the server then proceeds to ALWAYS send back a joinedroom message, even if the room did not exist before.
	} else if (type === 'otherjoin') {
		let dadata = JSON.parse(data);
		MidBox.innerHTML = MidBox.innerHTML.replace('<b style="color: transparent">{{User2}}</b>', dadata['Username']);
	}
}

