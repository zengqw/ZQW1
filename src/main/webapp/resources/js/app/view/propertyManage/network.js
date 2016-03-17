/**
 * product
 * @autoor zq
 * Created by 2015-10-29 11:11
 */
define([
	'jquery',
	'backbone',
	'underscore',
	'common/remote',
	'common/tool',
	'plugin/jq.interactive'
], function ($, B, _, Remote, Tool) {
	return B.View.extend({
		events      : {
			'click .workload-title a': 'switchModule',	//切换模块
			'click tr .btn-edit'     : 'edit',	        //修改
			'click tr .btn-delete'   : 'delete',	        //删除
			'click tr .btn-add'      : 'add',	        //添加
		},
		initialize  : function (options) {
			var self = this;
			this.el = options.el;

			//渲染模板
			require([options.tpl], function (tpl) {
				self.el.innerHTML = tpl;
				self.cacheDom();
				self.renderTitle();
			});
		},
		cacheDom    : function () {
			this.$workTitle = $('.workload-title');
			this.$workData = $('.workload-data-list');

			this.tplTitle = $("#J_title_tpl").html();
			this.tplModule = $("#J_unit_tpl").html();
			this.$titles = this.$workTitle.find("a");
		},
		renderTitle : function () {
			var self = this;
			Remote({
				type   : "POST",
				data   : {},
				url    : "propertyMng/getPCConfigList",
				success: function (r) {
					if (r.code == 200) {
						var title = _.template(self.tplTitle)(r.data);
						self.$workTitle.html(title);
						self.$titles = self.$workTitle.find("a");
						$(self.$titles[0]).trigger("click");
					} else {
						$.oaTip(r.msg, "warning", 2000);
					}
				}
			});
		},
		switchModule: function (e) {
			var $target = $(e.target),
				typeCode = $target.data("code");
			this.curTypeCode = typeCode;
			this.$titles.removeClass("active");
			$target.addClass("active");
			this.renderModule();
			Tool.stop(e);
		},
		renderModule: function () {
			var self = this,
				_unit_html;
			Remote({
				type   : "POST",
				data   : {
					typeCode: this.curTypeCode
				},
				url    : "propertyMng/getPCConfigList",
				success: function (r) {
					if (r.code == 200) {
						_unit_html = _.template(self.tplModule)(r.data);
						self.$workData.html(_unit_html);
					} else {
						$.oaTip(r.msg, "warning", 2000);
					}
				}
			});
		},
		edit        : function (e) {
			var $target = $(e.target),
				$tr = $target.parents("tr").length ? $target.parents("tr") : $target,
				assertId = $tr.data("id"),
				val = $.trim($tr.find("input").val());

			if (!val) {
				$.oaTip("输入名称不能为空", "warning", 2000);
			} else {
				Remote({
					type   : "POST",
					url    : "propertyMng/getPCConfigList",
					data   : {
						typeCode: this.curTypeCode,
						name    : val,
						assertid: assertId,
						method  : "modify"
					},
					success: function (r) {
						$.oaTip(r.msg, r.code == 200 ? "success" : "error", 2000);
					}
				});
			}

			Tool.stop(e);
		},
		delete      : function (e) {
			var self = this,
				$target = $(e.target),
				$tr = $target.parents("tr").length ? $target.parents("tr") : $target,
				assertId = $tr.data("id");

			var $confirm = $.confirm({
				title    : '提示',
				msg      : '确认删除吗？',
				onconfirm: function () {
					Remote({
						type   : "POST",
						url    : "propertyMng/getPCConfigList",
						data   : {
							typeCode: self.curTypeCode,
							assertid: assertId,
							method  : "delete"
						},
						success: function (r) {
							$.oaTip(r.msg, r.code == 200 ? "success" : "error", 2000);
							r.code == 200 && $tr.remove();
							$confirm.remove();
						}
					});
				}
			});

			Tool.stop(e);
		},
		add         : function (e) {
			var self = this,
				$target = $(e.target),
				$tr = $target.parents("tr").length ? $target.parents("tr") : $target,
				val = $.trim($tr.find("input").val());

			if (!val) {
				$.oaTip("输入名称不能为空", "warning", 2000);
			} else {
				Remote({
					type   : "POST",
					url    : "propertyMng/getPCConfigList",
					data   : {
						typeCode: this.curTypeCode,
						name    : val,
						method  : "add"
					},
					success: function (r) {
						$.oaTip(r.msg, r.code == 200 ? "success" : "error", 2000);
						r.code == 200 && self.renderModule.apply(self);
					}
				});
			}

			Tool.stop(e);
		},

	});

})