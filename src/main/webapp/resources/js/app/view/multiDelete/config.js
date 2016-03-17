/**
 * config.js
 * @autoor zq
 * Created by 2015-12-15 10:15
 */
define(["common/validatorHelper"], function (ValidatorHelper) {
	return {
		list     : [
			{
				label:"资产编号",
				key: "assetSns",
				type: "textarea",
				required:true,
				value:"",
				placeHolder:"输入资产编号.多个资产编号用逗号','分割"
			}
		],
		submitUrl: "/ams/deleteEquip/batchDeleteAsset",
		validatorFunc: {
			assetSns: {
				validator: [ValidatorHelper.isNotEmpty]
			}
		}
	}
});