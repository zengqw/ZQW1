/**
 * tool.js
 * @info 高亮显示二级导航和对应导航内容
 * @autoor zq
 * Created by 2015-10-10 10:15
 */
define(['underscore'], function(_) {
	var MENU = function(options) {
		this.$subNavBox = options.$el;
		this.subMenuConfigs = options.subMenuConfigs;
		this.menu = options.menu;
		this.$subMenus = this.$subNavBox.find("[data-menu]");
		this.init();
	};

	MENU.prototype.init = function() {
		this.activeSubMenu();
	};
	MENU.prototype.activeSubMenu = function () {
		var name = this.menu,
			$target = this.$subNavBox.find('[data-menu=' + name + ']'),
			subMenu = {};

		//如果没有找到对应二级导航，则看是否为二级导航的子类目，再重新匹配
		if (!$target.length) {
			subMenu = _.findWhere(this.subMenuConfigs, {child: name}) || {};
			name = subMenu.menu;
			$target = this.$subNavBox.find('[data-menu=' + name + ']');
			$target.text(subMenu.text);
			$target.attr("href", subMenu.href);
			$target.attr("data-child", subMenu.child);
		}
		this.$subMenus.removeClass('active');
		$target.addClass('active');
	};

	return MENU;

});