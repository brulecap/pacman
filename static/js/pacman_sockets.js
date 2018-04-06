function connect_to_server() {
	var socket_host = window.location.origin + window.location.pathname;
	// Connect to server.
	console.log("host name", socket_host);
	var user_array = [];
//	socket  = io.connect(socket_host);
//	socket  = io.connect("http://localhost:8000");
	var socket  = io();
	socket.on('player_update', function (data) {
		for (let key in data.users) {
			if (data.users[key].id !== socket.id) {
				// User is not this client. Push on array
				if (!$("#"+data.users[key].id).length) {
					// We have not drawn this users board yet.
					$("#right_content").append(`<h2 class="remote_header">${data.users[key].name} Points: <span id="points_${data.users[key].id}">0</span></h2><div id="${data.users[key].id}" class="remote"></div>`);
					create_board(data.users[key].id, 8, 8);
					user_array.push(data.users[key].id);
				}
			}
		}
		$(".remote").each(function() {
			// User has disconnected. Remove users board
			if (!user_array.includes($(this).attr('id'))) {
				// Not sure if this is working correctly... Remove console.log below 
				// if we see that it is.
				console.log("removing user ", this);
				$(this).remove();
			}
		})
	});
	socket.on('move', function (data) {
		console.log("move", data.points);
		$("#"+data.id).html(data.board);
		$(`#points_${data.id}`).html(data.points);
	});
	socket.on('remove_user', function (data) {
		$('#'+data.id).remove();
	});
	return socket;
}