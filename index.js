var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var playerTurnBox = document.getElementById('playerTurnBox');

var TicTacToe = require('./tic-tac-toe');

var model = new TicTacToe();
var squareSize = 100;

var Ai = require('./ai.js');
var ai = new Ai('x');

render(ctx);

function render(ctx) {
	var grid = model.grid;

	// Render grid content

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			var piece = grid[i][j];
			var color = piece === 'x' ? '#FF0000' : piece === 'o' ? '#0000FF' : '#EEEEEE';
			ctx.fillStyle = color;

			ctx.fillRect(squareSize * j, squareSize * i, squareSize, squareSize);
		}
	}

	// Render grid internal edges

	ctx.beginPath();
	ctx.moveTo(squareSize, 0);
	ctx.lineTo(squareSize, 300);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(squareSize * 2, 0);
	ctx.lineTo(squareSize * 2, 300);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(0, squareSize);
	ctx.lineTo(300, squareSize);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(0, squareSize * 2);
	ctx.lineTo(300, squareSize * 2);
	ctx.stroke();

	// Update player turn notification

	updatePlayerTurnBox(model.turn);
}

var playerSide = 'o';

if (!isPlayerSTurn()) {
	aiPlays();
}

function isPlayerSTurn() {
	return model.turn === playerSide;
}

function onClick(event) {
	if (model.gameOver || !isPlayerSTurn()) return;

	var x = event.pageY,
		y = event.pageX;
	var gridPos = [Math.floor(x / squareSize), Math.floor(y / squareSize)];

	// Fix accuracy issues on the edges of boxes

	var gridRow = gridPos[0];
	var gridColumn = gridPos[1];

	gridPos = [gridRow < 0 ? 0 : gridRow > 2 ? 2 : gridRow, gridColumn < 0 ? 0 : gridColumn > 2 ? 2 : gridColumn];

	var validMove = play(gridPos);

	if (validMove) {
		aiPlays();
	}
}

function aiPlays() {
	ai.getNextMove(model, function(nextMove) {
		console.log('Done');
		play(nextMove);
	});
	console.log('Loading');
}

function play(pos) {

	// Play
	var validMove = model.play(pos);

	if (!validMove) {
		return false;
	}

	// Render the game
	render(ctx);

	// Check winner
	if (model.gameOver) {
		var winner = model.winner === 'x' ? 'red' : model.winner === 'o' ? 'blue' : '';
		var message = winner ? winner + ' wins!' : 'Draw!';

		var r = confirm(message + ', replay?');

		if (r === true) {
			model.reset();
			render(ctx);
		}
	}

	return true;
}

canvas.addEventListener('mousedown', onClick, false);

function updatePlayerTurnBox(playerTurn) {
	playerTurnBox.innerHTML = 'Turn: ' + (playerTurn === 'x' ? 'red' : 'blue');
}