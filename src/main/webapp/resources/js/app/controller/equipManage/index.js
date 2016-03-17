define([
	'jquery',
	'underscore',
	'common/menu',
	'common/remote'
], function($, _,MENU, Remote) {
	return function(type, action) {
		var menuTpl = $("#J_menu_unit").html(),
			_menuHtml,
			$workMenu = $(".workload-menu");
		Remote({
			type:"GET",
			data:{},
			url:"equipManage/addHeader",
			success:function(r){
				if(r.code == 200){
					_menuHtml = _.template(menuTpl)(r.data);
					$workMenu.html(_menuHtml);

					//如果没有指定到二级导航，则默认跳转到menu的第一个
					//如果没有指定到二级导航，则默认跳转到menu的第一个
					type    =  !type && $workMenu.find("[data-menu]").length ? $($workMenu.find("[data-menu]")[0]).data("menu") : type;

					//二级导航高亮设置
					new MENU({
						$el: $(".workload-menu"),
						subMenuConfigs : [],
						menu: type
					});

					//根据type，实例化对应的View
					require(['app/view/equipManage/' + 'module'], function(View) {
						new View({
							el: $('div.workload-view').get(0),
							type: type,
							action: action,
							tpl: 'text!tmpl/equipManage/' + "module" + '.html'
						});
					});
				}
			}
		});
	};
});