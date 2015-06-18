module.exports = SelectMenu;

function SelectMenu($menuContainer, items) {
	var $menu = $($menuContainer.children('.menu')[0]);
	var $selectedBox = $menuContainer.children('.selected');

	function init($menu, $selectedBox, items, selectedItem) {
		selectedItem = selectedItem || items[0];

		$selectedBox.attr('data-item', selectedItem);
		$selectedBox.html(firstLetterToUpperCase(selectedItem));

		items.forEach(function(item) {
			$menu.append($('<li>', {
				class: 'menu-item button' + (selectedItem === item ? ' selected-item' : ''),
				'data-item': item,
				html: firstLetterToUpperCase(item),
				click: function() {
					var $menuItem = $(this);
					var itemId = $menuItem.attr('data-item');

					$selectedBox.attr('data-item', itemId);
					$selectedBox.html(firstLetterToUpperCase(itemId));

					$menu.children('.selected-item').removeClass('selected-item');
					$menuItem.addClass('selected-item');

					$menu.css('visibility', 'hidden');
				}
			}));
		});

		$menu.css('visibility', 'hidden');
	}

	function firstLetterToUpperCase(str) {
		return str.split('').map(function(c, i) {
			return i === 0 ? c.toUpperCase() : c;
		}).join('');
	}

	$menuContainer.on('mouseenter', function() {
		$menu.css('visibility', 'visible');
	}).on('mouseleave', function() {
		$menu.css('visibility', 'hidden');
	});

	init($menu, $selectedBox, items);

	this.getSelectedItem = function() {
		return $selectedBox.attr('data-item');
	};
}