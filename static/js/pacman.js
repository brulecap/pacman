const up_key = 38;
const down_key = 40;
const left_key = 37;
const right_key = 39;
const game_id = "game_area";

var socket;
var done = true;



$(document).ready(function(){
	create_board(game_id, 16, 16);
	let pacman = new Pacman(game_id);
	let points = 0;
	for (var key in ghost_info) {
		pacman.ghost_objects[key] = new Ghost(pacman.board, key, pacman);
	}
	console.log(pacman.ghost_objects);

//	let ghost_creation = setInterval(createGhost, 3000);
//	function createGhost() {
//		if (ghosts.length > 0) {
//			let ghost = ghosts.shift();
//			pacman.ghost_objects[ghost] = new Ghost(pacman.board, ghost, pacman);
//		} else {
//			clearTimeout(ghost_creation);
//		}
//	}
	socket = connect_to_server(game_id);
	// Tell server new player joined
	socket.emit("add_new_player");



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
			if (!pacman.done) {
				pacman.move(direction);
			}
		}
		if (pacman.done) {
			pacman.resetBoard();
			$("#start").show();
		}
	})
	$("#start").on("click", function() {
		console.log("starting");
		pacman.done = false;
		pacman.resetBoard();
		pacman.gameReset();
		$("#start").hide();
	})

	$("#reset").on("click", function() {
		console.log("reset");
		pacman.resetBoard();
	})
});