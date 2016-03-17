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
    'common/selectChain',
    'common/addCondition',
    "common/validatorHelper"
], function ($, _, B, FixedBox, Remote, Tool, Config, TplFormat, Validator, interactiveEvent, ExportExcel, SelectChain, AddCondition, ValidatorHelper) {

    return B.View.extend({

        events: {
            'click .J_search'       : 'search',
            'click .J_export'       : 'export',
            'click .J_modify'       : 'itemModify',
            'change .J_input'       : 'onChange'
        },

        initialize: function (options) {
            _.extend(this, options);
            var _this = this;
            this.curConfig = Config;
            this.validatorFunc = this.curConfig.validatorFunc;
            this.initData = {};
            this.initIndex = 0;
            this.isFirstTime = true;

            require([options.tpl], function (tpl) {
                _this.el.innerHTML = tpl;
                _this.cacheDom();
                _this.bindEvent();
                _this.render();
            });
        },

        cacheDom: function () {
            this.$workOperation = $('.workload-operation');
            this.$workDateList = $('.workload-data-list');
            this.$totalAssets = $('.J_totalAssets');
            this.$workSearch = this.$workOperation.find('.workload-search .J_search_form');
            this.tplSearch = $("#J_tpl_search").html();
            this.tplCondition = $("#J_tpl_condition").html();
        },

        export: function (event) {
            var _this = this;
            var queryData = {
                techCheck: -1,
                type     : ''
            };
            $.extend(queryData, _this.queryData, {"exportExcelFlag": true});
            ExportExcel({
                url : _this.curConfig.fetchUrl,
                data: queryData
            });
        },

        bindEvent: function () {
            this.$workOperation.workloadSearch();
        },

        render: function () {
            var _this = this,
                _html;

            Remote({
                url    : _this.curConfig.initUrl,
                success: function (res) {
                    if (200 === res.code) {
                        // save the result data of init-page
                        _.extend(_this.initData, res.result);
                        _this.conditionValue = _.findWhere(_this.initData.data, {key: "condition0"}).value;
                        $.extend(res.result.data[3], {chain: true});

                        // select 级联
                        SelectChain({
                            key     : 'convalue',
                            afterKey: 'conopt',
                            label   : '属性值',
                            data    : _this.conditionValue
                        });
                        // render init page
                        _html = _.template(_this.tplSearch)({
                            data: res.result && res.result.data,
                            tpl : TplFormat,
                            list: _this.curConfig.list
                        });
                        _this.$workSearch.html(_html);
                        // 查询条件的初始化
                        AddCondition({
                            data: [_this.initData.data[3], _this.initData.data[2]]
                        });
                    } else {
                        $.oaTip(res.msg, 'error');
                    }
                }
            })
        },

        // If condition is not empty, conopt has to be not empty
        validChain : function (from, to) {
            var validator =  {
                validator: [ValidatorHelper.isNotEmpty]
            };

            if (this.hasValidChain && this.hasValidChain === true) {

            } else {
                var index = from.replace(/\D/g, "");
                to = index ? (to + index) : to;
                this.validatorFunc[to] = validator;
                this.hasValidChain = true
            }
        },

        onChange: function (e) {
            var $target = $(e.target),
                obj = {},
                value = $target.val(),
                key = $target.attr("name");
            obj[key] = value;

            if (key.indexOf('condition') !== -1) {
                this.validChain(key, 'conopt');
            }

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

        // search result with condition
        search: function (event) {
            var _this = this;
            var interactiveObj = interactiveEvent.serializeFields(this.$workOperation, 'browser'),
                dataJson = interactiveObj.dataJson;
            if (this.validate(this.validatorFunc, dataJson)) {
                $.oaTip("请检查输入内容格式是否满足要求", "warning", 2000);
                this.validator.showErrorTip(this.validator.getErrorsModel());
                return;
            }
            _this.queryData = dataJson;
            this.fixedBox = this.fixedBox ? this.fixedBox.render(dataJson) : new FixedBox({
                $el     : _this.$workDateList,
                configs : _this.curConfig,
                fetchUrl: _this.curConfig.fetchUrl,
                data    : dataJson,
                callback: function (res) {
                    if (res.result.data.isShowMoney === 'true' && res.result.data.financePrice[0]) {
                        _this.$totalAssets.removeClass('hide').find('span').text(Tool.formatNumber(res.result.data.financePrice[0]));
                    } else {
                        _this.$totalAssets.addClass('hide').find('span').text('');
                    }
                }
            });

            Tool.stop(event);
        },

        itemModify : function(event) {
            var $this = $(event.currentTarget);
            var _this = this;
            var id = $this.closest('tr').data('id');
            if (id) {
                window.location.href = '#assetModify/' + id;
            }
        }
    });
});