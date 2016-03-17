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
			this.$address = this.$workData.find("div[data-type='address']");
			this.$room = this.$workData.find("div[data-type='room']");
			this.$rank = this.$workData.find("div[data-type='rank']");

			this.config = [{
				type     : "address",
				$el      : this.$address,
				url      : "propertyMng/getLocationList",
				cols     : [10, 60, 30],
				theads   : ["ID", "地点名称", "操作"],
				tpl      : $("#J_unit_tpl").html(),
				tableView: "addressTableView"
			}, {
				type     : "room",
				$el      : this.$room,
				url      : "propertyMng/getLocationList",
				cols     : [10, 60, 30],
				theads   : ["ID", "机房名称", "操作"],
				tpl      : $("#J_unit_tpl").html(),
				tableView: "roomTableView"
			}, {
				type     : "rank",
				$el      : this.$rank,
				url      : "propertyMng/getLocationList",
				cols     : [10, 60, 30],
				theads   : ["ID", "机列名称", "操作"],
				tpl      : $("#J_unit_tpl").html(),
				tableView: "rankTableView"
			}];

		},
		bindEvent       : function () {
			var self = this;
			_.map(self.config, function (item) {
				self[item.tableView] = new TableView(_.pick(item, "type", "$el", "url", "cols", "theads", "tpl"));
			});
			this.renderAddress();
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
				case "address":
					this.curPlaceId = $tr.data("id");
					this.renderRoom();
					break;
				case "room":
					this.curRoomId = $tr.data("id");
					this.renderRank();
					break;
				case "rank":
					break;
				default :
					break;
			}


			this.updateViewStatus(type);
			Tool.stop(e);
		},
		renderAddress   : function () {
			var data = {
				method: "query"
			};
			this.addressTableView.render(data);
		},
		renderRoom      : function () {
			var data = {
				placeid: this.curPlaceId,
				method : "query"
			};
			this.roomTableView.render(data);
		},
		renderRank      : function () {
			var data = {
				placeid: this.curPlaceId,
				roomid : this.curRoomId,
				method : "query"
			};
			this.rankTableView.render(data);
		},
		updateViewStatus: function (type) {
			switch (type) {
				case "address":
					this.$room.removeClass("hide");
					this.$rank.addClass("hide");
					break;
				case "room":
					this.$rank.removeClass("hide");
					break;
				case "rank":
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
				case "address":
					tip = "地点";
					this.curPlaceId = $tr.data("id");
					url = "propertyMng/getLocationList";
					data = {
						placeid  : this.curPlaceId,
						placename: val,
						type     : "place",
						method   : "modify"
					};
					break;
				case "room":
					tip = "机房";
					this.curRoomId = $tr.data("id");
					url = "propertyMng/getLocationList";
					data = {
						placeid : this.curPlaceId,
						roomid  : this.curRoomId,
						roomname: val,
						type    : "room",
						method  : "modify"
					};
					break;
				case "rank":
					tip = "机列";
					this.curRankId = $tr.data("id");
					url = "propertyMng/getLocationList";
					data = {
						roomid  : this.curRoomId,
						lineid  : this.curRankId,
						linename: val,
						type    : "line",
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
				placeId,
				roomId,
				rankId,
				success = function () {
				};

			switch (type) {
				case "address":
					placeId = $tr.data("id");
					url = "propertyMng/getLocationList";
					data = {
						placeid: placeId,
						type   : "place",
						method : "delete"
					};
					success = function () {
						if (placeId == self.curPlaceId) {
							self.$rank.addClass("hide");
							self.$room.addClass("hide");
						}
						$tr.remove();
					};
					break;
				case "room":
					roomId = $tr.data("id");
					url = "propertyMng/getLocationList";
					data = {
						roomid: roomId,
						type  : "room",
						method: "delete"
					};
					success = function () {
						roomId == self.curRoomId && self.$rank.addClass("hide");
						$tr.remove();
					};
					break;
				case "rank":
					rankId = $tr.data("id");
					url = "propertyMng/getLocationList";
					data = {
						lineid: rankId,
						type  : "line",
						method: "delete"
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
				case "address":
					tip = "地点";
					url = "propertyMng/getLocationList";
					data = {
						placename: val,
						type     : "place",
						method   : "add"
					};
					success = function () {
						self.renderAddress();
					};
					break;
				case "room":
					tip = "机房";
					url = "propertyMng/getLocationList";
					data = {
						placeid : this.curPlaceId,
						roomname: val,
						type    : "room",
						method  : "add"
					};
					success = function () {
						self.renderRoom();
					};
					break;
				case "rank":
					tip = "机列";
					url = "propertyMng/getLocationList";
					data = {
						linename: val,
						roomid  : this.curRoomId,
						type    : "line",
						method  : "add"
					};
					success = function () {
						self.renderRank();
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