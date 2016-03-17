/**
 * @图片幻灯片插件
 * Author: gzxushaolong
 */
define(["jquery"], function($) {
	$.fn.photoSlides = function(options) {
		var $this = $(this);
		var o = {
			timer: null,
			total: $this.find('.slides-item').length,
			current: 0,
			animating: false,
			btnTPL: ''
		}
		$.extend(o, options);

		// 幻灯片自动播放
		o.start = function() {
			o.timer = setInterval(o.next, 6000);
		}
		o.next = function() {
			var next = o.current + 1;
			o.goto(next);
		}
		// 清除幻灯片自动播放
		o.pause = function() {
			if(o.timer != null) clearInterval(o.timer);
			o.timer = null;
		}
		// 定位到指定的幻灯片
		o.goto = function(i) {
			// 禁止在幻灯片播放过程中继续幻灯
			if(o.animating) return false;
			o.animating = true;

			var j = i>=o.total ? 0 : i;
			o.current = j;

			$this.find('.slides-control span:eq(' + j + ')').addClass('current').siblings('span').removeClass('current');
			$this.find('.slides-item:eq(' + j + ')').fadeIn('slow', function() {
				// 幻灯片播放完毕后重启自动播放
				o.animating = false;
				if(o.timer == null) o.start();
			});
			$this.find('.slides-item:eq(' + j + ')').siblings('.slides-item').fadeOut('slow');
		}

		// 初始化
		o.ini = function() {
			for(var i=0; i<o.total; i++) {
				o.btnTPL += '<span' + (i==0 ? ' class="current"' : '') + '></span>';
			}
			$this.find('.slides-control').html(o.btnTPL);
			$this.find('.slides-control span').unbind('click').bind('click', function() {
				var i = $(this).index();

				if($(this).hasClass('current')) return false;

				o.pause();
				o.goto(i);

				return false;
			});

			// 开始幻灯片效果
			o.start();
		}
		o.ini();
	};
});