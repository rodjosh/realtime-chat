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

	const messageSubmit = document.getElementById('chat-submit');
	messageSubmit.addEventListener('click', ()=>{
		sendMessage(socket, username);
	})

	socket.on('messages-update', updateMessages);
}

function updateList(list) {
	const onlineUsersDiv = document.getElementById('online-users');
	let onlineUsers = '';

	onlineUsers+= '<h3>Online users:</h3>'

	list.forEach((user)=>{
		onlineUsers+= '<span class="online-user"> ';
		onlineUsers+= encodeURIComponent(user);
		onlineUsers+= ' </span>'
	})

	onlineUsersDiv.innerHTML = onlineUsers;
}

function sendMessage(socket, username) {
	const messageInput = document.getElementById('chat-input');
	const message = messageInput.value;

	if (message.length == 0){
		alert('Empty message');
		return
	}

	socket.emit('new-message', username, message);
}

function updateMessages(messages){
	const messagesDiv = document.getElementById('chat-messages');
	let listedMessages = '';

	messages.forEach(message => {
		listedMessages += '<div class="message">';
		listedMessages += '<strong>' + message.username + ': </strong>';
		listedMessages += '<span>' + message.text + '<span>';
		listedMessages += '</div>';
	})

	messagesDiv.innerHTML = listedMessages;
}

const enterButton = document.getElementById('enter-chat');
enterButton.addEventListener('click', enterChat);