function enterChat(){
	//Take username information
	const usernameInput = document.getElementById('username-input');
	const username = usernameInput.value.toLowerCase();

	//Throw if username is empty
	if (username.length == 0) {
		alert('Empty username');
		return
	}

	//Initialize sockets
	const socket = io();
	
	//Everytime a user connects:
	socket.on('connect', ()=>{

		//Check if the username is available
		socket.emit('check-user', username, (used)=>{

			//If used stop chat logic
			if (used) {
				socket.disconnect();
				return alert('Username already used')
			};
			
			//If not continue chat logic
			startChat(socket, username);
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

//Set chat logic start to enter chat button
const enterButton = document.getElementById('enter-chat');
enterButton.addEventListener('click', enterChat);