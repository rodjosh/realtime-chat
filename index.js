//Importing the necessary libraries
const http = require('http');
const socket_io = require('socket.io');
const express = require('express');
const htmlEntities = require('html-entities');

//Express intance
const app = express();

//HTTP Server
const httpServer = http.createServer(app);

//Socket.io server
const io = new socket_io.Server();

//Attach to the http server
io.attach(httpServer, {

	//To server client-side socket.io bundle
	serveClient: true
});

/* STARTS CHAT LOGIC */

//Serving static files
app.use(express.static(__dirname + '/public'));

//Containers
const users = [];
const users_id = [];
const messages = [];

//When a new connection happen do:
io.on('connection', (socket)=>{

	//Check if the username exists
	socket.on('check-user', (username, isUsed)=>{

		//If exists execute callback and return
		const used = users.includes(username);
		if (used) return isUsed(used);

		//If not attach events to create a new one
		socket.on('new-user', (username)=>{ 
			
			//Store the user details in the containers
			users.push(username);
			users_id.push(socket.id);

			//Send online users and messages information
			io.emit('users-update', users);
			io.emit('messages-update', messages);

			//For every new user attach:

			//New message event
			socket.on('new-message', (username, text)=>{

				//Basic message structure
				const message = {
					username: username,
					text: htmlEntities.encode(text)
				};

				//Store the message in the messages container
				messages.push(message);

				//Set messages container limit to 15
				if (messages.length > 15){
					messages.shift();
				}

				//Send new messages information
				io.emit('messages-update', messages);
			});

			//Disconnect event to remove from the containers
			socket.on('disconnect', ()=>{

				//If the user exists delete it from containers
				if (users_id.includes(socket.id)){
					const index = users_id.indexOf(socket.id);

					users.splice(index, 1);
					users_id.splice(index, 1);

					//Send new online users information
					io.emit('users-update', users);
				}
			})
		});

		//Once events attached executes callback
		isUsed(used);
	})
});

/*
Listening from the httpServer because app.listen()
creates a new httpServer without socket.io attached
*/

httpServer.listen(3000, ()=>{
	console.log('Listening on 3000');
})