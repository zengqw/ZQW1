/**
 * product
 * @autoor zq
 * Created by 2015-10-29 11:11
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'view/common/table',
    './config',
    'text!tmpl/common/format.html',
    'common/tool',
    'common/interactiveEvent',
    'common/remote'
], function ($, _, B, TableView, Config, TplFormat, Tool, interactiveEvent, Remote) {
    return B.View.extend({
        events    : {
            'click .J_search' : 'search',
            'keydown .J_input': 'inputKeydown'
        },
        urls      : {
            initUrl: '/ams/propertyMng/initProperty?initType=product'
        },
        initialize: function (options) {
            var self = this;
            this.el = options.el;

            //渲染模板
            require([options.tpl], function (tpl) {
                self.el.innerHTML = tpl;
                self.cacheDom();
                self.bindEvent();
            });
        },
        cacheDom  : function () {
            this.$workOperation = $('.workload-operation');
            this.$workSearch = $('.J_search_form');
            this.$workData = $('.workload-data-list');
            this.tplSearch = $('#J_tpl_search').html();
        },
        bindEvent : function () {
            var self = this;
            this.$workOperation.workloadSearch();
            this.tableView = new TableView({
                $el    : self.$workData,
                url    : "propertyMng/getProductCodeList",
                cols   : [30, 50, 20],
                theads : ["ID", "产品Code", "产品名称"],
                unitTpl: $("#J_unit_tpl").html()
            });
            this.render();
        },
        render    : function () {
            var _this = this;
            var html;
            Remote({
                url    : this.urls.initUrl,
                success: function (res) {
                    if (200 === res.code) {
                        html = _.template(_this.tplSearch)({
                            data: res.result && res.result.data,
                            tpl : TplFormat,
                            list: Config.product
                        });

                        _this.$workSearch.html(html);
                    } else {
                        $.oaTip(res.desc, 'error');
                    }
                }
            });
            this.tableView.render();
        },

        // search result with condition
        search: function (event) {
            var _this = this;
            var interactiveObj = interactiveEvent.serializeFields(this.$workOperation, 'browser'),
                dataJson = interactiveObj.dataJson;

            this.tableView.render(dataJson);

            Tool.stop(event);
        },

        inputKeydown: function (event) {
            if (event.which === 13) {
                $('.J_search').trigger('click');
            }
        }
    });

})