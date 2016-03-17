/**
 * index
 * @autoor zq
 * Created by 2015-10-29 09:39
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'common/tool',
	'common/interactiveEvent',
	'common/remote',
	'common/validator',
	'common/validatorHelper'
], function ($, _, B, Tool, interactiveEvent, Remote, Validator, ValidatorHelper) {

	return B.View.extend({
		events        : {
			"click .ac_searchWorkload": "modifypassword",     //修改密码,
			"change .J_input" : "onChange"
		},
		initialize    : function (options) {
			var self = this;
			//渲染模板
			require([options.tpl], function (tpl) {
				self.el.innerHTML = tpl;
			});
		},
		validatorFunc : {
			oldpassword: {
				validator: [ValidatorHelper.isNotEmpty, ValidatorHelper.passwordFormat],
				label    : "旧密码"
			},
			password1  : {
				validator: [ValidatorHelper.isNotEmpty, ValidatorHelper.passwordFormat],
				label    : "新密码"
			}
		},
		onChange          : function (e) {
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
		validate          : function (config, data) {
			this.validator = this.validator ? this.validator.reset(config, data) : new Validator(config, data);
			this.validator.validate();
			return this.validator.hasErrors();
		},
		clearErrorTips    : function () {
			$(".error-tip.active").removeClass("active");
		},
		hideErrorTip      : function (key) {
			$(".J_" + key).find(".error-tip").text('').removeClass("active");
		},
		showErrorTip      : function (errModels) {
			var $dl;
			_.map(errModels, function (model) {
				$dl = $(".J_" + model.key);
				$dl.find(".error-tip").text(model.msg).addClass("active");  //show error tip
			});
		},
		modifypassword: function (e) {
			var interactiveObj = interactiveEvent.serializeFields($('.workload-operation'), 'browser'),
				dataJson = interactiveObj.dataJson,
				dataForm = interactiveObj.dataModel;
			if (this.validate(this.validatorFunc, dataJson)) {
				$.oaTip("请检查输入内容格式是否满足要求", "warning", 2000);
				this.showErrorTip(this.validator.getErrorsModel());
			} else {
				Remote({
					type   : "GET",
					data   : {},
					url    : "userManage/modifyPassword" + "?" + dataForm,
					success: function (r) {
						$.oaTip(r.msg, r.code == 200 ? "success" : "error", 2000);
					}
				});
			}
			Tool.stop(e);
		}
	});
})