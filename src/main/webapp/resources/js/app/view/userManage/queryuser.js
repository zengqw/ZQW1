/**
 * queryuser.js
 * @autoor zq
 * Created by 2015-10-09 19:54
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'common/fixedBox',
	'common/tool',
	'common/remote',
	'common/interactiveEvent',
	'common/exportExcel'
], function ($, _, B, FixedBox, Tool, Remote, interactiveEvent, ExportExcel) {
	return B.View.extend({
		events       : {
			'click .J_delete'         : 'deleteUser',		    // 删除用户
			'click .J_modify'         : 'modifyUser',		    // 编辑用户
			'click .ac_searchWorkload': 'search',		        // 执行搜索
			'click .J_reset_password' : 'resetPassword',		// 重置密码
			'click .J_export'         : 'export'    		    // 导出
		},
		initialize   : function (options) {
			var self = this;
			this.el = options.el;

			//渲染模板
			require([options.tpl], function (tpl) {
				self.el.innerHTML = tpl;
				self.cacheDom.apply(self);
				self.bindEvent.apply(self);
				self.initPoup();
				self.refresh();

			});
		},
		bindEvent    : function () {
			this.$workOperation.workloadSearch();
		},
		cacheDom     : function () {
			this.$workOperation = $('.workload-operation');
			this.$workData = $('.workload-data-list');
			this.passwordTpl = $('#J_password_tpl').html();
		},
		deleteUser   : function (e) {
			var self = this,
				$target = $(e.target),
				nameEn = $target.parents("tr").data("id");
			var $confirm = $.confirm({
				title    : '提示',
				msg      : '确认删除该用户吗？',
				onconfirm: function () {
					Remote({
						type   : "POST",
						data   : {
							nameEn: nameEn
						},
						url    : "userManage/deleteUser",
						success: function (r) {
							$.oaTip(r.msg, r.code == 200 ? "success" : "error", 2000);
							r.code == 200 && self.refresh();
							$confirm.remove();
						}
					});
				}
			});

			//防止冒泡和组织浏览器默认行为
			Tool.stop(e);
		},
		modifyUser   : function (e) {
			var $target = $(e.target),
				nameEn = $target.parents("tr").data("id");
			window.location.href = "#userManage/modifyuser/" + nameEn;
			Tool.stop(e);
		},
		refresh      : function () {
			var interactiveObj = interactiveEvent.serializeFields(this.$workOperation, 'browser'),
				dataJson = interactiveObj.dataJson;
			this.renderList(dataJson);
		},
		search       : function (e) {
			this.refresh();

			//防止冒泡和组织浏览器默认行为
			Tool.stop(e);
		},
		renderList   : function (data) {
			this.fixedBox = this.fixedBox ? this.fixedBox.render(data) : new FixedBox({
				$el     : this.$workData,
				fetchUrl: "userManage/queryUser",
				configs : {
					keys     : [
						{
							text : "英文姓名",
							key  : "nameEn",
							fixed: true
						},
						{
							text: "中文姓名",
							key : "nameCh",
						},
						{
							text: "E-mail",
							key : "email"
						},
						{
							text: "部门",
							key : "department"
						},
						{
							text: "密码修改时间",
							key : "modifyPasswordTime"
						}],
					controls : {
						text: "操作",
						btns: [
							{
								type     : "modify",
								text     : "修改",
								className: "u-btn-modify J_modify"
							},
							{
								type     : "delete",
								text     : "删除",
								className: "u-btn-delete J_delete"
							},
							{
								type     : "reset",
								text     : "重置密码",
								className: "u-btn-reset J_reset_password"
							}
						]
					},
					needIndex: true,
					uId: "nameEn"
				},
				data    : data
			});
		},
		initPoup     : function () {
			var self = this;
			PoupView = B.View.extend({
				tagName   : 'div',
				className : '',
				id        : '',
				events    : {},
				initialize: function () {
					Sector = this;
				},
				render    : function (name) {
					Sector.el.innerHTML = self.passwordTpl;
					Sector.name = name;
					var $sprite;
					$sprite = $.sprite({
						title        : "重置密码",
						width        : 400,
						height       : 100,
						move         : true,
						mask         : true,
						confirmButton: true,
						loading      : false,
						clearButton  : false,
						onsuccess    : function (obj) {
							$(obj).empty();
							$(obj)[0].appendChild(Sector.el);
						},
						onconfirm    : function () {
							var passwd = $(Sector.el).find("input").val();
							if (!$.trim(passwd)) {
								$.oaTip("密码内容不能为空", "warning", 2000);
								return;
							}
							var $confirm = $.confirm({
								title    : '提示',
								msg      : '确认要修改密码吗？',
								onconfirm: function () {
									Remote({
										type   : "GET",
										data   : {
											nameEn  : Sector.name,
											password: passwd
										},
										url    : "userManage/resetPassword",
										success: function (r) {
											if (r.code == 200) {
												$sprite.remove();
												Sector.removeView();
												$.oaTip(r.msg, "success", 2000);
											} else {
												$.oaTip(r.msg, "error", 2000);
											}
											$confirm.remove();
										}
									});
								}
							});

						},
						onclose      : function () {
							Sector.removeView();
						}
					});
				},
				removeView: function () {
					poupView = null;
					PoupView = null;
				}
			});
			this.poupView = new PoupView();
		},
		resetPassword: function (e) {
			var $target = $(e.target),
				nameEn = $target.parents("tr").data("id");
			this.poupView.render(nameEn);
			Tool.stop(e);
		},
		export : function() {
			ExportExcel({
				url : "userManage/queryUser",
				data : {
					excel: "用户"
				}
			});
		},
	});
});