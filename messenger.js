module.exports = Messenger;

function Messenger(messageBox, firstToPlayBox) {
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
		this.write(!winner ? 'Draw' : winner + ' wins');
		toggleFirstToPlayBox(true);
	};
}