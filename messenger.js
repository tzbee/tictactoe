module.exports = Messenger;

function Messenger(element) {
	this.element = element;

	this.write = function(message) {
		if (message.length > 6) {
			this.element.style.fontSize = message.length > 6 ? '35px' : '70px';
		}

		this.element.innerHTML = message;
	};

	this.enableButton = function() {
		this.element.className += 'button';
	};

	this.disableButton = function() {
		this.element.className = '';
	};
}