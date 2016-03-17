/**
 * product
 * @autoor zq
 * Created by 2015-10-29 11:11
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
	'cxcalendar'
], function ($, _, B, FixedBox, Remote, Tool, Config, TplFormat, Validator, interactiveEvent) {
	return B.View.extend({
		events        : {
			'click .J_search': 'search',		        // 搜索
			'change .J_input': 'onChange'                                     //监听值变化，校验
		},
		initialize    : function (options) {
			_.extend(this, options);
			var self = this;
			this.curConfig = Config[this.type];
			this.validatorFunc = this.curConfig.validatorFunc;
			//渲染模板
			require([options.tpl], function (tpl) {
				self.el.innerHTML = tpl;
				self.cacheDom();
				self.bindEvent();
				self.renderBody();
			});
		},
		cacheDom      : function () {
			this.$workOperation = $('.workload-operation');
			this.$workDateList = $('.workload-data-list');
			this.$workSearch = this.$workOperation.find('.workload-search .J_search_form');
			this.tplSearch = $("#J_tpl_search").html();

		},
		bindEvent     : function () {
			this.$workOperation.workloadSearch();
		},
		renderBody    : function () {
			var self = this,
				_html;
			Remote({
				type   : "GET",
				url    : self.curConfig.initUrl,
				data   : {
					flag: self.type
				},
				success: function (r) {
					if (200 == r.code) {
						_html = _.template(self.tplSearch)(_.extend({
							data: r.data,
							tpl : TplFormat
						}, self.curConfig));
						self.$workSearch.html(_html);
						$(".J_calendar").cxCalendar({
							type: "YYYY-MM-DD"
						});
						$(".J_calendar_month").cxCalendar({
							type       : "YYYY-MM",
							isMonPicker: true   //支持年月选择器
						});
					} else {
						$.oaTip(r.msg, "error", 2000);
					}
				}
			});
		},
		onChange      : function (e) {
			var $target = $(e.target),
				obj = {},
				value = $target.val(),
				key = $target.attr("name");
			obj[key] = value;
			if (this.validate(_.pick(this.validatorFunc, key), obj)) {
				this.showErrorTip(this.validator.getErrorsModel());
			} else {
				this.hideErrorTip(key);
			}
		},
		validate      : function (config, data) {
			this.validator = this.validator ? this.validator.reset(config, data) : new Validator(config, data);
			this.validator.validate();
			return this.validator.hasErrors();
		},
		clearErrorTips: function () {
			$(".error-tip.active").removeClass("active");
		},
		hideErrorTip  : function (key) {
			$(".J_" + key).find(".error-tip").text('').removeClass("active");
		},
		showErrorTip  : function (errModels) {
			var $dl;
			_.map(errModels, function (model) {
				$dl = $(".J_" + model.key);
				$dl.find(".error-tip").text(model.msg).addClass("active");  //show error tip
			});
		},
		search        : function (e) {
			var self = this;
			var interactiveObj = interactiveEvent.serializeFields(this.$workOperation, 'browser'),
				dataJson = interactiveObj.dataJson;

			if (this.validate(this.validatorFunc, dataJson)) {
				$.oaTip("请检查输入内容格式是否满足要求", "warning", 2000);
				this.showErrorTip(this.validator.getErrorsModel());
			} else {
				new FixedBox({
					$el     : self.$workDateList,
					configs : _.pick(self.curConfig, "keys", "needIndex", "controls"),
					fetchUrl: self.curConfig.fetchUrl,
					data    : _.extend(dataJson)
				});
			}
			Tool.stop(e);
		}
	});
})