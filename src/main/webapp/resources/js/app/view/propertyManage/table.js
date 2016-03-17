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
	'text!tmpl/propertyManage/table.html',
	'common/interactiveEvent'

], function ($, _, B, Remote, tpl) {

	return B.View.extend({
		initialize: function (options) {
			var self = this;
			_.extend(this, options);

			/*render table thead */
			self.$el.html(_.template(tpl)({
				cols  : self.cols,
				theads: self.theads
			}));
		},
		data      : [],
		getData   : function () {
			return this.data;
		},
		render    : function (queryData) {
			var self = this,
				listHtml = null,
				data = {},
				url = " ";
			if (typeof queryData == "object") {
				url = self.url;
				data = queryData;
			} else {
				url = self.url + "?" + queryData;
			}
			Remote({
				type   : "POST",
				url    : url,
				data   : data,
				success: function (r) {
					if (r.code == 200 || r.code == 204) {

						r.data.type = self.type;
						/*render table body*/
						listHtml = _.template(self.tpl)(r.data);
						self.$el.find("tbody").html(listHtml);
						self.data = r.data;
					} else {
						$.oaTip(r.msg, 'error', 2000);
					}
				}
			});
		}
	});
});