/**
 * queryuser.js
 * @autoor zq
 * Created by 2015-10-09 19:54
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'common/interactiveEvent',
	'common/remote',
	'common/tool',
	'common/validator',
	'common/validatorHelper'

], function ($, _, B, interactiveEvent, Remote, Tool, Validator, ValidatorHelper) {

	return B.View.extend({
		events                 : {
			'click .J_modify_user' : 'modifyUser'		    // 修改用户
		},
		initialize             : function (options) {
			var self = this,
				$curMenu = $('[data-child=' + options.type + ']'),
				href = $curMenu.attr("href");

			//add roleId to cur menu
			$curMenu.attr("href", href + "/" + options.action);
			this.nameEn = options.action;
			//渲染模板
			require([options.tpl], function (tpl) {
				self.el.innerHTML = tpl;
				self.cacheDom.apply(self);
				self.bindEvent.apply(self);
				self.renderRoleList.call(self);

			});
		},
		cacheDom               : function () {
			this.$workOperation = $('.workload-operation');
			this.$formContent = $(".search-form");


			this.formTpl = $("#J_tpl_form").html();
		},
		bindEvent              : function () {
			this.$workOperation.workloadSearch();
		},
		renderRoleList         : function () {
			var self = this,
				roleListInnerHtml;

			Remote({
				type   : "GET",
				data   : {
					nameEn: this.nameEn
				},
				url    : "userManage/getUser",
				success: function (r) {
					if (r.code == 200) {
						roleListInnerHtml = _.template(self.formTpl)(r.result.data);
						self.$formContent.html(roleListInnerHtml);
					} else {
						$.oaTip(r.msg, "error", 2000);
					}
				}
			});
		},
		validatorFunc          : {
			nameEn: {
				validator: [ValidatorHelper.isNotEmpty],
				label    : "英文姓名"
			},
			nameCh: {
				validator: [ValidatorHelper.isNotEmpty, ValidatorHelper.isAllChiness],
				label    : "中文姓名"
			}
		},
		validate               : function (config, data) {
			this.validator = this.validator ? this.validator.reset(config, data) : new Validator(config, data);
			this.validator.validate();
			return this.validator.hasErrors();
		},
		modifyUser             : function (e) {
			var interactiveObj = interactiveEvent.serializeFields($('.workload-operation'), 'browser'),
				dataJson = interactiveObj.dataJson;
			if (this.validate(this.validatorFunc, dataJson)) {
				$.oaTip(this.validator.getErrors(), "warning", 2000);
			} else {
				Remote({
					type   : "POST",
					data   : dataJson,
					url    : "userManage/modifyUser",
					success: function (r) {
						if (r.code == 200) {
							$.oaTip(r.msg, "success", 2000, function () {
								window.location = '#userManage/queryuser'
							});
						} else {
							$.oaTip(r.msg, "error", 2000);
						}
					}
				});
			}
			Tool.stop(e);
		}
	});
});

