function connect_to_server() {
	var socket_host = window.location.origin + window.location.pathname;
	var user_array = [];
	// Connect to server.
	var socket  = io();
	socket.on('session_restore', function (data) {
		$(".container").show();
		$("#display_name").html(data.name);
		$("#coins").html(data.points);
		$("#name_input").hide();

	});
	socket.on('player_update', function (data) {
		for (let key in data.users) {
			if (data.users[key].id !== socket.id) {
				// User is not this client. Push on array
				if (!$(`#${data.users[key].id}`).length) {
					// We have not drawn this users board yet.
					$("#remote_content").append(`<div class="remote_game col-sm-6 col-md-4"><h2 id="header_${data.users[key].id}" class="remote_header">${data.users[key].name} Score: <span>0</span></h2><div id="${data.users[key].id}" class="remote"></div></div>`);
					create_board(data.users[key].id, remote_cell_size, remote_cell_size);
					$(".remote_header").css("width", get_board_width(remote_cell_size));
					user_array.push(data.users[key].id);
				}
			}
		}
	});
	socket.on('move', function (data) {
		$(`#${data.id}`).html(data.board);
		$(`#header_${data.id} span`).html(data.points);
	});
	socket.on('remove_user', function (data) {
		$(`#${data.id}`).remove();
		$(`#header_${data.id}`).remove();
		let remove_user_index = user_array.indexOf(data.id);
		if (remove_user_index > -1) {
			user_array.splice(remove_user_index, 1);
		}
	});
	socket.on('messages', function (data) {
		let message_list = "";
		if (data.messages.length === 0) {
			message_list = "<li>No messages yet</li>";
		} else {
			for (const [i, message] of data.messages.entries()) {
				message_list += `<li${i%2?' class="odd"':''}>${message.name}: ${message.message}</li>`;
			}
		}
		$("#messages ul").html(message_list);
	});
	return socket;
}