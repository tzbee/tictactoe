var canvas = document.getElementById('gridCanvas');
var ctx = canvas.getContext('2d');
var Messenger = require('./messenger');

var GRID_SIZE = canvas.width;
var SQUARE_SIZE = GRID_SIZE / 3;

var grid = [
	['', '', ''],
	['', '', ''],
	['', '', '']
];

var enableGameToHuman = false;
var imgCache;
var sprites;

var players = [];
var currentPlayerIndex;

var tokens = ['x', 'o'];

var MenuManager = require('./menu-manager');


var menuItems = ['human', 'expert', 'dumb'];
var player1Menu = new MenuManager($('#player1'), menuItems);
var player2Menu = new MenuManager($('#player2'), menuItems);

$('#startButton').on('click', function() {
	var player1 = player1Menu.getSelectedItem();
	var player2 = player2Menu.getSelectedItem();

	updatePlayers(player1, player2);
	start(0);
});

function createPlayer(playerTypeId, token) {
	switch (playerTypeId) {
		case 'expert':
			return new ExpertAI(token);
		case 'dumb':
			return new RandomAI(token);
		case 'human':
			return new HumanPlayer(token);
		default:
			return new ExpertAI(token);
	}
}

function updatePlayers(playerType1, playerType2) {
	players[0] = createPlayer(playerType1, tokens[0]);
	players[1] = createPlayer(playerType2, tokens[1]);
}

function start(firstTurn) {
	currentPlayerIndex = firstTurn;
	emptyGrid(grid);
	playerPlays();
}

function nextPlayer() {
	currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
}

function playerPlays() {
	var currentPlayer = players[currentPlayerIndex];

	if (currentPlayer.type === 'ai') {
		enableGameToHuman = false;

		showAiIsThinking();

		currentPlayer.getNextMove(grid, function(nextMove) {
			play(grid, currentPlayer.token, nextMove);
			if (!renderAndCheckWinner()) {
				nextPlayer();
				playerPlays();
			}
		});

	} else if (currentPlayer.type === 'human') {
		enableGameToHuman = true;
		showHumanTurn();
	}
}

var messenger = new Messenger(document.getElementById('messageBox'), document.getElementById('firstToPlayBox'));

init();

function loadImages(imgURLs, done) {
	if (imgURLs.length === 0) done();

	var imgLoadedCounter = 0;
	var img;
	var imgs = {};

	imgURLs.forEach(function(imgURL) {
		img = new Image();
		img.src = imgURL;
		img.onload = function() {
			imgs[imgURL] = img;
			if (++imgLoadedCounter >= imgURLs.length) done(imgs);
		};
	});
}

function init() {
	if (!imgCache) {
		loadImages(['img/tic-tac-toe-sprites.png'], function(imgs) {
			imgCache = imgs;

			sprites = {
				'o': {
					img: imgCache['img/tic-tac-toe-sprites.png'],
					pos: [0, 0],
					size: [263, 263]
				},
				'x': {
					img: imgCache['img/tic-tac-toe-sprites.png'],
					pos: [305, 4],
					size: [294, 266]
				},
			};

			// Initial rendering

			render(grid, ctx);

			canvas.addEventListener('mousedown', onClick, false);

			document.getElementById('humanFirst').onclick = function() {
				start(0);
			};

			document.getElementById('aiFirst').onclick = function() {
				start(1);
			};
		});
	}
}

function emptyGrid(grid) {
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			grid[i][j] = '';
		}
	}

	render(grid, ctx);
}

function render(grid, ctx) {
	//Clear canvas

	ctx.fillStyle = '#FFFFFF';
	ctx.fillRect(0, 0, GRID_SIZE, GRID_SIZE);

	// Render grid content

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			var piece = grid[i][j];

			if (piece) {
				var pieceSprite = sprites[piece];
				var offset = 10;
				ctx.drawImage(pieceSprite.img, pieceSprite.pos[0], pieceSprite.pos[1], pieceSprite.size[0], pieceSprite.size[1], SQUARE_SIZE * j + offset, SQUARE_SIZE * i + offset, SQUARE_SIZE - offset * 2, SQUARE_SIZE - offset * 2);
			}
		}
	}

	// Render grid internal edges

	ctx.fillStyle = '#5A5A5A';

	ctx.beginPath();
	ctx.moveTo(SQUARE_SIZE, 0);
	ctx.lineTo(SQUARE_SIZE, GRID_SIZE);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(SQUARE_SIZE * 2, 0);
	ctx.lineTo(SQUARE_SIZE * 2, GRID_SIZE);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(0, SQUARE_SIZE);
	ctx.lineTo(GRID_SIZE, SQUARE_SIZE);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(0, SQUARE_SIZE * 2);
	ctx.lineTo(GRID_SIZE, SQUARE_SIZE * 2);
	ctx.stroke();
}

function renderAndCheckWinner() {
	render(grid, ctx);
	var winner = checkWinner(grid);

	if (winner || isFullGrid(grid)) {
		enableGameToHuman = false;
		showWinner(winner);
		return true;
	}

	return false;
}

function getMousePos(event) {
	var rect = canvas.getBoundingClientRect();

	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;

	return [x, y];
}

function onClick(event) {
	if (!enableGameToHuman) return;

	var currentPlayer = players[currentPlayerIndex];

	var mousePos = getMousePos(event);

	var gridPos = [Math.floor(mousePos[1] / SQUARE_SIZE), Math.floor(mousePos[0] / SQUARE_SIZE)];

	var validMove = play(grid, currentPlayer.token, gridPos);

	if (validMove && !renderAndCheckWinner()) {
		nextPlayer();
		playerPlays();
	}
}

function showAiIsThinking() {
	messenger.thinking();
}

function showHumanTurn() {
	messenger.humanTurn();
}

function showWinner(winner) {
	messenger.gameIsOver(winner);
}

function checkWinner(grid) {
	var winner;

	for (var i = 0; i < 3; i++) {
		winner = checkLine(getRow(grid, i));
		if (winner) return winner;
	}

	for (i = 0; i < 3; i++) {
		winner = checkLine(getColumn(grid, i));
		if (winner) return winner;
	}

	winner = checkLine(getDiag1(grid));
	if (winner) return winner;

	winner = checkLine(getDiag2(grid));
	if (winner) return winner;

	return '';
}

function play(grid, token, pos) {
	if (isValidPosition(grid, pos)) {
		grid[pos[0]][pos[1]] = token;
	} else {
		return false;
	}
	return true;
}

function isValidPosition(grid, pos) {
	if (!pos || pos && pos.length !== 2) return false;

	var row = grid[pos[0]];

	if (row === null) return false;

	var piece = row[pos[1]];

	return piece === '';
}

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

function getRow(grid, rowIndex) {
	return grid[rowIndex];
}

function getColumn(grid, colIndex) {
	return [grid[0][colIndex], grid[1][colIndex], grid[2][colIndex]];
}

function getDiag1(grid) {
	return [grid[0][0], grid[1][1], grid[2][2]];
}

function getDiag2(grid) {
	return [grid[2][0], grid[1][1], grid[0][2]];
}

function nbOfOccurences(piece, array) {
	var nbOfOcc = 0;

	array.forEach(function(p) {
		if (p === piece) {
			nbOfOcc++;
		}
	});

	return nbOfOcc;
}

function isFullGrid(grid) {
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			if (!grid[i][j]) return false;
		}
	}

	return true;
}

function ExpertAI(token) {
	this.token = token;
	this.type = 'ai';

	this.evaluate = function(grid, depth) {
		var winner = checkWinner(grid);
		return (!winner ? 0 : winner === this.token ? 10 : -10) - depth;
	};

	this.minimax = function(grid, maximize, depth) {
		depth = depth || 0;

		if (isFullGrid(grid) || checkWinner(grid)) {
			return this.evaluate(grid, depth);
		}

		var gridCopy;
		var scores = [];
		var moves = [];

		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				gridCopy = copyGrid(grid);
				var move = [i, j];
				var isValidMove = play(gridCopy, maximize ? this.token : (this.token === 'x' ? 'o' : 'x'), move);
				if (isValidMove) {
					scores.push(this.minimax(gridCopy, !maximize, depth + 1));
					moves.push(move);
				}
			}
		}

		var result;

		if (maximize) {
			result = scores.reduce(function(max, score) {
				return score > max ? score : max;
			}, -1000);
		} else {
			result = scores.reduce(function(min, score) {
				return score < min ? score : min;
			}, 1000);
		}

		// Get all best moves and pick a random one  
		var indexes = getAllIndexesOf(result, scores);
		var index = indexes[getRandomValue(indexes.length)];

		this.aiChoice = moves[index];

		return result;
	};

	function getAllIndexesOf(value, array) {
		var indexes = [];
		for (var i = 0; i < array.length; i++) {
			if (value === array[i]) indexes.push(i);
		}
		return indexes;
	}

	function getRandomValue(n) {
		return Math.floor(Math.random() * n);
	}

	function copyGrid(grid) {
		var gridCopy = [];
		for (var i = 0; i < 3; i++) {
			gridCopy.push(grid[i].slice());
		}
		return gridCopy;
	}

	this.getNextMove = function(grid, done) {
		setTimeout(function() {
			this.minimax(grid, true);
			done(this.aiChoice);
		}.bind(this), 100);
	};
}

function HumanPlayer(token) {
	this.token = token;
	this.type = 'human';
}

function RandomAI(token) {
	this.token = token;
	this.type = 'ai';

	this.getNextMove = function(grid, done) {
		var move = [getRandomNumber(), getRandomNumber()];
		while (!isValidPosition(grid, move)) {
			move = [getRandomNumber(), getRandomNumber()];
		}
		done(move);
	};

	function getRandomNumber() {
		var random = Math.floor(Math.random() * 3);
		while (random === 3) {
			random = Math.floor(Math.random() * 3);
		}
		return random;
	}
}