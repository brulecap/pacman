function connect_to_server() {
	var socket_host = window.location.origin + window.location.pathname;
	// Connect to server.
	console.log("host name", socket_host);
	var user_array = [];
	socket  = io.connect(socket_host);
	socket.on('player_update', function (data) {
		for (let key in data.users) {
			console.log("key",data.users[key], data.users[key].id);
			if (data.users[key].id !== socket.id) {
				console.log("New user", data.users[key].id)
				// User is not this client. Push on array
				if (!$("#"+data.users[key].id).length) {
					console.log("not added");
					// We have not drawn this users board yet.
					$("#right_content").append(`<h2>${data.users[key].name}</h2><div id="${data.users[key].id}" class="remote"></div>`);
					create_board(data.users[key].id, 8, 8);
				}
				user_array.push(data.users[key].id);
			}
		}
		$(".remote").each(function() {
			// User has disconnected. Remove users board
			if (!user_array.includes($(this).attr('id'))) {
				$(this).remove();
			}
		})
	});
	socket.on('move', function (data) {
		$("#"+data.id).html(data.board);
	});
	socket.on('remove_user', function (data) {
		$('#'+data.id).remove();
	});
	return socket;
}