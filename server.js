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
const users = [];
const messages = [];
const max_messages = 10;
// Start Node server listening on port 8001.
var server = app.listen(process.env.PORT || 8000, function() {
	console.log(process.env.PORT || 8000);
});
var io = require('socket.io').listen(server);
io.sockets.on("connection", function (socket) {
	socket.on( "add_new_player", function (data) {
		/*
			Update all clients with all current users.
		*/
		users.push({id:socket.id, name:data.name});
		io.emit('player_update', {users:users});
	})
	socket.on("moved", function(data) {
		socket.broadcast.emit('move', {id:socket.id, board:data.board,points:data.points});
	})
	socket.on("disconnect", function (data) {
		io.emit('remove_user', {id:socket.id});
		let remove_index = users.map(function(user) { return user.id; }).indexOf(socket.id);
		if (remove_index > -1) {
			users.splice(remove_index, 1);
		}
	})
	/*
		Not imlemented or tested.
	*/
	socket.on("message", function (data) {
		let name ="";
		if (messages.length > max_messages) {
			// FIFO list. Objects added at index 0 so take last one off.
			messages.splice(-1,1)
		}
		let user_index = users.map(function(user) { return user.id; }).indexOf(socket.id);
		if (user_index > -1) {
			messages.splice(0,0,{name:users[user_index].name, message:data.message});
			io.emit( 'messages', {messages:messages});
		} else {
			console.log("Could not find user for the message", data.message);
		}
	})
})