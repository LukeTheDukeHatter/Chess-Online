if (document.cookie) {
	let cook = document.cookie.split(';')[0].split('=');
	console.log(cook);
} else {
	console.log('Bugga');
}

// Gets the cookies with the uid