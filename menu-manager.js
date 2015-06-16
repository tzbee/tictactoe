module.exports = MenuManager;

function MenuManager(menuContainer, items) {
	var self = this;

	this.$menu = $(menuContainer.children('.menu')[0]);
	this.$selected = menuContainer.children('.selected');

	this.$selected.on('click', function() {
		this.toggleMenu();
	}.bind(this));

	this.items = items;

	function initMenu($menu, items) {
		$menu.hide();

		items.forEach(function(item) {
			$menu.append(createMenuItem(item));
		});
	}

	function getMenuElement($menu, itemId) {
		var selector = '.menu-item[data-item="' + itemId + '"]';
		var results = $menu.children(selector);
		return $(results.get(0));
	}

	function createMenuItem(itemId) {
		return $('<li>', {
			'class': 'button',
			'data-item': itemId,
			'html': itemId,
			'click': function() {
				self.unselect(self.getSelectedItem(self.$selected));
				self.select(itemId);
			}
		});
	}

	this.toggleMenu = function() {
		if (this.isMenuOpen()) {
			this.$menu.show();
		} else {
			this.$menu.hide();
		}
	};

	this.isMenuOpen = function() {
		return this.$menu.is(':hidden');
	};

	this.select = function(item) {
		this.$selected.attr('data-item', item);
		this.$selected.html(item);
		this.$menu.hide();
	};

	this.unselect = function(itemId) {
		var $menuElement = getMenuElement(this.$menu, itemId);
		$menuElement.hide();
	};

	this.getSelectedItem = function() {
		return self.$selected.attr('data-item');
	};

	initMenu(this.$menu, this.items);

	this.select(this.items[0]);
}