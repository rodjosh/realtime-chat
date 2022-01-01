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

const users = [];
const users_id = [];
const messages = [];

io.on('connection', (socket)=>{
	socket.on('check-user', (username, isUsed)=>{
		isUsed(users.includes(username));
	})

	socket.on('new-user', (username)=>{ 
		users.push(username);
		users_id.push(socket.id);

		io.emit('users-update', users);
		io.emit('messages-update', messages);

		socket.on('new-message', (username, text)=>{
			const message = {
				username: username,
				text: text
			};

			messages.push(message);

			if (messages.length > 15){
				messages.shift();
			}

			io.emit('messages-update', messages);
		});

		socket.on('disconnect', ()=>{
			if (users_id.includes(socket.id)){
				const index = users_id.indexOf(socket.id);

				users.splice(index, 1);
				users_id.splice(index, 1);

				io.emit('users-update', users);
			}
		})
	});
});

/*
Listening from the httpServer because app.listen()
creates a new httpServer without socket.io attached
*/

httpServer.listen(3000, ()=>{
	console.log('Listening on 3000');
})