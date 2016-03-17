/**
 * product
 * @autoor zq
 * Created by 2015-10-29 11:11
 */
define([
	'jquery',
	'backbone',
	'underscore',
	'view/propertyManage/table',
	'common/tool',
	'common/remote'
], function ($, B, _, TableView, Tool, Remote) {
	return B.View.extend({
		events          : {
			'click tr.tr-item'            : 'showChildren',	// 展开机房或者机列
			'click tr.tr-item .btn-edit'  : 'modify',	        // 修改
			'click tr.tr-item .btn-delete': 'delete',	        // 删除
			'click tr .btn-add'           : 'add',	        // 增加

		},
		initialize      : function (options) {
			var self = this;
			this.el = options.el;

			//渲染模板
			require([options.tpl], function (tpl) {
				self.el.innerHTML = tpl;
				self.cacheDom();
				self.bindEvent();
			});
		},
		cacheDom        : function () {
			this.$workOperation = $('.workload-operation');
			this.$workData = $('.workload-data-list');
			this.$tank = this.$workData.find("div[data-type='tank']");
			this.$box = this.$workData.find("div[data-type='box']");
			this.$blade = this.$workData.find("div[data-type='blade']");

			this.config = [{
				type     : "tank",
				$el      : this.$tank,
				url      : "propertyMng/getTlankConfig",
				cols     : [10, 60, 30],
				theads   : ["ID", "地点名称", "操作"],
				tpl      : $("#J_unit_tpl").html(),
				tableView: "tankTableView"
			}, {
				type     : "box",
				$el      : this.$box,
				url      : "propertyMng/getTlankConfig",
				cols     : [10, 60, 30],
				theads   : ["ID", "机房名称", "操作"],
				tpl      : $("#J_unit_tpl").html(),
				tableView: "boxTableView"
			}, {
				type     : "blade",
				$el      : this.$blade,
				url      : "propertyMng/getTlankConfig",
				cols     : [10, 60, 30],
				theads   : ["ID", "机列名称", "操作"],
				tpl      : $("#J_unit_tpl").html(),
				tableView: "bladeTableView"
			}];

		},
		bindEvent       : function () {
			var self = this;
			_.map(self.config, function (item) {
				self[item.tableView] = new TableView(_.pick(item, "type", "$el", "url", "cols", "theads", "tpl"));
			});
			this.renderTank();
			this.scrollCheck();
		},
		scrollCheck     : function () {
			var $initTable = $('.init-table'),
				$roomTable = $('.room-table'),
				$rankTable = $('.rank-table'),
				outerWidth = $initTable.outerWidth(),
				initOffsetLeft =  $initTable.offset().left,
				roomOffsetLeft =  initOffsetLeft + outerWidth,
				rankOffsetLeft =  initOffsetLeft + outerWidth * 2,
				style = {
					'width': '',
					'position' : '',
					'top': '',
					'left': ''
				};

			$initTable.css({'width': outerWidth}).find('thead').find('th').each(function (index){
				$(this).css({'width': $(this).outerWidth()})
			});
			$(window).scroll(function () {
				if ($(this).scrollTop() > 135) {
					$initTable.find('thead').css({
						'width': outerWidth + 1,
						'position' : 'fixed',
						'top': 0,
						'left': initOffsetLeft
					});
					$roomTable.css({
						'width': outerWidth,
						'position' : 'fixed',
						'top': 0,
						'left': roomOffsetLeft + 1
					});
					$rankTable.css({
						'width': outerWidth,
						'position' : 'fixed',
						'top': 0,
						'left': rankOffsetLeft
					});
				} else {
					$initTable.find('thead').css(style);
					$roomTable.css(style);
					$rankTable.css(style);
				}
			});
		},
		showChildren    : function (e) {
			var $target = $(e.target),
				$tr = $target.parents("tr").length ? $target.parents("tr") : $target,
				type = $tr.data("type"),
				id = $tr.data("id");

			$tr.siblings("tr.active").removeClass("active");
			$tr.removeClass('active-prev').siblings("tr.active-prev").removeClass("active-prev");
			$tr.addClass("active").prev().addClass('active-prev');

			switch (type) {
				case "tank":
					this.curTankId = $tr.data("id");
					this.renderBox();
					break;
				case "box":
					this.curBoxId = $tr.data("id");
					this.renderBlade();
					break;
				case "blade":
					break;
				default :
					break;
			}


			this.updateViewStatus(type);
			Tool.stop(e);
		},
		renderTank      : function () {
			var data = {
				method: "query"
			};
			this.tankTableView.render(data);
		},
		renderBox       : function () {
			var data = {
				tankid: this.curTankId,
				method: "query"
			};
			this.boxTableView.render(data);
		},
		renderBlade     : function () {
			var data = {
				tankid: this.curTankId,
				boxid : this.curBoxId,
				method: "query"
			};
			this.bladeTableView.render(data);
		},
		updateViewStatus: function (type) {
			switch (type) {
				case "tank":
					this.$box.removeClass("hide");
					this.$blade.addClass("hide");
					break;
				case "box":
					this.$blade.removeClass("hide");
					break;
				case "blade":
					break;
				default :
					break;
			}
		},
		modify          : function (e) {
			var $target = $(e.target),
				$tr = $target.parents("tr").length ? $target.parents("tr") : $target,
				type = $tr.data("type"),
				tip,
				val = $.trim($tr.find("input").val()),
				url,
				data = {};

			switch (type) {
				case "tank":
					tip = "地点";
					this.curTankId = $tr.data("id");
					url = "propertyMng/getTlankConfig";
					data = {
						tankid  : this.curTankId,
						tankname: val,
						type    : "tank",
						method  : "modify"
					};
					break;
				case "box":
					tip = "机房";
					this.curBoxId = $tr.data("id");
					url = "propertyMng/getTlankConfig";
					data = {
						tankid : this.curTankId,
						boxid  : this.curBoxId,
						boxname: val,
						type   : "box",
						method : "modify"
					};
					break;
				case "blade":
					tip = "机列";
					this.curBladeId = $tr.data("id");
					url = "propertyMng/getTlankConfig";
					data = {
						boxid    : this.curBoxId,
						bladeid  : this.curBladeId,
						bladename: val,
						type     : "blade",
						method   : "modify"
					};
					break;
				default :
					break;
			}

			if (!val) {
				$.oaTip("修改" + tip + "输入名称不能为空", "warning", 2000);
			} else {
				Remote({
					type   : "POST",
					url    : url,
					data   : data,
					success: function (r) {
						$.oaTip(r.msg, r.code == 200 ? "success" : "error", 2000);
					}
				});
			}
			Tool.stop(e);
		},

		delete: function (e) {
			var self = this,
				$target = $(e.target),
				$tr = $target.parents("tr").length ? $target.parents("tr") : $target,
				type = $tr.data("type"),
				url,
				data = {},
				tankId,
				boxId,
				bladeId,
				success = function () {
				};

			switch (type) {
				case "tank":
					tankId = $tr.data("id");
					url = "propertyMng/getTlankConfig";
					data = {
						tankid: tankId,
						type  : "tank",
						method: "delete"
					};
					success = function () {
						if (tankId == self.curTankId) {
							self.$blade.addClass("hide");
							self.$box.addClass("hide");
						}
						$tr.remove();
					};
					break;
				case "box":
					boxId = $tr.data("id");
					url = "propertyMng/getTlankConfig";
					data = {
						boxid : boxId,
						type  : "box",
						method: "delete"
					};
					success = function () {
						boxId == self.curBoxId && self.$blade.addClass("hide");
						$tr.remove();
					};
					break;
				case "blade":
					bladeId = $tr.data("id");
					url = "propertyMng/getTlankConfig";
					data = {
						bladeid: bladeId,
						type   : "blade",
						method : "delete"
					};
					success = function () {
						$tr.remove();
					};
					break;
				default :
					break;
			}

			var $confirm = $.confirm({
				title    : '提示',
				msg      : '确认删除吗？',
				onconfirm: function () {
					Remote({
						type   : "POST",
						url    : url,
						data   : data,
						success: function (r) {
							$.oaTip(r.msg, r.code == 200 ? "success" : "error", 2000);
							success && success();
							$confirm.remove();
						}
					});
				}
			});

			Tool.stop(e);
		},
		add   : function (e) {
			var self = this,
				$target = $(e.target),
				$tr = $target.parents("tr").length ? $target.parents("tr") : $target,
				type = $tr.data("type"),
				val = $.trim($tr.find("input").val()),
				tip,
				url,
				data = {},
				success = function () {
				};


			switch (type) {
				case "tank":
					tip = "地点";
					url = "propertyMng/getTlankConfig";
					data = {
						tankname: val,
						type    : "tank",
						method  : "add"
					};
					success = function () {
						self.renderTank();
					};
					break;
				case "box":
					tip = "机房";
					url = "propertyMng/getTlankConfig";
					data = {
						tankid : this.curTankId,
						boxname: val,
						type   : "box",
						method : "add"
					};
					success = function () {
						self.renderBox();
					};
					break;
				case "blade":
					tip = "机列";
					url = "propertyMng/getTlankConfig";
					data = {
						bladename: val,
						boxid    : this.curBoxId,
						type     : "blade",
						method   : "add"
					};
					success = function () {
						self.renderBlade();
					};
					break;
				default :
					break;
			}
			if (!val) {
				$.oaTip("添加" + tip + "输入名称不能为空", "warning", 2000);
			} else {
				Remote({
					type   : "POST",
					url    : url,
					data   : data,
					success: function (r) {
						$.oaTip(r.msg, r.code == 200 ? "success" : "error", 2000);
						success && success();
					}
				});
			}


			Tool.stop(e);
		}
	});

})