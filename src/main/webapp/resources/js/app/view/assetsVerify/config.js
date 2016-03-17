/**
 * config.js
 * @autoor zq
 * Created by 2015-12-15 10:15
 */
define(["common/validatorHelper"], function (ValidatorHelper) {
	return {
		list     : [
			{
				key: "company"
			},
			{
				key: "type"
			},
			{
				key: "timeFlag"
			},
			{
				key: "startTime"
			},
			{
				key: "endTime"
			}
		],
		initUrl  : "/ams/getCheckEquipment/initEquip",
		fetchUrl : "/ams/getCheckEquipment/queryEquip",
		submitUrl:"/ams/getCheckEquipment/submitEquip",
		validatorFunc: {
			startTime: {
				validator: [ValidatorHelper.calendarFormat]
			},
			endTime: {
				validator: [ValidatorHelper.calendarFormat]
			}
		},
		keys     : [
			{
				text : "资产编号",
				key  : "assetsSn",
				fixed: true
			},
			{
				text: "USGAAP入账价格",
				key : "financePrice",
				type: "text"
			},
			{
				text: "PRCGAAP入账价格",
				key : "prcFinancePrice",
				type: "text"
			},
			{
				text : "凭证号",
				key  : "financeVoucherSn",
				type : "text",
				fixed: false
			},
			{
				text: "资产用途",
				key : "useAssetsUse",
				type: "text"
			},
			{
				text: "入帐日期",
				key : "financePayDate",
				type: "date"
			},
			{
				text: "USGAAP残值率",
				key : "confStandby2"
			},
			{
				text: "PRCGAAP残值率",
				key : "prcScrapRate"
			},
			{
				text: "资产名称",
				key : "typeAll"
			},
			{
				text: "资产所属公司",
				key : "name"
			},
			{
				text: "财务编号",
				key : "financeUsageCode"
			},
			{
				text : "验收单编号",
				key  : "financeCheckerSn",
				fixed: false
			},
			{
				text : "验收日期",
				key  : "financeBuyDate",
				fixed: false
			},
			{
				text: "残值",
				key : "defaultUsScrapRate"
			}
		],
		//controls : {
		//	text: "操作",
		//	btns: [
		//		{
		//			type     : "modify",
		//			text     : "修改",
		//			className: "u-btn-modify J_modify"
		//		}
		//	]
		//},
		needIndex: false,
		uId      : "assetsSn"
	}
});