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
			this.$equip = this.$workData.find("div[data-type='equip']");
			this.$item = this.$workData.find("div[data-type='item']");
			this.$info = this.$workData.find("div[data-type='info']");

			this.config = [{
				type     : "equip",
				$el      : this.$equip,
				url      : "propertyMng/getConfigDetailList",
				cols     : [10, 60, 30],
				theads   : ["ID", "配置类型", "操作"],
				tpl      : $("#J_equip_tpl").html(),
				tableView: "equipTableView"
			}, {
				type     : "item",
				$el      : this.$item,
				url      : "propertyMng/getConfigDetailList",
				cols     : [10, 60, 30],
				theads   : ["ID", "配置属性", "操作"],
				tpl      : $("#J_type_tpl").html(),
				tableView: "itemTableView"
			}, {
				type     : "info",
				$el      : this.$info,
				url      : "propertyMng/getConfigDetailList",
				cols     : [10, 60, 30],
				theads   : ["ID", "配置详细信息", "操作"],
				tpl      : $("#J_info_tpl").html(),
				tableView: "infoTableView"
			}];

		},
		bindEvent       : function () {
			var self = this;
			_.map(self.config, function (item) {
				self[item.tableView] = new TableView(_.pick(item, "type", "$el", "url", "cols", "theads", "tpl"));
			});
			this.renderEquip();
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
				case "equip":
					this.curEquiptype = $tr.data("id");
					this.renderItem();
					break;
				case "item":
					this.curItemType = $tr.data("id");
					this.renderInfo();
					break;
				case "info":
					break;
				default :
					break;
			}


			this.updateViewStatus(type);
			Tool.stop(e);
		},
		renderEquip     : function () {
			var data = {
				method: "query"
			};
			this.equipTableView.render(data);
		},
		renderItem      : function () {
			var data = {
				equiptype: this.curEquiptype,
				method   : "query"
			};
			this.itemTableView.render(data);
		},
		renderInfo      : function () {
			var data = {
				equiptype: this.curEquiptype,
				itemtype : this.curItemType,
				method   : "query"
			};
			this.infoTableView.render(data);
		},
		updateViewStatus: function (type) {
			switch (type) {
				case "equip":
					this.$item.removeClass("hide");
					this.$info.addClass("hide");
					break;
				case "item":
					this.$info.removeClass("hide");
					break;
				case "info":
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
				case "equip":
					tip = "配置类型";
					this.curEquiptype = $tr.data("id");
					url = "propertyMng/getConfigDetailList";
					data = {
						equiptype: this.curEquiptype,
						equipname: val,
						type     : "equip",
						method   : "modify"
					};
					break;
				case "item":
					tip = "配置属性";
					this.curItemType = $tr.data("id");
					url = "propertyMng/getConfigDetailList";
					data = {
						equiptype: this.curEquiptype,
						itemtype : this.curItemType,
						itemname : val,
						type     : "item",
						method   : "modify"
					};
					break;
				case "info":
					tip = "配置详细信息";
					this.curItemInfo = $tr.data("id");
					url = "propertyMng/getConfigDetailList";
					data = {
						itemtype: this.curItemType,
						iteminfo: this.curItemInfo,
						infoname: val,
						type    : "info",
						method  : "modify"
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
				equipType,
				itemType,
				itemInfo,
				success = function () {
				};

			switch (type) {
				case "equip":
					equipType = $tr.data("id");
					url = "propertyMng/getConfigDetailList";
					data = {
						equiptype: equipType,
						type     : "equip",
						method   : "delete"
					};
					success = function () {
						if (equipType == self.curEquiptype) {
							self.$info.addClass("hide");
							self.$item.addClass("hide");
						}
						$tr.remove();
					};
					break;
				case "item":
					itemType = $tr.data("id");
					url = "propertyMng/getConfigDetailList";
					data = {
						itemtype: itemType,
						type    : "item",
						method  : "delete"
					};
					success = function () {
						itemType == self.curItemType && self.$info.addClass("hide");
						$tr.remove();
					};
					break;
				case "info":
					itemInfo = $tr.data("id");
					url = "propertyMng/getConfigDetailList";
					data = {
						iteminfo: itemInfo,
						type    : "info",
						method  : "delete"
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
				case "equip":
					tip = "配置类型";
					url = "propertyMng/getConfigDetailList";
					data = {
						equipname: val,
						type     : "equip",
						method   : "add"
					};
					success = function () {
						self.renderEquip();
					};
					break;
				case "item":
					tip = "配置属性";
					url = "propertyMng/getConfigDetailList";
					data = {
						equiptype: this.curEquiptype,
						itemname : val,
						type     : "item",
						method   : "add"
					};
					success = function () {
						self.renderItem();
					};
					break;
				case "info":
					tip = "配置详细信息";
					url = "propertyMng/getConfigDetailList";
					data = {
						infoname: val,
						itemtype: this.curItemType,
						type    : "info",
						method  : "add"
					};
					success = function () {
						self.renderInfo();
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