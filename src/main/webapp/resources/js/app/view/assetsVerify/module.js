/**
 * module.js
 * @autoor zq
 * Created by 2015-12-22 11:11
 */
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
    'common/exportExcel',
    'common/foldCondition',
    'cxcalendar'
], function ($, _, B, FixedBox, Remote, Tool, Config, TplFormat, Validator, interactiveEvent, ExportExcel, FoldCondition) {
    return B.View.extend({
        events        : {
            'click .J_search'                  : 'search',		                                // 搜索
            'click .J_timeFlag .input-checkbox': 'toggleViewTime',		                        // 限制时间控制
            'click .J_modify'                  : 'modify',		                                // 单个修改
            'click .J_submit'                  : 'submit',		                                // 提交
            'change .J_input'                  : 'onChange',                                     //监听值变化，校验
            'click .J_export'                  : 'export'
        },
        initialize    : function (options) {
            _.extend(this, options);
            var self = this;
            this.curConfig = Config;
            this.validatorFunc = this.curConfig.validatorFunc;

            //渲染模板
            require([options.tpl], function (tpl) {
                self.el.innerHTML = tpl;
                self.cacheDom();
                self.bindEvent();
                self.renderBody();
            });
        },
        cacheDom      : function () {
            this.$workOperation = $('.workload-operation');
            this.$workDateList = $('.workload-data-list');
            this.$workSearch = this.$workOperation.find('.workload-search .J_search_form');
            this.tplSearch = $("#J_tpl_search").html();
            this.$btnSubmit = $(".J_submit");

        },
        toggleViewTime: function (e) {
            var flag = $(e.target).hasClass("input-checkbox-hover");
            this.$startTime[!flag ? "show" : "hide"]();
            this.$endTime[!flag ? "show" : "hide"]();
        },
        bindEvent     : function () {
            this.$workOperation.workloadSearch();
        },
        renderBody    : function () {
            var self = this,
                _html;
            Remote({
                type   : "GET",
                url    : self.curConfig.initUrl,
                data   : {
                    flag: self.type
                },
                success: function (r) {
                    if (200 == r.code) {
                        _html = _.template(self.tplSearch)({
                            data: r.data,
                            tpl : TplFormat,
                            list: self.curConfig.list
                        });
                        self.$workSearch.html(_html);
                        self.$startTime = $(".J_startTime");
                        self.$endTime = $(".J_endTime");
                        self.$startTime.hide();
                        self.$endTime.hide();
                        $(".J_calendar").cxCalendar({
                            type: "YYYY-MM-DD"
                        });
                        $(".J_calendar_month").cxCalendar({
                            type       : "YYYY-MM",
                            isMonPicker: true   //支持年月选择器
                        });

                        FoldCondition({
                            selector : '.J_company'
                        })
                    } else {
                        $.oaTip(r.msg, "error", 2000);
                    }
                }
            });
        },
        onChange      : function (e) {
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

        validate     : function (config, data) {
            this.validator = this.validator ? this.validator.reset(config, data) : new Validator(config, data);
            this.validator.validate();
            return this.validator.hasErrors();
        },
        search       : function () {
            var self = this;
            var interactiveObj = interactiveEvent.serializeFields(this.$workOperation, 'browser'),
                dataJson = interactiveObj.dataJson;

            if (this.validate(this.validatorFunc, dataJson)) {
                $.oaTip("请检查输入内容格式是否满足要求", "warning", 2000);
                this.validator.showErrorTip(this.validator.getErrorsModel());
            } else {
                self.fixedBox = self.fixedBox ? self.fixedBox.render(dataJson) : new FixedBox({
                    $el     : self.$workDateList,
                    configs : _.pick(self.curConfig, "keys", "needIndex", "controls", "uId"),
                    fetchUrl: self.curConfig.fetchUrl,
                    data    : dataJson,
                    callback: function (r) {
                        self.$btnSubmit[r.result && r.result.data && r.result.data.list && r.result.data.list.length ? "removeClass" : "addClass"]("hide");
                    }
                });
            }
        },
        modify       : function (e) {
            var $target = $(e.currentTarget),
                index = $target.parents("tr").index();

            this.dealTrsModify([index]);
        },
        dealTrsModify: function (indexArr) {
            var self = this,
                obj = {},
                tr,
                data = _.reduce(indexArr, function (ret, index) {
                    tr = $(".fx-m table tbody tr").eq(index);
                    obj = interactiveEvent.serializeFields($(tr), 'browser').dataJson;
                    ret.push(_.extend(obj, {
                        assetsSn: $(tr).data("id")
                    }));
                    return ret;
                }, []);

            Remote({
                type   : "POST",
                url    : this.curConfig.submitUrl,
                data   : {
                    financeType: JSON.stringify(data)
                },
                success: function (r) {
                    200 == r.code && self.search();
                    $.oaTip(r.desc, 200 == r.code ? "success" : "error", 2000);
                }
            });
        },
        submit       : function () {
            var indexArr = _.reduce($(".J_fixed_box .input-checkbox-hover[data-type='item']"), function (ret, chked) {
                ret.push($(chked).parents("tr").index());
                return ret;
            }, []);
            if (!indexArr.length) {
                $.oaTip("请先选择需要修改的资产", "warning", 2000);
                return;
            }
            this.dealTrsModify(indexArr);
        },

        export: function (event) {
            var _this = this;
            var queryData = {
                excel: '资产审核_' + new Date().format()
            };
            var interactiveObj = interactiveEvent.serializeFields(this.$workOperation, 'browser'),
                dataJson = interactiveObj.dataJson;
            $.extend(queryData, dataJson);

            ExportExcel({
                url : _this.curConfig.fetchUrl,
                data: queryData
            });
        },
    });
})