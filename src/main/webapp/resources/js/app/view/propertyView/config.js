/**
 * config.js
 * @autoor zq
 * Created by 2015-12-15 10:15
 */
define(["common/validatorHelper"], function (ValidatorHelper) {
	return {
		list     : [
			{
				key: "locationPlace",
				style: "color: #ff8400; border-color: #ff8400"
			},
			{
				key: "locationRoomName",
				style: "color: #4876FF; border-color: #4876FF"
			},
			{
				key: "locationColName",
				style: "color: #1E1E1E; border-color: #1E1E1E"
			},
			{
				key: "confBrand",
				style: "color: #FF00FF; border-color: #FF00FF"
			},
			{
				key: "confType",
				style: "color: #BCEE68; border-color: #BCEE68"
			},
			{
				key: "useAssetsUse",
				style: "color: #CD0000; border-color: #CD0000"
			},
			{
				key: "company",
				style: "color: #708090; border-color: #708090"
			},
			{
				key: "useStatus",
				style: "color: #76EE00; border-color: #76EE00"
			}
		],
		initUrl  : "/ams/displayPreProperty/display"
	}
});