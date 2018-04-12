const up_key = 38;
const down_key = 40;
const left_key = 37;
const right_key = 39;
const game_id = "game_area";

var socket;
var game_on = false;
var name= "";

function emit_to_server(action, message) {
	socket.emit(action, message);
}


$(document).ready(function(){
	create_board(game_id, cell_size, cell_size);
	$("#game_top").css("width", get_board_width(cell_size));
	let pacman = new Pacman(game_id);
	let points = 0;
	for (var key in ghost_info) {
		pacman.ghost_objects[key] = new Ghost(pacman.board, key, pacman);
	}

	socket = connect_to_server();

	$(document).keydown(function(e) {
		let direction = "";
		if (e.keyCode == left_key) {
			direction = "left";
		} else if (e.keyCode == right_key) {
			direction = "right";
		} else if (e.keyCode == up_key) {
			direction = "up";
		} else if (e.keyCode == down_key) {
			direction = "down";
		}
		if (direction) {
			e.preventDefault();
			if (!pacman.done && game_on) {
				pacman.move(direction);
			}
		}
		if (pacman.done && game_on) {
			pacman.resetBoard();
			game_on = false;
			$("#start").show();
			$("#reset").hide();
		}
	})
	$("#start").on("click", function() {
		pacman.done = false;
		game_on = true;
		pacman.resetBoard();
		pacman.gameStart();
		$("#start").hide();
		$("#reset").show();
	})
	$("#submit_name").on("click", function(e) {
		name = $("#user_name").val();
		if (!name.length) {
			$("#name_error").show();
			e.preventDefault();
		}
	})
	$("#submit_message").on("click", function() {
		message = $("#message").val();
		$("#message").val("");
		if (message.length) {
			socket.emit("message", {message:message});
		}
	})
});