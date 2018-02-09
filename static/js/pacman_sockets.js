function connect_to_server(container) {
	// Connect to server.
	socket  = io.connect();
	const game_container = container;
	socket.on('player_update', function (data) {
		let user_array = [];
		for (var key in data.users) {
			if (data.users[key] !== socket.id) {
				// User is not this client. Push on array
				if (!$("#"+data.users[key]).length) {
					// We have not drawn this users board yet.
					$("#right_content").append(`<div id="${data.users[key]}" class="remote"></div>`);
					create_board(data.users[key], 8, 8, false);
				}
				user_array.push(data.users[key]);
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