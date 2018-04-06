// Load the express module
var express = require("express");
// invoke var express and store the resulting application in var app
var app = express();
// set the location for the ejs views
app.set('views', __dirname + '/views'); 
// set the view engine
app.set('view engine', 'ejs');
// set the static file location
app.use(express.static(__dirname + "/static"));
// root route to render the index.ejs file
app.get("/pacman", function (request, response){
	response.render('index');
})
const users = [];
// Start Node server listening on port 8001.
var server = app.listen(process.env.PORT || 8000, function() {
	console.log(process.env.PORT || 8000);
});
var io = require('socket.io').listen(server);
io.sockets.on("connection", function (socket) {
	socket.on( "add_new_player", function (data) {
		// Update all users with all current users.
		// I was having an issue where if a client refreshed
		// I would end up with two copies of a remote player
		// for the non-refreshed client. 
		// Not sure if this is the best way, but I am going to
		// send all of the users and let the client update
		// appropriately. 
		console.log("adding new player", data, socket.id);
		users.push({id:socket.id, name:data.name});
		io.emit('player_update', {users:users});
	})
	socket.on("moved", function(data) {
		console.log("moved", socket.id, data.points)
		socket.broadcast.emit('move', {id:socket.id, board:data.board,points:data.points});
	})
	socket.on("disconnect", function (data) {
		io.emit('remove_user', {id:socket.id});
		for (let i=0;i<users.length;i++) {
			if (users.id === socket.id) {
				console.log("Found remove", users, i);
				users.splice(i, 1);
			}
		}
	})
	/*
		Not imlemented or tested.
	*/
	socket.on("send_message", function (data) {
		if (messages.length > max_messages) {
			// FIFO list. Take first one off the list.
			messages.shift();
		}
		messages.push({name:users[socket.id], message:data.message});
		io.emit( 'new_message', {messages:[{name:users[socket.id], message:data.message}]});
	})
})