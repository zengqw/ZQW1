/**
 * Created by wjjn3481 on 2016/1/25.
 */
define(['jquery', 'underscore', 'text!tmpl/common/format.html'], function ($, _, TplFormat) {
    return function (options) {
        var opts = {
                selector     : '.ac_addCondition',     // 添加条件的元素，非必须
                data         : [],                     // 条件的初始化数据，必须
                showCondition: false                   // 初始化时是否隐藏查询条件
            },
            $body = $('body'),
            maxCount = 10,
            tpl = _.template(TplFormat);

        $.extend(opts, options);

        $body.off('click.addCondition', opts.selector);
        $body.off('click.removeCondition', '.ac_removeCondition');
        $body.on('click.addCondition', opts.selector, addCondition).on('click.removeCondition', '.ac_removeCondition', removeCondition);

        function addCondition(event) {
            var $this = $(event.currentTarget);
            var _this = this;
            var $add = $this.closest('.J_add');
            var html, data = [],
                initIndex = $('.J_multiCondition').length;
            if (!$add.length) {
                $add = $this.parent();
            }
            var conlogic = {
                key     : 'conlogic0',
                label   : '条件关系',
                type    : 'radioGroup',
                required: false,
                value   : [{
                    checked: true,
                    text   : "并且",
                    value  : "and"
                }, {
                    checked: false,
                    text   : "或者",
                    value  : "or"
                }]
            };

            if ( initIndex >= maxCount) {
                $.oaTip('不能超过10个查询条件', 'error');
                return false;
            }

            if (initIndex === 0) {
                // use these data alone
                data.push(opts.data[0], opts.data[1]);
            } else {
                // use these data alone
                data.push(conlogic, opts.data[0], opts.data[1]);
            }

            _.each(data, function (item, index) {
                var key = item.key;
                item.key = key.replace(/\d/g, "") + initIndex;
            });

            // add more condition
            html = _.map(data, function (item, index) {
                return tpl(item);
            });

            $add.before('<div class="clearfix J_multiCondition">' + html.join('') + '<div class="remove-icon ac_removeCondition J_multiIndex' + initIndex +'"></div></div>');
        }

        function removeCondition(event) {
            var $this = $(event.currentTarget),
                $parent = $this.parent('.J_multiCondition'),
                $prevAll = $parent.prevAll('.J_multiCondition'),
                $nextAll = $parent.nextAll('.J_multiCondition'),
                currentIndex = $prevAll.length;
            if ($this.hasClass('J_multiIndex0')) {
                if ($parent.siblings('.J_multiCondition').length === 0) {
                    initIndex = 0;
                } else {
                    $.oaTip('这个查询条件不能删除，你可以先删除下面的查询条件', 'error');
                    return false;
                }
            }
            $parent.remove();
            $nextAll.each(function (index, item) {
                currentIndex += index;
                $(this).find('input[type="hidden"]').each(function (index, item) {
                    var name = $(this).attr('name').replace(/\d/g, "") + currentIndex;
                    $(this).attr('name', name);
                })
            })
        }
    }
});