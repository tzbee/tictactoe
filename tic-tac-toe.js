module.exports = TicTacToe;

function TicTacToe() {
	this.gameOver = false;
	this.winner = '';
	this.turn = 'x';

	this.grid = [
		['', '', ''],
		['', '', ''],
		['', '', '']
	];

	this.play = function(pos) {
		var side = this.turn;

		if (!pos || !side || (side !== 'x' && side !== 'o')) {
			return;
		}

		if (this.isValidPosition(pos)) {
			this.grid[pos[0]][pos[1]] = side;
			this.turn = this.turn === 'x' ? 'o' : 'x';
		}

		this.winner = this.checkWinner();
		if (this.winner || this.isFullGrid()) this.gameOver = true;
	};

	this.isValidPosition = function(pos) {
		if (!pos || pos && pos.length !== 2) return false;

		var row = this.grid[pos[0]];

		if (row === null) return false;

		var piece = row[pos[1]];

		return piece === '';
	};

	this.checkWinner = function() {
		var winner;

		for (var i = 0; i < 3; i++) {
			winner = checkLine(this.getRow(i));
			if (winner) return winner;
		}

		for (i = 0; i < 3; i++) {
			winner = checkLine(this.getColumn(i));
			if (winner) return winner;
		}

		winner = checkLine(this.getDiag1());
		if (winner) return winner;

		winner = checkLine(this.getDiag2());
		if (winner) return winner;

		return '';
	};

	function checkLine(line) {
		var nbX = nbOfOccurences('x', line);
		var nbO = nbOfOccurences('o', line);

		if (nbX === 3) {
			return 'x';
		}
		if (nbO === 3) {
			return 'o';
		} else {
			return '';
		}
	}

	this.getRow = function(rowIndex) {
		return this.grid[rowIndex];
	};

	this.getColumn = function(colIndex) {
		var grid = this.grid;
		return [grid[0][colIndex], grid[1][colIndex], grid[2][colIndex]];
	};

	this.getDiag1 = function() {
		var grid = this.grid;
		return [grid[0][0], grid[1][1], grid[2][2]];
	};

	this.getDiag2 = function() {
		var grid = this.grid;
		return [grid[2][0], grid[1][1], grid[0][2]];
	};

	function nbOfOccurences(piece, array) {
		var nbOfOcc = 0;

		array.forEach(function(p) {
			if (p === piece) {
				nbOfOcc++;
			}
		});

		return nbOfOcc;
	}

	this.reset = function() {
		this.gameOver = false;

		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				this.grid[i][j] = '';
			}
		}
	}

	this.isFullGrid = function() {
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				if (!this.grid[i][j]) return false;
			}
		}

		return true;
	}

	this.toString = function() {
		return this.grid.map(function(row) {
			return row.map(function(p) {
				return p;
			}).join(',');
		}).join('||');
	};
}