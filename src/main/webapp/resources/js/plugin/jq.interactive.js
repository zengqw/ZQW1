/**
 * @弹窗插件
 * Author: gzxushaolong
 */
define(["jquery", "plugin/sharpTool"], function($) {
	var __removeBoxTimeoutId = null;
	var __removeErrorTimeoutId = null;
	var __easyType = '';

	var __box = function(options) {
		__remove(options.type);
		options = $.extend({
			title: '',
			msg: '',
			direction: '',						// 框体弹窗方向：up|right|down|left
			target: undefined,					// 触发框体元素，箭头对齐目标
			alignTarget: undefined,				// 框体对齐目标，未定义时对齐到target
			align: 'center',					// 框体对齐方式：top|right|bottom|left|middle|center
			noArrow: true,						// 不显示箭头
			noCloser: false,					// 不显示关闭
			arrowSize: {w:20, h:11},			// w:箭头宽，h:箭头高
			radiusSize: 0,						// 弹窗边框大小
			outerFix: {t:8, r:20, b:8, l:20},	// 弹窗定位偏移
			showButtons: true,					// 显示操作按钮
			confirmButton: false,				// 显示确定按钮
			confirmText: '确定',
			clearButton: true,					// 显示清除按钮
			clearText: '清除',
			closeButton: true,					// 显示取消按钮
			closeText: '取消',
			easyClose: false,					// 是否单击其他位置关闭弹窗
			animate: 'slide',					// 弹窗动画方式：swing|slide|none
			loading: true,						// 是否显示加载动画
			heightLimit: true						// 是否限制高度
		}, options);
		if(options.noArrow) options.arrowSize = {a:0, b:0};

		if(options.type == 'confirm') options.msg = '<div class="confirm-content">' + options.msg + '</div>';

		// 弹窗TPL
		var loadingTPL = '<div class="interactive-loading">数据正在加载中，请稍后...</div>';
		var contentTPL =
			(options.noArrow ? '' : '<em class="interactive-arrow interactive-arrow-' + options.direction + '">^</em>') +
			(options.title != '' ? '<div class="interactive-title"' + (options.move ? ' style="cursor:move;"' : '') + '>' + (options.title ? '<h3>' + options.title + '</h3>' : '') + (options.noCloser ? '' : '<a href="javascript:void(0);" class="interactive-close interactive-x">关闭</a>') + '</div>' : '') +
			'<div class="interactive-error">\
				<a href="javascript:void(0);" class="interactive-x">关闭</a>\
				<p></p>\
			</div>\
			<div class="interactive-success">\
				<a href="javascript:void(0);" class="interactive-x">关闭</a>\
				<p></p>\
			</div>\
			<div class="interactive-content" style="' + (options.width!='' ? 'width:' + options.width + 'px;' : '') + (options.height!='' ? 'height:' + options.height + 'px;' : '') + '">' + options.msg + '</div>\
			<div class="interactive-button"' + (options.showButtons ? '' : ' style="display:none;"') + '><em' + (options.confirmButton ? '' : ' style="display:none;"') + '><a href="#" class="interactive-confirm ac_interactiveConfirm">' + options.confirmText + '</a></em><em' + (options.clearButton ? '' : ' style="display:none;"') + '><a href="#" class="interactive-cancel ac_interactiveClear">' + options.clearText + '</a></em><em' + (options.closeButton ? '' : ' style="display:none;"') + '><a href="#" class="interactive-cancel interactive-x">' + options.closeText + '</a></em></div>';
		//var boxTPL = '<div id="jq-interactive-' + options.type + '" class="interactive-box' + (options.color=='blue' ? ' interactive-blue' : '') + '"><table class="interactive-table" border="0" cellspacing="0" cellpadding="0"><colgroup><col width="8px"><col width="8px"><col width="8px"></colgroup><tbody><tr><td class="wrapperTL"></td><td class="wrapperTC"></td><td class="wrapperTR"></td></tr><tr><td class="wrapperML"></td><td class="wrapperMC"><div class="interactive-wrapper">' + contentTPL + '</div></td><td class="wrapperMR"></td></tr><tr><td class="wrapperBL"></td><td class="wrapperBC"></td><td class="wrapperBR"></td></tr></tbody></table></div>';
		var boxTPL = '<div id="jq-interactive-' + options.type + '" class="interactive-box' + (options.className ? ' ' + options.className : '') + '"><table class="interactive-table" border="0" cellspacing="0" cellpadding="0"><colgroup><col width="0"><col width="0"><col width="0"></colgroup><tbody><tr><td class="wrapperTL"></td><td class="wrapperTC"></td><td class="wrapperTR"></td></tr><tr><td class="wrapperML"></td><td class="wrapperMC"><div class="interactive-wrapper">' + contentTPL + '</div></td><td class="wrapperMR"></td></tr><tr><td class="wrapperBL"></td><td class="wrapperBC"></td><td class="wrapperBR"></td></tr></tbody></table></div>';
		var $box = $(boxTPL).appendTo(document.getElementById('content') || document.body);
		var $content = $box.find('div.interactive-content');

		$(document).unbind("click", __autoRemove);

		// 绑定关闭弹窗事件
		$box.find('.interactive-x').click(function() {
			if(options.onbeforeClose) options.onbeforeClose();
			__remove(options.type);
			if(options.onclose) options.onclose();
			return false;
		});

		// 显示加载动画
		if(options.loading && options.msg=='') $box.find('div.interactive-content').html(loadingTPL);
		
		// 显示遮罩
		if(options.mask) $.mask({type: options.type});
		
		// 如果指定了top left，那么给box做标记， __resetPos不再重置位置
		if(options.left || options.top) $box.data('customPosition', true);
		$box.data('options', options);
		__setPos($box);

		// 防止内容过高造成溢出
		if(!options.heightLimit) $box.find('div.interactive-content').css('height', '');

		// 弹窗加载完回调
		if(options.onsuccess) options.onsuccess($content);
		// 弹窗确定按钮回调
		if(options.onconfirm) {
			$box.delegate('a.ac_interactiveConfirm', 'click', function() {
				options.onconfirm($content, $(this));
				return false;
			});
		}
		// 弹窗清除按钮回调
		if(options.onclear) {
			$box.find('a.ac_interactiveClear').unbind('click').bind('click', function() {
				options.onclear();
				return false;
			});
		}

		// 按住标题移动弹窗
		if(options.move) $.sTool.drag($box.find('div.interactive-title'), $box);
		// 窗口大小发生变化时重新定位弹窗
		if(options.keepPos)
			$(window).resize(function() {
				options.animate = 'none';
				$box.data('options', options);
				__resetPos($box);
			});
		
		// 单击屏幕其他位置关闭弹窗
		if(options.easyClose) {
			$(document).off('mousedown').on('mousedown', function(e) {
				var target = e.target || e.srcElement;
				while(target && target !== document && !$(target).hasClass('interactive-box')) {
					target = target.parentNode;
				}
				if(target === document) {
					if(options.onbeforeClose) options.onbeforeClose();

					__easyType = options.type;
					__autoRemove();

					if(options.onclose) options.onclose();

					// 移除弹窗时顺便移除绑定在document上的事件
					$(document).off('mousedown');
				}
			});
		}

		$box.extend({
			remove: function() {
				if(options.onbeforeClose) options.onbeforeClose();
				__remove(options.type);
				if(options.onclose) options.onclose();
			}
		});
		return $box;
	}

	// 移除弹窗
	var __remove = function(type) {
		if(!type) $('#jq-interactive-box, #jq-interactive-alert, #jq-interactive-notice, #jq-interactive-errormsg, #jq-interactive-successmsg, #jq-interactive-mask').remove();
		else $('#jq-interactive-errormsg, #jq-interactive-successmsg, #jq-interactive-' + type + ', #jq-interactive-' + type + '-mask').remove();
	}
	var __autoRemove = function() {
		if(__easyType == '') return;
		
		__remove(__easyType);
	}
	// 弹窗定位
	var __setPos = function(box) {
		var $box = box || $('#jq-interactive-box');
		var _pos = getMidOfClient($box),
			_arrowPos = {x: undefined, y: undefined},
			_options = $box.data('options');
		var $alignTarget = $(_options.alignTarget || _options.target || 'body'),
			$target = $(_options.target || 'body');

		var alignOffset = $alignTarget.offset(),
			targetOffset = $target.offset();

		switch(_options.align) {
			// 垂直对齐，对应direction: left|right
			case 'top':
				_pos.y = alignOffset.top - 20;
				_arrowPos.y = 20 + ($target.outerHeight() - _options.arrowSize.h)/2;
				break;
			case 'middle':
				_pos.y = alignOffset.top - ($box.outerHeight() - $alignTarget.outerHeight())/2;
				_arrowPos.y = targetOffset.top - _pos.y + ($target.outerHeight() - _options.arrowSize.h)/2;
				break;
			case 'bottom':
				_pos.y = alignOffset.top + $alignTarget.outerHeight() - $box.outerHeight();
				_arrowPos.y = targetOffset.top - _pos.y + ($target.outerHeight() - _options.arrowSize.h)/2 - _options.outerFix.t;
				break;
			// 水平对齐，对应direction: up|down
			case 'left':
				_pos.x = alignOffset.left - _options.outerFix.l;
				_arrowPos.x = targetOffset.left - _pos.x + ($alignTarget.outerWidth() - _options.arrowSize.w)/2 - _options.radiusSize;
				break;
			case 'center':
				_pos.x = alignOffset.left - ($box.outerWidth() - $alignTarget.outerWidth())/2;
				_arrowPos.x = targetOffset.left - _pos.x + ($alignTarget.outerWidth() - _options.arrowSize.w)/2 - _options.radiusSize;
				break;
			case 'right':
				_pos.x = alignOffset.left + $alignTarget.outerWidth() - $box.outerWidth() + _options.outerFix.r;
				_arrowPos.x = targetOffset.left - _pos.x + ($alignTarget.outerWidth() - _options.arrowSize.w)/2 - _options.radiusSize;
				break;
		}
		switch(_options.direction) {
			case 'left':
				_pos.x = targetOffset.left - $box.outerWidth() - 10;
				break;
			case 'right':
				_pos.x = targetOffset.left + $target.outerWidth() + 10;
				break;
			case 'up':
				_pos.y = targetOffset.top - $box.outerHeight() - (_options.arrowSize.h - _options.radiusSize);
				break;
			case 'down':
				_pos.y = targetOffset.top + $target.outerHeight() + _options.outerFix.b;
				break;
			default:
				_pos.y = ($(window).height() - $box.outerHeight())/2 + $(document).scrollTop();
				if(_pos.y < 0) _pos.y = 0;
				break;
		}

		var _top = _options.top || _pos.y;
		var _left = _options.left || _pos.x;

		$box.find('em.interactive-arrow').css({
			top: _arrowPos.y,
			left: _arrowPos.x
		});

		if($.sTool.isIe && $.sTool.ieVersion <= 8) _options.animate = 'none';


		switch(_options.animate) {
			case 'swing':
				$box.css({
					top: _top - 200,
					left: _left
				})
				$box.animate({
					top: _top
				}, 1000, 'easeOutBounce', function(){});
				break;
			case 'slide':
				$box.css({
					top: _top - 20,
					left: _left
				});
				$box.animate({
					top: _top
				}, 500);
				break;
			case 'none':
				$box.css({
					top: _top,
					left: _left
				});
				break;
		}
	}
	var __resetPos = function(box) {
		var $box = box || $('#jq-interactive-box');
		if($box.data('customPosition')) return;
		__setPos($box);
	}
	// Loading
	function __showLoading() {
		__clearError();
		$('#jq-interactive-box').find('.interactive-loading').css('visibility', 'visible');
	}
	function __hideLoading() {
		$('#jq-interactive-box').find('.interactive-loading').css('visibility', 'hidden');
	}

	// 全局弹窗参数
	var __globalOptions = {
		type: 'box',
		title: '',
		content: '',
		width: '',
		height: '',
		mask: false,
		liveTime: 3000,
		onComplete: null,
		onClosed: null
	}

	$.extend({
		sprite: function(options) {
			var _baseOption = {
				type: 'sprite',
				mask: false,
				move: false,
				keepPos: true
			}
			options = $.extend({}, __globalOptions, _baseOption, options);
			var $box = __box(options);

			return $box;
		},
		confirm: function(options) {
			var _baseOption = {
				type: 'confirm',
				className: 'jq-interactive-confirm',
				width: 400,
				confirmButton: true,
				clearButton: false,
				mask: true,
				move: true,
				animate: 'swing',
				keepPos: true
			}
			options = $.extend({}, __globalOptions, _baseOption, options);
			var $box = __box(options);

			return $box;
		},
		mask: function(options) {
			var options = $.extend({
				color: '#000000',
				opacity: 0.2,
				animate: 'show'
			}, options);

			// init UI
			__remove('mask');
			var $mask = $('<div id="jq-interactive-' + options.type + '-mask" class="interactive-mask"></div>').appendTo(document.body);
			$mask.css({
				backgroundColor: options.color,
				opacity: options.opacity
			}).show();
		},
		hideUI: function() {
			$('div.interactive-box').each(function() {
				$(this).remove();
			});
			__autoRemove();
		},
		/*
			操作结果提示框
			调用方式：$.oaTip('提示语', 'info/success/error/warning');
			注意事项：提示语控制在18个汉字以内，type默认为info
		 */
		oaTip: function(text, type, time, callback, textType) {
			var $tip = $('#oaTipBox');
			var _type = type || 'info',
				_time = isNaN(time) ? 2000 : time;
				_tpl = '<div id="oaTipBox" class="oa-tip oa-' + _type + '-tip"><a href="#" class="close-tip"></a><i></i><div class="tip-content"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td>' + text + '</td></tr></table></div></div><div id="oaTipMask" class="oa-tip-mask"></div>';
			var _animateTimeout = null;

			if($tip.length > 0) {
				if(textType == 'html') $tip.removeClass().addClass('oa-tip oa-' + _type + '-tip').find('td').html(text);
				else $tip.removeClass().addClass('oa-tip oa-' + _type + '-tip').find('td').text(text);
				return;
			}
			
			$('body').append(_tpl);
			$tip = $('#oaTipBox');
			$mask = $('#oaTipMask');

			if(time == 0) $tip.find('a.close-tip').hide();

			var _top = ($(window).height() - $tip.outerHeight())/2 + $(document).scrollTop();
			var _left = ($(window).width() - $tip.outerWidth())/2;
			$tip.css({
				'top': _top + 'px',
				'left': _left + 'px'
			});
			$tip.find('a.close-tip').unbind('click').bind('click', function() {
				$tip.remove();
				$mask.remove();

				clearTimeout(_animateTimeout);
				if(callback) callback();
				return false;
			});

			if(_time != 0) {
				_animateTimeout = setTimeout(function() {
					$tip.animate({'top': (_top-200) + 'px', 'opacity': 0}, function() {
						$tip.remove();
						$mask.remove();
						if(callback) callback();
					});
				}, _time);
			}
		},
		operateTip: function(options) {
			var o = {
				type: 'info',
				top: 115
			};
			$.extend(o, options);

			var $operateTip = $('#operateTip');
			var _date = new Date(),
				_hour = _date.getHours(),
				_minute = _date.getMinutes(),
				_time = (_hour<10 ? '0'+_hour : _hour) + ':' + (_minute<10 ? '0'+_minute : _minute),
				_tpl = '<div id="operateTip" class="workload-operate-tip" style="top:' + o.top + 'px;">' + _time + ' ' + o.msg + '</div>';

			if(o.type === 'error') _tpl = '<div id="operateTip" class="workload-operate-tip workload-operate-error-tip" style="top:' + o.top + 'px;">' + o.msg + '</div>';

			if($operateTip.length > 0) $operateTip.remove();

			$('body').append(_tpl);
			$operateTip = $('#operateTip');

			setTimeout(function() {
				$operateTip.animate({'opacity': 0}, function() {
					$operateTip.remove();
				});
			}, 3000);
		},
		resetPop: function() {
			__setPos($('.interactive-box').stop());
		}
	});
	function getMidOfClient(el) {
		var $el = $(el);
		if($el.length == 0) return;
		var _client = $(window);
		var _dom = $(document);
		var _pos = {};
		_pos.x = ((_client.width() - $el.outerWidth())/2 + _dom.scrollLeft()) >> 0;
		_pos.y = ((_client.height() - $el.outerHeight())/2 + _dom.scrollTop()) >> 0;
		return _pos;
	}
});