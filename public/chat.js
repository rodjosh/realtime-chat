function startChat(){
	const usernameInput = document.getElementById('username-input');
	const username = usernameInput.value.toLowerCase();

	if (username.length == 0) {
		alert('Empty username');
		return
	}

	const socket = io();
	let isUsernameUsed;

	socket.on('connect', ()=>{
		console.log("Check user");
		socket.emit('check-user', username, (used)=>{
			isUsernameUsed = used;
		});
	});

	if (isUsernameUsed) {
		alert('Username already in use');
		return location.reload();
	}

	const enterDiv = document.getElementById('enter');
	enterDiv.style.display = 'none';

	const chatDiv = document.getElementById('chat');
	chatDiv.style.display = 'block';

	socket.emit('new-user', username);

	socket.on('users-update', (list)=>{
		updateList(list);
	})
}

function updateList(list) {
	console.log(list);
}

const enterButton = document.getElementById('enter-chat');
enterButton.addEventListener('click', startChat);