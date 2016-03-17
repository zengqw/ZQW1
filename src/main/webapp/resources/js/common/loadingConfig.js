define([
	'jquery'
], function ($) {
	var $loading = $('<div class="loading" ng-class="{active:loading.active}">loading</div>'),
		$overlay = $('<div class="loading-overlay" ng-class="{active:loading.active}">&nbsp;</div>'),

		classActive = {
			loading: 'loading__active',
			overlay: 'loading-overlay__active'
		},

		timer = null,

		enable = true;

	function showLoading() {
		if (!enable) {
			enable = true;
			return;
		}

		timer = setTimeout(function () {
			$loading.addClass(classActive.loading);
			$overlay.addClass(classActive.overlay);
		}, 0);
	}

	function hideLoading() {
		clearTimeout(timer);

		$loading.removeClass(classActive.loading);
		$overlay.removeClass(classActive.overlay);

		$loading.text('loading');
		$loading.removeAttr('style');
	}

	$.toggleLoading = function (toggle) {
		enable = !!toggle;
	};

	$.settingLoading = function (text, style) {
		if (text) {
			$loading.text(text);
			$loading.css(style || {});
		}
	};

	$.ajaxSetup({
		timeout: 1000 * 60 * 10 // 十分钟
	});

	$(document).ajaxStart(function () {
		showLoading();
	});

	$(document).ajaxStop(function () {
		setTimeout(function() {
			hideLoading();
		}, 200);
	});

	$(window).on('error', function () {
		hideLoading();
	});

	$(document.body).prepend($loading).prepend($overlay);
});