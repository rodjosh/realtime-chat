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

//Listening from the http server
httpServer.listen(3000, ()=>{
	console.log('Listening on 3000');
})