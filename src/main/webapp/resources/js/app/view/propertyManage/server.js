/**
 * product
 * @autoor zq
 * Created by 2015-10-29 11:11
 */
define([
	'jquery',
	'backbone',
	'view/propertyManage/table',
	'common/tool',
	'common/remote'
], function ($, B, TableView, Tool, Remote) {
	return B.View.extend({
		events          : {
			'click tr.tr-item'            : 'showChildren',	// 展开类型或者型号
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
			this.$brand = this.$workData.find("div[data-type='brand']");
			this.$type = this.$workData.find("div[data-type='type']");
			this.$model = this.$workData.find("div[data-type='model']");

			this.config = [{
				type     : "brand",
				$el      : this.$brand,
				url      : "propertyMng/getConfigList",
				cols     : [10, 60, 30],
				theads   : ["ID", "品牌名称", "操作"],
				tpl      : $("#J_unit_tpl").html(),
				tableView: "brandTableView"
			}, {
				type     : "type",
				$el      : this.$type,
				url      : "propertyMng/getConfigList",
				cols     : [10, 60, 30],
				theads   : ["ID", "类型名称", "操作"],
				tpl      : $("#J_unit_tpl").html(),
				tableView: "typeTableView"
			}, {
				type     : "model",
				$el      : this.$model,
				url      : "propertyMng/getConfigList",
				cols     : [10, 60, 30],
				theads   : ["ID", "型号名称", "操作"],
				tpl      : $("#J_unit_tpl").html(),
				tableView: "modelTableView"
			}];

		},
		bindEvent       : function () {
			var self = this;
			_.map(self.config, function (item) {
				self[item.tableView] = new TableView(_.pick(item, "type", "$el", "url", "cols", "theads", "tpl"));
			});
			this.renderBrand();
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
				case "brand":
					this.curBrandId = $tr.data("id");
					this.renderType();
					break;
				case "type":
					this.curTypeId = $tr.data("id");
					this.renderModel();
					break;
				case "model":
					break;
				default :
					break;
			}


			this.updateViewStatus(type);
			Tool.stop(e);
		},
		renderBrand     : function () {
			var data = {
				method: "query"
			};
			this.brandTableView.render(data);
		},
		renderType      : function () {
			var data = {
				brandid: this.curBrandId,
				method : "query"
			};
			this.typeTableView.render(data);
		},
		renderModel     : function () {
			var data = {
				brandid: this.curBrandId,
				typeid : this.curTypeId,
				method : "query"
			};
			this.modelTableView.render(data);
		},
		updateViewStatus: function (type) {
			switch (type) {
				case "brand":
					this.$type.removeClass("hide");
					this.$model.addClass("hide");
					break;
				case "type":
					this.$model.removeClass("hide");
					break;
				case "model":
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
				case "brand":
					tip = "品牌";
					this.curBrandId = $tr.data("id");
					url = "propertyMng/getConfigList";
					data = {
						brandid  : this.curBrandId,
						brandname: val,
						type     : "brand",
						method   : "modify"
					};
					break;
				case "type":
					tip = "类型";
					this.curTypeId = $tr.data("id");
					url = "propertyMng/getConfigList";
					data = {
						brandid : this.curBrandId,
						typeid  : this.curTypeId,
						typename: val,
						type    : "type",
						method  : "modify"
					};
					break;
				case "model":
					tip = "型号";
					this.curModelId = $tr.data("id");
					url = "propertyMng/getConfigList";
					data = {
						typeid   : this.curTypeId,
						modelid  : this.curModelId,
						modelname: val,
						type     : "model",
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
				placeId,
				roomId,
				rankId,
				success = function () {
				};

			switch (type) {
				case "brand":
					brandId = $tr.data("id");
					url = "propertyMng/getConfigList";
					data = {
						brandid: brandId,
						type   : "brand",
						method : "delete"
					};
					success = function () {
						if (placeId == self.curBrandId) {
							self.$model.addClass("hide");
							self.$type.addClass("hide");
						}
						$tr.remove();
					};
					break;
				case "type":
					typeId = $tr.data("id");
					url = "propertyMng/getConfigList";
					data = {
						typeid: typeId,
						type  : "type",
						method: "delete"
					};
					success = function () {
						roomId == self.curTypeId && self.$model.addClass("hide");
						$tr.remove();
					};
					break;
				case "model":
					modelId = $tr.data("id");
					url = "propertyMng/getConfigList";
					data = {
						modelid: modelId,
						type   : "model",
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
				case "brand":
					tip = "品牌";
					url = "propertyMng/getConfigList";
					data = {
						brandname: val,
						type     : "brand",
						method   : "add"
					};
					success = function () {
						self.renderBrand();
					};
					break;
				case "type":
					tip = "类型";
					url = "propertyMng/getConfigList";
					data = {
						brandid : this.curBrandId,
						typename: val,
						type    : "type",
						method  : "add"
					};
					success = function () {
						self.renderType();
					};
					break;
				case "model":
					tip = "型号";
					url = "propertyMng/getConfigList";
					data = {
						modelname: val,
						typeid   : this.curTypeId,
						type     : "model",
						method   : "add"
					};
					success = function () {
						self.renderModel();
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