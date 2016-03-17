/**
 * addrole.js
 * @autoor zq
 * Created by 2015-10-09 19:55
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'common/interactiveEvent',
	'common/tool',
    'common/validator',
	'view/common/table',
	'common/remote',
    './configuration'
], function ($, _, B, interactiveEvent, Tool, Validator, TableView, Remote, configuration) {
	return B.View.extend({
		events            : {
            'click .input-checkbox': 'selectCheckbox',		    // 模拟复选框
            'click .J_add_role'    : 'addRole',		            // 添加角色
            'change .J_input'      : 'onChange'
		},
		initialize        : function (options) {
			var self = this;
			this.el = options.el;
			this.roleid = options.action;
            this.validatorFunc = configuration.validatorFunc;

			//渲染模板
			require([options.tpl], function (tpl) {
				self.el.innerHTML = tpl;
				self.cacheDom.apply(self);
				self.render.call(self);
			});
		},
		// 模拟复选框
		selectCheckbox    : function (e) {
			var $target = $(e.currentTarget),
				$list = $target.parents('.checkbox-parent'),
				_oprt = $target.data("oprt"),
				_type = $target.data('type');

			if (_oprt) {
				if (_type === 'all') {
					if ($target.hasClass('input-checkbox-hover')) $list.find('.input-checkbox-hover[data-oprt=' + _oprt + ']:not([data-type="all"])').removeClass('input-checkbox-hover');
					else $list.find('.input-checkbox[data-type="item"][data-oprt=' + _oprt + ']:not(".input-checkbox-hover")').addClass('input-checkbox-hover');
				}

				$target.toggleClass('input-checkbox-hover');

				if (_type === 'item') {
					var _len = $list.find('.input-checkbox[data-type="item"][data-oprt=' + _oprt + ']').length,
						_checks = $list.find('.input-checkbox-hover[data-type="item"][data-oprt=' + _oprt + ']').length;

					if (_len === _checks) $list.find('.input-checkbox[data-type="all"][data-oprt=' + _oprt + ']').addClass('input-checkbox-hover');
					else $list.find('.input-checkbox[data-type="all"][data-oprt=' + _oprt + ']').removeClass('input-checkbox-hover');

				}
			} else {
				if (_type === 'all') {
					if ($target.hasClass('input-checkbox-hover')) $list.find('.input-checkbox-hover:not([data-type="all"])').removeClass('input-checkbox-hover');
					else $list.find('.input-checkbox[data-type="item"]:not(".input-checkbox-hover")').addClass('input-checkbox-hover');
				}

				$target.toggleClass('input-checkbox-hover');

				if (_type === 'item') {
					var _len = $list.find('.input-checkbox[data-type="item"]').length,
						_checks = $list.find('.input-checkbox-hover[data-type="item"]').length;

					if (_len === _checks) $list.find('.input-checkbox[data-type="all"]').addClass('input-checkbox-hover');
					else $list.find('.input-checkbox[data-type="all"]').removeClass('input-checkbox-hover');

				}
			}


			return false;
		},
		cacheDom          : function () {
			this.$workOperation = $('.workload-operation');
			this.$roleList = $(".J_form_list");


			this.roleListTpl = $("#J_tpl_action_list").html();
		},
		render            : function () {
			var self = this,
				roleHtml;

			Remote({
				type   : "GET",
				data   : {},
				url    : "userManage/initRole",
				success: function (r) {
					if (r.code == 200) {
						roleHtml = _.template(self.roleListTpl)(r.data);
						self.$roleList.html(roleHtml);
					} else {
						$.oaTip(r.msg, "error", 2000);
					}
				}
			});
		},
		updateChkListValue: function () {
			var $chkLists = $(".ac-checkbox-list"),
				$list,
				oprts,
				value;
			_.map($chkLists, function (list) {
				$list = $(list);
				oprts = $list.data("oprts");
				if (oprts) {
					_.map(oprts.split(","), function (oprt) {
						value = _.reduce($list.find(".input-checkbox-hover[data-type='item'][data-oprt=" + oprt + "]"), function (ret, chk) {
							ret.push($(chk).data("value"));
							return ret;
						}, []).join(",");
						$list.find("input[data-oprt=" + oprt + "]").val(value);
					});
				} else {
					value = _.reduce($list.find(".input-checkbox-hover[data-type='item']"), function (ret, chk) {
						ret.push($(chk).data("value"));
						return ret;
					}, []).join(",");
					$list.find("input").val(value);
				}
			});
		},

        onChange: function (e) {
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

        validate: function (config, data) {
            this.validator = this.validator ? this.validator.reset(config, data) : new Validator(config, data);
            this.validator.validate();
            return this.validator.hasErrors();
        },

		addRole           : function () {
			this.updateChkListValue();
			var data = interactiveEvent.serializeFields($('.workload-operation'), 'browser').dataJson;

            if (this.validate(this.validatorFunc, data)) {
                $.oaTip("请检查输入内容格式是否满足要求", "warning", 2000);
                this.validator.showErrorTip(this.validator.getErrorsModel());
                return;
            }

			Remote({
				type   : "POST",
				data   : data,
				url    : "userManage/addRole",
				success: function (r) {
					$.oaTip(r.msg, r.code == 200 ? "success" : "error", 2000);
				}
			});
		}
	});
});