/**
 * Created by wjjn3481 on 2015/12/31.
 */
define(['jquery', 'underscore', 'text!tmpl/common/format.html', 'cxcalendar'], function ($, _, TplFormat) {
    return function (options) {
        var opts = {
            key     : '',       // 字段名
            afterKey: '',       // 插入到指定字段后面
            label   : '',       // 字段中文名
            data    : [],       // 当前select的value值
            dateArr : ['financeBuyDate', 'financePayDate', 'standby1']        // type值为date类型的属性数组
        };
        var data, $html;

        $.extend(opts, options);

        $('body').off('click.selectChain', '.J_select_chain .ac_selectItem').on('click.selectChain', '.J_select_chain .ac_selectItem', function () {
            var $this = $(this);
            var $selectChain = $this.closest('.J_select_chain');
            var val = $this.attr('val');
            var index = $selectChain.prop("className").replace(/\D/g, "");
            var renderData = {
                disabled: false,
                key     : opts.key + index,
                label   : opts.label,
                required: false,
                type    : "text",
                value   : ''
            };

            // If 'afterKey' is set, change $selectChain object
            if (_.isString(opts.afterKey) && opts.afterKey.length > 0) {
                $selectChain = $selectChain.next('[class^="J_' + opts.afterKey + '"]');
            }

            var $next = $selectChain.next('.J_' + renderData.key);
            // remove old select/input/date
            $next.remove();

            data = _.findWhere(opts.data, {value: val});

            if (data.children) {
                _.extend(renderData, {value: data.children.value});
            }
            //if value is array, then change type into 'select'
            if ("[object Array]" === Object.prototype.toString.call(renderData.value) && renderData.value.length) {
                renderData.type = 'select'
            } else if (_.indexOf(opts.dateArr, val) > -1) {
                renderData.type = 'date'
            }

            // add more condition
            $html = $(_.template(TplFormat)(renderData));

            // append new select-edit
            $selectChain.after($html);
            if (_.indexOf(opts.dateArr, val) > -1) {
                $html.find('.J_calendar').cxCalendar();
            }
        });
    }
});