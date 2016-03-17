/**
 * product
 * @autoor zq
 * Created by 2015-10-29 11:11
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'common/interactiveEvent',
    'common/remote',
    'common/tool',
    './config',
    'common/validator',
    'common/validatorHelper',
    'cxcalendar'
], function ($, _, B, interactiveEvent, Remote, Tool, DataConfig, Validator, ValidatorHelper) {
    return B.View.extend({
        events      : {
            "click .J_confBrand li.ac_selectItem"         : "fetchConfType",              //update conftype base on conf brand
            "click .J_confType li.ac_selectItem"          : "fetchConfModel",             //update confmodel base on conf brand and conf type
            "click .J_confType em"                        : "checkBrandSelected",         //check brand is selected
            "click .J_locationPlace li.ac_selectItem"     : "fetchLocationRoom",          //update location room base on location place
            "click .J_locationRoomName li.ac_selectItem"  : "fetchLocationCol",           //update  location col base on location place and location room
            "click .J_locationRoomName em"                : "checkLocationPlaceSelected", //check location place is selected
            "click .J_locationTank li.ac_selectItem"      : "fetchLocationBox",           //update location box base on location tank
            "click .J_locationBladeBoxNo em"              : "checkLocationTankSelected",  //check brand is selected
            "click .ac_searchWorkload"                    : "registerAssets",
            "click .J_locationBladeBoxNo li.ac_selectItem": "fetchLocationBladeNo",       //update bladeno base on location tank and bladebox
            "click .J_useAssetsUse li.ac_selectItem"      : "fetchProductCode",           //update product code base on assetsusage
            "click .J_productCode em"                     : "checkAssetsUsageSelected",   //check asset usage is selected
            "click .J_add"                                : "add",                        //add to list
            "click .J_select_search"                      : "searchForSelect",            //search results to list
            "click .J_input_search"                       : "searchForInput",             //search results to input
        },
        initialize  : function (options) {
            var self = this;
            this.el = options.el;
            this.assetTypeId = $(".workload-menu a[data-menu=" + options.type + "]").data("id");
            this.transConfig = DataConfig.list;
            this.listGroupConfig = DataConfig.listGroup;

            //渲染模板
            require([options.tpl], function (tpl) {
                self.el.innerHTML = tpl;
                self.cacheDom();
                self.renderModule();
            });
        },
        initPoup    : function () {
            var self = this;
            PoupView = B.View.extend({
                tagName   : 'div',
                className : '',
                id        : '',
                events    : {},
                initialize: function () {
                    Sector = this;
                },
                render    : function (opt) {
                    Sector.el.innerHTML = self.tplPoup;
                    Sector.url = opt.url;
                    Sector.callback = opt.callback;
                    var $sprite = $.sprite({
                        title        : opt.title,
                        width        : 400,
                        height       : 100,
                        move         : true,
                        mask         : true,
                        confirmButton: true,
                        loading      : false,
                        clearButton  : false,
                        onsuccess    : function (obj) {
                            $(obj).empty();
                            $(obj)[0].appendChild(Sector.el);
                        },
                        onconfirm    : function () {
                            var val = $.trim($(Sector.el).find("input").val());
                            if (!$.trim(val)) {
                                $.oaTip("输入内容不能为空", "warning", 2000);
                                return;
                            }
                            Remote({
                                type   : opt.type || "POST",
                                data   : {},
                                url    : Sector.url + val,
                                success: function (r) {
                                    if (r.code == 200) {
                                        Sector.callback(val, r.data);
                                    } else {
                                        $.oaTip(r.msg, "error", 2000);
                                    }
                                    $sprite.remove();
                                    Sector.removeView();
                                }
                            });
                        },
                        onclose      : function () {
                            Sector.removeView();
                        }
                    });
                },
                removeView: function () {
                    poupView = null;
                    PoupView = null;
                }
            });
            this.poupView = new PoupView();
        },
        transData   : function (data) {
            var self = this,
                obj = {},
                newProps = {};
            return _.reduce(data.addEquipProperty, function (ret, prop) {
                obj = _.findWhere(self.transConfig, {key: prop.method_name});
                newProps = {
                    label   : prop.property_name,
                    name    : obj.key,
                    type    : obj.type,
                    required: prop.must == "*" ? true : false,
                    extend  : obj.extend || ""
                };
                switch (obj.type) {
                    case "select":
                        newProps.extendUrl = prop.extendUrl;
                        newProps.options = obj.options ? obj.options : _.map(data[obj.key + "List"], function (item) {
                            return obj.trans(item);
                        });
                        break;
                    case "select-ajax":
                        newProps.options = [];
                        break;
                    case "select-ajax-effect":
                        newProps.effectProperty = prop.effectProperty;
                        newProps.options = [];
                        break;
                    case "text":
                        newProps.extendUrl = prop.extendUrl;
                        break;
                    default :
                        break;
                }
                ret.push(newProps);
                return ret;
            }, []);
        },
        cacheDom    : function () {
            this.$workOperation = $('.workload-operation');
            this.$workSearch = this.$workOperation.find('.workload-search');


            this.tplModule = $("#J_tpl_module").html();
            this.tplSelect = $("#J_tpl_select").html();
            this.tplSelectSn = $("#J_tpl_select_sn").html();
            this.tplPoup = $("#J_tpl_poup").html();
            this.tplAddLi = $("#J_tpl_li").html();
        },
        cacheViewDom: function () {
            this.$confType = $(".J_confType");
            this.$confModel = $(".J_confModel");
            this.$locationRoom = $(".J_locationRoomName");
            this.$locationCol = $(".J_locationColName");
            this.$locationBladeBox = $(".J_locationBladeBoxNo");
            this.$locationBlade = $(".J_locationBladeNo");
            this.$selectedRef = $(".J_selectedRef");
            this.$productCode = $(".J_productCode");
            this.$assetsUsage = $(".J_useAssetsUse");
            this.$useUser = $(".J_useUser");
            this.$useUserEmail = $(".J_email");
            this.$employeeCode = $(".J_employeeCode ");
        },
        bindEvent   : function () {
            var self = this;
            $(".J_calendar").cxCalendar();
            $(".J_input").on("change", self.onChange.bind(self));
            this.initPoup();
        },
        onChange    : function (e) {
            var $target = $(e.target),
                obj = {},
                value = $target.val(),
                key = $target.attr("name");
            obj[key] = value;
            if (this.validate(_.pick(this.validatorFunc, key), obj)) {
                this.showErrorTip(this.validator.getErrorsModel());
            } else {
                this.hideErrorTip(key);
            }

            if ('useAssetsUse' === key) {
                $target.val(_.find(this.cacheData.useAssetsUseList, function (item, index) {
                    return item.sn === value;
                }).name);
                $('input[name="financeUsageCode"]').val(value);
            }
        },
        renderModule : function () {
            var self = this,
                _html;
            Remote({
                type   : "GET",
                data   : {
                    assetTypeId: this.assetTypeId
                },
                url    : "equipManage/initAddEquip",
                success: function (r) {
                    if (r.code == 200) {
                        var data = self.transData(r.data);
                        var dataGroup = self.makeGroup(self.listGroupConfig, data);
                        self.cacheData = r.result.data;
                        _html = _.template(self.tplModule)({dataGroup: dataGroup});
                        self.$workSearch.html(_html);

                        //缓存模板渲染后的DOM节点
                        self.cacheViewDom();

                        self.bindEvent();
                    } else {
                        $.oaTip(r.msg, "error", 2000);
                    }
                }
            });

        },

        makeGroup: function (listGroup, data) {
            var children;
            _.each(listGroup, function (item, index) {
                children = [];
                _.each(item.children, function (itemChild, index) {
                    _.each(data, function (itemData, index) {
                        if (itemChild.key === itemData.name) {
                            _.extend(itemData, itemChild);
                            children.push(itemData)
                        }
                    });
                });
                item.children = children;
            });

            return listGroup
        },

        fetchConfType             : function (e) {
            var self = this,
                _ul;
            this.curConfBrandId = $(e.target).attr("val");

            //reset conf type and model
            this.resetProps(["confType", "confModel"]);

            //reset selectedRef
            this.toggleShowSelectedRef("");
            Remote({
                type   : "POST",
                data   : {
                    brandid: this.curConfBrandId,
                    method : "query"
                },
                url    : "propertyMng/getConfigList",
                success: function (r) {
                    if (r.code == 200) {
                        _ul = _.template(self.tplSelect)(r.data);
                        self.$confType.find("ul").html(_ul);
                    } else {
                        $.oaTip(r.msg, "error", 2000);
                    }
                }
            });
        },
        fetchConfModel            : function (e) {
            var self = this,
                $target = $(e.target),
                _ul;
            this.curConfTypeId = $target.attr("val");

            //reset conf model
            this.resetProps(["confModel"]);

            //update SelectedRef view status
            this.toggleShowSelectedRef($target.text());
            Remote({
                type   : "POST",
                data   : {
                    brandid: this.curConfBrandId,
                    typeid : this.curConfTypeId,
                    method : "query"
                },
                url    : "propertyMng/getConfigList",
                success: function (r) {
                    if (r.code == 200) {
                        _ul = _.template(self.tplSelect)(r.data);
                        self.$confModel.find("ul").html(_ul);

                    } else {
                        $.oaTip(r.msg, "error", 2000);
                    }
                }
            });
        },
        toggleShowSelectedRef     : function (text) {
            if (["磁盘阵列", "服务器"].indexOf(text) > -1) {
                this.$selectedRef.removeClass("hide");
                this.$selectedRef.find("dt").text("磁盘阵列" == text ? "服务器：" : "磁盘阵列：");
            } else {
                this.$selectedRef.addClass("hide");
                this.$selectedRef.find("textarea").val("");
            }

        },
        checkBrandSelected        : function () {
            if (!this.curConfBrandId) {
                $.oaTip("请先选择配置_品牌", "warning", 2000);
            }
        },
        fetchLocationRoom         : function (e) {
            var self = this,
                _ul;
            this.curLoactionPlaceId = $(e.target).attr("val");

            //reset conf type and model
            this.resetProps(["locationRoom", "locationCol"]);

            Remote({
                type   : "POST",
                data   : {
                    placeid: this.curLoactionPlaceId,
                    method : "query"
                },
                url    : "propertyMng/getLocationList",
                success: function (r) {
                    if (r.code == 200) {
                        _ul = _.template(self.tplSelect)(r.data);
                        self.$locationRoom.find("ul").html(_ul);
                    } else {
                        $.oaTip(r.msg, "error", 2000);
                    }
                }
            });
        },
        fetchLocationCol          : function (e) {
            var self = this,
                _ul;
            this.curLoactionRoomId = $(e.target).attr("val");

            //reset conf model
            this.resetProps(["locationCol"]);

            Remote({
                type   : "POST",
                data   : {
                    placeid: this.curLoactionPlaceId,
                    roomid : this.curLoactionRoomId,
                    method : "query"
                },
                url    : "propertyMng/getLocationList",
                success: function (r) {
                    if (r.code == 200) {
                        _ul = _.template(self.tplSelect)(r.data);
                        self.$locationCol.find("ul").html(_ul);

                    } else {
                        $.oaTip(r.msg, "error", 2000);
                    }
                }
            });
        },
        checkLocationPlaceSelected: function () {
            if (!this.curLoactionPlaceId) {
                $.oaTip("请先选择位置_机房地点", "warning", 2000);
            }
        },
        fetchLocationBox          : function (e) {
            var self = this,
                _ul;
            this.curLocationTankId = $(e.target).attr("val");

            //reset conf type and model
            this.resetProps(["locationBladeBoxNo", "locationBladeNo"]);

            Remote({
                type   : "POST",
                data   : {
                    tankid: this.curLocationTankId,
                    method: "query"
                },
                url    : "propertyMng/getTlankConfig",
                success: function (r) {
                    if (r.code == 200) {
                        _ul = _.template(self.tplSelect)(r.data);
                        self.$locationBladeBox.find("ul").html(_ul);
                    } else {
                        $.oaTip(r.msg, "error", 2000);
                    }
                }
            });
        },
        fetchLocationBladeNo      : function (e) {
            var self = this,
                _ul;
            this.curLocationBladeBoxId = $(e.target).attr("val");

            //reset conf model
            this.resetProps(["locationBladeNo"]);

            Remote({
                type   : "POST",
                data   : {
                    tankid: this.curLocationTankId,
                    boxid : this.curLocationBladeBoxId,
                    method: "query"
                },
                url    : "propertyMng/getTlankConfig",
                success: function (r) {
                    if (r.code == 200) {
                        _ul = _.template(self.tplSelect)(r.data);
                        self.$locationBlade.find("ul").html(_ul);

                    } else {
                        $.oaTip(r.msg, "error", 2000);
                    }
                }
            });
        },
        fetchProductCode          : function (e) {
            var self = this,
                _ul,
                list = [];
            this.curUsageSn = $(e.target).attr("val");

            //reset  productCode
            this.resetProps(["productCode "]);

            Remote({
                type   : "GET",
                data   : {
                    usageSn: this.curUsageSn
                },
                url    : "equipManage/queryProduct",
                success: function (r) {
                    if (r.code == 200) {
                        list = _.map(r.data.list, function (item) {
                            return {
                                id  : item.value,
                                name: item.text
                            }
                        });
                        _ul = _.template(self.tplSelect)({list: list});
                        self.$productCode.find("ul").html(_ul);

                    } else {
                        $.oaTip(r.msg, "error", 2000);
                    }
                }
            });
        },
        checkLocationTankSelected : function () {
            if (!this.curLocationTankId) {
                $.oaTip("请先选择位置_机柜名称", "warning", 2000);
            }
        },
        checkAssetsUsageSelected  : function () {
            if (!this.curUsageSn) {
                $.oaTip("请先选择用途_资产用途", "warning", 2000);
            }
        },
        resetProps                : function (props) {
            _.map(props, function (prop) {
                interactiveEvent.restoreSearchKey($('.J_' + prop), prop + "=");
            });
        },
        validatorFunc             : {
            assetsSn      : {
                validator: [ValidatorHelper.isNotEmpty],
                label    : "资产编号"
            },
            assetsCompany : {
                validator: [ValidatorHelper.isNotEmpty],
                label    : "资产编号"
            },
            confBrand     : {
                validator: [ValidatorHelper.isNotEmpty],
                label    : "配置_品牌"
            },
            confType      : {
                validator: [ValidatorHelper.isNotEmpty],
                label    : "配置_类型"
            },
            useAssetsUse  : {
                validator: [ValidatorHelper.isNotEmpty],
                label    : "用途_资产用途"
            },
            locationPlace : {
                validator: [ValidatorHelper.isNotEmpty],
                label    : "位置_机房位置地点"
            },
            status        : {
                validator: [ValidatorHelper.isNotEmpty],
                label    : "使用状态"
            },
            assetsStatus  : {
                validator: [ValidatorHelper.isNotEmpty],
                label    : "资产状态"
            },
            realPrice     : {
                validator: [ValidatorHelper.isNotEmpty, ValidatorHelper.positiveNum],
                label    : "购买价格"
            },
            financeBuyDate: {
                validator: [ValidatorHelper.isNotEmpty, ValidatorHelper.calendarFormat],
                label    : "验收日期"
            },
            financePayDate: {
                validator: [ValidatorHelper.calendarFormat],
                label    : "入帐日期"
            },
            standby1      : {
                validator: [ValidatorHelper.calendarFormat],
                label    : "折旧日期"
            },
            abandonDate   : {
                validator: [ValidatorHelper.calendarFormat],
                label    : "报废日期"
            },
            taxScrapDate  : {
                validator: [ValidatorHelper.calendarFormat],
                label    : "税务报废日期"
            },

        },
        validate                  : function (config, data) {
            this.validator = this.validator ? this.validator.reset(config, data) : new Validator(config, data);
            this.validator.validate();
            return this.validator.hasErrors();
        },
        clearErrorTips            : function () {
            $(".error-tip.active").removeClass("active");
        },
        hideErrorTip              : function (key) {
            $(".J_" + key).find(".error-tip").text('').removeClass("active");
        },
        showErrorTip              : function (errModels) {
            _.map(errModels, function (model) {
                $(".J_" + model.key).find(".error-tip").text(model.msg).addClass("active");
            });
        },
        add                       : function (e) {
            var $target = $(e.target),
                self = this,
                $select = $target.parents("dl");
            this.poupView.render({
                title   : '添加',
                url     : $target.data("url") + "&name=",
                callback: function (name) {
                    var newLi = _.template(self.tplAddLi)({name: name});
                    $select.find('.ac_selectItem.hover').removeClass('hover');
                    $select.find("ul").append(newLi);
                    $select.find("input").val(name);
                    $select.find("em").text(name);
                }
            });
        },
        searchForSelect           : function (e) {
            var $target = $(e.target),
                self = this,
                _ul;
            this.poupView.render({
                title   : '搜索',
                type    : 'GET',
                url     : $target.data("url") + "?usageName=",
                callback: function (name, data) {
                    if (data.length) {
                        self.cacheData.useAssetsUseList = data;
                        _ul = _.template(self.tplSelectSn)({list: data});
                        self.$assetsUsage.find("ul").html(_ul).find("li.ac_selectItem").eq(0).trigger('click');
                    }
                }
            });
        },
        searchForInput            : function (e) {
            var $target = $(e.target),
                self = this;
            this.poupView.render({
                title   : '查询员工信息',
                type    : 'GET',
                url     : $target.data("url") + "?employeeCode=",
                callback: function (name, data) {
                    if (data) {
                        self.$useUser.find("input").val(data.realName);
                        self.$useUserEmail.find("input").val(data.email);
                        self.$employeeCode.find("input").val(data.jobNumber);
                    }
                }
            });
        },

        dataProcess : function (data) {
            var attr = ['confBrand','confType', 'locationPlace'];
            _.each(attr, function(item, index) {
                data[item] = $('dl.J_'+ item).find('ul.select-auto>li.ac_selectItem.hover').text();
            });

            return data;
        },

        registerAssets            : function (e) {
            var self = this,
                interactiveObj = interactiveEvent.serializeFields($('.workload-operation'), 'browser'),
                dataJson = interactiveObj.dataJson,
                dataForm;
            this.clearErrorTips();
            if (this.validate(this.validatorFunc, dataJson)) {
                $.oaTip("请检查输入内容格式是否满足要求", "warning", 2000);
                this.showErrorTip(this.validator.getErrorsModel());
            } else {
                dataForm = $.param(self.dataProcess(dataJson));
                Remote({
                    type   : "POST",
                    data   : {},
                    url    : "equipManage/addEquipment" + "?" + "typeAll=" + self.assetTypeId + "&" + dataForm,
                    success: function (r) {
                        $.oaTip(r.msg, r.code == 200 ? "success" : "error", 2000);
                    }
                });
            }

            Tool.stop(e);
        }
    });

})