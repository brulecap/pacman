/*
	game board defines the setup of the pacman game.
	Each number in the array references the type of brick as defined in brick_type below. 
*/
const game_board = 	[[16,12,12,12,12,12,12,12,12,12,12,12,12,10,10,12,12,12,12,12,12,12,12,12,12,12,12,17],
					[15,3,3,3,3,3,3,3,3,3,3,3,3,13,14,3,3,3,3,3,3,3,3,3,3,3,3,15],
					[15,3,16,10,10,17,3,16,10,10,10,17,3,13,14,3,16,10,10,10,17,3,16,10,10,17,3,15],
					[15,20,13,0,0,14,3,13,0,0,0,14,3,13,14,3,13,0,0,0,14,3,13,0,0,14,20,15],
					[15,3,18,11,11,19,3,18,11,11,11,19,3,18,19,3,18,11,11,11,19,3,18,11,11,19,3,15],
					[15,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,15],
					[15,3,16,10,10,17,3,16,17,3,16,10,10,10,10,10,10,17,3,16,17,3,16,10,10,17,3,15],
					[15,3,18,11,11,19,3,13,14,3,18,11,11,0,0,11,11,19,3,13,14,3,18,11,11,19,3,15],
					[15,3,3,3,3,3,3,13,14,3,3,3,3,13,14,3,3,3,3,13,14,3,3,3,3,3,3,15],
					[18,12,12,12,12,17,3,13,0,10,10,17,3,13,14,3,16,10,10,0,14,3,16,12,12,12,12,19],
					[0,0,0,0,0,15,3,13,0,11,11,19,3,18,19,3,18,11,11,0,14,3,15,0,0,0,0,0],
					[0,0,0,0,0,15,3,13,14,0,0,0,0,0,0,0,0,0,0,13,14,3,15,0,0,0,0,0],
					[0,0,0,0,0,15,3,13,14,0,16,12,12,1,1,12,12,17,0,13,14,3,15,0,0,0,0,0],
					[12,12,12,12,12,19,3,18,19,0,15,0,0,0,0,0,0,15,0,18,19,3,18,12,12,12,12,12],
					[0,0,0,0,0,0,3,0,0,0,15,0,4,5,6,7,0,15,0,0,0,3,0,0,0,0,0,0],
					[12,12,12,12,12,17,3,16,17,0,15,0,0,0,0,0,0,15,0,16,17,3,16,12,12,12,12,12],
					[0,0,0,0,0,15,3,13,14,0,18,12,12,12,12,12,12,19,0,13,14,3,15,0,0,0,0,0],
					[0,0,0,0,0,15,3,13,14,0,0,0,0,0,2,0,0,0,0,13,14,3,15,0,0,0,0,0],
					[0,0,0,0,0,15,3,13,14,0,16,10,10,10,10,10,10,17,0,13,14,3,15,0,0,0,0,0],
					[16,12,12,12,12,19,3,18,19,0,18,11,11,0,0,11,11,19,0,18,19,3,18,12,12,12,12,17],
					[15,3,3,3,3,3,3,3,3,3,3,3,3,13,14,3,3,3,3,3,3,3,3,3,3,3,3,15],
					[15,3,16,10,10,17,3,16,10,10,10,17,3,13,14,3,16,10,10,10,17,3,16,10,10,17,3,15],
					[15,3,18,11,0,14,3,18,11,11,11,19,3,18,19,3,18,11,11,11,19,3,13,0,11,19,3,15],
					[15,20,3,3,13,14,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,13,14,3,3,20,15],
					[13,10,17,3,13,14,3,16,17,3,16,10,10,10,10,10,10,17,3,16,17,3,13,14,3,16,10,14],
					[13,11,19,3,18,19,3,13,14,3,18,11,11,0,0,11,11,19,3,13,14,3,18,19,3,18,11,14],
					[15,3,3,3,3,3,3,13,14,3,3,3,3,13,14,3,3,3,3,13,14,3,3,3,3,3,3,15],
					[15,3,16,10,10,10,10,0,0,10,10,17,3,13,14,3,16,10,10,0,0,10,10,10,10,17,3,15],
					[15,3,18,11,11,11,11,11,11,11,11,19,3,18,19,3,18,11,11,11,11,11,11,11,11,19,3,15],
					[15,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,15],
					[18,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,19]];

/*
	The following constants define the different types of bricks in the game.
	The border on the bricks are defined by the classes. Class top for example
	puts a border on the top. Class left_top should be used in conjunction with left and top
	to provide a rounded border. Similarly with the other side_side combinations.
	ID pacman_holder denotes the place on the game board pacman will be put at the start of
	a game/round. Class pacman is the current position of pacman on the grid.
	Class coin_holder will have a point in place when at the start off each
	game/round. When pacman eats a coin, class point will be removed.
*/
const brick_type =[];
brick_type[10] = 'class="brick top"';
brick_type[11] = 'class="brick bottom"';
brick_type[12] = 'class="brick top bottom"';
brick_type[13] = 'class="brick left_border"';
brick_type[14] = 'class="brick right_border"';
brick_type[15] = 'class="brick left_border right_border"';
brick_type[16] = 'class="brick left_border top left_top"';
brick_type[17] = 'class="brick right_border top right_top"';
brick_type[18] = 'class="brick left_border bottom left_bottom"';
brick_type[19] = 'class="brick right_border bottom right_bottom"';
brick_type[20] = 'class="energizer_holder energizer"';
brick_type[0] = 'class="blank"';
brick_type[1] = 'class="door"';
brick_type[2] = 'class="pacman_holder pacman"';
brick_type[3] = 'class="coin_holder point"';
brick_type[4] = 'class="pinky_holder pinky"';
brick_type[5] = 'class="blinky_holder blinky"';
brick_type[6] = 'class="clyde_holder clyde"';
brick_type[7] = 'class="inky_holder inky"';

// ghost_info contains ghost name and the path to enter playing field.
const ghost_info = {'pinky':['up','right','up','up'],
				  'blinky':['up','up','up'],
				  'clyde':['up','up','up'],
				  'inky':['up','left','up','up']};

/*
	Calls create_board_html to... Yup create the board html.
	Then set css properties width and height on both the board
	and each cell in the board.
*/
function create_board(id, width, height) {
	// dom object of whole board
	let board_dom_object = $("#"+id);
	// dom object of all divs(cells) in the board.
	board_dom_object.css("width", width*game_board[0].length);
	board_dom_object.css("height", height*game_board.length);
	board_dom_object.html(create_board_html());
	let board_div_dom_object = $("#"+id+" .game_row div");
	board_div_dom_object.css("width", width);
	board_div_dom_object.css("height", height);	
}
/*
	Creates html of the board. Uses const game_board and brick_type defined above
	See their defintion for details.
	Board html short example:
	<div id="board_div_id>
		<div class="row">
			<div class"brick_type"></div>
			<div class"brick_type"></div>
		</div>
		<div class="row">
			<div class"brick_type"></div>
			<div class"brick_type"></div>
		</div>
	</div>
*/
function create_board_html() {
	let board_html = "";
	for (var i=0; i<game_board.length; i++) {
		board_html += '<div class="game_row">';
		for (var j=0; j<game_board[i].length; j++) {
			board_html += '<div ' + brick_type[game_board[i][j]] + '></div>';
		}
		board_html += '</div>';
	}
	return board_html;
}
/*
	Resets board to starting configuration. Puts pacman and ghosts in their starting
	place and repopulates coins.
*/
function reset_board(board) {
	$("#" + board + " .energizer_holder").addClass("energizer point");
	$("#" + board + " .coin_holder").addClass("point");
	$("#" + board + " .pacman").removeClass("pacman");
	$("#" + board + " .pacman_holder").addClass("pacman");
	$("#" + board + " .pinky").removeClass("pinky");
	$("#" + board + " .pinky_holder").addClass("pinky");
	$("#" + board + " .clyde").removeClass("clyde");
	$("#" + board + " .clyde_holder").addClass("clyde");
	$("#" + board + " .blinky").removeClass("blinky");
	$("#" + board + " .blinky_holder").addClass("blinky");
	$("#" + board + " .inky").removeClass("inky");
	$("#" + board + " .inky_holder").addClass("inky");
	$("#" + board + " .scared").removeClass("scared");	
}