define([
	'jquery',
	'underscore',
	'backbone',
	'common/remote',
	'common/interactiveEvent',
], function ($, _, B, Remote) {

	return B.View.extend({
		events        : {
			'click .J_start_inventory': 'startInventory',		// 开始盘点
			'click .J_end_inventory'  : 'endInventory',		// 结束盘点
		},
		initialize    : function (options) {

			var me = this;
			this.el = options.el;

			//渲染模板
			require([options.tpl], function (tpl) {
				me.el.innerHTML = tpl;
				me.cacheDom = {
					$workloadHeader: $(".workload-header"),
					$tStage        : $(".t-stage")
				};

				me.type = options.type;
				me.isCheckNow();
			});
		},
		queryData     : {
			mail: ENV.loginName
		},
		isCheckNow    : function () {
			var me = this;
			Remote({
				type    : 'GET',
				dataType: 'JSON',
				data    : me.queryData,
				url     : "checkManage/isCheckNow",
				success : function (r) {
					r.code = parseInt(r.code);
					if (606 == r.code) {
						//展示结束入口
						me.cacheDom.$tStage.toggleClass("hide");
						me.renderList();
					} else if (_.indexOf([400, 607], r.code) > -1) {
						//展示开始盘点入口
						me.renderList();
					} else {
						//展示报错信息
						$.oaTip(r.msg, 'error', 2000);
					}
				}
			});
		},
		// 渲染组织单元列表
		renderList    : function () {
			var me = this;
			me.cacheDom = {
				$stageList: this.$el.find(".J_stage_list"),
				$tStage   : this.$el.find(".J_stage_top")
			}

			Remote({
				type    : 'GET',
				dataType: 'JSON',
				data    : me.queryData,
				url     : "checkManage/checkResult",
				success : function (r) {
					r.code = parseInt(r.code);
					if (r.code == 204) {
						var _unitTPL = $("#J_state_unit").html(),
							_unitList = _.template(_unitTPL)(r);

						//渲染列表
						me.cacheDom.$stageList.html(_unitList);
					} else {
						$.oaTip(r.msg, 'error', 2000);
					}
				}
			});
		},
		startInventory: function () {
			var me = this;
			var $confirm = $.confirm({
				title    : '提示',
				msg      : '确定要开始盘点吗？',
				onconfirm: function () {
					$confirm.remove();
					Remote({
						type    : 'GET',
						dataType: 'JSON',
						data    : me.queryData,
						url     : "checkManage/checkBegin",
						success : function (r) {
							r.code = parseInt(r.code);
							if (r.code == 200) {
								me.cacheDom.$tStage.toggleClass("hide");
								me.renderList();
							} else {
								$.oaTip(r.msg, 'error', 2000);
							}
						}
					});
				}
			});
		},
		endInventory  : function () {
			var me = this;
			var $confirm = $.confirm({
				title    : '提示',
				msg      : '确定要结束盘点吗？',
				onconfirm: function () {
					$confirm.remove();
					Remote({
						type    : 'GET',
						dataType: 'JSON',
						data    : me.queryData,
						url     : "checkManage/checkClose",
						success : function (r) {
							r.code = parseInt(r.code);
							if (r.code == 201) {
								me.cacheDom.$tStage.toggleClass("hide");
								me.renderList();
							} else {
								$.oaTip(r.msg, 'error', 2000);
							}
						}
					});
				}
			});

		}
	});
});