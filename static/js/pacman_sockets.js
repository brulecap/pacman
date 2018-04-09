function connect_to_server() {
	var socket_host = window.location.origin + window.location.pathname;
	var user_array = [];
	// Connect to server.
	var socket  = io();
	socket.on('player_update', function (data) {
		for (let key in data.users) {
			if (data.users[key].id !== socket.id) {
				// User is not this client. Push on array
				if (!$("#"+data.users[key].id).length) {
					// We have not drawn this users board yet.
					$("#right_content").append(`<h2 id="header_${data.users[key].id}" class="remote_header">${data.users[key].name} Points: <span>0</span></h2><div id="${data.users[key].id}" class="remote"></div>`);
					create_board(data.users[key].id, 8, 8);
					user_array.push(data.users[key].id);
				}
			}
		}
	});
	socket.on('move', function (data) {
		$("#"+data.id).html(data.board);
		$(`#header_${data.id} span`).html(data.points);
	});
	socket.on('remove_user', function (data) {
		$('#'+data.id).remove();
		$(`#header_${data.id}`).remove();
		let remove_user_index = user_array.indexOf(data.id);
		if (remove_user_index > -1) {
			user_array.splice(remove_user_index, 1);
		}
		console.log("remove", user_array, data.id, remove_user_index);
	});
	socket.on('messages', function (data) {
		let message_list = "<ul>";
		for (let key in data.messages) {
			message_list += `<li>${data.messages[key].name}: ${data.messages[key].message}</li>`;
		}
		message_list += "</ul>";
		$("#messages").html(message_list);
	});
	return socket;
}