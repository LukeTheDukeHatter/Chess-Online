if (document.cookie) {
	let cook = document.cookie.split(';')[0].split('=');
	console.log(cook);
} else {
	console.log('Bugga');
}

// Gets the cookies with the uid

const socket = new WebSocket('ws://localhost:8765');

socket.onopen = () => { console.log('Connected to webserver'); };

function send(type,message) { this.socket.send(type+'|~~|'+message); }

socket.onmessage = (e) => {
	alert('Recieved');

	let data = e.data.split('|~~|');
	if (data[0] == 'true') {

		const date = new Date();
		date.setFullYear(date.getFullYear() + 1);
		  
		// April 20, 2023
		console.log(date); // 2023-04-20T00:00:00.000Z

		document.cookie = "uid="+data[1]+"; expires = "+date+"; path=/";
		console.log(document.cookie.split('=')[0]);
		console.log(document.cookie.split('=')[1]);
		console.log(document.cookie.split('='));
		console.log(document.cookie);
		window.location.href = 'lobby.html';
	} else {
		alert('Invalid username or password');
	}
}




let roomTemplate = `
<h1>Welcome to the lobby,</h1>
<h2>Your room code is: <b style="text-transform: uppercase;">{{RoomCode}}</b></h2>
<br>
<h2>Currently Connected:</h3>
<h3>{{User1}}</h3>
<h3>{{User2}}</h3>

<button style="margin-top: 1.5em;">Start game!</button>
`;

let initTemplate = `
<h1>Welcome, {{Username}}</h1>
`;