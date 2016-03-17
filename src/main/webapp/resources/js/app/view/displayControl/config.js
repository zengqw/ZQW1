/**
 * config.js
 * @autoor zq
 * Created by 2015-12-15 10:15
 */
define(["common/validatorHelper"], function (ValidatorHelper) {
	return {
			list     : [
				{
					key: "methodName"
				}
			],
			initUrl  : "/ams/displayControl/displayNameList",
			submitUrl: "/ams/displayControl/modifyDisplayCtrl",
			validatorFunc: {
				methodName: {
					validator: [ValidatorHelper.isNotEmpty]
				}
			},
		}
});