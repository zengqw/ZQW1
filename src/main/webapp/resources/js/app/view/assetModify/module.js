define([
    'jquery',
    'underscore',
    'backbone',
    'common/fixedBox',
    'common/remote',
    'common/tool',
    './config',
    'text!tmpl/common/format.html',
    'common/validator',
    'common/interactiveEvent',
    'cxcalendar'
], function ($, _, B, FixedBox, Remote, Tool, Config, TplFormat, Validator, interactiveEvent) {

    return B.View.extend({

        events: {
            'click .ac_assetModify'                     : 'assetModify',
            'click .ac_assetRemove'                     : 'assetRemove',
            'click .ac_assetShift'                      : 'assetShift',
            'click .ac_assetHistory'                    : 'assetHistory',
            'change .J_input'                           : 'onChange',
            "click .J_confBrand li.ac_selectItem"       : "fetchConfType", //update conftype base on conf brand
            "click .J_confType em"                      : "checkBrandSelected", //check brand is selected
            "click .J_confType  li.ac_selectItem"       : "fetchConfModel", //update confmodel base on conf brand and conf type
            "click .J_useAssetsUse li.ac_selectItem"    : "fetchProductCode",  //update product code base on assetsusage
            "click .J_locationPlace li.ac_selectItem"   : "fetchLocationRoom",          //update location room base on location place
            "click .J_locationRoomName li.ac_selectItem": "fetchLocationCol",           //update  location col base on location place and location room
            "click .J_locationRoomName em"              : "checkLocationPlaceSelected", //check location place is selected
            "click .J_locationTank li.ac_selectItem"    : "fetchLocationBox",           //update location box base on location tank
            "click .J_input_search"                     : "searchForInput",            //search results to list
            "click .J_add"                              : "add"                        //add tos list

        },

        urls: {
            assetDelete : '/ams/queryEquip/deleteAsset',
            assetShift  : '/ams/modifyAsset/transferEquip',
            shiftConfirm: '/ams/modifyAsset/transferConfirm',
            assetHistory: '/ams/amsLog/modifyLogSingleHistory'
        },

        initialize: function (options) {
            _.extend(this, options);
            var _this = this;
            this.curConfig = Config;
            this.validatorFunc = this.curConfig.validatorFunc;
            this.initData = {};
            this.initIndex = 0;

            require([options.tpl], function (tpl) {
                _this.el.innerHTML = tpl;
                _this.cacheDom();
                _this.render();
            });
        },

        transferData: function () {
            var _this = this;
            var keyArr = _this.curConfig.keys;
        },

        cacheDom: function () {
            this.$workOperation = $('.workload-operation');
            this.$workDateList = $('.workload-data-list');
            this.$modifyWrapper = $('.J_modifyWrapper');
            this.tplModify = $("#J_tpl_modify").html();
            this.tplShift = $("#J_tpl_shift").html();
            this.tplShiftCompare = $("#J_tpl_shiftCompare").html();
            this.tplModule = $("#J_tpl_module").html();
            this.tplSelect = $("#J_tpl_select").html();
            this.tplPoup = $("#J_tpl_poup").html();
            this.tplAddLi = $("#J_tpl_li").html();
            this.tplExtend = $("#J_tpl_extend").html();
        },

        cacheViewDom: function () {
            this.$confType = $(".J_confType");
            this.$confModel = $(".J_confModel");
            this.$locationRoom = $(".J_locationRoomName");
            this.$locationCol = $(".J_locationColName");
            this.$locationBladeBox = $(".J_locationBladeBoxNo");
            this.$locationBlade = $(".J_locationBladeNo");
            this.$selectedRef = $(".J_confRaid");
            this.$productCode = $(".J_productCode");
            this.$assetsUsage = $(".J_useAssetsUse");
            this.$useUser = $(".J_useUser");
            this.$useUserEmail = $(".J_email");
            this.$employeeCode = $(".J_employeeCode");
        },

        bindEvent: function () {
            $(".J_calendar").cxCalendar();
            this.initPoup();
        },

        initPoup: function () {
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
                                type   : "POST",
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

        render: function () {
            var _this = this,
                _html;

            Remote({
                url    : _this.curConfig.fetchUrl,
                data   : {assetsSn: _this.type},
                success: function (res) {
                    if (200 === res.code) {
                        $.extend(_this.initData, res.result.data);
                        // render init page
                        var dataGroup = Tool.makeGroup(Config.listGroup, res.result.data.modifyDisplay);
                        _html = _.template(_this.tplModify)({
                            dataGroup: dataGroup,
                            tpl      : TplFormat
                        });
                        _this.$modifyWrapper.html(_html);
                        _this.extendRender();
                        // Cache jquery obj after page is rendered
                        _this.cacheViewDom();
                        _this.bindEvent();
                        _this.$selectedRef.addClass('hide').find('input').attr('placeholder', '输入资产编号,多个资产编号用,分割');
                    } else {
                        $.oaTip(res.msg, 'error');
                    }
                }
            })
        },

        extendRender: function () {
            var _this = this;
            var extendList = _this.curConfig.extendList;
            var extendTpl = _.template(_this.tplExtend);
            _.each(extendList, function (item, index) {
                $('.J_' + item.key).find('.J_errorTip').before(extendTpl(item));
            })
        },

        onChange: function (e) {
            var $target = $(e.target),
                obj = {},
                value = $target.val(),
                key = $target.attr("name");
            obj[key] = value;
            if (this.validate(_.pick(this.validatorFunc, key), obj)) {
                this.validator.showErrorTip(this.validator.getErrorsModel());
            } else {
                this.validator.hideErrorTip(key);
            }
        },

        validate: function (config, data) {
            this.validator = this.validator ? this.validator.reset(config, data) : new Validator(config, data);
            this.validator.validate();
            return this.validator.hasErrors();
        },

        dataProcess : function (data) {
            var attr = ['confBrand','confType', 'locationPlace'];
            _.each(attr, function(item, index) {
                if (_.has(data, item)) {
                    data[item] = $('dl.J_'+ item).find('ul.select-auto>li.ac_selectItem.hover').text();
                }
            });

            return data;
        },

        // modify operation
        assetModify: function (event) {
            var _this = this;
            var interactiveObj = interactiveEvent.serializeFields(this.$workOperation, 'browser'),
                dataJson = interactiveObj.dataJson,
                dataForm = _this.dataProcess(dataJson);
            Remote({
                url    : _this.curConfig.saveUrl,
                type   : 'POST',
                data   : dataForm,
                success: function (res) {
                    if (200 === res.code) {
                        $.oaTip(res.msg, 'success');
                    } else {
                        $.oaTip(res.msg, 'error');
                    }
                }
            });

            Tool.stop(event);
        },

        assetRemove: function (event) {
            var $this = $(event.currentTarget);
            var _this = this;
            var $confirm = $.confirm({
                title    : '删除操作',
                msg      : '您确定要删除此数据吗？',
                onconfirm: function (obj, $thisConfirm) {
                    Remote({
                        url    : _this.urls.assetDelete,
                        type   : 'POST',
                        data   : {
                            id      : _this.initData.id,
                            assetsSn: _this.initData.assetsSn
                        },
                        success: function (res) {
                            $confirm.remove();
                            if (200 === res.code) {
                                $.oaTip(res.result.data.messageList[0], 'success');
                            } else {
                                $.oaTip(res.msg, 'error');
                            }
                        }
                    })
                }
            });
        },

        assetShift: function (event) {
            var $this = $(event.currentTarget);
            var _this = this;

            var $sprite = $.sprite({
                title      : '资产转移',
                msg        : '',
                showButtons: false,
                width      : 1000,
                mask       : true,
                move       : true,
                onsuccess  : function (obj) {
                    var $shiftWrapper, html;
                    var shiftData = _.map(_this.curConfig.shiftList, function (item, index) {
                        return item;
                    });

                    Remote({
                        url    : _this.curConfig.shiftUrl,
                        data   : {
                            id: _this.initData.id
                        },
                        success: function (res) {
                            shiftData = shiftData.concat(res.result.data.list);
                            html = _.template(_this.tplShift)({data: shiftData, tpl: TplFormat});
                            obj.html(html).find(".J_calendar").cxCalendar({
                                type: "YYYY-MM-DD"
                            });
                            $shiftWrapper = obj.find('.J_shift');
                            obj.find('.ac_shiftNext').click(function () {
                                var interactiveObj = interactiveEvent.serializeFields(obj, 'browser'),
                                    dataJson = interactiveObj.dataJson;
                                $.extend(dataJson, {id: _this.initData.id});
                                Remote({
                                    url    : _this.urls.assetShift,
                                    data   : dataJson,
                                    success: function (res) {
                                        if (res.code == 200) {
                                            $shiftWrapper.addClass('hide');
                                            obj.append(_.template(_this.tplShiftCompare)(res.result.data));

                                            obj.find('.ac_shiftConfirm').click(function () {
                                                Remote({
                                                    url    : _this.urls.shiftConfirm,
                                                    type   : 'POST',
                                                    success: function (res) {
                                                        if (res.code === 200) {
                                                            $.oaTip(res.desc, 'success');
                                                            $sprite.remove();
                                                        } else {
                                                            $.oaTip(res.desc, 'error');
                                                        }
                                                    }
                                                })
                                            });

                                            obj.find('.ac_shiftBack').click(function () {
                                                $shiftWrapper.removeClass('hide');
                                                obj.find('.J_shiftCompare').remove();
                                            });

                                        } else {
                                            $.oaTip(res.desc, 'error');
                                        }
                                    }
                                });
                            });
                        }
                    });
                }
            });
        },

        assetHistory: function (event) {
            var $this = $(event.currentTarget);
            var _this = this;
            if (!this.fixedBox) {
                this.fixedBox = new FixedBox({
                    $el     : _this.$workDateList,
                    configs : _this.curConfig,
                    fetchUrl: _this.urls.assetHistory,
                    data    : {assetsSn: _this.type},
                    callback: function (res) {
                        $("html, body").animate({scrollTop: $(document).height() - $(window).height()}, "slow");
                    }
                });
            }
        },

        resetProps: function (props) {
            _.map(props, function (prop) {
                interactiveEvent.restoreSearchKey($('.J_' + prop), prop + "=");
            });
        },

        toggleShowSelectedRef: function (text) {
            if (["磁盘阵列", "服务器"].indexOf(text) > -1) {
                this.$selectedRef.removeClass("hide");
                this.$selectedRef.find("dt").text("磁盘阵列" == text ? "服务器：" : "磁盘阵列：");
            } else {
                this.$selectedRef.addClass("hide");
                this.$selectedRef.find("textarea").val("");
            }
        },

        checkBrandSelected: function () {
            if (!this.curConfBrandId) {
                $.oaTip("请先选择配置_品牌", "warning", 2000);
            }
        },

        fetchConfType: function (event) {
            var _this = this,
                _ul;
            this.curConfBrandId = $(event.target).attr("val");

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
                        _ul = _.template(_this.tplSelect)(r.data);
                        _this.$confType.find("em").text('请选择');
                        _this.$confType.find("ul").html(_ul);
                    } else {
                        $.oaTip(r.msg, "error", 2000);
                    }
                }
            });
        },

        fetchConfModel: function (event) {
            var _this = this,
                $this = $(event.target),
                _ul;
            this.curConfTypeId = $this.attr("val");

            //reset conf model
            this.resetProps(["confModel"]);

            //update SelectedRef view status
            this.toggleShowSelectedRef($this.text());
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
                        _ul = _.template(_this.tplSelect)(r.data);
                        _this.$confModel.find("em").text('请选择');
                        _this.$confModel.find("ul").html(_ul);

                    } else {
                        $.oaTip(r.msg, "error", 2000);
                    }
                }
            });
        },

        add: function (e) {
            var $target = $(e.target),
                self = this,
                $select = $target.parents("dl");
            this.poupView.render({
                title   : '添加',
                url     : $target.data("url") + "&name=",
                callback: function (name) {
                    var newLi = _.template(self.tplAddLi)({name: name});
                    $select.find("ul").append(newLi);
                    $select.find("input").val(name);
                    $select.find("em").text(name);
                }
            });
        },

        searchForSelect: function (e) {
            var $target = $(e.target),
                self = this,
                _ul;
            this.poupView.render({
                title   : '搜索',
                url     : $target.data("url") + "?usageName=",
                callback: function (name, data) {
                    _ul = _.template(self.tplSelect)({list: data});
                    self.$assetsUsage.find("ul").html(_ul);
                }
            });
        },

        searchForInput: function (e) {
            var $target = $(e.target),
                self = this;
            this.poupView.render({
                title   : '查询员工信息',
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

        fetchLocationRoom: function (e) {
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
                        self.$locationRoom.find("em").text('请选择');
                        self.$locationRoom.find("ul").html(_ul);
                    } else {
                        $.oaTip(r.msg, "error", 2000);
                    }
                }
            });
        },

        fetchLocationCol: function (e) {
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
                        self.$locationCol.find("em").text('请选择');
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

        fetchLocationBox: function (e) {
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
                        self.$locationBladeBox.find("em").text('请选择');
                        self.$locationBladeBox.find("ul").html(_ul);
                    } else {
                        $.oaTip(r.msg, "error", 2000);
                    }
                }
            });
        },

        fetchLocationBladeNo: function (e) {
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
                        self.$locationBlade.find("em").text('请选择');
                        self.$locationBlade.find("ul").html(_ul);

                    } else {
                        $.oaTip(r.msg, "error", 2000);
                    }
                }
            });
        },

        fetchProductCode: function (event) {
            var self = this,
                _ul,
                list = [];
            this.curUsageSn = $(event.target).attr("val");

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
                        self.$productCode.find("em").html('请选择');
                        self.$productCode.find("ul").html(_ul);

                    } else {
                        $.oaTip(r.msg, "error", 2000);
                    }
                }
            });
        },
    });
});