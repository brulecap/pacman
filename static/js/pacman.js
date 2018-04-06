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
	create_board(game_id, 16, 16);
	let pacman = new Pacman(game_id);
	let points = 0;
	for (var key in ghost_info) {
		pacman.ghost_objects[key] = new Ghost(pacman.board, key, pacman);
	}

	socket = connect_to_server();
	// Tell server new player joined


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

	$("#reset").on("click", function() {
		pacman.resetBoard();
		$("#start").show();
	})
	$("#submit_name").on("click", function() {
		name = $("#user_name").val();
		if (!name.length) {
			$("#enter_name").addClass("text-danger");
		} else {
			console.log("adding new Player", name);
			socket.emit("add_new_player", {name:name});
			$("#display_name").html('Welcome ' + name + ' Coins: <span id="coins">0</span>');
			$("#display_name").show();
			$("#start").show();
			$("#name_input").hide();
			$("#enter_name").removeClass("text-danger");
		}
	})

});