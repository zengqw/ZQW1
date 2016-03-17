/**
 * Created by wjjn3481 on 2016/1/26.
 */
define(['jquery'], function ($) {
    return function (options) {
        var opts = {
                selector: '',
                startNumber: 13   // 开始隐藏的选项
            },
            hitNumber,
            selectorArr,
            $foldWrap = $('<div class="clearfix fold-wrapper J_foldWrap"><div class="clearfix J_foldArea" style="display: none;"></div><div class="fold-trigger"><span class="J_foldTrigger"></span></div></div>');

        $.extend(opts, options);

        hitNumber = opts.startNumber - 1;
        if (!opts.selector || 'string' !== typeof opts.selector) {
            return;
        }
        selectorArr = opts.selector.split(',');

        $.each(selectorArr, function (index, value) {
            var $all = $(value).find('dd > span.item-checkbox'),
                $prev = $all.eq(opts.startNumber - 2);
            $foldWrap.insertAfter($prev).find('.J_foldArea').html($all.filter(function (index) {
                return (index - hitNumber) >= 0;
            }).detach());
        });

        $('body').off('click.fold', '.J_foldTrigger').on('click.fold', '.J_foldTrigger', function (event) {
            $(this).toggleClass('active').parent().siblings('.J_foldArea').slideToggle();
        })
    }
});