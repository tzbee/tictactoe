module.exports = SelectMenu;

function SelectMenu($menuContainer, items) {
	this.items = items;

	this.$menu = $($menuContainer.children('.menu')[0]);
	this.$selectedBox = $menuContainer.children('.selected');

	function init($menu, $selectedBox, items, selectedItem) {
		$selectedBox.attr('data-item', selectedItem);
		$selectedBox.html(selectedItem);

		items.forEach(function(item) {
			$menu.append($('<li>', {
				class: 'menu-item button' + (selectedItem === item ? ' selected-item' : ''),
				'data-item': item,
				html: item,
				click: function() {
					var $menuItem = $(this);
					var itemId = $menuItem.attr('data-item');

					$selectedBox.attr('data-item', itemId);
					$selectedBox.html(itemId);

					$menu.children('.selected-item').removeClass('selected-item');
					$menuItem.addClass('selected-item');

					$menu.hide();
				}
			}));
		});

		$menu.hide();
	}

	$menuContainer.on('mouseenter', function() {
		this.$menu.show();
	}.bind(this));

	$menuContainer.on('mouseleave', function() {
		this.$menu.hide();
	}.bind(this));

	init(this.$menu, this.$selectedBox, this.items, this.items[0]);

	this.getSelectedItem = function() {
		return this.$selectedBox.attr('data-item');
	};
}