/**
 * Created by wjjn3481 on 2016/1/12.
 */

define(["common/validatorHelper"], function (ValidatorHelper) {
    return {
        list     : [
            {
                key: 'property'
            },
            {
                key        : 'conditions',
                placeHolder: "请输入查询条件，并用回车或逗号','分隔"
            }
        ],
        initUrl  : '/ams/queryEquip/initBatchQuery',
        fetchUrl : '/ams/batchQuery/batchQuery',
        validatorFunc: {
            property: {
                validator: [ValidatorHelper.isNotEmpty]
            },
            conditions : {
                validator: [ValidatorHelper.isNotEmpty]
            }
        },
        keys     : [
            {
                text : "资产编号",
                key  : "assetsSn",
                fixed: true
            },
            {
                text: "资产名称",
                key : "typeName",
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
                key : "confBrands"
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
                text: "资产描述",
                key : "otherDescribe"
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
                text: "验收单编号",
                key : "financeCheckerSn"
            },
            {
                text: "验收日期",
                key : "financeBuy",
            },
            {
                text: "入账日期",
                key : "financePay"
            },
            {
                text: "折旧日期",
                key : "standby1"
            },
            {
                text: "报废日期",
                key : "abandon"
            },
            {
                text: "报废原因",
                key : "abandonResean",
            },
            {
                text: "收益",
                key : "proceeds"
            },
            {
                text: "财务编号",
                key : "financeUsageCode"
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
                text: "产品名",
                key : "productCode",
            },
            {
                text: "用途_资产用途",
                key : "useAssetsUse"
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
                text: "使用者一级部门名称",
                key : "userDept1",
            },
            {
                text: "使用者二级部门名称",
                key : "userDept2"
            },
            {
                text: "使用者三级部门名称",
                key : "userDept3"
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
                text: "操作系统名称",
                key : "osName",
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
                key : "assetsStatus"
            },
            {
                text: "地点名称",
                key : "standby2"
            },
            {
                text: "二级部门负责人",
                key : "standby3",
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
            ,
            {
                text: "借用者工号",
                key : "borrower_employeeCode"
            },
            {
                text: "借用者姓名",
                key : "borrower_name"
            },
            {
                text: "借用者邮箱",
                key : "borrower_email",
            },
            {
                text: "借用者一级部门",
                key : "borrower_dept1"
            },
            {
                text: "借用者二级部门",
                key : "borrower_dept2"
            },
            {
                text: "借用者三级部门",
                key : "borrower_dept3"
            },
            {
                text: "借用日期",
                key : "borrower"
            },
            {
                text: "应还日期",
                key : "shouldReturn",
            },
            {
                text: "实际归还日期",
                key : "realReturnData"
            }
        ],
        controls : {
            text: "操作",
            btns: [
                {
                    type     : "modify",
                    text     : "修改",
                    className: "u-btn-modify J_modify"
                }
            ]
        },
        uId      : "assetsSn",
        needIndex: true
    }
});