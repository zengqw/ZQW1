/**
 * @info   : 导航权限配置
 * @author : zq
 * @date   : 2016-1-4
 **/
define([], function() {

	return [
		{
			id: 01,
			text:"资产登记",
			hash: "equipManage",
			autoMenu:true,   //动态获取的权限
			children:[
				{
					text: "服务器或盘阵",
					hash: "serverDisk"
				},
				{
					text: "服务器配件",
					hash: "serverParts"
				},
				{
					text: "台式机",
					hash: "desktop"
				},
				{
					text: "笔记本",
					hash: "computer"
				},
				{
					text: "显示器",
					hash: "display"
				},
				{
					text: "打印机",
					hash: "printer"
				},
				{
					text: "传真机",
					hash: "fax"
				},
				{
					text: "网络设备",
					hash: "netEquip"
				},
				{
					text: "IT办公设备",
					hash: "officeEquip"
				},
				{
					text: "软件",
					hash: "soft"
				},
				{
					text: "其他IT设备",
					hash: "otherIt"
				},
				{
					text: "手机",
					hash: "cellPhone"
				},
				{
					text: "空调",
					hash: "airCondition"
				},
				{
					text: "家电",
					hash: "houseEletrics"
				},
				{
					text: "汽车",
					hash: "car"
				},
				{
					text: "手写板",
					hash: "writingPad"
				},
				{
					text: "行政办公设备",
					hash: "adminEquip"
				},
				{
					text: "装修",
					hash: "fitment"
				},
				{
					text: "房屋建筑物",
					hash: "buildings"
				},
				{
					text: "IT服务器或盘阵",
					hash: "itServerDisk"
				},
				{
					text: "游戏部电子产品",
					hash: "gameEletrics"
				},
				{
					text: "经营性租入固定资产改良",
					hash: "businessAssets"
				},
				{
					text: "投影仪",
					hash: "projector"
				},
				{
					text: "电视机",
					hash: "tv"
				},
				{
					text: "机器设备",
					hash: "machine"
				}
			]
		},
		{
			id: 02,
			text:"批量导入",
			hash: "multiImport"
		},
		{
			id: 03,
			text: "资产查询",
			hash: "equipSearch",
		},
		{
			id: 04,
			text: "批量查询",
			hash: "multiSearch",
		},
		{
			id: 05,
			text: "批量修改",
			hash: "multiModify",
		},
		{
			id: 06,
			text: "显示控制",
			hash: "displayControl",
		},
		{
			id: 07,
			text: "属性管理",
			hash: "propertyManage",
			autoMenu:true,   //动态获取的权限
			children:[
				{
					text: "机柜刀框刀片配置管理",
					hash: "tank",
					url: "getTlankConfig"
				},
				{
					text: "网管部资产配置管理",
					hash: "network",
					url: "getPCConfigList"
				},
				{
					text: "地点管理",
					hash: "address",
					url: "getLocationList"
				},
				{
					text: "配置详细信息管理",
					hash: "detail",
					url: "getConfigDetailList"
				},
				{
					text: "产品段管理",
					hash: "product",
					url: "getProductCodeList"
				},
				{
					text: "折旧参数管理",
					hash: "parameter",
					url: "equipType"
				},
				{
					text: "服务器配置管理",
					hash: "server",
					url: "getConfigList"
				},
				{
					text: "公司管理",
					hash: "company",
					url: "getCompanyList"
				},
				{
					text: "用途管理",
					hash: "usage",
					url: "getUsageList"
				},
				{
					text: "IT资产配置管理",
					hash: "it",
					url: "getITConfigList"
				}
			]
		},
		{
			id: 08,
			text: "属性查看",
			hash: "propertyView",
		},
		{
			id: 09,
			text: "批量删除",
			hash: "multiDelete",
		},
		{
			id: 10,
			text:"资产审核",
			hash: "assetsVerify"
		},
		{
			id: 11,
			text:"资产统计",
			hash: "equipStat",
			children:[
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
				}
				,
				{
					text: "换货资产统计",
					hash: "exchange",
					value:"8"
				},
				{
					text: "折旧差异统计",
					hash: "depdiff",
					value:"9"
				}
				,
				{
					text: "固定资产净值统计",
					hash: "fixnet",
					value:"10"
				}
				,
				{
					text: "资产折旧查询",
					hash: "depsearch",
					value:"11"
				}
			]
		},
		{
			id: 12,
			text:"日志查询",
			hash: "logSearch",
			children:[
				{
					text: "时间段查询",
					hash: "in"
				},
				{
					text: "截至日期查询",
					hash: "end"
				}
			]
		},
		{
			id: 13,
			text:"用户管理",
			hash: "userManage",
			subMenuConfigs : [{                    //二级导航子类目配置
				menu  : 'queryuser',
				child : 'modifyuser',
				text  : '修改用户信息',
				href  : "#userManage/modifyuser"
			},{
				menu  : 'queryrole',
				child : 'viewrole',
				text  : '查看角色',
				href  : "#userManage/viewrole"
			}],
			children:[
				{
					text: "查询用户",
					hash: "queryuser"
				},
				{
					text: "添加用户",
					hash: "adduser"
				},
				{
					text: "查询角色",
					hash: "queryrole"
				},
				{
					text: "添加角色",
					hash: "addrole"
				},
				{
					text: "配置成本中心的显示",
					hash: "config"
				},
				{
					text: "重新加载系统配置",
					hash: "reload"
				}
			]
		},
		{
			id: 14,
			text:"模板下载",
			hash: "tmpDownload",
		},
		{
			id: 15,
			text:"手动折旧",
			hash: "manuDep",
		},
		{
			id: 16,
			text:"盘点标识",
			hash: "checkMark",
		},
		{
			id: 17,
			text:"盘点管理",
			hash: "checkManage",
			children:[
				{
					text: "盘点查询",
					hash: "search"
				},
				{
					text: "盘点设置",
					hash: "setting"
				}
			]
		},
		{
			id: 18,
			text:"会计期管理",
			hash: "accMonManage",
			children:[
				{
					text: "查询会计期",
					hash: "search"
				},
				{
					text: "结转会计期",
					hash: "forward"
				}
			]
		},
		{
			id: 19,
			text:"数据导出",
			hash: "dataTransfer",
			children:[
				{
					text: "导出总账到ERP",
					hash: "ledger"
				},
				{
					text: "资产税务报废导入ERP",
					hash: "transfer"
				}
			]
		},
		{
			id: 80,
			text:"资产修改",
			hash: "assetModify",
		},
		{
			id: 81,
			text:"资产删除",
			hash: "assetDelete",
		},
		{
			id: 82,
			text:"导出查询",
			hash: "exportSearch",
		},
		{
			id: 83,
			text:"导出PDF",
			hash: "exportPdf",
		},
		{
			id: 84,
			text:"导出统计结果",
			hash: "exportStaResult",
		},
		{
			id: 85,
			text:" 查看资产日志",
			hash: "ViewAssetsLog",
		},
		{
			id: 86,
			text:"转移此项资产",
			hash: "transferAssets",
		},
		{
			id: 87,
			text:"税务报废",
			hash: "taxScrap",
			children:[
				{
					text: "税务报废处理",
					hash: "deal"
				},
				{
					text: "已税务报废资产查询",
					hash: "scraped"
				}
			]
		},
		{
			id: 88,
			text:"折旧统计",
			hash: "dpcStats",
			children:[
				{
					text: "资产净值明细-RPC",
					hash: "nbvprc"
				},
				{
					text: "资产净值明细-US",
					hash: "nbvus"
				},
				{
					text: "资产净值差异明细",
					hash: "nbvdiff"
				},
				{
					text: "资产净值差异汇总",
					hash: "nbvsum"
				},
				{
					text: "资产折旧明细-PRC",
					hash: "depprc"
				},
				{
					text: "资产折旧明细-US",
					hash: "depus"
				},
				{
					text: "资产折旧差异明细",
					hash: "depdiff"
				},
				{
					text: "资产折旧差异汇总",
					hash: "depsum"
				}
			]
		},
		{
			id: 89,
			text:"重新折旧",
			hash: "depAgain",
		},
		{
			id: 90,
			text:"系统帮助",
			hash: "help",
			children:[
				{
					text: "资产登记",
					hash: "assetRegist"
				},
				{
					text: "资产查询",
					hash: "queryAsset"
				},
				{
					text: "修改资产",
					hash: "modifyAsset"
				},
				{
					text: "删除资产",
					hash: "deleteAsset"
				},
				{
					text: "查看服务器历史记录",
					hash: "viewHistory"
				},
				{
					text: "批量查询",
					hash: "bachQuery"
				},
				{
					text: "批量修改",
					hash: "batchModify"
				},
				{
					text: "批量导入",
					hash: "importData"
				},
				{
					text: "显示控制",
					hash: "displayCtrl"
				},
				{
					text: "资产统计",
					hash: "assetSatistic"
				}
			]
		},
		{
			id: 91,
			text:"修改密码",
			hash: "password"
		},
		{
			id: 92,
			text:"退出系统",
			hash: "logout"
		}
	];

});