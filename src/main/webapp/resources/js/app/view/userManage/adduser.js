/**
 * adduser.js
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
			'click .J_add_user': 'addUser'		    // 添加用户
		},
		initialize             : function (options) {
			var self = this;
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
			this.$roleList = $(".J_role_list");


			this.roleListTpl = $("#J_tpl_role_list").html();
		},
		bindEvent              : function () {
			this.$workOperation.workloadSearch();
		},
		renderRoleList         : function () {
			var self = this,
				roleListInnerHtml;
			Remote({
				type   : "GET",
				data   : {},
				url    : "userManage/queryRole",
				success: function (r) {
					if (r.code == 200) {
						roleListInnerHtml = _.template(self.roleListTpl)(r);
						self.$roleList.html(roleListInnerHtml);
					} else {
						$.oaTip(r.msg, "error", 2000);
					}
				}
			});
		},
		validatorFunc          : {
			nameEn: {
				validator: [ValidatorHelper.isNotEmpty, ValidatorHelper.isContainsChiness],
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
		addUser                : function (e) {
			var interactiveObj = interactiveEvent.serializeFields($('.workload-operation'), 'browser'),
				dataJson = interactiveObj.dataJson;
			if (this.validate(this.validatorFunc, dataJson)) {
				$.oaTip(this.validator.getErrors(), "warning", 2000);
			} else {
				Remote({
					type   : "POST",
					data   : dataJson,
					url    : "userManage/addUser",
					success: function (r) {
						$.oaTip(r.msg, r.code == 200 ? "success" : "error", 2000);
					}
				});
			}

			Tool.stop(e);
		}
	});
});

