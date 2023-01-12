const theForm = document.getElementById('theForm');

const socket = new WebSocket('ws://localhost:8765');
socket.onopen = () => { console.log('Connected to webserver'); };

let ebox = document.getElementById('email');
let ubox = document.getElementById('username');
let pbox = document.getElementById('password');
let cpbox = document.getElementById('confirmPassword');

socket.onmessage = (e) => {
	let data = e.data.split('|~~|');
	if (data[0] === 'true') {
		alert('Account created successfully!');
		window.location.href = 'login.html';
	} else {
		if (data[1].includes('Email')) {
			ebox.style.border = '1px solid red';
		} else {
			ebox.style.border = '1px solid black';
		}
		if (data[1].includes('Password')) {
			cpbox.style.border = '1px solid red';
			pbox.style.border = '1px solid red';
		} else {
			cpbox.style.border = '1px solid black';
			pbox.style.border = '1px solid black';
		}
		alert(data[1]);
	}
}

theForm.addEventListener('submit', (e) => {
	e.preventDefault();

	if (pbox.value === cpbox.value) {
		socket.send('signup|~~|' + ebox.value + '|~|' + ubox.value + '|~|' + pbox.value);
	} else {
		cpbox.style.border = '1px solid red';
	}

});