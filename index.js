var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var TicTacToe = require('./tic-tac-toe');

var model = new TicTacToe();
var squareSize = 100;

render(ctx);

function render(ctx) {
	var grid = model.grid;

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			var piece = grid[i][j];
			var color = piece === 'x' ? '#FF0000' : piece === 'o' ? '#0000FF' : '#EEEEEE';
			ctx.fillStyle = color;

			ctx.fillRect(squareSize * j, squareSize * i, squareSize, squareSize);
		}
	}
}

function onClick(event) {
	if (model.gameOver) return;

	var x = event.pageY,
		y = event.pageX;
	var gridPos = [Math.floor(x / squareSize), Math.floor(y / squareSize)];

	model.play(gridPos);

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
}

canvas.addEventListener('mousedown', onClick, false);