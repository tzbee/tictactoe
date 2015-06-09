var canvas = document.getElementById('grid');
var ctx = canvas.getContext('2d');

var TicTacToe = require('./tic-tac-toe');

var squareSize = 100;

var Ai = require('./ai.js');

var sides = {
	ai: 'x',
	player: 'o'
};

var ai = new Ai(sides.ai);
var firstTurn = sides.ai;

var model = new TicTacToe(firstTurn);
model.gameOver = true;

render(ctx);

function start() {
	model.gameOver = false;

	if (isTurnOf('ai')) {
		aiPlays();
	}
}

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
}

function isTurnOf(side) {
	return model.turn === sides[side];
}

function onClick(event) {
	if (model.gameOver || !isTurnOf('player')) return;

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
	if (model.gameOver || !isTurnOf('ai')) return;

	ai.getNextMove(model, function(nextMove) {
		hideSpinner();
		play(nextMove);
	});
	showSpinner();
}

function showSpinner() {
	var classes = ' fa fa-spinner fa-spin';

	var x = document.getElementsByClassName('spinner');

	for (var i = 0; i < x.length; i++) {
		x[i].className += classes;
	}
}

function hideSpinner() {
	var x = document.getElementsByClassName('spinner');

	for (var i = 0; i < x.length; i++) {
		x[i].className = 'spinner';
	}
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

document.getElementById('theButton').addEventListener('click', start);
canvas.addEventListener('mousedown', onClick, false);