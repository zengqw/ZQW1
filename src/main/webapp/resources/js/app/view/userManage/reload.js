/**
 * reload.js
 * @autoor zq
 * Created by 2015-10-09 19:55
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'common/remote',
	'common/tool',
	'common/interactiveEvent'

], function ($, _, B, Remote, Tool) {

	return B.View.extend({
		events    : {
			'click button': 'reload',		// 重新加载
		},
		initialize: function (options) {
			var self = this;
			//渲染模板
			require([options.tpl], function (tpl) {
				self.el.innerHTML = tpl;
			});
		},
		reload    : function (e) {
			Remote({
				type   : "GET",
				data   : {},
				url    : "userManage/restartProp",
				success: function (r) {
					$.oaTip(r.msg, r.code == 200 ? "success" : "error", 2000);
				}
			});
			Tool.stop(e);
		}
	});
});