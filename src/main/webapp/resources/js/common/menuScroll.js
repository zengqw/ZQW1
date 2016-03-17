/**
 * Created by wjjn3481 on 2016/1/22.
 */
define(['jquery'], function ($) {
    return function (options) {
        var opts = {
                selector: '.J_menu_fixed a[data-menu]' // 默认点击触发滚动元素
            },
            $window = $(window),
            $body = $('body'),
            limitHeight = 20;

        $.extend(opts, options);

        function navJump(event) {
            var $this = $(event.currentTarget);
            var type = $this.data('menu');

            window.__animate = true;

            radioClass($this);

            $("html, body").animate({scrollTop: $('#' + type).offset().top - limitHeight}, "slow", function () {
                delete window.__animate;
            });

            return false;
        }

        function radioClass ($element) {
            $element.closest('ul').find('a.active').removeClass('active').end().end().addClass('active');
        }

        $window.on('scroll.menuScroll', function (event) {

            if (this.__animate) {
                return false;
            }

            var result = [];
            $('.u-panel').each(function () {
                if (window.scrollY >= $(this).offset().top - limitHeight) {
                    result.push(this.id);
                } else {
                    return false;
                }
            });

            radioClass($('.J_menu_fixed a[data-menu=' + result.splice(-1) + ']'));
        });
        $body.on('click', opts.selector, navJump);
    };
});