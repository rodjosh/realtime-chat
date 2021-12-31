//Importing the necessary libraries
const http = require('http');
const socket_io = require('socket.io');
const express = require('express');

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

io.on('connection', (socket)=>{
	console.log(socket.id);
})

/*
Listening from the httpServer because app.listen()
creates a new httpServer without socket.io attached
*/

httpServer.listen(3000, ()=>{
	console.log('Listening on 3000');
})