const theForm = document.getElementById('theForm');

const socket = new WebSocket('ws://localhost:8765');
socket.onopen = () => { console.log('Connected to webserver'); };

socket.onmessage = (e) => {
	let data = e.data.split('|~~|');
	if (data[0] == 'true') {
		window.location.href = 'login.html';
	} else {
		alert(data[1]);
	}
}

theForm.addEventListener('submit', (e) => {
	e.preventDefault();

	// socket.send('login',TheData.get('username')+'|~|'+TheData.get('password'));

	let ebox = document.getElementById('email');
	let ubox = document.getElementById('username');
	let pbox = document.getElementById('password');
	let cpbox = document.getElementById('confirmPassword');

	if (pbox.value == cpbox.value) {
		socket.send('signup|~~|' + ebox.value + '|~|' + ubox.value + '|~|' + pbox.value);
	} else {
		cpbox.style.border = '1px solid red';
	}

});