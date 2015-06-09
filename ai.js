var TicTacToe = require('./tic-tac-toe');

module.exports = AIPlayer;

function AIPlayer(side) {
	this.side = side;
}

AIPlayer.prototype.evaluate = function(game) {
	return !game.winner ? 0 : game.winner === this.side ? 10 : -10;
};

AIPlayer.prototype.minimax = function(game) {
	if (game.gameOver) {
		return this.evaluate(game);
	}

	var aiSTurn = game.turn === this.side;

	var gameCopy;
	var scores = [];
	var moves = [];

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			gameCopy = copyGame(game);
			var move = [i, j];
			var isValidMove = gameCopy.play(move);
			if (isValidMove) {
				scores.push(this.minimax(gameCopy));
				moves.push(move);
			}
		}
	}

	var result;

	if (aiSTurn) {
		result = scores.reduce(function(max, score) {
			return score > max ? score : max;
		}, -1000);
	} else {
		result = scores.reduce(function(min, score) {
			return score < min ? score : min;
		}, 1000);
	}

	this.choice = moves[scores.indexOf(result)];

	return result;
};


function copyGrid(grid) {
	var gridCopy = [];
	for (var i = 0; i < 3; i++) {
		gridCopy.push(grid[i].slice());
	}
	return gridCopy;
}

function copyGame(game) {
	var gameCopy = new TicTacToe();

	gameCopy.turn = game.turn;
	gameCopy.winner = game.winner;
	gameCopy.gameOver = game.gameOver;

	gameCopy.grid = copyGrid(game.grid);

	return gameCopy;
}

AIPlayer.prototype.getNextMove = function(game, done) {
	var self = this;
	setTimeout(function() {
		self.minimax(game);
		done(self.choice);
	}, 0);
};

var gameTree;

function buildGameTree(game) {

}