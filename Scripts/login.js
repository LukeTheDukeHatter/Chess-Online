const theForm = document.getElementById('theForm');

const socket = new WebSocket('ws://localhost:8765');

socket.onopen = () => { console.log('Connected to webserver'); };

function send(type,message) { socket.send(type+'|~~|'+message); }

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


theForm.addEventListener('submit', (e) => {
	e.preventDefault();

	let ubox = document.getElementById('email');
	let pbox = document.getElementById('password');

	let Message = 'login|~~|'+ubox.value+'|~|'+pbox.value;
	console.log(Message);

	socket.send(Message);

});