/**
 * table.js
 * @info 属性管理通用表格视图组件
 * @autoor zq
 * Created by 2015-10-09 19:55
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'common/remote',
	'common/page',
	'text!tmpl/equipStat/table.html',
	'common/interactiveEvent',
	'tableHeadFixer'

], function ($, _, B, Remote, pageAjax, tpl) {

	return B.View.extend({
		initialize: function (options) {
			_.extend(this, options);
			this.render();
		},
		render    : function () {
			var self = this;

			new pageAjax(self.fetchUrl, self.data, function (r) {
				if (r.code == 200 || r.code == 204) {
					self.$el.html(_.template(tpl)(_.extend(r.result.data, {keyConfigs: self.keyConfigs})));
				} else {
					$.oaTip(r.desc, 'error', 2000);
				}
				$(".J_table").tableHeadFixer({head: true, left: 1,"bg-color": "#FFFDDB"});
			});
		}
	});
});