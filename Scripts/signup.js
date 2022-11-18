const theForm = document.getElementById('theForm');

const TheSocket = WS();

theForm.addEventListener('submit', (e) => {
	e.preventDefault();

	let TheData = new FormData(theForm);

	TheSocket.send('login',TheData.get('username')+'|~|'+TheData.get('password'));

});