/**
 * module.js
 * @autoor zq
 * Created by 2015-12-22 11:11
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'common/fixedBox',
	'common/remote',
	'common/tool',
	'./config',
	'text!tmpl/common/format.html',
	'common/validator',
	'common/interactiveEvent',
	'common/menuScroll'
], function ($, _, B, FixedBox, Remote, Tool, Config, TplFormat, Validator, interactiveEvent, MenuScroll) {
	return B.View.extend({
		initialize: function (options) {
			_.extend(this, options);
			var self = this;
			this.curConfig = Config;
			this.validatorFunc = this.curConfig.validatorFunc;

			//渲染模板
			require([options.tpl], function (tpl) {
				self.el.innerHTML = tpl;
				self.cacheDom();
				self.bindEvent();
				self.renderBody();
			});
		},
		cacheDom  : function () {
			this.$workOperation = $('.workload-operation');
			this.$workDateList = $('.workload-data-list');
			this.$workSearch = this.$workOperation.find('.workload-search .J_search_form');
			this.tplSearch = $("#J_tpl_search").html();

		},
		bindEvent : function () {
			this.$workOperation.workloadSearch();
		},
		renderBody: function () {
			var self = this,
				_html;

			Remote({
				type   : "GET",
				url    : self.curConfig.initUrl,
				data   : {},
				success: function (r) {
					if (200 == r.code) {
						_html = _.template(self.tplSearch)({
							data: r.data,
							tpl : TplFormat,
							list: self.curConfig.list
						});
						self.$workSearch.html(_html);

						// init menuScroll
						MenuScroll();
					} else {
						$.oaTip(r.msg, "error", 2000);
					}
				}
			});
		}
	});
})