function enterChat(){
	const usernameInput = document.getElementById('username-input');
	const username = usernameInput.value.toLowerCase();

	if (username.length == 0) {
		alert('Empty username');
		return
	}

	const socket = io();
	
	socket.on('connect', ()=>{
		socket.emit('check-user', username, (used)=>{
			if (used){
				alert('Username already used');
			} else {
				startChat(socket, username);
			}
		});
	});
}

function startChat(socket, username){
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

	const onlineUsersDiv = document.getElementById('online-users');
	let onlineUsers = '';

	list.forEach((user)=>{
		onlineUsers+= '<span class="online-user">';
		onlineUsers+= encodeURIComponent(user);
		onlineUsers+= '</span>'
	})

	onlineUsersDiv.innerHTML = onlineUsers;
}

const enterButton = document.getElementById('enter-chat');
enterButton.addEventListener('click', enterChat);