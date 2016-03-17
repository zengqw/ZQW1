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
		events    : {
			'click .J_submit': 'submit',		        // 提交
			'change .J_input': 'onChange'               //监听值变化，校验
		},
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
			_html = _.template(self.tplSearch)({
				tpl : TplFormat,
				list: self.curConfig.list
			});
			self.$workSearch.html(_html);
			$(".J_input").on("change", self.onChange.bind(self));
		},
		onChange  : function (e) {
			var $target = $(e.target),
				obj = {},
				value = $target.val(),
				key = $target.attr("name");
			obj[key] = value;
			if (this.validate(_.pick(this.validatorFunc, key), obj)) {
				this.validator.showErrorTip(this.validator.getErrorsModel());
			} else {
				this.validator.hideErrorTip(key);
			}
		},
		validate  : function (config, data) {
			this.validator = this.validator ? this.validator.reset(config, data) : new Validator(config, data);
			this.validator.validate();
			return this.validator.hasErrors();
		},
		submit    : function (e) {
			var self = this,
				interactiveObj = interactiveEvent.serializeFields(this.$workOperation, 'browser'),
				dataJson = interactiveObj.dataJson;

			if (this.validate(this.validatorFunc, dataJson)) {
				$.oaTip("请检查输入内容格式是否满足要求", "warning", 2000);
				this.validator.showErrorTip(this.validator.getErrorsModel());
			} else {
				dataJson.assetSns = Tool.transferComma(dataJson.assetSns);
				Remote({
					type : "POST",
					url  : self.curConfig.submitUrl,
					data: dataJson,
					success: function(r){
						if (200 == r.code) {
							$.oaTip(r.result.data.messageList.join('<br/>'), 3000);
						} else {
							$.oaTip(r.desc, "error", 2000);
						}
					}
				});
			}
			Tool.stop(e);
		}
	});
})