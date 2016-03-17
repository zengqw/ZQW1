/**
 * config.js
 * @autoor zq
 * Created by 2015-10-10 10:15
 */
define([], function () {
    return {
        list     : [
            {
                key : "assetsSn",
                type: "text"
            },
            {
                key : "typeAll",
                type: "text"
            },
            {
                key  : "assetsCompany",
                type : "select",
                trans: function (item) {
                    return {
                        text : item.name,
                        value: item.value
                    }
                }
            },
            {
                key : "confProvider",
                type: "text"
            },
            {
                key  : "confBrand",
                type : "select",
                trans: function (item) {
                    return {
                        text : item.name,
                        value: item.id
                    }
                }
            },
            {
                key : "confType",
                type: "select-ajax-effect",
            },
            {
                key : "confModel",
                type: "select"
            },
            {
                key : "confRaid",
                type: "text"
            },
            {
                key  : "confText",
                type : "select",
                trans: function (item) {
                    return {
                        text : item.equipName,
                        value: item.equipType
                    }
                }
            },
            {
                key : "otherDescribe",
                type: "text"
            },
            {
                key : "financePrice",
                type: "text"
            },
            {
                key : "orderSn",
                type: "text"
            },
            {
                key : "systemSn",
                type: "text"
            },
            {
                key : "financeCompactSn",
                type: "text"
            },
            {
                key : "financeVoucherSn",
                type: "text"
            },
            {
                key : "financeCheckerSn",
                type: "text"
            },
            {
                key : "realPrice",
                type: "text"
            },
            {
                key : "confStandby2",
                type: "text"
            },
            {
                key : "financeBuyDate",
                type: "date"
            },
            {
                key : "financePayDate",
                type: "date"
            },
            {
                key : "standby1",
                type: "date"
            },
            {
                key : "financeUsageCode",
                type: "text"
            },
            {
                key   : "useAssetsUse",
                type  : "select",
                extend: "search",
                trans : function (item) {
                    return {
                        text : item.name,
                        value: item.sn
                    }
                }
            },
            {
                key  : "productCode",
                type : "select",
                trans: function (item) {
                    return {
                        text : item.text,
                        value: item.value
                    }
                }
            },
            {
                key : "useComments",
                type: "text"
            },
            {
                key : "useUser",
                type: "text"
            },
            {
                key   : "employeeCode",
                type  : "text",
                extend: "search"
            },
            {
                key : "email",
                type: "text"
            },
            {
                key : "osName",
                type: "text"
            },
            {
                key : "osOperator",
                type: "text"
            },
            {
                key  : "locationPlace",
                type : "select",
                trans: function (item) {
                    return {
                        text : item.name,
                        value: item.id
                    }
                }
            },
            {
                key : "locationRoomName",
                type: "select-ajax"
            },
            {
                key : "locationColName",
                type: "select-ajax"
            },
            {
                key  : "locationTank",
                type : "select",
                trans: function (item) {
                    return {
                        text : item.name,
                        value: item.id
                    }
                }
            },
            {
                key : "repairNumber",
                type: "text"
            },
            {
                key : "eventDescription",
                type: "text"
            },
            {
                key : "badAccessory",
                type: "text"
            },
            {
                key : "badPartSn",
                type: "text"
            },
            {
                key : "badItemPostion",
                type: "text"
            },
            {
                key : "malfunctionDescription",
                type: "text"
            },
            {
                key : "malfunctionReporter",
                type: "text"
            },
            {
                key : "productContactor",
                type: "text"
            },
            {
                key : "locationBladeBoxNo",
                type: "select-ajax"
            },
            {
                key : "locationBladeNo",
                type: "select-ajax"
            },
            {
                key    : "isHight",
                type   : "select",
                options: [
                    {
                        text : "是",
                        value: "Y"
                    },
                    {
                        text : "否",
                        value: "N"
                    }

                ]
            },
            {
                key : "locationOutIp",
                type: "text"
            },
            {
                key : "locationInIp",
                type: "text"
            },
            {
                key : "locationMngIp",
                type: "text"
            },
            {
                key : "locationUsage",
                type: "text"
            },
            {
                key  : "status",
                type : "select",
                trans: function (item) {
                    return {
                        text : item,
                        value: item
                    }
                }
            },
            {
                key  : "assetsStatus",
                type : "select",
                trans: function (item) {
                    return {
                        text : item,
                        value: item
                    }
                }
            },
            {
                key : "repairDate",
                type: "date"
            },
            {
                key  : "confCdrom",
                type : "select",
                trans: function (item) {
                    return {
                        text : item,
                        value: item
                    }
                }
            },
            {
                key  : "confCpu",
                type : "select",
                trans: function (item) {
                    return {
                        text : item,
                        value: item
                    }
                }
            },
            {
                key  : "confDisplay",
                type : "select",
                trans: function (item) {
                    return {
                        text : item,
                        value: item
                    }
                }
            },
            {
                key  : "confHarddisk",
                type : "select",
                trans: function (item) {
                    return {
                        text : item,
                        value: item
                    }
                }
            },
            {
                key  : "confMem",
                type : "select",
                trans: function (item) {
                    return {
                        text : item,
                        value: item
                    }
                }
            },
            {
                key  : "confNetcard",
                type : "select",
                trans: function (item) {
                    return {
                        text : item,
                        value: item
                    }
                }
            },
            {
                key  : "confSound",
                type : "select",
                trans: function (item) {
                    return {
                        text : item,
                        value: item
                    }
                }
            },
            {
                key : "confStandby1",
                type: "text"
            },
            {
                key  : "standby2",
                type : "select",
                trans: function (item) {
                    return {
                        text : item,
                        value: item
                    }
                }
            },
            {
                key : "standby3",
                type: "text"
            },
            {
                key : "abandonDate",
                type: "date"
            },
            {
                key : "proceeds",
                type: "text"
            },
            {
                key : "abandonResean",
                type: "text"
            },
            {
                key : "confStandby3",
                type: "text"
            },
            {
                key : "upSwitchIn",
                type: "text"
            },
            {
                key : "upSwitchInPort",
                type: "text"
            },
            {
                key : "upSwitchOut",
                type: "text"
            },
            {
                key : "upSwitchOutPort",
                type: "text"
            },
            {
                key : "financeUseMonth",
                type: "text"
            },
            {
                key : "prcFinanceUseMonth",
                type: "text"
            },
            {
                key : "taxScrapDate",
                type: "date"
            },
            {
                key : "taxStatus",
                type: "text"
            },
            {
                key : "prcFinancePrice",
                type: "text"
            },
            {
                key : "prcScrapRate",
                type: "text"
            },
            {
                key : "naConfCpu",
                type: "text"
            },
            {
                key : "naConfMem",
                type: "text"
            },
            {
                key   : "naConfHardDiskType1",
                type  : "select",
                extend: "add",
                trans : function (item) {
                    return {
                        text : item,
                        value: item
                    }
                }
            },
            {
                key   : "naConfHardDiskCap1",
                type  : "select",
                extend: "add",
                trans : function (item) {
                    return {
                        text : item,
                        value: item
                    }
                }
            },
            {
                key   : "naConfHardDiskNum1",
                type  : "select",
                extend: "add",
                trans : function (item) {
                    return {
                        text : item,
                        value: item
                    }
                }
            },
            {
                key   : "naConfHardDiskType2",
                type  : "select",
                extend: "add",
                trans : function (item) {
                    return {
                        text : item,
                        value: item
                    }
                }
            },
            {
                key   : "naConfHardDiskCap2",
                type  : "select",
                extend: "add",
                trans : function (item) {
                    return {
                        text : item,
                        value: item
                    }
                }
            },
            {
                key   : "naConfHardDiskNum2",
                type  : "select",
                extend: "add",
                trans : function (item) {
                    return {
                        text : item,
                        value: item
                    }
                }
            },
            {
                key : "naConfNetCard",
                type: "text"
            },
            {
                key : "naConfRaid",
                type: "text"
            },
            {
                key : "naConfServerTag",
                type: "text"
            },
            {
                key : "naConfOther",
                type: "text"
            }
        ],
        listGroup: [
            {
                text    : '资产信息',
                color   : '#ef6117',
                children: [
                    {
                        key : "assetsSn",
                        type: "text"
                    },
                    {
                        key : "typeAll",
                        type: "text"
                    },
                    {
                        key : "assetsCompany",
                        type: "select"
                    }
                ]
            },
            {
                text    : '配置',
                color   : '#009fe6',
                children: [
                    {
                        key : "confProvider",
                        type: "text"
                    },
                    {
                        key : "confBrand",
                        type: "select"
                    },
                    {
                        key : "confType",
                        type: "select-ajax-effect",
                    },
                    {
                        key : "confModel",
                        type: "select"
                    },
                    {
                        key : "confRaid",
                        type: "text"
                    },
                    {
                        key : "confText",
                        type: "select"
                    },
                    {
                        key : "confCdrom",
                        type: "select"
                    },
                    {
                        key : "confCpu",
                        type: "select"
                    },
                    {
                        key : "confDisplay",
                        type: "select"
                    },
                    {
                        key : "confHarddisk",
                        type: "select"
                    },
                    {
                        key : "confMem",
                        type: "select"
                    },
                    {
                        key : "confNetcard",
                        type: "select"
                    },
                    {
                        key : "confSound",
                        type: "select"
                    },
                    {
                        key : "confStandby1",
                        type: "text"
                    }
                ]
            },
            {
                text    : '资产描述',
                color   : '#21b170',
                children: [
                    {
                        key : "otherDescribe",
                        type: "text"
                    },
                    {
                        key : "financePrice",
                        type: "text"
                    },
                    {
                        key : "orderSn",
                        type: "text"
                    },
                    {
                        key : "systemSn",
                        type: "text"
                    },
                    {
                        key : "financeCompactSn",
                        type: "text"
                    },
                    {
                        key : "financeVoucherSn",
                        type: "text"
                    },
                    {
                        key : "financeCheckerSn",
                        type: "text"
                    },
                    {
                        key : "realPrice",
                        type: "text"
                    },
                    {
                        key : "confStandby2",
                        type: "text"
                    },
                    {
                        key : "financeBuyDate",
                        type: "date"
                    },
                    {
                        key : "financePayDate",
                        type: "date"
                    },
                    {
                        key : "standby1",
                        type: "date"
                    },
                    {
                        key : "financeUsageCode",
                        type: "text"
                    },
                    {
                        key : "useAssetsUse",
                        type: "select"
                    },
                    {
                        key : "productCode",
                        type: "select"
                    },
                    {
                        key : "standby2",
                        type: "select"
                    },
                    {
                        key : "standby3",
                        type: "text"
                    },
                    {
                        key : "abandonDate",
                        type: "date"
                    },
                    {
                        key : "proceeds",
                        type: "text"
                    },
                    {
                        key : "abandonResean",
                        type: "text"
                    },
                    {
                        key : "confStandby3",
                        type: "text"
                    },
                    {
                        key : "upSwitchIn",
                        type: "text"
                    },
                    {
                        key : "upSwitchInPort",
                        type: "text"
                    },
                    {
                        key : "upSwitchOut",
                        type: "text"
                    },
                    {
                        key : "upSwitchOutPort",
                        type: "text"
                    },
                    {
                        key : "financeUseMonth",
                        type: "text"
                    },
                    {
                        key : "prcFinanceUseMonth",
                        type: "text"
                    },
                    {
                        key : "taxScrapDate",
                        type: "date"
                    },
                    {
                        key : "taxStatus",
                        type: "text"
                    },
                    {
                        key : "prcFinancePrice",
                        type: "text"
                    },
                    {
                        key : "prcScrapRate",
                        type: "text"
                    }
                ]
            },
            {
                text    : '用途',
                color   : '#002d71',
                children: [
                    {
                        key : "useComments",
                        type: "text"
                    },
                    {
                        key : "useUser",
                        type: "text"
                    },
                    {
                        key   : "employeeCode",
                        type  : "text",
                        extend: "search"
                    },
                    {
                        key : "email",
                        type: "text"
                    },
                    {
                        key : "osName",
                        type: "text"
                    },
                    {
                        key : "osOperator",
                        type: "text"
                    }
                ]
            },
            {
                text    : '位置',
                color   : '#8a569e',
                children: [
                    {
                        key : "locationPlace",
                        type: "select"
                    },
                    {
                        key : "locationRoomName",
                        type: "select-ajax"
                    },
                    {
                        key : "locationColName",
                        type: "select-ajax"
                    },
                    {
                        key : "locationTank",
                        type: "select"
                    },
                    {
                        key : "locationBladeBoxNo",
                        type: "select-ajax"
                    },
                    {
                        key : "locationBladeNo",
                        type: "select-ajax"
                    }
                ]
            },
            {
                text    : '状态',
                color   : '#b44245',
                children: [
                    {
                        key : "status",
                        type: "select"
                    },
                    {
                        key : "assetsStatus",
                        type: "select"
                    }
                ]
            },
            {
                text    : '管理',
                color   : '#009e96',
                children: [
                    {
                        key : "isHight",
                        type: "select"
                    },
                    {
                        key : "locationOutIp",
                        type: "text"
                    },
                    {
                        key : "locationInIp",
                        type: "text"
                    },
                    {
                        key : "locationMngIp",
                        type: "text"
                    },
                    {
                        key : "locationUsage",
                        type: "text"
                    },
                    {
                        key : "repairNumber",
                        type: "text"
                    },
                    {
                        key : "eventDescription",
                        type: "text"
                    },
                    {
                        key : "badAccessory",
                        type: "text"
                    },
                    {
                        key : "badPartSn",
                        type: "text"
                    },
                    {
                        key : "badItemPostion",
                        type: "text"
                    },
                    {
                        key : "malfunctionDescription",
                        type: "text"
                    },
                    {
                        key : "malfunctionReporter",
                        type: "text"
                    },

                    {
                        key : "productContactor",
                        type: "text"
                    },
                    {
                        key : "repairDate",
                        type: "date"
                    }
                ]
            },
            {
                text    : 'NA-配置',
                color   : '#4089c7',
                children: [
                    {
                        key : "naConfCpu",
                        type: "text"
                    },
                    {
                        key : "naConfMem",
                        type: "text"
                    },
                    {
                        key : "naConfHardDiskType1",
                        type: "select"
                    },
                    {
                        key : "naConfHardDiskCap1",
                        type: "select"
                    },
                    {
                        key : "naConfHardDiskNum1",
                        type: "select"
                    },
                    {
                        key : "naConfHardDiskType2",
                        type: "select"
                    },
                    {
                        key : "naConfHardDiskCap2",
                        type: "select"
                    },
                    {
                        key : "naConfHardDiskNum2",
                        type: "select"
                    },
                    {
                        key : "naConfNetCard",
                        type: "text"
                    },
                    {
                        key : "naConfRaid",
                        type: "text"
                    },
                    {
                        key : "naConfServerTag",
                        type: "text"
                    },
                    {
                        key : "naConfOther",
                        type: "text"
                    }
                ]
            }
        ]
    }

});