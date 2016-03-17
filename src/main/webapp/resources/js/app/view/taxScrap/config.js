/**
 * config.js
 * @autoor zq
 * Created by 2015-12-15 10:15
 */
define(['common/validatorHelper'], function (ValidatorHelper) {
	return {
		deal   : {
			list         : [
				{
					key: "financeType"
				},
				{
					key: "endDate"
				}
			],
			validatorFunc: {
				financeType:{
					validator: [ValidatorHelper.isNotEmpty]
				},
				endDate: {
					validator: [ValidatorHelper.calendarMonFormat]
				}
			},
			initUrl      : "/ams/queryTaxScrap/initQueryTax",
			fetchUrl     : "/ams/queryTaxScrap/queryTax",
			keys         : [
				{
					text : "资产编号",
					key  : "assetsSn",
					fixed: true
				},
				{
					text : "资产名称",
					key  : "assetsName",
					fixed: false
				},
				{
					text: "资产所属公司",
					key : "assetsCompany"
				},
				{
					text: "财务分类",
					key : "typeFinance"
				},
				{
					text: "验收日期",
					key : "financeBuyDate"
				},
				{
					text : "资产价格",
					key  : "financePrice",
					fixed: false
				},
				{
					text : "PRCTax折旧月数",
					key  : "prc_FinanceUseMonth",
					fixed: false
				},
				{
					text: "已折旧月数",
					key : "depreciatedMonths"
				},
				{
					text: "残值率",
					key : "prc_ScrapRate"
				},
				{
					text : "残值",
					key  : "prc_ScrapValue",
					fixed: false
				},
				{
					text: "USCTax折旧月数",
					key : "us_FinanceUseMonth"
				},
				{
					text : "US 已折旧月数",
					key  : "us_depreciatedMonths",
					fixed: false
				},
				{
					text: "US 累计折旧",
					key : "us_AccumulateDepreciation"
				},
				{
					text: "US 残值率",
					key : "us_ScrapRate"
				},
				{
					text : "US 残值",
					key  : "us_ScrapValue",
					fixed: false
				},
				{
					text: "财务编号",
					key : "usage_code"
				},
				{
					text: "业务使用状态",
					key : "status"
				}
			],
			needIndex    : true
		},
		scraped: {
			list         : [
				{
					key: "startDate"
				},
				{
					key: "endDate"
				},
				{
					key: "financeType"
				}
			],
			validatorFunc: {
				startDate: {
					validator: [ValidatorHelper.calendarMonFormat]
				},
				endDate  : {
					validator: [ValidatorHelper.calendarMonFormat]
				},
				financeType:{
					validator: [ValidatorHelper.isNotEmpty]
				}
			},
			initUrl      : "/ams/queryTaxScrap/initQueryTax",
			fetchUrl     : "/ams/queryTaxScrap/taxScrapedAssetsQuery",
			keys         : [
				{
					text : "资产编号",
					key  : "assetsSn",
					fixed: true
				},
				{
					text : "资产名称",
					key  : "assetsName",
					fixed: false
				},
				{
					text: "资产所属公司",
					key : "assetsCompany "
				},
				{
					text: "财务分类",
					key : "typeFinance"
				},
				{
					text: "报废时间",
					key : "taxScrapDate"
				},
				{
					text: "验收日期",
					key : "financeBuyDate"
				},
				{
					text : "资产价格",
					key  : "financePrice",
					fixed: false
				},
				{
					text : "PRCTax折旧月数",
					key  : "prc_FinanceUseMonth",
					fixed: false
				},
				{
					text : "PRC累计折旧",
					key  : "prc_AccumulateDepreciation",
					fixed: false
				},
				{
					text: "PRC残值率",
					key : "prc_ScrapRate"
				},
				{
					text : "PRC残值",
					key  : "prc_ScrapValue",
					fixed: false
				},
				{
					text: "财务编号",
					key : "usage_code"
				},
				{
					text: "报废状态",
					key : "taxStatus"
				}
			],
			needIndex    : true
		}
	}
});