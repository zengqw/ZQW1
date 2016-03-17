/**
 * config.js
 * @autoor zq
 * Created by 2015-12-15 10:15
 */
define(["common/validatorHelper", "common/tool"], function (ValidatorHelper) {
    return {
        shiftList    : [
            {
                disabled: false,
                key     : "newAssetSn",
                label   : "转入资产编号",
                required: false,
                type    : "text",
                value   : ''
            },
            {
                disabled: false,
                key     : "transferDate",
                label   : "转移日期",
                required: false,
                type    : "date",
                value   : new Date().format()
            }
        ],
        extendList   : [
            {
                key      : 'employeeCode',
                extend   : 'search',
                extendUrl: 'equipManage/queryEmployee'
            },
            {
                key      : 'naConfHardDiskType1',
                extend   : 'add',
                extendUrl: 'propertyMng/getPCConfigList?typeCode=009&method=add'
            },
            {
                key      : 'naConfHardDiskCap1',
                extend   : 'add',
                extendUrl: 'propertyMng/getPCConfigList?typeCode=010&method=add'
            },
            {
                key      : 'naConfHardDiskNum1',
                extend   : 'add',
                extendUrl: 'propertyMng/getPCConfigList?typeCode=011&method=add'
            },
            {
                key      : 'naConfHardDiskType2',
                extend   : 'add',
                extendUrl: 'propertyMng/getPCConfigList?typeCode=010&method=add'
            },
            {
                key      : 'naConfHardDiskCap2',
                extend   : 'add',
                extendUrl: 'propertyMng/getPCConfigList?typeCode=013&method=add'
            },
            {
                key      : 'naConfHardDiskNum2',
                extend   : 'add',
                extendUrl: 'propertyMng/getPCConfigList?typeCode=014&method=add'
            }
        ],
        initUrl      : '',
        fetchUrl     : '/ams/modifyAsset/editorAsset',
        saveUrl      : '/ams/modifyAsset/modifySave',
        shiftUrl     : '/ams/modifyAsset/initTransfer',
        validatorFunc: {
            techCheck: {
                validator: [ValidatorHelper.isNotEmpty]
            }
        },
        listGroup    : [
            {
                text    : '资产信息',
                color   : '#ef6117',
                children: [
                    {
                        key: "assetsSn"
                    },
                    {
                        key: "typeAll"
                    },
                    {
                        key: "assetsCompany"
                    }
                ]
            },
            {
                text    : '配置',
                color   : '#009fe6',
                children: [
                    {
                        key: "confProvider"
                    },
                    {
                        key: "confBrand"
                    },
                    {
                        key: "confType"
                    },
                    {
                        key: "confModel"
                    },
                    {
                        key: "confRaid"
                    },
                    {
                        key: "confText"
                    },
                    {
                        key: "confCdrom"
                    },
                    {
                        key: "confCpu"
                    },
                    {
                        key: "confDisplay"
                    },
                    {
                        key: "confHarddisk"
                    },
                    {
                        key: "confMem"
                    },
                    {
                        key: "confNetcard"
                    },
                    {
                        key: "confSound"
                    },
                    {
                        key: "confStandby1"
                    }
                ]
            },
            {
                text    : '资产描述',
                color   : '#21b170',
                children: [
                    {
                        key: "otherDescribe"
                    },
                    {
                        key: "realPrice"
                    },
                    {
                        key: "financePrice"
                    },
                    {
                        key: "confStandby2"
                    },
                    {
                        key: "orderSn"
                    },
                    {
                        key: "systemSn"
                    },
                    {
                        key: "financeCompactSn"
                    },
                    {
                        key: "financeVoucherSn"
                    },
                    {
                        key: "financeCheckerSn"
                    },
                    {
                        key: "financeBuyDate"
                    },
                    {
                        key: "financePayDate"
                    },
                    {
                        key: "standby1"
                    },
                    {
                        key: "financeUsageCode"
                    },
                    {
                        key: "useAssetsUse"
                    },
                    {
                        key: "productCode"
                    },
                    {
                        key: "standby2"
                    },
                    {
                        key: "standby3"
                    },
                    {
                        key: "abandonDate"
                    },
                    {
                        key: "proceeds"
                    },
                    {
                        key: "abandonResean"
                    },
                    {
                        key: "confStandby3"
                    },
                    {
                        key: "upSwitchIn"
                    },
                    {
                        key: "upSwitchInPort"
                    },
                    {
                        key: "upSwitchOut"
                    },
                    {
                        key: "upSwitchOutPort"
                    },
                    {
                        key: "financeUseMonth"
                    },
                    {
                        key: "prcFinanceUseMonth"
                    },
                    {
                        key: "taxScrapDate"
                    },
                    {
                        key: "taxStatus"
                    },
                    {
                        key: "prcFinancePrice"
                    },
                    {
                        key: "prcScrapRate"
                    }
                ]
            },
            {
                text    : '用途',
                color   : '#002d71',
                children: [
                    {
                        key: "useComments"
                    },
                    {
                        key: "useUser"
                    },
                    {
                        key: "employeeCode"
                    },
                    {
                        key: "email"
                    },
                    {
                        key: "osName"
                    },
                    {
                        key: "osOperator"
                    }
                ]
            },
            {
                text    : '位置',
                color   : '#8a569e',
                children: [
                    {
                        key: "locationPlace"
                    },
                    {
                        key: "locationRoomName"
                    },
                    {
                        key: "locationColName"
                    },
                    {
                        key: "locationTank"
                    },
                    {
                        key: "locationBladeBoxNo"
                    },
                    {
                        key: "locationBladeNo"
                    }
                ]
            },
            {
                text    : '状态',
                color   : '#b44245',
                children: [
                    {
                        key: "status"
                    },
                    {
                        key: "assetsStatus"
                    }
                ]
            },
            {
                text    : '管理',
                color   : '#009e96',
                children: [
                    {
                        key: "isHight"
                    },
                    {
                        key: "locationOutIp"
                    },
                    {
                        key: "locationInIp"
                    },
                    {
                        key: "locationMngIp"
                    },
                    {
                        key: "locationUsage"
                    },
                    {
                        key: "repairNumber"
                    },
                    {
                        key: "eventDescription"
                    },
                    {
                        key: "badAccessory"
                    },
                    {
                        key: "badPartSn"
                    },
                    {
                        key: "badItemPostion"
                    },
                    {
                        key: "malfunctionDescription"
                    },
                    {
                        key: "malfunctionReporter"
                    },

                    {
                        key: "productContactor"
                    },
                    {
                        key: "repairDate"
                    }
                ]
            },
            {
                text    : 'NA-配置',
                color   : '#4089c7',
                children: [
                    {
                        key: "naConfCpu"
                    },
                    {
                        key: "naConfMem"
                    },
                    {
                        key: "naConfHardDiskType1"
                    },
                    {
                        key: "naConfHardDiskCap1"
                    },
                    {
                        key: "naConfHardDiskNum1"
                    },
                    {
                        key: "naConfHardDiskType2"
                    },
                    {
                        key: "naConfHardDiskCap2"
                    },
                    {
                        key: "naConfHardDiskNum2"
                    },
                    {
                        key: "naConfNetCard"
                    },
                    {
                        key: "naConfRaid"
                    },
                    {
                        key: "naConfServerTag"
                    },
                    {
                        key: "naConfOther"
                    }
                ]
            }
        ],
        keys         : [
            {
                text : "操作时间",
                key  : "operationTime",
                fixed: true
            },
            {
                text: "操作者",
                key : "operator"
            },
            {
                text: "动作",
                key : "action"
            },
            {
                text: "资产编号",
                key : "assetsSn"
            },
            {
                text: "资产名称",
                key : "typeAll"
            },
            {
                text: "资产所属公司",
                key : "assetsCompany"
            },
            {
                text: "配置_供应商",
                key : "confProvider"
            },
            {
                text: "配置_品牌",
                key : "confBrand"
            },
            {
                text: "配置_类型",
                key : "confType"
            },
            {
                text: "配置_型号",
                key : "confModel",
            },
            {
                text: "配置_相关",
                key : "confRaid"
            },
            {
                text: "配置_详细信息",
                key : "confText"
            },
            {
                text: "资产描述",
                key : "otherDescribe"
            },
            {
                text: "购买价格",
                key : "realPrice"
            },
            {
                text: "入账价格",
                key : "financePrice"
            },
            {
                text: "残值率",
                key : "confStandBy2",
            },
            {
                text: "下单号",
                key : "orderSn"
            },
            {
                text: "合同号",
                key : "financeCompactSn"
            },
            {
                text: "凭证号",
                key : "financeVoucherSn"
            },
            {
                text: "系统序列号",
                key : "systemSn"
            },
            {
                text: "验收单编号",
                key : "financeCheckerSn"
            },
            {
                text: "验收日期",
                key : "financeBuyDate",
            },
            {
                text: "入账日期",
                key : "financePayDate"
            },
            {
                text: "折旧日期",
                key : "standby1"
            },
            {
                text: "财务编号",
                key : "financeUsageCode"
            },
            {
                text: "用途_资产用途",
                key : "useAssetsUse"
            },
            {
                text: "产品名",
                key : "productCode",
            },
            {
                text: "用途备注",
                key : "useComment"
            },
            {
                text: "使用者",
                key : "useUser"
            },
            {
                text: "员工编号",
                key : "employeeCode"
            },
            {
                text: "使用者邮箱",
                key : "email"
            },
            {
                text: "操作系统名称",
                key : "osName"
            },
            {
                text: "操作系统安装人",
                key : "osOperator"
            },
            {
                text: "机房地点",
                key : "locationPlace"
            },
            {
                text: "机房名称",
                key : "locationRoomName"
            },
            {
                text: "机列名称",
                key : "locationColName"
            },
            {
                text: "机柜名称",
                key : "locationTank",
            },
            {
                text: "刀框序号",
                key : "locationBladeBoxNo"
            },
            {
                text: "刀片序号",
                key : "locationBladeBNo"
            },
            {
                text: "是否高亮",
                key : "isHight"
            },
            {
                text: "位置_外网IP",
                key : "locationOutIp"
            },
            {
                text: "位置_内网IP",
                key : "locationInIp",
            },
            {
                text: "管理网IP",
                key : "locationMngIp"
            },
            {
                text: "位置_使用地点",
                key : "locationUsage"
            },
            {
                text: "使用状态",
                key : "status"
            },
            {
                text: "资产状态",
                key : "assetsStatus"
            },
            {
                text: "维修次数",
                key : "repairNumber"
            },
            {
                text: "事件描述",
                key : "eventDescription"
            },
            {
                text: "报修人",
                key : "malfunctionReporter"
            },
            {
                text: "产品联系人",
                key : "productContactor"
            },
            {
                text: "报修的配件(配件号)",
                key : "badAccessory"
            },
            {
                text: "报修的SN号或ST号",
                key : "badPartSn"
            },
            {
                text: "报修物品放置位置",
                key : "badItemPostion"
            },
            {
                text: "报修的故障描述",
                key : "malfunctionDescription"
            },
            {
                text: "上门维修的时间(人员)",
                key : "repairDate"
            },
            {
                text: "配置_光驱",
                key : "confCdrom"
            },
            {
                text: "配置_CPU",
                key : "confCpu",
            },
            {
                text: "配置_显卡",
                key : "confDisplay"
            },
            {
                text: "配置硬盘",
                key : "confHarddisk"
            },
            {
                text: "配置内存",
                key : "confMem"
            },
            {
                text: "配置网卡",
                key : "confNetcard"
            },
            {
                text: "配置声卡",
                key : "confSound",
            },
            {
                text: "配置Service",
                key : "confStandby1"
            },
            {
                text: "地点名称",
                key : "standby2"
            },
            {
                text: "二级部门负责人",
                key : "standby3"
            },
            {
                text: "报废日期",
                key : "abandonDate"
            },
            {
                text: "收益",
                key : "proceeds"
            },
            {
                text: "报废原因",
                key : "abandonResean",
            },
            {
                text: "S类资产",
                key : "confStandby3"
            },
            {
                text: "内网交换机IP",
                key : "upSwitchIn"
            },
            {
                text: "交换机内网端口",
                key : "upSwitchInPort"
            },
            {
                text: "外网交换机IP",
                key : "upSwitchOut",
            },
            {
                text: "交换机外网端口",
                key : "upSwitchOutPort"
            },
            {
                text: "使用月份",
                key : "financeUseMonth",
            },
            {
                text: "PRC使用月份",
                key : "prcFinanceUseMonth"
            },
            {
                text: "PRC残值率",
                key : "prcScrapRate"
            },
            {
                text: "PRC原值",
                key : "prcFinancePrice"
            },
            {
                text: "税务报废状态",
                key : "taxStatus"
            },
            {
                text: "税务报废日期",
                key : "taxScrap"
            },
            {
                text: "NA配置-CPU",
                key : "naConfCpu"
            },
            {
                text: "NA配置-内存",
                key : "naConfMem"
            },
            {
                text: "NA配置-硬盘1型号",
                key : "naConfHardDiskType1"
            },
            {
                text: "NA配置-硬盘1容量",
                key : "naConfHardDiskCap1",
            },
            {
                text: "NA配置-硬盘1数量",
                key : "naConfHardDiskNum1"
            },
            {
                text: "NA配置-硬盘2容量",
                key : "naConfHardDiskCap2"
            },
            {
                text: "NA配置-硬盘2数量",
                key : "naConfHardDiskType2"
            },
            {
                text: "NA配置-网卡",
                key : "naConfNetCard"
            },
            {
                text: "NA配置-raid卡",
                key : "naConfRaid"
            },
            {
                text: "NA配置-ServerTag",
                key : "naConfServerTag"
            },

            {
                text: "NA配置-其它",
                key : "naConfOther"
            }
        ],
        needIndex    : true,
        colorControl : true
    }
});