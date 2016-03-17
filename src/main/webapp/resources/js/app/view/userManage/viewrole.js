/**
 * viewrole.js
 * @autoor zq
 * Created by 2015-10-27 09:51
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'common/interactiveEvent',
	'common/tool',
	'view/common/table',
	'common/remote'
], function ($, _, B, interactiveEvent, Tool, TableView, Remote) {
	return B.View.extend({
		events            : {
			'click .input-checkbox': 'selectCheckbox',		    // 模拟复选框
			'click .J_modify'      : 'modifyRole',		        // 修改角色
			'click .J_delete'      : 'deleteRole',		        // 删除角色
		},
		initialize        : function (options) {
			var self = this,
				$curMenu = $('[data-child=' + options.type + ']'),
				href = $curMenu.attr("href");

			//add roleId to cur menu
			$curMenu.attr("href", href + "/" + options.action);
			this.el = options.el;
			this.roleid = options.action;


			//渲染模板
			require([options.tpl], function (tpl) {
				self.el.innerHTML = tpl;
				self.cacheDom.apply(self);
				self.bindEvent.apply(self);
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
		bindEvent         : function () {
			//this.$workOperation.workloadSearch();
		},
		render            : function () {
			var self = this,
				roleHtml;

			Remote({
				type   : "GET",
				data   : {
					roleid: self.roleid
				},
				url    : "userManage/viewRole",
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
		modifyRole        : function () {
			this.updateChkListValue();
			var data = interactiveEvent.serializeFields($('.workload-operation'), 'browser').dataModel;
			data = "id=" + this.roleid + "&" + data;
			Remote({
				type   : "GET",
				data   : {},
				url    : "userManage/modifyRole" + "?" + data,
				success: function (r) {
					$.oaTip(r.msg, r.code == 200 ? "success" : "error", 2000);
				}
			});
		},
		deleteRole        : function () {
			Remote({
				type   : "POST",
				data   : {
					roleId: this.roleid
				},
				url    : "userManage/deleteRole",
				success: function (r) {
					$.oaTip(r.msg, r.code == 200 ? "success" : "error", 2000);
				}
			});
		}
	});
});