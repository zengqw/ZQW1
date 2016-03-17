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
	'common/exportExcel',
	'common/interactiveEvent',
], function ($, _, B, FixedBox, Remote, Tool, Config, TplFormat, Validator, ExportExcel, interactiveEvent) {
	return B.View.extend({
		events : {
			'click .ac_downloadTpl' : 'downloadTpl'
		},
		initialize: function (options) {
			_.extend(this, options);
			var self = this;

			this.curConfig = Config;
			//渲染模板
			require([options.tpl], function (tpl) {
				self.el.innerHTML = tpl;
				self.cacheDom();
				self.renderBody();
			});
		},
		cacheDom  : function () {
			this.$workOperation = $('.workload-operation');
			this.$workDateList = $('.workload-data-list');
			this.$workSearch = this.$workOperation.find('.workload-search .J_search_form');
			this.tplDownload = $("#J_tpl_download").html();

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
						_html = _.template(self.tplDownload)({
							data: r.data
						});
						self.$workSearch.html(_html);
					} else {
						$.oaTip(r.msg, "error", 2000);
					}
				}
			});
		},

		downloadTpl : function(event) {
		    var $this = $(event.currentTarget);
			var url = $this.data('url');

			Remote({
				url : url,
				success : function (res) {
					if (200 === res.code) {
						window.location.href = url + '&excel=' + (+new Date())
					} else {
						$.oaTip(res.desc, "error");
					}
				}
			});
		},
	});
})