/**
 * config.js
 * @autoor zq
 * Created by 2015-12-15 10:15
 */
define(['common/validatorHelper'], function (ValidatorHelper) {
	return {
		nbvprc : {
			list         : [
				{
					key: "company"
				},
				{
					key: "financeType"
				},
				{
					key: "startTime"
				},
				{
					key: "endTime"
				},
				{
					key: "financeCode"
				},
				{
					key: "endDate"
				},
				{
					key: "assetsSn"
				},
				{
					key: "term"
				}
			],
			validatorFunc: {
				startTime: {
					validator: [ValidatorHelper.calendarFormat],
				},
				endTime  : {
					validator: [ValidatorHelper.calendarFormat],
				},
				endDate  : {
					validator: [ValidatorHelper.calendarMonFormat]
				}
			},
			initUrl      : "/ams/queryNbvDetail/initQueryNbvDetail",
			fetchUrl     : "/ams/queryNbvDetail/queryDetail",
			keys         : [
				{
					text : "资产编号",
					key  : "assetsSn",
					fixed: true
				},
				{
					text : "资产名称",
					key  : "typeAllName",
					fixed: false
				},
				{
					text: "资产所属公司",
					key : "companyName"
				},
				{
					text: "财务分类",
					key : "typeFinanceName"
				},
				{
					text: "验收日期",
					key : "financePayDate"
				},
				{
					text : "资产价格",
					key  : "price",
					fixed: false
				},
				{
					text : "PRC折旧月数",
					key  : "financeUseMonth",
					fixed: false
				},
				{
					text: "PRC已折旧月数",
					key : "depreciatedMonth"
				},
				{
					text: "PRC累计折旧",
					key : "accumulateDepreciation"
				},
				{
					text: "净值",
					key : "nbv"
				},
				{
					text : "PRC残值率",
					key  : "salvageRate",
					fixed: false
				},
				{
					text: "PRC残值",
					key : "salvage"
				},
				{
					text: "财务编号",
					key : "financeCode"
				}
			],
			needIndex    : true
		},
		nbvus  : {
			list         : [
				{
					key: "company"
				},
				{
					key: "financeType"
				},
				{
					key: "startTime"
				},
				{
					key: "endTime"
				},
				{
					key: "financeCode"
				},
				{
					key: "endDate"
				},
				{
					key: "assetsSn"
				},
				{
					key: "term"
				}
			],
			validatorFunc: {
				startTime: {
					validator: [ValidatorHelper.calendarFormat],
				},
				endTime  : {
					validator: [ValidatorHelper.calendarFormat],
				},
				endDate  : {
					validator: [ValidatorHelper.calendarMonFormat]
				}
			},
			initUrl      : "/ams/queryNbvDetail/initQueryNbvDetail",
			fetchUrl     : "/ams/queryNbvDetail/queryDetail",
			keys         : [
				{
					text : "资产编号",
					key  : "assetsSn",
					fixed: true
				},
				{
					text : "资产名称",
					key  : "typeAllName",
					fixed: false
				},
				{
					text: "资产所属公司",
					key : "companyName"
				},
				{
					text: "财务分类",
					key : "typeFinanceName"
				},
				{
					text: "验收日期",
					key : "financePayDate"
				},
				{
					text : "资产价格",
					key  : "price",
					fixed: false
				},
				{
					text : "US折旧月数",
					key  : "financeUseMonth",
					fixed: false
				},
				{
					text: "US已折旧月数",
					key : "depreciatedMonth"
				},
				{
					text: "US累计折旧",
					key : "accumulateDepreciation"
				},
				{
					text: "净值",
					key : "nbv"
				},
				{
					text : "US残值率",
					key  : "salvageRate",
					fixed: false
				},
				{
					text: "US残值",
					key : "salvage"
				},
				{
					text: "财务编号",
					key : "financeCode"
				}
			],
			needIndex    : true
		},
		nbvdiff: {
			list         : [
				{
					key: "company"
				},
				{
					key: "financeType"
				},
				{
					key: "startTime"
				},
				{
					key: "endTime"
				},
				{
					key: "endDate"
				},
				{
					key: "financeCode"
				},
				{
					key: "term"
				}
			],
			validatorFunc: {
				startTime: {
					validator: [ValidatorHelper.calendarFormat],
				},
				endTime  : {
					validator: [ValidatorHelper.calendarFormat],
				},
				endDate  : {
					validator: [ValidatorHelper.calendarMonFormat]
				}
			},
			initUrl      : "/ams/queryNbvDetail/initQueryNbvDetail",
			fetchUrl     : "/ams/queryNbvDetail/queryDetail",
			keys         : [
				{
					text : "资产编号",
					key  : "assetsSn",
					fixed: true
				},
				{
					text : "资产名称",
					key  : "typeAllName",
					fixed: false
				},
				{
					text: "资产所属公司",
					key : "companyName"
				},
				{
					text: "财务分类",
					key : "typeFinanceName"
				},
				{
					text: "验收日期",
					key : "financePayDate"
				},
				{
					text : "资产价格",
					key  : "price",
					fixed: false
				},
				{
					text : "US净值",
					key  : "nbvus",
					fixed: false
				},
				{
					text: "PRC净值",
					key : "nbvprc"
				},
				{
					text: "US净值-PRC净值",
					key : "nbv"
				},
				{
					text: "财务编号",
					key : "financeCode"
				}
			],
			needIndex    : true
		},
		nbvsum : {
			list         : [
				{
					key: "company"
				},
				{
					key: "financeType"
				},
				{
					key: "startTime"
				},
				{
					key: "endTime"
				},
				{
					key: "endDate"
				},
				{
					key: "term"
				}
			],
			validatorFunc: {
				startTime: {
					validator: [ValidatorHelper.calendarFormat],
				},
				endTime  : {
					validator: [ValidatorHelper.calendarFormat],
				},
				endDate  : {
					validator: [ValidatorHelper.calendarMonFormat]
				}
			},
			initUrl      : "/ams/queryNbvDetail/initQueryNbvDetail",
			fetchUrl     : "/ams/queryNbvDetail/queryDetail",
			keys         : [
				{
					text : "公司",
					key  : "companyName",
					fixed: true
				},
				{
					text: "财务分类",
					key : "typeFinanceName"
				},
				{
					text: "资产价格汇总",
					key : "price"
				},
				{
					text : "US净值汇总",
					key  : "nbvus",
					fixed: false
				},
				{
					text: "PRC净值汇总",
					key : "nbvprc"
				},
				{
					text: "US净值-PRC净值",
					key : "nbv"
				}
			],
			needIndex    : true
		},
		depprc : {
			list         : [
				{
					key: "company"
				},
				{
					key: "financeType"
				},
				{
					key: "financeCode"
				},
				{
					key: "startDate"
				},
				{
					key: "endDate"
				},
				{
					key: "assetsSn"
				},
				{
					key: "startTime"
				},
				{
					key: "endTime"
				},
				{
					key: "term"
				}
			],
			validatorFunc: {
				startTime: {
					validator: [ValidatorHelper.calendarFormat],
				},
				endTime  : {
					validator: [ValidatorHelper.calendarFormat],
				},
				startDate: {
					validator: [ValidatorHelper.calendarMonFormat]
				},
				endDate  : {
					validator: [ValidatorHelper.calendarMonFormat]
				}
			},
			initUrl      : "/ams/queryNbvDetail/initQueryNbvDetail",
			fetchUrl     : "/ams/queryNbvDetail/queryDetail",
			keys         : [
				{
					text : "资产编号",
					key  : "assetsSn",
					fixed: true
				},
				{
					text : "资产名称",
					key  : "typeAllName",
					fixed: false
				},
				{
					text: "资产所属公司",
					key : "companyName"
				},
				{
					text: "财务分类",
					key : "typeFinanceName"
				},
				{
					text: "入账日期",
					key : "financePayDate"
				},
				{
					text : "资产价格",
					key  : "price",
					fixed: false
				},
				{
					text : "PRC应折旧月数",
					key  : "financeUseMonth",
					fixed: false
				},
				{
					text: "计算月数",
					key : "depreciatedMonth"
				},
				{
					text: "PRC折旧总和",
					key : "depreciationSum"
				},
				{
					text: "PRC残值率",
					key : "salvageRate"
				},
				{
					text: "PRC残值",
					key : "salvage"
				},
				{
					text: "财务编号",
					key : "financeCode"
				}
			],
			needIndex    : true
		},
		depus  : {
			list         : [
				{
					key: "company"
				},
				{
					key: "financeType"
				},
				{
					key: "financeCode"
				},
				{
					key: "startDate"
				},
				{
					key: "endDate"
				},
				{
					key: "assetsSn"
				},
				{
					key: "startTime"
				},
				{
					key: "endTime"
				},
				{
					key: "term"
				}
			],
			validatorFunc: {
				startTime: {
					validator: [ValidatorHelper.calendarFormat],
				},
				endTime  : {
					validator: [ValidatorHelper.calendarFormat],
				},
				startDate: {
					validator: [ValidatorHelper.calendarMonFormat]
				},
				endDate  : {
					validator: [ValidatorHelper.calendarMonFormat]
				}
			},
			initUrl      : "/ams/queryNbvDetail/initQueryNbvDetail",
			fetchUrl     : "/ams/queryNbvDetail/queryDetail",
			keys         : [
				{
					text : "资产编号",
					key  : "assetsSn",
					fixed: true
				},
				{
					text : "资产名称",
					key  : "typeAllName",
					fixed: false
				},
				{
					text: "资产所属公司",
					key : "companyName"
				},
				{
					text: "财务分类",
					key : "typeFinanceName"
				},
				{
					text: "入账日期",
					key : "financePayDate"
				},
				{
					text : "资产价格",
					key  : "price",
					fixed: false
				},
				{
					text : "US应折旧月数",
					key  : "financeUseMonth",
					fixed: false
				},
				{
					text: "计算月数",
					key : "depreciatedMonth"
				},
				{
					text: "US折旧总和",
					key : "depreciationSum"
				},
				{
					text: "US残值率",
					key : "salvageRate"
				},
				{
					text: "US残值",
					key : "salvage"
				},
				{
					text: "财务编号",
					key : "financeCode"
				}
			],
			needIndex    : true
		},
		depdiff: {
			list         : [
				{
					key: "company"
				},
				{
					key: "financeType"
				},
				{
					key: "startTime"
				},
				{
					key: "endTime"
				},
				{
					key: "financeCode"
				},
				{
					key: "startDate"
				},
				{
					key: "endDate"
				},
				{
					key: "assetsSn"
				},
				{
					key: "term"
				}
			],
			validatorFunc: {
				startTime: {
					validator: [ValidatorHelper.calendarFormat],
				},
				endTime  : {
					validator: [ValidatorHelper.calendarFormat],
				},
				startDate: {
					validator: [ValidatorHelper.calendarMonFormat]
				},
				endDate  : {
					validator: [ValidatorHelper.calendarMonFormat]
				}
			},
			initUrl      : "/ams/queryNbvDetail/initQueryNbvDetail",
			fetchUrl     : "/ams/queryNbvDetail/queryDetail",
			keys         : [
				{
					text : "资产编号",
					key  : "assetsSn",
					fixed: true
				},
				{
					text : "资产名称",
					key  : "typeAllName",
					fixed: false
				},
				{
					text: "资产所属公司",
					key : "companyName"
				},
				{
					text: "财务分类",
					key : "typeFinanceName"
				},
				{
					text: "入账日期",
					key : "financePayDate"
				},
				{
					text : "资产价格",
					key  : "price",
					fixed: false
				},
				{
					text : "PRC折旧总和",
					key  : "depreciationSumPRC",
					fixed: false
				},
				{
					text: "US折旧总和",
					key : "depreciationSumUS"
				},
				{
					text: "US-PRC",
					key : "depreciationSum"
				},
				{
					text: "财务编号",
					key : "financeCode"
				}
			],
			needIndex    : true
		},
		depsum : {
			list         : [
				{
					key: "company"
				},
				{
					key: "financeType"
				},
				{
					key: "startTime"
				},
				{
					key: "endTime"
				},
				{
					key: "startDate"
				},
				{
					key: "endDate"
				},
				{
					key: "term"
				}
			],
			validatorFunc: {
				startTime: {
					validator: [ValidatorHelper.calendarFormat],
				},
				endTime  : {
					validator: [ValidatorHelper.calendarFormat],
				},
				startDate: {
					validator: [ValidatorHelper.calendarMonFormat]
				},
				endDate  : {
					validator: [ValidatorHelper.calendarMonFormat]
				}
			},
			initUrl      : "/ams/queryNbvDetail/initQueryNbvDetail",
			fetchUrl     : "/ams/queryNbvDetail/queryDetail",
			keys         : [
				{
					text : "公司",
					key  : "companyName",
					fixed: true
				},
				{
					text: "财务分类",
					key : "typeFinanceName"
				},
				{
					text : "资产价格",
					key  : "price",
					fixed: false
				},
				{
					text: "PRC折旧总和",
					key : "depreciationSumPRC"
				},
				{
					text: "US折旧总和",
					key : "depreciationSumUS"
				},
				{
					text: "US-PRC",
					key : "depreciationSum"
				}
			],
			needIndex    : true
		}
	}
});