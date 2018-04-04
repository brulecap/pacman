const move_timeout = 550;
const start_timeout = 3000;
const re = /16px/gi;
const cell_size = "8px";


class Character {
	/*
		Paramters:
			board - id of boaard containing character
			char_type - pacman, one of the ghosts(pinky, blinky, clyde, inky...) or other characters??? 
	*/
	constructor(board, char_type) {
		this.x = 0; // init value
		this.y = 0; // init value
		this.board = board;
		this.direction = "right";
		this.all_transforms = "left right up down";
		this.scared = false;
		this.transform = "";
		this.character = char_type;
		this.path_out = [];
		this.setPosition(this.character);
	}
	/*
		Sets x and y coordinates of character.

		Paramters:
			character - pacman, one of the ghosts...
	*/
	setPosition(character) {
		this.x = $("#" + this.board + " ." + character).parent().index();
		this.y = $("#" + this.board + " ." + character).index();
	}
	/*
		Gets x, y coordinate of character.

		Paramters:
			character - pacman, one of the ghosts...

		Returns: object containing x,y coordinates
	*/
	getPosition(character) {
		return {x:$("#" + this.board + " ." + character).parent().index(),
				y:$("#" + this.board + " ." + character).index()};
	}
	/*
		This method gets the dom object of the cell where a move would take us.

		Returns dom object of new cell
	*/
	getNewCell() {
		let dom_identifier = "#" + this.board + " ." + this.character;
		let new_cell = "";
		if (this.direction === "left") {
			new_cell = $(dom_identifier).prev();
		} else if (this.direction ===  "right") {
			new_cell = $(dom_identifier).next();
		} else if (this.direction === "up") {
			new_cell = $(dom_identifier).parent("div").prev().eq(0).children().eq($(dom_identifier).index());
		} else {
			new_cell = $(dom_identifier).parent("div").next().eq(0).children().eq($(dom_identifier).index());
		}
		// For now we will let everyone move from one side of the board to the other.
		if (new_cell.length === 0) {
			//Going to the other side of the board
			if ($(dom_identifier).index() === 0) {
				//left side
				new_cell = $(dom_identifier).siblings().last();
			} else {
				new_cell = $(dom_identifier).siblings().first();
			}
		}
		return new_cell;
	}
	/*
		Checks if cell is a brick or door. Note ghosts can move out of door
		but not back through door.

		Paramters:
			cell - cell move would take us	

		Returns true if move okay, false otherwise.	
	*/
	move_okay(cell) {
		if (!(cell.hasClass("brick")) && 
			(!(cell.hasClass("door")) || (this.path_out.length > 0))) {
			return true;
		}
		return false;
	}
	/*
		Gets cell where move would go using getNewCell and then checks if cell is a brick or door using move_okay.
		If move is okay, character is moved to new cell. Also checks if new cell contains both pacman and ghost.

		Paramters:
			direction - direction of move... up, down, left, right

		Returns cell if move successfull, false otherwise.	
	*/
	move(direction) {
		this.direction = direction;
		let new_cell = this.getNewCell();
		if (new_cell.length > 0) {
			if (this.move_okay(new_cell)) {
				// Complete move
				if (this.scared) {
					$("#" + this.board + " ." + this.character).removeClass("scared");
					new_cell.addClass("scared");
				}
				$("#" + this.board + " ." + this.character).removeClass(this.character + " " + this.all_transforms);
				new_cell.addClass(this.character + " " + this.transform);
				this.checkCollision(new_cell);
				this.setPosition(this.character);
				return new_cell;
			}
		} else {
			console.log(this.character, "super move --- Could not get new cell");
		}
		return false;
	}
	/*
		Puts character back in it's starting position as determined by the "character name"_holder class
		defined in board.js.
	*/
	goHome() {
		if (this.scared) {
			$("#" + this.board + " ."+this.character).removeClass("scared");
		}
		$("#" + this.board + " ."+this.character).removeClass(this.character + " " + this.all_transforms);
		$("#" + this.board + " ." + this.character + "_holder").addClass(this.character);
		this.setPosition();
	}
	/*
		Checks if pacman and a ghost occupy same cell.

		TODO: Need to decouple the check from the action. i.e. Should not be sending
		ghost home here.
	*/
	checkCollision(cell) {
		let ghost = this.getGhostCell(cell);
		if (ghost && this.isPacmanCell(cell)) {
			// We need pacman object. "this" is either pacman or a ghost.
			// Assume pacman is this... If this is a ghost then get pacman
			// from ghost. 
			let pacman = this;
			if (this instanceof Ghost) {
				pacman = this.pacman;
			}
			if (pacman.energized) {
				pacman.ghost_objects[ghost].goHome(start_timeout);
			} else {
				pacman.done = true;
			}
		}
	}
	/*
		Checks a ghost occupies the cell.

		Parameters:
			cell - the cell to check

		Returns name of chracter in cell, false otherwise.
	*/
	getGhostCell(cell) {
		for (var key in ghost_info) {
			if (cell.hasClass(key)) {
				return key;
			}
		}
		return false;
	}
	/*
		Checks if pacman occupies the cell.

		Parameters:
			cell - the cell to check

		Returns true if pacman occupies the cell, false otherwise.
	*/
	isPacmanCell(cell) {
		if (cell.hasClass("pacman")) {
			return true;
		}
		return false;
	}
	/*
		Send message to server.

		Parameters:
			action: string containing the action ... moved, and others to come
			message: object containing the action data.
	*/
	emitServer(action, message) {
		emit_to_server(action, message);
	}

}

class Pacman extends Character {
	/*
		Parameters:
			See character constructor.
	*/
	constructor(board) {
		super(board, "pacman");
		this.energized = false;
		this.energized_timeout = false;
		// Number of dots pacman has eaten.
		this.dots = 0;
		this.done = true;
		this.ghost_objects = {};
	}
	/*
		Calls reset_board in board.js to put board in starting configuration. Then clears
		the move interval for ghosts and the ghost starting timeout.

		TODO: This whole reset/restart process is a bit convoluted. Need to clean this up
		and make it more concise.
	*/
	resetBoard() {
		reset_board(this.board);
		for (var key in this.ghost_objects) {
			this.ghost_objects[key].scared=false;
			clearInterval(this.ghost_objects[key].ghost_interval);
			clearTimeout(this.ghost_objects[key].ghost_start);
		}
		this.dots = 0;
		this.setPosition(this.character);
		this.emitServer("moved", {board:$("#"+this.board).html().replace(re, cell_size)});
	}
	/*
		Calls all ghosts goHome method which sets the start timeout for
		each ghost.
	*/
	gameStart() {
		let timeout = start_timeout;
		for (var key in this.ghost_objects) {
			this.ghost_objects[key].goHome(timeout);
			timeout += start_timeout;
		}
	}

	/*
		This calls super.move. If a new cell is returned, then checks if cell is a point and performs
		logic associated with that.

		Parameters:
			direction - direction of move(up, down, left, right)
	*/
	move(direction) {
		this.transform = direction;
		let new_cell = super.move(direction);
		if (new_cell) {
			if ((new_cell.hasClass("point")) || (new_cell.hasClass("energizer"))) {
				this.dots += 1;
				new_cell.removeClass("point");
				if (new_cell.hasClass("energizer")) {
					new_cell.removeClass("energizer");
					this.energized = true;
					for (var key in this.ghost_objects) {
						$("#" + this.board + " ." + key).addClass("scared");
						this.ghost_objects[key].scared = true;
					}
					if (this.energized_timeout) {
						// pacman energized while he was alread energized... Silly dude.
						// Cancel current timer and start new one.
						clearInterval(this.energized_timeout);
					}
					this.energized_timeout = setTimeout(this.energizedTimeout.bind(this), 10000);
				}
				// This is checking if all the points have been eaten.
				if ($("#" + this.board + " .game_row").find(".point").length === 0) {
					this.done = true;
				}
			}
		}
		this.emitServer("moved", {board:$("#"+this.board).html().replace(re, cell_size)});
	}
	/*
		Callback method to setTimeout. Sets energized to false.
	*/
	energizedTimeout() {
		this.energized_timeout = false;
		this.energized = false;
		for (var key in this.ghost_objects) {
			$("#" + this.board + " ." + key).removeClass("scared");
			this.ghost_objects[key].scared = false;
		}
	}	
}

class Ghost extends Character {
	/*
		Parameters:
			See character constructor.
	*/
	constructor(board, ghost_type, pacman) {
		super(board, ghost_type);
		this.pacman = pacman;
		this.ghost_interval = undefined;
		this.ghost_start = undefined;
		// exclude_directions is used to mark paths we have tried or direction
		// back to where we were. i.e If previous move was left, then we don't
		// want to go right. This requires that the board does not have any dead
		// ends.
		this.exclude_directions = {'up':false, 'down':false, 'left':false, 'right':false};
		this.resetPathOut();
	}
	/*
		Gets a random direction not in exclude_directions.
	*/
	getDirection() {
		let direction = "";
		while (true) {
			switch(Math.floor(Math.random()*4)) {
				case 0:
					direction = "up";
					break;
				case 1:
					direction = "down";
					break;
				case 2:
					direction = "left";
					break;
				default:
					direction = "right";
			}
			if (!this.exclude_directions[direction]) {
				// direction not excluded. return it otherwise try again.
				return direction;
			}
		}
	}
	/*
		This is an attempt to make a somewhat "smart" ghost.
		ghost x < pacman x move down,
		ghost x > pacman x move up,
		ghost y < pacman y move right,
		move left
		The opposite of above will happend if pacman is energized.
		Note: exclude_directions is used to mark paths we have tried. If that move
		was unsuccessful, brick or door, then we don't want to try it again.

		Returns direction or false if a "smart" direction is not available.

		TODO: Not very. Better way?
	*/
	smart_move() {
		let pacman_position = this.getPosition("pacman");
		if ((this.x < pacman_position.x) && (!this.exclude_directions[this.toOrAway("down")])) {
			this.exclude_directions[this.toOrAway("down")] = true;
			return this.toOrAway("down");
		} else if ((this.x > pacman_position.x) && (!this.exclude_directions[this.toOrAway("up")])) {
			this.exclude_directions[this.toOrAway("up")] = true;
			return this.toOrAway("up");
		} else if ((this.y < pacman_position.y) && (!this.exclude_directions[this.toOrAway("right")])) {
			this.exclude_directions[this.toOrAway("right")] = true;
			return this.toOrAway("right");
		} else if (!this.exclude_directions[this.toOrAway("left")]){
			this.exclude_directions[this.toOrAway("left")] = true;
			return this.toOrAway("left");
		}
		return false;
	}
	/*
		Determines if we should go towards pacman or away based on energized
		state.

		Parameters:
			direction - "up", "down", "left", "right"

		returns direction
	*/
	toOrAway(direction) {
		if (!this.pacman.energized) {
			return direction;
		} else {
			return this.getOpposite(direction);
		}
	}
	/*
		First moves ghost out of home through door. Then tries to make a smart move in regards
		to pacman's location. If not successful with that it just moves. Calls super.move to
		complete the move and then performs tasks specific to ghost.

		TODO: Clean up... not concise... I'm using that phrase a lot...
	*/
	move() {
		if (this.path_out.length > 0) {
			super.move(this.path_out.shift());
		} else {
			var direction;
			let moved = false;
			while (true) {
				direction = this.smart_move();
				if (direction) {
					if (super.move(direction)) {
						moved = true;
						break;
					}
				} else {
					this.resetExcluded();
					this.excludeOpposite();
					break;
				}
			}
			if (!moved) {
				direction = this.getDirection();
				while (true) {
					if (super.move(direction)) { break; }
					this.exclude_directions[direction] = true;
					direction = this.getDirection();
				}
			}
		}
		if (this.pacman.done) {
			this.pacman.resetBoard();
			$("#start").show();
			$("#reset").hide();
		} else {
			this.emitServer("moved", {board:$("#"+this.board).html().replace(re, cell_size)});
		}
		this.resetExcluded();
		this.excludeOpposite();
	}
	/*
		Set exclude_directions to false for each object - "up", "down", ...
	*/
	resetExcluded() {
		this.exclude_directions = {'up':false, 'down':false, 'left':false, 'right':false};
	}
	/*
		Set opposite of direction to true so that ghost does not go back to where
		it was... No random back and forth.
	*/
	excludeOpposite() {
		this.exclude_directions[this.getOpposite(this.direction)] = true;
	}
	/*
		Get opposite direction.

		Parameters:
			direction - "up", "down", "left", "right"

		Returns opposite direction
	*/
	getOpposite(direction) {
		switch(direction) {
			case 'up':
				return 'down';
			case 'down':
				return 'up';
				break;
			case 'right':
				return 'left';
				break;
			default:
				return 'right';
		}
	}
	/*
		Send ghost home and reset. Clears the move interval and then sets timer for when
		ghost starts moving.
	*/
	goHome(timeout_value) {
		super.goHome();
		this.resetPathOut();
		clearInterval(this.ghost_interval);
		this.ghost_start = setTimeout(this.reStart.bind(this), timeout_value);
	}
	/*
		Callback for setTimeout. Starts move interval.
	*/
	reStart() {
		this.ghost_interval = setInterval(this.move.bind(this), move_timeout);
	}
	/*
		Initializes ghost path_out so ghost know how to get out of "home".
	*/
	resetPathOut() {
		this.path_out = ghost_info[this.character].slice();
	}
}