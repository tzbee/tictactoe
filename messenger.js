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
		this.firstToPlayBox.style.visibility = 'hidden';
		this.write('I am thinking..');
	};

	this.humanTurn = function() {
		this.firstToPlayBox.style.visibility = 'hidden';
		this.write('Your turn, human');
	};

	this.gameIsOver = function(winner) {
		this.write(!winner ? 'Draw' : winner === aiPiece ? 'I win' : 'This..is impossible');
		this.firstToPlayBox.style.visibility = 'visible';
	};
}