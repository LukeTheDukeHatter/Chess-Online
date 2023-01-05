if (document.cookie) {
	let daCookie = getCookie('uid');
	if (daCookie) { window.location.href='lobby.html'; }
}

const theForm = document.getElementById('theForm');

const socket = new WebSocket('ws://localhost:8765');

socket.onopen = () => { console.log('Connected to webserver'); };

function send(type,message) { socket.send(type+'|~~|'+message); }


socket.onmessage = (e) => {

	let data = e.data.split('|~~|');
	if (data[0] == 'true') {

		const date = new Date();
		date.setFullYear(date.getFullYear() + 1);
		  
		// April 20, 2023

		document.cookie += "uid="+data[1]+"; expires = "+date+"; path=/";
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

	socket.send(Message);

});