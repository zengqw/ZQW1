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
], function ($, _, B, FixedBox, Remote, Tool, Config, TplFormat, Validator, interactiveEvent) {
	return B.View.extend({
		initialize: function (options) {
			_.extend(this, options);
			var self = this;
			this.curConfig = Config[self.type];

			//渲染模板
			require([options.tpl], function (tpl) {
				self.el.innerHTML = tpl;
				self.cacheDom();
				self.render();
			});
		},
		cacheDom  : function () {
			this.$workDateList = $('.workload-data-list');
			this.tplHelp = $("#J_tpl_help").html();
		},
		render: function(){
			var _html = _.template(this.tplHelp)({data: this.curConfig});
			this.$workDateList.html(_html);
		}
	});
})