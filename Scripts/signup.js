
const socket = new WebSocket('ws://localhost:8765');
socket.onopen = () => { console.log('Connected to webserver'); };

let ebox = document.getElementById('email');
let ubox = document.getElementById('username');
let pbox = document.getElementById('password');
let cpbox = document.getElementById('confirmPassword');

let secondstagehtml = `
		<h2>Please enter the code in the email we just sent you.</h2>
		<input id="codebox" type="text" pattern=".{6}">
		<input type="submit">
`

socket.onmessage = (e) => {
	let data = e.data.split('|~~|');
	if (data[0] === 'Stage1True') {
		let theForm = document.getElementById('theForm');
		theForm.innerHTML = secondstagehtml
		theForm.addEventListener('submit', (e) => {
			e.preventDefault();
			socket.send('signupcode|~~|' + document.getElementById("codebox").value);
		})
	} else if (data[0] === 'Stage2True') {
		alert('Account created successfully!');
		window.location.href = 'login.html';
	} else if (data[0] === 'Stage2False') {
		document.getElementById("codebox").style.border = '1px solid red';
		alert('Code incorrect')
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

let theForm = document.getElementById('theForm');

theForm.addEventListener('submit', (e) => {
	e.preventDefault();

	if (pbox.value === cpbox.value) {
		socket.send('signup|~~|' + ebox.value + '|~|' + ubox.value + '|~|' + pbox.value);
	} else {
		cpbox.style.border = '1px solid red';
	}

});