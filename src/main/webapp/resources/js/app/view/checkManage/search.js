define([
	'jquery',
	'underscore',
	'backbone',
	'common/requestConfig',
	'common/interactiveEvent',
	'view/unit/write',
	'common/page',
	'common/remote'

], function ($, _, B, requestConfig, interactiveEvent, UnitWrite, pageAjax, Remote) {

	return B.View.extend({
		events         : {
			'click .input-checkbox'    : 'selectCheckbox',		        // 模拟复选框
			'click .ac_searchWorkload' : 'search',		                // 执行搜索,
			'click .J_clear_chked'     : 'toggleAllChked',             //切换清除、全选复选框,
			'click .J_reset_search'    : 'resetSearch',                //恢复搜索初始状态,
			'click .J_type'            : "executeFilterByType",        //不同类型过滤,
			'click .J_view'            : "toggleHideView",
			'click .J_view_all'        : 'toggleAllHideView',
			'click .J_modify_inventory': 'modifySingleInventory',		//修改单个盘点信息
			'click .J_multi_modify'    : 'modifyMultiInventory',       //批量修改盘点信息
			'click .J_ams_exportExcel' : 'exportExcel',                //根据查询条件导出Excel,
			'click .J_ams_notify'      : 'notify'                      //消息提醒
		},
		initialize     : function (options) {
			var me = this;
			this.el = options.el;

			//渲染模板
			require([options.tpl], function (tpl) {
				me.el.innerHTML = tpl;
				me.cacheDom = {
					$workloadHeader: $(".workload-header"),
					$firstDeptList : me.$el.find(".J_dept_first"),
					$secondDeptList: me.$el.find(".J_dept_second"),
					$tableBody     : me.$el.find(".workload-data-list tbody"),
					$equipList     : me.$el.find(".J_equipments"),
					$fliterType    : $(".J_type"),
					$overlay       : $('.J_overlay'),
					$viewAllBtn    : $(".J_view_all")
				};

				me.pageIndex = 1;
				me.pageSize = 10;

				$('.workload-operation').workloadSearch({
					callback: function (options) {
					}
				});

				me.type = options.type;
				me.renderDept();
				me.renderEquipment();
				me.initModifyPopup();
			});

		},
		cacheList      : [],
		//渲染配置
		renderEquipment: function () {
			var me = this;
			Remote({
				type    : 'GET',
				dataType: 'JSON',
				url     : "common/equipmentList",
				success : function (r) {
					r.code = parseInt(r.code);
					if (r.code == 200) {
						var _unitTPL = $("#J_equip_unit").html(),
							_unitList = _.template(_unitTPL)({data: r.data.equipList});

						//渲染列表
						me.cacheDom.$equipList.html(_unitList);
					} else {
						$.oaTip(r.desc, 'error', 2000);
					}
				}
			});
		},

		//渲染部门选项
		renderDept       : function () {
			var me = this;
			Remote({
				type    : 'GET',
				dataType: 'JSON',
				data    : {
					departLevel: 1
				},
				url     : "common/queryDepartment",
				success : function (r) {
					//请求成功
					if (r.code == 200) {
						var _unitTPL = $("#J_dept_unit").html(),
							_unitList = _.template(_unitTPL)(r);

						//渲染列表
						me.cacheDom.$firstDeptList.html(_unitList);
					} else {
						$.oaTip(r.desc, 'error', 2000);
					}
				}
			});
			Remote({
				type    : 'GET',
				dataType: 'JSON',
				data    : {
					departLevel: 2
				},
				url     : "common/queryDepartment",
				success : function (r) {
					//请求成功
					if (r.code == 200) {
						var _unitTPL = $("#J_dept_unit").html(),
							_unitList = _.template(_unitTPL)(r);

						//渲染列表
						me.cacheDom.$secondDeptList.html(_unitList);
					} else {
						$.oaTip(r.desc, 'error', 2000);
					}
				}
			});

		},
		// 组合搜索条件
		assembleQueryData: function () {
			var formData = interactiveEvent.serializeFields($('.workload-operation'), 'browser').dataModel,
				type = $(".filter-item.active").attr('data-type'),
				typeAll = _.reduce(this.cacheDom.$equipList.find(".input-checkbox-hover"), function (ret, item) {
					ret.push($(item).attr('data-id'));
					return ret;
				}, []).join(",");
			return formData + '&type=' + type + '&typeAll=' + typeAll;
		},
		//恢复列表的控制，比如全选，查看
		resetListControl : function () {
			$(".input-checkbox[data-type=all]").removeClass('input-checkbox-hover');
			this.cacheDom.$viewAllBtn.removeClass("view-close").text("查看");
		},
		// 模拟复选框
		selectCheckbox   : function (e) {
			var $target = $(e.currentTarget),
				$table = $target.parents('table'),
				$tbody = $table.find('tbody');

			var _type = $target.data('type');

			if (_type === 'all') {
				if ($target.hasClass('input-checkbox-hover')) $tbody.find('.input-checkbox-hover').removeClass('input-checkbox-hover');
				else $tbody.find('.input-checkbox:not(".input-checkbox-hover")').addClass('input-checkbox-hover');
			}

			$target.toggleClass('input-checkbox-hover');

			if (_type === 'item') {
				var _len = $tbody.find('.input-checkbox').length,
					_checks = $tbody.find('.input-checkbox-hover').length;

				if (_len === _checks) $table.find('.input-checkbox[data-type="all"]').addClass('input-checkbox-hover');
				else $table.find('.input-checkbox[data-type="all"]').removeClass('input-checkbox-hover');
			}

			return false;
		},

		//切换全选和清除功能
		toggleAllChked       : function (e) {
			var $target = $(e.currentTarget);
			$target.toggleClass("chked");
			this.cacheDom.$equipList.find('.input-checkbox')[$target.hasClass("chked") ? "addClass" : "removeClass"]('input-checkbox-hover');
			$target.text($target.hasClass("chked") ? "取消全选" : "全选");
		},
		resetChk             : function () {
			this.cacheDom.$equipList.find('.input-checkbox').addClass('input-checkbox-hover');
			$(".J_clear_chked").text("取消全选").addClass("chked");
		},
		//恢复搜索面板最初状态
		resetSearch          : function () {
			var resetData = "status=&year=&primaryDepartmentId=&secondaryDepartment=&userStatus=&assetsStatus=&standby2=&assetsSn=&assetsCompany=&useAssetsUse=&useUser=&employeeCode=&email=&confModel="
			interactiveEvent.restoreSearchKey($('.ams-view .workload-search'), resetData);
			this.resetChk();
		},
		//更新列表数据
		updateList           : function (data) {
			//缓存最新盘点列表信息
			this.cacheList = data;

			var _unitTPL = $("#J_enventory_unit").html(),
				_unitList = _.template(_unitTPL)({data: data});
			//渲染列表
			this.cacheDom.$tableBody.html(_unitList);
			this.resetListControl();
		},
		// 渲染组织单元列表
		renderList           : function (queryData) {
			var me = this;
			new pageAjax("checkManage/checkQuery?" + queryData, {
				pageSize : me.pageSize,
				pageIndex: me.pageIndex
			}, function (r) {
				if (r.code == 200) {
					me.updateList(r.data);
					me.pageSize = r.pageSize;
					me.pageIndex = r.pageIndex;
				} else {
					$.oaTip(r.desc, 'error', 2000);
				}
			});
		},
		showOverLay          : function () {
			this.cacheDom.$overlay.addClass("overlay_active");
		},
		hideOverLay          : function () {
			this.cacheDom.$overlay.removeClass("overlay_active");
		},
		exportExcel          : function () {
			var queryData = this.assembleQueryData();

			Remote({
				type    : 'GET',
				dataType: 'JSON',
				data    : {},
				url     : "checkManage/checkQuery?" + "excel=盘点信息汇总" + "&" + queryData,
				success : function (r) {
					if (r.code == 200) {
						window.location.href = "common/exportExcel";
					} else {
						$.oaTip(r.desc, "error", 2000);
					}
				}
			});
		},
		refresh              : function () {
			this.renderList(this.assembleQueryData());
		},
		resetPage            : function () {
			this.pageIndex = 1;
			this.pageSize = 10;
		},
		search               : function () {
			this.resetPage();
			this.renderList(this.assembleQueryData());
			return false;
		},
		executeFilterByType  : function (e) {
			var $target = $(e.currentTarget),
				type = $target.attr('data-type');
			this.cacheDom.$fliterType.removeClass("active");
			$target.addClass("active");
			this.search();
		},
		toggleAllHideView    : function (e) {
			var $target = $(e.currentTarget),
				$hideViews = $(".J_hide_view"),
				$viewBtns = $(".J_view");
			$target.toggleClass("view-close").text($target.hasClass("view-close") ? "关闭" : "查看");
			if ($target.hasClass("view-close")) {
				$target.text("关闭");
				$viewBtns.addClass("view-close").text("关闭");
				$hideViews.removeClass("hide");
			} else {
				$target.text("查看");
				$viewBtns.removeClass("view-close").text("查看");
				$hideViews.addClass("hide");
			}
		},
		toggleHideView       : function (e) {
			var $target = $(e.currentTarget),
				viewId = $target.attr('data-view-id');
			$target.toggleClass("view-close").text($target.hasClass("view-close") ? "关闭" : "查看");
			$(".J_hide_view").filter('[data-view-id=' + viewId + ']').toggleClass("hide");

			//更新全部查看的状态
			if ($(".J_view").length = 0 || $(".J_view").length != $(".J_view.view-close").length) {
				this.cacheDom.$viewAllBtn.removeClass("view-close").text("查看");
			} else if ($(".J_view").length == $(".J_view.view-close").length) {
				this.cacheDom.$viewAllBtn.addClass("view-close").text("关闭");
			}

		},
		modifySingleInventory: function (e) {
			var $target = $(e.currentTarget),
				index = $target.attr("data-index"),
				detailId = $target.attr("data-detail-id");
			this.modifyPopupView.openSingleModify(detailId, this.cacheList[index]);

		},
		modifyMultiInventory : function () {
			var detailIds = _.reduce(this.cacheDom.$tableBody.find(".input-checkbox-hover"), function (ret, chk) {
				ret.push($(chk).attr("data-detail-id"));
				return ret;
			}, []);
			if (detailIds.length) {
				this.modifyPopupView.openMultiModify(detailIds);
			} else {
				$.oaTip("请勾选需要修改的资产", "warning", 2000);
			}

			return false;
		},
		initModifyPopup      : function () {
			var me = this;
			require(["text!tmpl/interactive/assetsStatus.html?"], function (tpl) {
				var Sector = null;
				var ModifyPopupView = Backbone.View.extend({
					tagName                : 'div',
					className              : 'modify-inventory',
					id                     : 'modifyInventory',
					events                 : {},
					initialize             : function () {
						Sector = this;
					},
					renderInventoryInfo    : function (data) {
						var $el = $(Sector.el);
						data.userConfirmTime = data.userConfirmTime || "";
						$el.find(".J_info_content").html(_.template($("#J_enventory_info_tpl").html())(data));
						$el.find(".J_info_tip").html(_.template($("#J_enventory_tip_tpl").html())(data));
						["新增"].indexOf(data.checkstatus) >= 0 && this.disableSlectStatus();
					},
					disableSlectStatus     : function () {
						var $statusBox = $(Sector.el).find(".J_status");
						$statusBox.find(".select-box em").removeClass("ac_selectBox").text("新增").css("color", "red");
						$statusBox.find(".select-auto").remove();
						$statusBox.find(".select-box input").val(4);
					},
					renderMultiInventoryTip: function (num) {
						var $el = $(Sector.el);
						$el.find(".J_info_tip").html(_.template($("#J_multi_enventory_tip_tpl").html())({
							num: num
						}));
					},
					openSingleModify       : function (detailId, data) {
						this.detailIds = [detailId];
						this.render();
						this.renderInventoryInfo(data);
					},
					openMultiModify        : function (detailIds) {
						detailIds = detailIds || [];
						this.detailIds = detailIds;
						this.render(true);
						this.renderMultiInventoryTip(detailIds.length);
					},
					render                 : function (multiFlag) {
						Sector.el.innerHTML = tpl;
						var height = multiFlag ? 200 : 570,
							$sprite = $.sprite({
								title        : '盘点修改',
								width        : 800,
								height       : height,
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
									var formData = interactiveEvent.serializeFields($('.J_modify_form'), 'browser').dataModel;
									Sector.formData = formData;
									var $confirm = $.confirm({
										title    : '提示',
										msg      : '确认修改吗？',
										onconfirm: function () {
											Remote({
												type    : 'GET',
												dataType: 'JSON',
												data    : {},
												url     : "checkManage/checkAgain?" + "mail=" + ENV.loginName + "&" + "detailIds=" + Sector.detailIds + "&" + formData,
												success : function (r) {
													r.code = parseInt(r.code);
													if (r.code == 202) {
														me.refresh.apply(me);
														$.oaTip("修改成功", 'success', 2000);
														$sprite.remove();
														Sector.removeView();
													} else {
														$.oaTip(r.desc, 'error', 2000);
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
					removeView             : function () {
						modifyPopupView = null;
						ModifyPopupView = null;
					}
				});
				me.modifyPopupView = new ModifyPopupView();
			});
		},
		notify               : function (data) {
			var me = this,
				detailId = null,
				email = null,
				type = $(".filter-item.active").attr('data-type');
			var notifyList = _.reduce(this.cacheDom.$tableBody.find(".input-checkbox-hover"), function (ret, chk) {
				detailId = $(chk).data("detail-id");
				email = $(chk).data("email");

				//过滤邮箱重复，排除邮箱为空的情况
				if (!email || !_.findWhere(ret, {email: email})) {
					ret.push(_.findWhere(me.cacheList, {detailId: parseInt(detailId)}));
				}
				return ret;
			}, []);
			if (parseInt(type) != 3) {
				$.oaTip("请先切换到未盘点列表", "warning", 2000);
				return;
			}
			if (notifyList.length) {
				me.renderNotify(notifyList);
			} else {
				$.oaTip("请勾选需要通知的资产", "warning", 2000);
			}
		},
		renderNotify         : function (data) {
			var me = this;
			require(["text!tmpl/interactive/msgNotify.html?"], function (tpl) {
				var Sector = null;
				var NotifyPopupView = Backbone.View.extend({
					tagName    : 'div',
					className  : 'notify-inventory',
					id         : 'notifyInventory',
					events     : {},
					recordCount: 0,
					initialize : function () {
						Sector = this;
						Sector.emails = [];
						Sector.detailIds = [];
						Sector.notifyList = data;
						Sector.render();
						Sector.renderList();
					},
					renderList : function () {
						var _unitTPL = $("#J_notify_unit").html(),
							_unitList = _.template(_unitTPL)({data: data});
						//渲染列表
						$(".J_notify_table").html(_unitList);
						$(".J_notify_nums").text(data.length);
					},
					render     : function () {
						Sector.el.innerHTML = tpl;
						var $el = $(Sector.el);
						var $sprite = $.sprite({
							title        : '未盘点提醒',
							width        : 720,
							height       : 570,
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
								var $confirm = $.confirm({
									title    : '提示',
									msg      : '确认要发送未盘点提醒邮件吗？',
									onconfirm: function () {
										_.map(Sector.notifyList, function (item) {
											Sector.emails.push(item.email);
											Sector.detailIds.push(item.detailId);
										});
										Remote({
											type    : 'GET',
											dataType: 'JSON',
											data    : {
												mail     : ENV.loginName,
												emails   : Sector.emails.join(","),
												detailIds: Sector.detailIds.join(",")
											},
											url     : "checkManage/insertNoticeUser",
											success : function (r) {
												//请求成功
												r.code = parseInt(r.code);
												if (r.code == 203) {
													$.oaTip("确认提醒邮件发送成功", 'success', 2000);
													$sprite.remove();
													Sector.removeView();
												} else {
													$.oaTip(r.desc, 'error', 2000);
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
					removeView : function () {
						notifyPopupView = null;
						NotifyPopupView = null;
					}
				});
				var notifyPopupView = new NotifyPopupView();
			});
		}
	});
});