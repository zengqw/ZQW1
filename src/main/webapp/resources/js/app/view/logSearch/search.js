define([
	'jquery',
	'underscore',
	'backbone',
	'common/requestConfig',
	'common/interactiveEvent',
	'common/tool',
	'view/common/table',
	'common/popTip'

], function ($, _, B, requestConfig, interactiveEvent, Tool, TableView, PopTip) {

	return B.View.extend({
		events           : {
			'click .ac_searchWorkload': 'search',		    // 执行搜索
			'click .J_reset_search'   : 'resetSearch',		// 恢复初始查询状态
			'click td'                : 'showPopTip'
		},
		cacheDom         : function () {
			this.$workloadHeader = $(".workload-header");
			this.$workOperation = $('.workload-operation');
			this.$workData = $('.workload-data-list');
		},
		config           : {
			theads: ["操作时间", "操作者", "操作类型", "资产编号", "资产名称", "资产所属公司", "配置_供应商", "配置_品牌", "配置_类型", "配置_型号", "配置_相关", "配置_详细信息", "配置_光驱", "配置_CPU", "配置_显卡", "配置硬盘", "配置内存", "配置网卡", "配置声卡", "配置Service", "资产描述", "入账价格", "残值率", "下单号", "合同号", "凭证号", "验收单编号", "验收日期", "入账日期", "折旧日期", "报废日期", "报废原因", "收益", "财务编号", "税务报废状态", "税务报废日期", "产品名", "用途_资产用途", "用途备注", "使用者", "使用者一级部门名称", "使用者二级部门名称", "使用者三级部门名称", "员工编号", "使用者邮箱", "使用月份", "PRC使用月份", "PRC残值率", "PRC原值", "操作系统名称", "操作系统安装人", "机房地点", "机房名称", "机列名称", "机柜名称", "刀框序号", "刀片序号", "位置_外网IP", "位置_内网IP", "管理网IP", "位置_使用地点", "使用状态", "资产状态", "地点名称", "二级部门负责人", "S类资产", "内网交换机IP", "交换机内网端口", "外网交换机IP", "交换机外网端口", "NA配置-CPU", "NA配置-内存", "NA配置-硬盘1型号", "NA配置-硬盘1容量", "NA配置-硬盘1数量", "NA配置-硬盘2型号", "NA配置-硬盘2容量", "NA配置-硬盘2数量", "NA配置-网卡", "NA配置-raid卡", "NA配置-ServerTag", "NA配置-其它", "借用者工号", "借用者姓名", "借用者邮箱", "借用者一级部门", "借用者二级部门", "借用者三级部门", "借用日期", "应还日期", "实际归还日期"],
			tds   : ["logTimes", "logName", "logAction", "assetsSn", "typeName", "assetsCompany", "confProvider", "confBrand", "confType", "confModel", "confRaid", "confText", "confCdrom", "confCpu", "confDisplay", "confHarddisk", "confMem", "confNetcard", "confSound", "confStandby1", "otherDescribe", "financePrice", "confStandBy2", "orderSn", "financeCompactSn", "financeVoucherSn", "financeCheckerSn", "financeBuy", "financePay", "standby1", "abandon", "abandonResean", "proceeds", "financeUsageCode", "taxStatus", "taxScrap", "productCode", "useAssetsUse", "useComment", "useUser", "userDept1", "userDept2", "userDept3", "employeeCode", "email", "financeUseMonth", "prcFinanceUseMonth", "prcScrapRate", "prcFinancePrice", "osName", "osOperator", "locationPlace", "locationRoomName", "locationColName", "locationTank", "locationBladeBoxNo", "locationBladeBNo", "locationOutIp", "locationInIp", "locationMngIp", "locationUsage", "status", "assetsStatus", "standby2", "standby3", "confStandby3", "upSwitchIn", "upSwitchInPort", "upSwitchOut", "upSwitchOutPort", "naConfCpu", "naConfMem", "naConfHardDiskType1", "naConfHardDiskCap1", "naConfHardDiskNum1", "naConfHardDiskType2", "naConfHardDiskCap2", "naConfHardDiskNum2", "naConfNetCard", "naConfRaid", "naConfServerTag", "naConfOther", "borrower_employeeCode", "borrower_name", "borrower_email", "borrower_dept1", "borrower_dept2", "borrower_dept3", "borrower", "shouldReturn", "realReturnData"]
		},
		bindEvent        : function () {
			var self = this;

			//激活当前导航选项
			self.$workloadHeader.find('a[href="home' + window.location.hash + '"]').addClass('active').siblings('a').removeClass('active');

			self.$workOperation.workloadSearch({
				callback: function (options) {
				}
			});

			this.tableView = new TableView({
				$el    : self.$workData,
				url    : "amsLog/queryAssetLog",
				cols   : [],
				theads : self.config.theads,
				unitTpl: $("#J_unit_tpl").html()
			});
		},
		initialize       : function (options) {
			var self = this;

			self.cacheDom.apply(self);
			self.bindEvent.apply(self);
		},
		// 组合搜索条件
		assembleQueryData: function () {
			var formData = interactiveEvent.serializeFields($('.workload-operation'), 'browser').dataModel;
			return formData;
		},
		//恢复搜索面板最初状态
		resetSearch      : function (e) {
			var resetData = "sn=";
			interactiveEvent.restoreSearchKey($('.ams-view .workload-search'), resetData);
			Tool.stop(e);
		},
		search           : function (e) {
			var formData = interactiveEvent.serializeFields($('.workload-operation'), 'browser').dataModel;
			this.renderList(formData);

			//防止冒泡和组织浏览器默认行为
			Tool.stop(e);
		},
		renderList       : function (queryData) {
			this.tableView.render(queryData);
		},
		showPopTip       : function (e) {
			var $target = $(e.target),
				$td = $target.parents("td").length ? $target.parents("td") : $target;
			new PopTip({
				el: $td.get(0)
			});
		}
	});
});