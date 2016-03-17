/**
 * table.js
 * @info 通用表格视图组件
 * @autoor zq
 * Created by 2015-10-09 19:55
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'common/page',
	'text!tmpl/common/table.html',
	'common/interactiveEvent'

], function ($, _, B, pageAjax, tpl) {

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
		render    : function (data) {
			var self = this,
				listHtml = null;

			if (self.url){
				var queryData = {},
					url;
				if (typeof data == "object"){
					url = self.url;
					queryData = data;
				}else{
					url = self.url + "?" + data;
				}
				new pageAjax(url, queryData, function (r) {
					if (r.code == 200 || r.code == 204) {
						self.data = r.data;

						/*render table body*/
						listHtml = _.template(self.unitTpl)(r.result);
						self.$el.find("tbody").html(listHtml);
					} else if (r.code == 613) {
						// session  超时 重定向到登录页
						window.location.href = "/ams/login";
					} else {
						$.oaTip(r.desc, 'error', 2000);
					}
				});
			}else{
				/*render table body*/
				listHtml = _.template(self.unitTpl)(data);
				self.$el.find("tbody").html(listHtml);
			}

		}
	});
});