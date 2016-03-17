/**
 * config.js
 * @autoor zq
 * Created by 2015-12-15 10:15
 */
define(["common/validatorHelper"], function (ValidatorHelper) {
	return {
		ledger  : {
			list     : [
				{
					key: "endDate"
				},
				{
					key: "financeType"
				}
			],
			initUrl  : "/ams/transferData/initTransafer",
			submitUrl: "/ams/transferData/transferDataERP",
			validatorFunc: {
				endDate: {
					validator: [ValidatorHelper.isNotEmpty, ValidatorHelper.calendarMonFormat]
				}
			},
			errorTheads:["序号", "资产编号", "表名", "总账时间", "错误信息", "错误时间"]
		},
		transfer: {
			list     : [
				{
					key: "endDate"
				},
				{
					key: "financeType"
				}
			],
			initUrl  : "/ams/queryTaxScrap/initQueryTax",
			submitUrl: "/ams/transferData/transferDataTaxScrap",
			validatorFunc: {
				endDate: {
					validator: [ValidatorHelper.isNotEmpty, ValidatorHelper.calendarMonFormat]
				}
			}
		}
	}
});