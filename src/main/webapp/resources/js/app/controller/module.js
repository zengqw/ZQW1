define([
	'jquery',
	'underscore',
	'common/menu',
	'common/nav'
], function($, _, MENU, Navs) {
	return function(type, action) {

		var mainHash = window.location.hash.split("/")[0].slice(1),
			curNav = _.findWhere(Navs, {hash: mainHash});


		//对于存在二级菜单的权限， 并且不属于二级映射菜单， 如果type不存在，或者是错误的二级type，则默认为第一个二级type
		if (curNav.children && curNav.children.length && (!curNav.subMenuConfigs || (curNav.subMenuConfigs && !_.findWhere(curNav.subMenuConfigs, {child: type}))) && (!type || (type && !_.findWhere(curNav.children, {hash: type})))){

			type = curNav.children[0].hash;
		}


			//二级导航高亮设置
			new MENU({
				$el: $(".workload-menu"),
				subMenuConfigs : [],
				menu: type
			});

		//根据type，实例化对应的View
		require(['app/view/' + mainHash + '/' + 'module'], function(View) {
			new View({
				el: $('div.workload-view').get(0),
				type: type,
				action: action,
				tpl: 'text!tmpl/' + mainHash + '/' + 'module' + '.html'
			});
		});
	};
});