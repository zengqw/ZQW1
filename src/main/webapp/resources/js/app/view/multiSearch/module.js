define([
    'jquery',
    'underscore',
    'backbone',
    'common/fixedBox',
    'common/menu',
    'common/remote',
    'common/tool',
    './config',
    'text!tmpl/common/format.html',
    'common/validator',
    'common/interactiveEvent',
    'common/exportExcel'
], function ($, _, B, FixedBox, MENU, Remote, Tool, Config, TplFormat, Validator, interactiveEvent, ExportExcel) {

    return B.View.extend({

        events: {
            'click .J_search'  : 'search',
            'change .J_input'  : 'onChange',
            'click .J_modify'  : 'itemModify',
            'click .J_repeatIp': 'repeatIp',
            'click .J_export'  : 'exportExcel'
        },

        initialize: function (options) {
            _.extend(this, options);
            var _this = this;
            this.curConfig = Config;
            this.validatorFunc = this.curConfig.validatorFunc;

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
            this.$repeatIpWrap = $('.J_repeatIpWrap');
            this.$repeatIpTable = this.$repeatIpWrap.find('.J_repeatIpTable');
            this.$ipList = this.$repeatIpWrap.find('.J_ipList');
            this.$totalAssets = $('.J_totalAssets');
            this.$workSearch = this.$workOperation.find('.workload-search .J_search_form');
            this.tplSearch = $("#J_tpl_search").html();
            this.tplRepeatIp = $("#J_tpl_repeatIp").html();
            this.tplSearchWrap = $("#J_tpl_searchWrap").html();
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
                        // render init page
                        _html = _.template(_this.tplSearch)({
                            data: res.result && res.result.data,
                            tpl : TplFormat,
                            list: _this.curConfig.list
                        });
                        _this.$workSearch.html(_html);

                    } else {
                        $.oaTip(res.msg, 'error');
                    }
                }
            })
        },

        itemModify: function (event) {
            var $this = $(event.currentTarget);
            var _this = this;
            var id = $this.closest('tr').data('id');
            if (id) {
                window.location.href = '#assetModify/' + id;
            }
        },

        repeatIp: function (event) {
            var _this = this, dataJson = {checkIp: true};

            this.ipFixedBox = this.ipFixedBox ? this.ipFixedBox.render(dataJson) : new FixedBox({
                $el     : _this.$repeatIpTable,
                configs : _this.curConfig,
                fetchUrl: _this.curConfig.fetchUrl,
                data    : dataJson,
                callback: function (res) {
                    _this.$repeatIpWrap.find('.panel-header').removeClass('hide');
                    _this.$ipList.html(_.template(_this.tplRepeatIp)(res.result.data));

                    _this.$workDateList.find('.panel-header, .J_exportWrap').addClass('hide');
                    _this.$workDateList.find('.J_searchTable').html('');
                    _this.fixedBox = null;
                }
            });
        },

        exportExcel: function (event) {
            var $this = $(event.currentTarget);
            var _this = this;
            var type = $this.data('type');
            var interactiveObj = interactiveEvent.serializeFields(this.$workOperation, 'browser'),
                dataJson = interactiveObj.dataJson;
            dataJson.conditions = Tool.transferComma(dataJson.conditions);

            switch (type) {
                case 'repeat':
                    ExportExcel({
                        url : _this.curConfig.fetchUrl,
                        data: {
                            checkIp        : true,
                            exportExcelFlag: true
                        }
                    });
                    break;
                default :
                    _.extend(dataJson, {exportExcelFlag: true});
                    ExportExcel({
                        url : _this.curConfig.fetchUrl,
                        data: dataJson
                    });
                    break;
            }
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

            dataJson.conditions = Tool.transferComma(dataJson.conditions);

            this.fixedBox = this.fixedBox ? this.fixedBox.render(dataJson) : new FixedBox({
                $el     : _this.$workDateList.find('.J_searchTable'),
                configs : _this.curConfig,
                fetchUrl: _this.curConfig.fetchUrl,
                data    : dataJson,
                callback: function (res) {
                    _this.$workDateList.find('.panel-header').removeClass('hide');

                    if (res.result.data.list && res.result.data.list.length) {
                        _this.$workDateList.find('.J_exportWrap').removeClass('hide');
                    }

                    _this.$repeatIpWrap.find('.panel-header').addClass('hide');
                    _this.$ipList.html('');
                    _this.$repeatIpTable.html('');
                    _this.ipFixedBox = null;
                }
            });

            Tool.stop(event);
        }
    });
});