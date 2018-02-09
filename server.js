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
app.get("/", function (request, response){
	response.render('index');
})
const users = {};
// Start Node server listening on port 8000.
var server = app.listen(8000, function() {
	console.log("Listening");
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
		users[socket.id] = socket.id;
		io.emit('player_update', {users:users});
	})
	socket.on("moved", function(data) {
		socket.broadcast.emit('move', {id:socket.id, board:data.board});
	})
	socket.on("disconnect", function (data) {
		io.emit('remove_user', {id:socket.id});
		delete users[socket.id];
	})
	socket.on("send_message", function (data) {
		if (messages.length > max_messages) {
			// FIFO list. Take first one off the list.
			messages.shift();
		}
		messages.push({name:users[socket.id], message:data.message});
		io.emit( 'new_message', {messages:[{name:users[socket.id], message:data.message}]});
	})
})