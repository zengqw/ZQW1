/**
 * config.js
 * @autoor zq
 * Created by 2015-12-15 10:15
 */
define(['common/validatorHelper'], function (ValidatorHelper) {
	return {
		menus: [
			{
				text: "累计折旧统计",
				hash: "accdep",
				value:"0"
			},
			{
				text: "新增资产统计",
				hash: "addition",
				value:"1"
			},
			{
				text: "报废资产统计",
				hash: "scrap",
				value:"2"
			},
			{
				text: "资产盈亏统计",
				hash: "proloss",
				value:"3"
			},
			{
				text: "资产折旧统计",
				hash: "assetdep",
				value:"4"
			},
			{
				text: "累计折旧预测统计",
				hash: "deprec",
				value:"5"
			},
			{
				text: "固定资产预测表统计",
				hash: "fixfore",
				value:"6"
			},
			{
				text: "资产转移统计",
				hash: "transfer",
				value:"7"
			},
			{
				text: "换货资产统计",
				hash: "exchange",
				value:"8"
			},
			//{
			//	text: "原值追加统计",
			//	hash: "source",
			//	value:"9"
			//},
			{
				text: "折旧差异统计",
				hash: "depdiff",
				value:"10"
			}
			,
			{
				text: "固定资产净值统计",
				hash: "fixnet",
				value:"11"
			}
			,
			{
				text: "资产折旧查询",
				hash: "depsearch",
				value:"12"
			}
		],
		accdep : {
			list         : [
				{
					key: "companyIds"
				},
				{
					key: "abandon"
				},
				{
					key: "isS"
				},
				{
					key: "depreciateType"
				},
				{
					key: "neteaseProduct"
				},
				{
					key: "typeCode"
				},
				{
					key: "beginDate"
				},
				{
					key: "endDate"
				}
			],
			keyConfigs:[
				{
					text: "编码",
					key : "financeCode",
					fixed: true
				},
				{
					text: "总数",
					key:"total"
				},
				{
					text: "累计折旧额",
					key:"financePrice"
				}
			],
			validatorFunc: {
				companyIds: {
					validator: [ValidatorHelper.isNotEmpty],
				},
				neteaseProduct: {
					validator: [ValidatorHelper.isNotEmpty],
				},
				beginDate: {
					validator: [ValidatorHelper.calendarMonFormat],
				},
				endDate  : {
					validator: [ValidatorHelper.calendarMonFormat],
				},
				typeCode: {
					validator: [ValidatorHelper.isNotEmpty],
				}
			},
			initUrl      : "/ams/statictis/initStatics",
			fetchUrl     : "/ams/statictis/statictisDepAsset"
		},
		addition : {
			list         : [
				{
					key: "companyIds"
				},
				{
					key: "abandon"
				},
				{
					key: "isS"
				},
				{
					key: "depreciateType"
				},
				{
					key: "typeCode"
				},
				{
					key: "beginDate"
				},
				{
					key: "endDate"
				}
			],
			keyConfigs:[
				{
					text: "编码",
					key : "financeCode",
					fixed: true
				},
				{
					text: "总数",
					key:"total"
				},
				{
					text: "累计折旧额",
					key:"financePrice"
				}
			],
			validatorFunc: {
				companyIds: {
					validator: [ValidatorHelper.isNotEmpty],
				},
				beginDate: {
					validator: [ValidatorHelper.calendarMonFormat],
				},
				endDate  : {
					validator: [ValidatorHelper.calendarMonFormat],
				},
				typeCode: {
					validator: [ValidatorHelper.isNotEmpty],
				}
			},
			initUrl      : "/ams/statictis/initStatics",
			fetchUrl     : "/ams/statictis/statictisNewAsset"
		},
		scrap : {
			list         : [
				{
					key: "companyIds"
				},
				{
					key: "depreciateType"
				},
				{
					key: "bfType"
				},
				{
					key: "typeCode"
				},
				{
					key: "beginDate"
				},
				{
					key: "endDate"
				}
			],
			keyConfigs:[
				{
					text: "编码",
					key : "financeCode",
					fixed: true
				},
				{
					text: "财务编号",
					key:"total"
				},
				{
					text: "总数",
					key:"total"
				},
				{
					text: "原值",
					key:"financePrice"
				},
				{
					text: "已提折旧",
					key:"depreciation"
				},
				{
					text: "残值和未折旧",
					key:"noDepreciate"
				},
				{
					text: "收益",
					key:"proceeds"
				}
			],
			validatorFunc: {
				companyIds: {
					validator: [ValidatorHelper.isNotEmpty],
				},
				beginDate: {
					validator: [ValidatorHelper.calendarMonFormat],
				},
				endDate  : {
					validator: [ValidatorHelper.calendarMonFormat],
				},
				typeCode: {
					validator: [ValidatorHelper.isNotEmpty],
				}
			},
			initUrl      : "/ams/statictis/initStatics",
			fetchUrl     : "/ams/statictis/assetAbandonStatictis"
		},
		proloss : {
			list         : [
				{
					key: "companyIds"
				},
				{
					key: "abandon"
				},
				{
					key: "isS"
				},
				{
					key: "typeCode"
				},
				{
					key: "beginDate"
				},
				{
					key: "endDate"
				}
			],
			keys :[
				{
					text: "财务编号",
					key:"assetsSn",
					fixed: true
				},
				{
					text: "资产名称",
					key:"typeName"
				},
				{
					text: "资产价格",
					key:"financePrice"
				},
				{
					text: "资产收益",
					key:"proceeds"
				},
				{
					text: "资产累计折旧",
					key:"depreciations"
				},
				{
					text: "资产净值",
					key:"netWorthPrice"
				},
				{
					text: "资产盈(亏)净值",
					key:"payOffPrice"
				}
			],
			needIndex: true,
			uId: "assetsSn",
			validatorFunc: {
				companyIds: {
					validator: [ValidatorHelper.isNotEmpty],
				},
				beginDate: {
					validator: [ValidatorHelper.calendarMonFormat],
				},
				endDate  : {
					validator: [ValidatorHelper.calendarMonFormat],
				},
				typeCode: {
					validator: [ValidatorHelper.isNotEmpty]
				}
			},
			initUrl      : "/ams/statictis/initStatics",
			fetchUrl     : "/ams/statictis/statisticPayOff"
		},
		assetdep : {
			list         : [
				{
					key: "depreciateType"
				},
				{
					key: "assetSns",
					placeHolder:"输入资产编号.多个资产编号用逗号','分割"
				}
			],
			keys:[
				{
					key :"assetsSn",
					text:  "资产编号",
					fixed:true
				},
				{
					key :"abandondate",

					text:  "报废日期"
				},
				{
					key :"abandonresean",
					text:  "报废原因"
				},
				{
					key :"assetsSnCount",
					text:  "已折旧月数"
				},
				{
					key :"companyName",
					text:  "资产所属公司"
				},
				{
					key :"confProvider",
					text:  "配置_供应商"
				},
				{
					key :"confbrand",
					text:  "配置_品牌"
				},
				{
					key :"confcdrom",
					text:  "配置_光驱"
				},
				{
					key :"confcpu",
					text:  "配置_CPU"
				},
				{
					key :"confdisplay",
					text:  "配置_显卡"
				},
				{
					key :"confharddisk",
					text:  "配置_硬盘"
				},
				{
					key :"confmem",
					text:  "配置_内存"
				},
				{
					key :"confmodel",
					text:  "配置_型号"
				},
				{
					key :"confnetcard",
					text:  "配置_网卡"
				},
				{
					key :"confsound",
					text:  "配置_声卡"
				},
				{
					key :"confstandby1",
					text:  "配置_Service Tag"
				},
				{
					key :"conftext",
					text:  "配置_详细信息"
				},
				{
					key :"conftype",
					text:  "配置_类型"
				},
				{
					key :"depreciationSum",
					text:  "累计折旧"
				},
				{
					key :"financeBuyDate",
					text:  "验收日期"
				},
				{
					key :"financeCheckerSn",
					text:  "验收单编号"
				},
				{
					key :"financeCompactSn",
					text:  "合同号"
				},
				{
					key :"financePayDate",
					text:  "入帐日期"
				},
				{
					key :"financePrice",
					text:  "资产价格"
				},
				{
					key :"financeUseMonth",
					text:  "使用月份"
				},
				{
					key :"financeVoucherSn",
					text:  "凭证号"
				},
				{
					key :"financeusagecode",
					text:  "财务编号"
				},
				{
					key :"locationcolname",
					text:  "位置_机列名称"
				},
				{
					key :"locationinip",
					text:  "位置_内网IP"
				},
				{
					key :"locationoutip",
					text:  "位置_外网IP"
				},
				{
					key :"locationplace",
					text:  "位置_机房地点"
				},
				{
					key :"locationroomname",
					text:  "位置_机房名称"
				},
				{
					key :"locationtank",
					text:  "位置_机柜名称"
				},
				{
					key :"locationusage",
					text:  "位置_使用地点"
				},
				{
					key :"netWorthPrice",
					text:  ""
				},
				{
					key :"pRCORUS",
					text:  "资产净值"
				},
				{
					key :"prcScrapRate",
					text:  "残值率"
				},
				{
					key :"proceeds",
					text:  "收益"
				},
				{
					key :"standby1",
					text:  "折旧日期"
				},
				{
					key :"standby2",
					text:  "地点名称"
				},
				{
					key :"standby3",
					text:  "二级部门负责人"
				},
				{
					key :"status",
					text:  "使用状态"
				},
				{
					key :"typeFinance",
					text:  "财务分类"
				},
				{
					key :"typeName",
					text:  "资产名称"
				},
				{
					key :"useassetsuse",
					text:  "用途_资产用途"
				},
				{
					key :"usecomments",
					text:  "用途_用途备注"
				},
				{
					key :"useuser",
					text:  "用途_使用者"
				}
			],
			needIndex: true,
			uId:"assetsSn",
			validatorFunc: {
				assetSns: {
					validator: [ValidatorHelper.isNotEmpty]
				}
			},
			initUrl      : "/ams/statictis/initStatics",
			fetchUrl     : "/ams/statictis/assetDepreciateStatistic"
		},
		deprec : {
			list         : [
				{
					key: "companyIds"
				},
				{
					key: "abandon"
				},
				{
					key: "depreciateType"
				},
				{
					key: "isS"
				},
				{
					key: "typeCode"
				},
				{
					key: "beginDate"
				},
				{
					key: "endDate"
				}
			],
			keyConfigs:[
				{
					text: "编码",
					key : "financeCode",
					fixed: true
				},
				{
					text: "原值",
					key:"financePrice"
				},
				{
					text: "总数",
					key:"total"
				}
			],
			validatorFunc: {
				companyIds: {
					validator: [ValidatorHelper.isNotEmpty],
				},
				beginDate: {
					validator: [ValidatorHelper.calendarMonFormat],
				},
				endDate  : {
					validator: [ValidatorHelper.calendarMonFormat],
				},
				typeCode: {
					validator: [ValidatorHelper.isNotEmpty],
				}
			},
			initUrl      : "/ams/statictis/initStatics",
			fetchUrl     : "/ams/statictis/depForecastStatistic"
		},
		transfer: {
			list         : [
				{
					key: "outCompanyIds"
				},
				{
					key: "inCompanyIds"
				},
				{
					key: "fromSn"
				},
				{
					key: "toSn"
				},
				{
					key: "beginDate"
				},
				{
					key: "endDate"
				}
			],
			keyConfigs:[
				{
					text: "编码",
					key : "financeCode",
					fixed: true
				},
				{
					text: "总数",
					key:"total"
				},
				{
					text: "累计折旧额",
					key:"financePrice"
				}
			],
			validatorFunc: {
				outCompanyIds: {
					validator: [ValidatorHelper.isNotEmpty],
				},
				inCompanyIds: {
					validator: [ValidatorHelper.isNotEmpty]
				},
				fromSn: {
					validator: [ValidatorHelper.isNotEmpty],
				},
				toSn: {
					validator: [ValidatorHelper.isNotEmpty]
				},
				beginDate: {
					validator: [ValidatorHelper.calendarMonFormat],
				},
				endDate  : {
					validator: [ValidatorHelper.calendarMonFormat],
				}
			},
			initUrl      : "/ams/statictis/initStatics",
			fetchUrl     : "/ams/statictis/statisticTransfer"
		},
		exchange : {
			list         : [
				{
					key: "companyIds"
				},
				{
					key: "abandon"
				},
				{
					key: "isS"
				},
				{
					key: "depreciateType"
				},
				{
					key: "typeCode"
				},
				{
					key: "beginDate"
				},
				{
					key: "endDate"
				}
			],
			keyConfigs:[
				{
					text: "编码",
					key : "financeCode",
					fixed: true
				},
				{
					text: "总数",
					key:"total"
				},
				{
					text: "累计折旧额",
					key:"financePrice"
				}
			],
			validatorFunc: {
				companyIds: {
					validator: [ValidatorHelper.isNotEmpty],
				},
				beginDate: {
					validator: [ValidatorHelper.calendarMonFormat],
				},
				endDate  : {
					validator: [ValidatorHelper.calendarMonFormat],
				},
				typeCode: {
					validator: [ValidatorHelper.isNotEmpty],
				}
			},
			initUrl      : "/ams/statictis/initStatics",
			fetchUrl     : "/ams/statictis/statisticChangedAsset"
		},
		fixfore : {
			list         : [
				{
					key: "companyIds"
				},
				{
					key: "typeCode"
				},
				{
					key: "zqzjTime1"
				},
				{
					key: "zqzjTime2"
				},
				{
					key: "deathLineTime"
				}
			],
			keyConfigs:[
				{
					text: "编码",
					key : "financeCode",
					fixed: true
				},
				{
					text: "累计折旧额",
					key:"depreciationPrice"
				},
				{
					text: "USGAAP资产价格",
					key:"financePrice"
				},
				{
					text: " USGAAP资产净值",
					key:"netWorthPrice"
				},
				{
					text: "总数",
					key:"total"
				}
			],
			validatorFunc: {
				companyIds: {
					validator: [ValidatorHelper.isNotEmpty],
				},
				zqzjTime1: {
					validator: [ValidatorHelper.calendarMonFormat],
				},
				zqzjTime2  : {
					validator: [ValidatorHelper.calendarMonFormat],
				},
				deathLineTime: {
					validator: [ValidatorHelper.calendarMonFormat],
				}
			},
			initUrl      : "/ams/statictis/initStatics",
			fetchUrl     : "/ams/statictis/exportAssetStatisticExcel",
			isExport     : true,
		},
		depdiff : {
			list         : [
				{
					key: "companyIds"
				},
				{
					key: "abandon"
				},
				{
					key: "isS"
				},
				{
					key: "typeCode"
				},
				{
					key: "beginDate"
				},
				{
					key: "endDate"
				}
			],
			keyConfigs:[
				{
					text: "编码",
					key : "financeCode",
					fixed: true
				},
				{
					text: "累计折旧额",
					key:"depreciationPrice"
				},
				{
					text: "原值",
					key:"financePrice"
				},
				{
					text: "USGAAP资产净值",
					key:"netWorthPrice"
				},
				{
					text: "总数",
					key:"total"
				}
			],
			validatorFunc: {
				companyIds: {
					validator: [ValidatorHelper.isNotEmpty],
				},
				beginDate: {
					validator: [ValidatorHelper.calendarMonFormat],
				},
				endDate  : {
					validator: [ValidatorHelper.calendarMonFormat],
				},
				typeCode: {
					validator: [ValidatorHelper.isNotEmpty],
				}
			},
			initUrl      : "/ams/statictis/initStatics",
			fetchUrl     : "/ams/statictis/assetDiffStatistic"
		},
		fixnet : {
			list         : [
				{
					key: "companyIds"
				},
				{
					key: "isS"
				},
				{
					key:"depreciateType"
				},
				{
					key: "typeCode"
				},
				{
					key: "billTime"
				}
			],
			keyConfigs:[
				{
					text: "编码",
					key : "financeCode",
					fixed: true
				},
				{
					text: "成本中心名称",
					key : "financeName",
					fixed: true
				},
				{
					text: "累计折旧额",
					key:"depreciationPrice"
				},
				{
					text: "资产总额",
					key:"financePrice"
				},
				{
					text: "资产净值",
					key:"netWorthPrice"
				},
				{
					text: "总数",
					key:"total"
				}
			],
			validatorFunc: {
				companyIds: {
					validator: [ValidatorHelper.isNotEmpty],
				},
				billTime: {
					validator: [ValidatorHelper.calendarMonFormat],
				},
				typeCode: {
					validator: [ValidatorHelper.isNotEmpty]
				}
			},
			initUrl      : "/ams/statictis/initStatics",
			fetchUrl     : "/ams/statictis/statisticNetWorthAsset"
		},
		depsearch : {
			list         : [
				{
					key: "companyIds"
				},
				{
					key: "usageCode"
				},
				{
					key:"abandon"
				},
				{
					key: "isS"
				},
				{
					key: "depreciateType"
				},
				{
					key:"beginDate"
				},
				{
					key:"endDate"
				}
			],
			keys:[
				{
					key :"assetsSn",
					text:  "资产编号",
					fixed:true
				},
				{
					key :"assetype",

					text:  "资产类型"
				},
				{
					key :"company",
					text:  "资产所属公司"
				},
				{
					key :"financPrice",
					text:  "资产价格"
				},
				{
					key :"financeCode",
					text:  "财务编号"
				},
				{
					key :"monthTheme10",
					text:  "2000-02折旧"
				},
				{
					key :"monthTheme10",
					text:  "2000-02折旧"
				},
				{
					key :"monthTheme11",
					text:  "2000-03折旧"
				},
				{
					key :"monthTheme12",
					text:  "2000-04折旧"
				},
				{
					key :"monthTheme13",
					text:  "2000-05折旧"
				},
				{
					key :"monthTheme14",
					text:  "2000-06折旧"
				},
				{
					key :"monthTheme15",
					text:  "2000-07折旧"
				},
				{
					key :"monthTheme16",
					text:  "2000-08折旧"
				},
				{
					key :"monthTheme17",
					text:  "2000-09折旧"
				},
				{
					key :"monthTheme18",
					text:  "2000-10折旧"
				},
				{
					key :"monthTheme19",
					text:  "2000-11折旧"
				},
				{
					key :"monthTheme7",
					text:  "1999-11折旧"
				},
				{
					key :"monthTheme8",
					text:  "1999-12折旧"
				},
				{
					key :"monthTheme9",
					text:  "2000-01折旧"
				},
				{
					key: "sum",
					text:"合计"
				},
				{
					key :"typeFinance",
					text:  "财务分类"
				},
				{
					key: "useAssetsUse",
					text:"用途_资产用途"
				}
			],
			validatorFunc: {
				companyIds: {
					validator: [ValidatorHelper.isNotEmpty],
				},
				beginDate: {
					validator: [ValidatorHelper.calendarMonFormat],
				},
				endDate: {
					validator: [ValidatorHelper.calendarMonFormat],
				},
				typeCode: {
					validator: [ValidatorHelper.isNotEmpty]
				}
			},
			initUrl      : "/ams/statictis/initStatics",
			fetchUrl     : "/ams/statictis/statictisCondictionEquipment"
		}

	}
});