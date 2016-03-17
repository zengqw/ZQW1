/**
 * Created by wjjn3481 on 2016/1/8.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'common/interactiveEvent',
    'common/uploadFile'
], function ($, _, B, interactiveEvent, UploadFile) {
    return B.View.extend({
        initialize: function (options) {
            var _this = this;
            //渲染模板
            require([options.tpl], function (tpl) {
                _this.el.innerHTML = tpl;
                UploadFile({
                    uploadUrl: '/ams/batchModify/batchModifyByExcel',
                    selector : '.file-wrapper'
                });
            });
        }
    })
});