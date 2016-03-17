define([
	'jquery',
	'underscore',
	'backbone',
	'common/requestConfig',
	'plugin/jq.interactive'
], function($, _, B, requestConfig) {
	return B.View.extend({
		events: {
			'click .input-checkbox': 'toggleCheckbox',
			'click .ac_submitWorkloadRight': 'submitWorkloadRight'
		},
		initialize: function(options) {
			var me = this;
			var $el = me.$el;

			me.renderRightList();
		},
		// 渲染权限列表
		renderRightList: function(options) {
			var $el = this.$el;
			var o = {};
			$.extend(o, options);

			var $workloadData = $el.find('div.workload-data-list');
			$.ajax({
				type: 'GET',
				dataType: 'JSON',
				url: requestConfig.setting.right
			}).done(function (r) {
				if(r.resultType == 'true') {
					var _rightTPL = $('#workloadRight').html();
					var _rightList = _.template(_rightTPL)(r.result);

					$workloadData.html(_rightList);
				}else {
					// 请求失败
				}
			}).fail(function () {
				// 请求失败
			});
		},
		toggleCheckbox: function(e) {
			var $target = $(e.currentTarget);
			var _type = $target.data('type');

			if($target.hasClass('input-checkbox-lock')) {
				$target.removeClass('input-checkbox-hover input-checkbox-lock').removeAttr('title');
				$target.siblings('a').removeClass('input-checkbox-hover');
				return false;
			}

			$target.toggleClass('input-checkbox-hover');

			if(_type == '2') {
				if($target.hasClass('input-checkbox-hover')) $target.siblings('a').addClass('input-checkbox-hover input-checkbox-lock').attr('title', '勾选了操作权限，必须同时勾选查阅权限');
				else $target.siblings('a').removeClass('input-checkbox-lock').removeAttr('title');
			}

			return false;
		},
		submitWorkloadRight: function() {
			var $el = this.$el,
				$workloadData = $el.find('div.workload-data-list');
			var _right = '';

			$workloadData.find('a.input-checkbox-hover').each(function(index) {
				var $checkbox = $(this);

				if(index > 0) _right += ';';
				_right += $checkbox.data('role') + ',' + $checkbox.data('operation') + ',' + $checkbox.data('type');
			});

			if(_right.length == 0) {
				$.oaTip('您尚未勾选任何选项', 'warning', 2000);
			}else {
				console.log(_right);
				$.ajax({
					type: 'POST',
					dataType: 'JSON',
					url: requestConfig.setting.rightOprt,
					data: 'right=' + _right,
				}).done(function (r) {
					if(r.resultType == 'true') {
						$.oaTip('权限编辑成功', 'success', 1000);
					}else {
						// 请求失败
					}
				}).fail(function () {
					// 请求失败
				});
			}

			 return false;
		}
	});
});