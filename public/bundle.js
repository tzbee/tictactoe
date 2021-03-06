(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var canvas = document.getElementById('gridCanvas');
var ctx = canvas.getContext('2d');
var Messenger = require('./messenger');

var GRID_SIZE = canvas.width;
var SQUARE_SIZE = GRID_SIZE / 3;

var grid = [['', '', ''], ['', '', ''], ['', '', '']];

var tokens = {
	player: 'x',
	ai: 'o'
};

var enableGameToHuman = false;
var imgCache;
var sprites;

var messenger = new Messenger(
	document.getElementById('messageBox'),
	document.getElementById('firstToPlayBox'),
	tokens.ai
);

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
				o: {
					img: imgCache['img/tic-tac-toe-sprites.png'],
					pos: [0, 0],
					size: [263, 263]
				},
				x: {
					img: imgCache['img/tic-tac-toe-sprites.png'],
					pos: [305, 4],
					size: [294, 266]
				}
			};

			// Initial rendering

			render(grid, ctx);

			canvas.addEventListener('mousedown', onClick, false);

			document.getElementById('humanFirst').onclick = function() {
				start('human');
			};

			document.getElementById('aiFirst').onclick = function() {
				start('ai');
			};
		});
	}
}

function start(firstTurn) {
	emptyGrid(grid);

	if (firstTurn === 'ai') {
		aiPlays(grid);
	} else if (firstTurn === 'human') {
		showHumanTurn();
		enableGameToHuman = true;
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
				ctx.drawImage(
					pieceSprite.img,
					pieceSprite.pos[0],
					pieceSprite.pos[1],
					pieceSprite.size[0],
					pieceSprite.size[1],
					SQUARE_SIZE * j + offset,
					SQUARE_SIZE * i + offset,
					SQUARE_SIZE - offset * 2,
					SQUARE_SIZE - offset * 2
				);
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

	var mousePos = getMousePos(event);

	var gridPos = [
		Math.floor(mousePos[1] / SQUARE_SIZE),
		Math.floor(mousePos[0] / SQUARE_SIZE)
	];

	var validMove = play(grid, tokens.player, gridPos);

	if (validMove && !renderAndCheckWinner()) aiPlays(grid);
}

function aiPlays(grid) {
	enableGameToHuman = false;
	getNextMove(grid, function(nextMove) {
		play(grid, tokens.ai, nextMove);
		showHumanTurn();
		if (!renderAndCheckWinner()) enableGameToHuman = true;
	});

	showAiIsThinking();
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
	if (!pos || (pos && pos.length !== 2)) return false;

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

function isEmptyGrid(grid) {
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			if (grid[i][j]) return false;
		}
	}

	return true;
}

// AI

function evaluate(grid, depth) {
	var winner = checkWinner(grid);
	return (!winner ? 0 : winner === tokens.ai ? 10 : -10) - depth;
}

var aiChoice;

function minimax(grid, maximize, depth) {
	depth = depth || 0;

	// Play randomly the first turn (does not matter for weak solving)
	if (isEmptyGrid(grid)) {
		aiChoice = getRandomMove();
		return -9;
	}

	if (isFullGrid(grid) || checkWinner(grid)) {
		return evaluate(grid, depth);
	}

	var gridCopy;
	var scores = [];
	var moves = [];

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			gridCopy = copyGrid(grid);
			var move = [i, j];
			var isValidMove = play(
				gridCopy,
				maximize ? tokens.ai : tokens.player,
				move
			);
			if (isValidMove) {
				scores.push(minimax(gridCopy, !maximize, depth + 1));
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
	var index = indexes[getRandomValue(indexes.length - 1)];

	aiChoice = moves[index];

	return result;
}

function getAllIndexesOf(value, array) {
	var indexes = [];
	for (var i = 0; i < array.length; i++) {
		if (value === array[i]) indexes.push(i);
	}
	return indexes;
}

function getRandomMove() {
	return [getRandomValue(2), getRandomValue(2)];
}

function getRandomValue(n) {
	var random = Math.floor(Math.random() * (n + 1));

	while (random === n + 1) {
		random = Math.floor(Math.random() * (n + 1));
	}

	return random;
}

function copyGrid(grid) {
	var gridCopy = [];
	for (var i = 0; i < 3; i++) {
		gridCopy.push(grid[i].slice());
	}
	return gridCopy;
}

function getNextMove(grid, done) {
	setTimeout(function() {
		minimax(grid, true);
		done(aiChoice);
	}, 100);
}

},{"./messenger":2}],2:[function(require,module,exports){
module.exports = Messenger;

function Messenger(messageBox, firstToPlayBox, aiPiece) {
	this.messageBox = messageBox;
	this.firstToPlayBox = firstToPlayBox;

	this.write = function(message) {
		this.messageBox.style.display = 'block';

		if (message.length > 6) {
			this.messageBox.style.fontSize = message.length > 6 ? '35px' : '70px';
		}

		this.messageBox.innerHTML = message;
	};

	this.thinking = function() {
		toggleFirstToPlayBox(false);
		this.write('I am thinking..');
	};

	this.humanTurn = function() {
		toggleFirstToPlayBox(false);
		this.write('Your turn, human');
	};

	function toggleFirstToPlayBox(enabled) {
		this.firstToPlayBox.style.visibility = enabled ? 'visible' : 'hidden';
	}

	this.gameIsOver = function(winner) {
		this.write(!winner ? 'Draw' : winner === aiPiece ? 'I win' : 'This..is impossible');
		toggleFirstToPlayBox(true);
	};
}
},{}]},{},[1]);
