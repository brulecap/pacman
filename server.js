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
// get body parser and use it
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
// setup sessions
var Session = require('express-session');
var session = Session({secret:'D0Imaed8ad2ppw',resave:true,saveUninitialized:true});
app.use(session);
/*
	When running behind nginx with proxy_pass the node server
	only "knows" itself as localhost. But the ejs templates and redirects
	need to know the url according to the outside world. This is configured
	in ecosystem.config.js used by pm2.

	With this in place we can test as localhost on the development side and
	minimal configuration on the deployed side.
*/
// root route to render the index.ejs file
app.get("/", function (request, response) {
	// Set session id
	request.session.uid = Date.now();
	response.render('index', {baseUrl:process.env.BASE || request.protocol + '://' + request.get('host') + request.originalUrl});
})
// root route to render the index.ejs file
app.get("/reset", function (request, response) {
	// Set session id
	request.session.destroy();
	response.redirect(process.env.BASE || '/');
})
app.post("/", function (request, response) {
	// Set session name
	request.session.name = request.body.user_name;
	request.session.points = 0;
	response.redirect(process.env.BASE || '/');
})
const users = [];
const messages = [];
const max_messages = 10;
// Start Node server listening on port 8001.
var server = app.listen(process.env.PORT || 8000, function() {
	console.log(process.env.PORT || 8000);
});

var io = require('socket.io')(server);

io.use(function(socket, next) {
  session(socket.handshake, {}, next);
});

io.sockets.on("connection", function (socket) {
	if (socket.handshake.session.name) {
		// Session is defined for this socket. Tell client who they are :) and give them
		// all the users and messages.
		socket.emit("session_restore", {name:socket.handshake.session.name, points:socket.handshake.session.points});
		socket.emit('player_update', {users:users});
		socket.emit('messages', {messages:messages});
		// Push new user on array.
		users.push({id:socket.id,name:socket.handshake.session.name,points:socket.handshake.session.points});
		// Tell everyone about the new user.
		socket.broadcast.emit('player_update', {users:[{id:socket.id,name:socket.handshake.session.name,points:socket.handshake.session.points}]});
	}
	socket.on( "add_new_player", function (data) {
		/*
			Update all clients with all current users.
		*/
		if (users.map(function(user) { return user.id; }).indexOf(socket.id) === -1) {
			// Tell new user about everyone and all messages.
			socket.emit('player_update', {users:users});
			socket.emit('messages', {messages:messages});
			// Push new user on array.
			users.push({id:socket.id, name:data.name});
			// Tell everyone about the new user.
			socket.broadcast.emit('player_update', {users:[{id:socket.id, name:data.name, points:data.points}]});
		} else {
			console.log("player already exists")
		}
	})
	socket.on("moved", function(data) {
		socket.handshake.session.points = data.points;
		socket.broadcast.emit('move', {id:socket.id, board:data.board,points:data.points});
	})
	socket.on("disconnect", function (data) {
		socket.broadcast.emit('remove_user', {id:socket.id});
		let remove_index = users.map(function(user) { return user.id; }).indexOf(socket.id);
		if (remove_index > -1) {
			users.splice(remove_index, 1);
		}
	})
	/*
		Handle messages.
	*/
	socket.on("message", function (data) {
		let name ="";
		if (messages.length > max_messages) {
			// FIFO list. Object added at index 0 so take last one off.
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