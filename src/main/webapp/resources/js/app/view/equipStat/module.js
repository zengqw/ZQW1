/**
 * module.js
 * @autoor zq
 * Created by 2015-12-22 11:11
 */
define([
    'jquery',
    'underscore',
    'backbone',
    './table',
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
], function ($, _, B, TableView, FixedBox, Remote, Tool, Config, TplFormat, Validator, interactiveEvent, ExportExcel, FoldCondition) {
    return B.View.extend({
        events    : {
            'click .J_search'       : 'search',		        // 搜索
            'change .J_input'       : 'onChange',               //监听值变化，校验
            'click .J_tree_fold'    : 'treeFold',
            'click .J_tree_checkbox': 'treeCheckbox',
            'click .J_exportBtn'    : 'exportBtn'
        },
        initialize: function (options) {
            _.extend(this, options);
            var self = this;
            this.curConfig = Config[this.type];
            this.validatorFunc = this.curConfig.validatorFunc;

            //渲染模板
            require([options.tpl], function (tpl) {
                self.el.innerHTML = tpl;
                self.cacheDom();
                self.bindEvent();
                self.renderBody();
            });
        },
        cacheDom  : function () {
            this.$workOperation = $('.workload-operation');
            this.$workDateList = $('.workload-data-list');
            this.$workSearch = this.$workOperation.find('.workload-search .J_search_form');
            this.tplSearch = $("#J_tpl_search").html();
            this.tplTransfer = $('#J_tpl_transfer').html();
            this.tplDepsearch = $('#J_tpl_depsearch').html();
        },
        bindEvent : function () {
            this.$workOperation.workloadSearch();
        },
        renderBody: function () {
            var self = this,
                _html;
            Remote({
                type   : "GET",
                url    : self.curConfig.initUrl,
                data   : {
                    id: _.findWhere(Config.menus, {hash: self.type}).value
                },
                success: function (r) {
                    if (200 == r.code) {
                        _html = _.template(self.tplSearch)({
                            data    : r.data,
                            tpl     : TplFormat,
                            list    : self.curConfig.list,
                            isExport: self.curConfig.isExport ? true : false
                        });
                        self.$workSearch.html(_html);
                        $(".J_calendar").cxCalendar({
                            type: "YYYY-MM-DD"
                        });
                        $(".J_calendar_month").cxCalendar({
                            type       : "YYYY-MM",
                            isMonPicker: true   //支持年月选择器
                        });
                        $(".J_input").on("change", self.onChange.bind(self));

                        FoldCondition({
                            selector : '.J_companyIds'
                        })
                    } else {
                        $.oaTip(r.msg, "error", 2000);
                    }
                }
            });
        },
        onChange  : function (e) {
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
        validate  : function (config, data) {
            this.validator = this.validator ? this.validator.reset(config, data) : new Validator(config, data);
            this.validator.validate();
            return this.validator.hasErrors();
        },
        search    : function (e) {
            var self = this,
                interactiveObj = interactiveEvent.serializeFields(this.$workOperation, 'browser'),
                dataJson = interactiveObj.dataJson;

            if (this.validate(this.validatorFunc, dataJson)) {
                $.oaTip("请检查输入内容格式是否满足要求", "warning", 2000);
                this.validator.showErrorTip(this.validator.getErrorsModel());
            } else {
                switch (self.type) {
                    case "fixfore":
                        ExportExcel({
                            url : self.curConfig.fetchUrl,
                            data: dataJson
                        });
                        break;
                    case "assetdep":
                    case "proloss":
                    case "depsearch":
                        this.fixedBox = this.fixedBox ? this.fixedBox.render(dataJson) : new FixedBox({
                            $el     : self.$workDateList,
                            fetchUrl: self.curConfig.fetchUrl,
                            configs : _.pick(self.curConfig, "keys", "needIndex", "uId"),
                            data    : dataJson,
                            callback: function (res) {
                                //self.$workDateList.prepend(self.tplDepsearch);
                            }
                        });
                        break;
                    case "transfer":
                        Remote({
                            url    : self.curConfig.fetchUrl,
                            data   : dataJson,
                            success: function (res) {
                                self.$workDateList.html(self.tplTransfer);
                                // 两个表格对比
                                self.fixedBox = self.fixedBox ? self.fixedBox.render(dataJson) : new FixedBox({
                                    $el    : self.$workDateList.find('.data-list-two > .list-wrap'),
                                    configs: {
                                        data     : res.result && res.result.data && res.result.data.PRCdataList,
                                        keys     : res.result && res.result.data && res.result.data.themeList,
                                        needIndex: true
                                    }
                                });
                                self.fixedBox1 = self.fixedBox1 ? self.fixedBox1.render(dataJson) : new FixedBox({
                                    $el    : self.$workDateList.find('.data-list-one > .list-wrap'),
                                    configs: {
                                        data     : res.result && res.result.data && res.result.data.USdataList,
                                        keys     : res.result && res.result.data && res.result.data.themeList,
                                        needIndex: true
                                    }
                                });
                            }
                        });

                        break;
                    default:
                        new TableView({
                            $el       : self.$workDateList,
                            keyConfigs: self.curConfig.keyConfigs,
                            fetchUrl  : self.curConfig.fetchUrl,
                            data      : dataJson
                        });
                        break;
                }
                ;
            }
            Tool.stop(e);
        },

        treeFold: function (event) {
            var $this = $(event.currentTarget);
            var $li = $this.parent();
            var $treeMid = $li.find('.tree-mid');
            if ($treeMid.length) {
                $li.toggleClass('active');
            }
        },

        treeCheckbox: function (event) {
            var $this = $(event.currentTarget);
            var $parentLi = $this.parents('li');
            var $subCheckbox = $this.parent().find('.checkbox-imitation');
            var $siblingCheckbox = $this.parent().parent().siblings('.tree-mid').find('.checkbox-imitation-active');
            var _this = this;
            $this.toggleClass('checkbox-imitation-active');
            if ($this.hasClass('checkbox-imitation-active')) {
                $parentLi.children('.checkbox-imitation').addClass('checkbox-imitation-active');
                $subCheckbox.addClass('checkbox-imitation-active')
            } else {
                if (!$siblingCheckbox.length) {
                    $parentLi.children('.checkbox-imitation').removeClass('checkbox-imitation-active');
                }
                $subCheckbox.removeClass('checkbox-imitation-active');
            }

            _this.treeChecked();
        },

        treeChecked: function (selector) {
            var _this = this;
            var $treeRoot = $(selector || '.tree-wrap');
            var $treeInput = $('input.J_tree_input');
            var $checked = $treeRoot.find('.checkbox-imitation-active');
            var checkedArr = [];
            $checked.each(function () {
                checkedArr.push($(this).data('deptid'));
            });
            $treeInput.val(checkedArr.join(','));
        },

        exportBtn : function(event) {
            var _this = this,
                interactiveObj = interactiveEvent.serializeFields(this.$workOperation, 'browser'),
                dataJson = interactiveObj.dataJson;
            ExportExcel({
                url : _this.curConfig.fetchUrl,
                data: dataJson
            });
        },
    });
});