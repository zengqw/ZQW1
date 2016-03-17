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
    'common/exportExcel',
    'common/selectChain',
    'common/addCondition',
    'cxcalendar'
], function ($, _, B, FixedBox, MENU, Remote, Tool, Config, TplFormat, Validator, interactiveEvent, ExportExcel, SelectChain, AddCondition) {

    return B.View.extend({

        events: {
            'click .J_search': 'search',
            'click .J_export': 'export',
            'change .J_input': 'onChange',
            'click .J_fold': 'foldTable'
        },

        initialize: function (options) {
            _.extend(this, options);
            var _this = this;
            this.curConfig = Config;
            this.validatorFunc = this.curConfig.validatorFunc;
            this.initData = {};
            this.type = this.type ? this.type : 'in';

            this.subMenuInit();
            require([options.tpl], function (tpl) {
                _this.el.innerHTML = tpl;
                _this.cacheDom();
                _this.bindEvent();
                _this.render();
            });
        },

        subMenuInit: function () {
            //二级导航高亮设置
            new MENU({
                $el           : $(".workload-menu"),
                subMenuConfigs: [],
                menu          : this.type
            });
        },

        cacheDom: function () {
            this.$workOperation = $('.workload-operation');
            this.$workDateList = $('.workload-data-list');
            this.$totalAssets = $('.J_totalAssets');
            this.$workSearch = this.$workOperation.find('.workload-search .J_search_form');
            this.tplSearch = $("#J_tpl_search").html();
            this.tplSubTable = $("#J_tpl_subTable").html();
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
                data   : {
                    type: _this.type
                },
                success: function (res) {
                    if (200 === res.code) {
                        // save the result data of init-page
                        _.extend(_this.initData, res.result);
                        _this.conditionValue = _.findWhere(_this.initData.data, {key: "condition0"}).value;
                        $.extend(res.result.data[1], {chain: true});

                        // select 级联
                        SelectChain({
                            key     : 'convalue',
                            afterKey: 'conopt',
                            label   : '属性值',
                            data    : _this.conditionValue
                        });
                        // render init page
                        _html = _.template(_this.tplSearch)({
                            data: _.reject(res.result.data, function (item) { return item.key === 'conopt0' || item.key === 'condition0'}),
                            tpl : TplFormat,
                            list: _this.type === 'end' ? _this.curConfig.endList : _this.curConfig.list
                        });
                        _this.$workSearch.html(_html);

                        AddCondition({
                            data: [_this.initData.data[1], _this.initData.data[0]]
                        });

                        $(".J_calendar").cxCalendar({
                            type: "YYYY-MM-DD"
                        });
                    } else {
                        $.oaTip(res.desc, 'error');
                    }
                }
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

        // search result with condition
        search: function (event) {
            var _this = this, config = {};
            var interactiveObj = interactiveEvent.serializeFields(this.$workOperation, 'browser'),
                dataJson = interactiveObj.dataJson;
            if (this.validate(this.validatorFunc, dataJson)) {
                $.oaTip("请检查输入内容格式是否满足要求", "warning", 2000);
                this.validator.showErrorTip(this.validator.getErrorsModel());
                return;
            }
            _this.queryData = dataJson;

            if (_this.type === 'end') {
                _.extend(config , _this.curConfig, {colorControl: false, controls: undefined});
            } else {
                _.extend(config , _this.curConfig);
            }

            this.fixedBox = this.fixedBox ? this.fixedBox.render(dataJson) : new FixedBox({
                $el     : _this.$workDateList,
                configs : config,
                fetchUrl: _this.type === 'end' ? _this.curConfig.fetchEndUrl : _this.curConfig.fetchUrl,
                data    : dataJson,
                callback: function (res) {
                    _this.tableTitle = res.result.data.tableTitle;
                    if (res.result.data.isShowMoney === 'true') {
                        _this.$totalAssets.removeClass('hide').find('span').text(Tool.formatNumber(res.result.data.financePrice[0]));
                    } else {
                        _this.$totalAssets.addClass('hide').find('span').text('');
                    }
                }
            });

            Tool.stop(event);
        },

        // 展示子数据
        foldTable: function (event) {
            var $this = $(event.currentTarget);
            var assetsSn = $this.closest('tr').data('id');
            var _this = this;
            var interactiveObj = interactiveEvent.serializeFields(this.$workOperation, 'browser'),
                dataJson = interactiveObj.dataJson;
            var html,
                $targets = $('table.t-normal.t-border.t-striped').find('tr[data-target=' + assetsSn + ']'),
                $tableMiddle = $('table.t-normal.t-border.t-striped').find('tr[data-id=' + assetsSn + ']');
            $tableLeft = $('.fx-unit.fx-l > table').find('tr[data-id=' + assetsSn + ']');
            $tableRight = $('.fx-unit.fx-r > table').find('tr[data-id=' + assetsSn + ']');
            $.extend(dataJson, {assetsSn: assetsSn});

            $this.toggleClass('u-btn-arrow-up');
            if ($targets.length) {
                $tableMiddle.nextAll('tr[data-target=' + assetsSn + ']').toggle();
                $tableLeft.nextAll('tr[data-target=' + assetsSn + ']').toggle();
                $tableRight.nextAll('tr[data-target=' + assetsSn + ']').toggle();
            } else {
                Remote({
                    url    : _this.type === 'end' ? _this.curConfig.fetchEndUrl : _this.curConfig.fetchUrl,
                    data   : dataJson,
                    success: function (res) {
                        html = _.template(_this.tplSubTable)({
                            data: res.result.data.list,
                            keys: _this.tableTitle
                        });
                        $tableMiddle.after(html);
                        $tableLeft.after(_.template($('#J_tpl_tableIndex').html())({
                            data: res.result.data.list
                        }));
                        $tableRight.after(_.template($('#J_tpl_tableOperation').html())({
                            data: res.result.data.list
                        }))
                    }
                })
            }
        },
    });
});