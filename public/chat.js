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
	//Hiding the "enter" and showing the "chat" section
	const enterDiv = document.getElementById('enter');
	enterDiv.style.display = 'none';

	const chatDiv = document.getElementById('chat');
	chatDiv.style.display = 'block';

	//Register the new user
	socket.emit('new-user', username);

	//On online users update execute updateList()
	socket.on('users-update', (list)=>{
		updateList(list);
	})

	//On message submit execute sendMessage()
	const messageSubmit = document.getElementById('chat-submit');
	messageSubmit.addEventListener('click', ()=>{
		sendMessage(socket, username);
	})

	//On messages update execute updateMessages()
	socket.on('messages-update', updateMessages);
}

function updateList(list) {
	//Online users container
	const onlineUsersDiv = document.getElementById('online-users');
	let onlineUsers = '';

	//HTML template
	onlineUsers+= '<h3>Online users:</h3>'

	list.forEach((user)=>{
		onlineUsers+= '<span class="online-user"> ';
		onlineUsers+= encodeURIComponent(user);
		onlineUsers+= ' </span>'
	})

	//Insert the html template in the container
	onlineUsersDiv.innerHTML = onlineUsers;
}

function sendMessage(socket, username) {

	//Text message input
	const messageInput = document.getElementById('chat-input');
	const message = messageInput.value;

	//If empty stop "send message" logic
	if (message.length == 0){
		alert('Empty message');
		return
	}

	//Send the message to the server with user detail
	socket.emit('new-message', username, message);
}

function updateMessages(messages){

	//Messages container
	const messagesDiv = document.getElementById('chat-messages');
	let listedMessages = '';

	//HTML Template
	messages.forEach(message => {
		listedMessages += '<div class="message">';
		listedMessages += '<strong>' + message.username + ': </strong>';
		listedMessages += '<span>' + message.text + '<span>';
		listedMessages += '</div>';
	})

	//Inser HTML Template in messages container
	messagesDiv.innerHTML = listedMessages;
}

//Set chat logic start to enter chat button
const enterButton = document.getElementById('enter-chat');
enterButton.addEventListener('click', enterChat);