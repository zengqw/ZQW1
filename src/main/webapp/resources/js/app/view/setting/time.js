define([
	'jquery',
	'underscore',
	'backbone',
	'common/requestConfig',
	'common/interactiveEvent',
	'plugin/jq.interactive'
], function($, _, B, requestConfig, interactiveEvent) {
	return B.View.extend({
		events: {
			'click .ac_changeTimeState': 'changeTimeState'	// 更改区间状态
		},
		initialize: function(options) {
			var me = this;
			var $el = me.$el;

			me.renderList();
		},
		// 渲染区间列表
		renderList: function(options) {
			var $el = this.$el;
			var o = {};
			$.extend(o, options);

			var $workloadData = $el.find('div.workload-data-list');
			$.ajax({
				type: 'post',
				dataType: 'JSON',
				url: requestConfig.setting.time
			}).done(function (r) {
				if(r.resultType == 'true') {
					var _projectTPL = $('#workloadTime').html();
					var _projectList = _.template(_projectTPL)({'list': r.result, 'resultRight': r.resultRight});

					$workloadData.html(_projectList);
				}else {
					// 请求失败
				}
			}).fail(function () {
				// 请求失败
			});
		},
		// 更改区间状态
		changeTimeState: function(e) {
			var me = this;
			var $target = $(e.currentTarget),
				$tr = $target.parents('tr');
			var _id = $tr.data('id'),
				_oprt = $target.data('oprt'),
				_oprtTip = {
					open: '确定打开该区间？',
					close: '确定关闭该区间？',
					end: '确定归档该区间？',
					endNext: '确定归档并打开下月区间？'
				};



			interactiveEvent.removeComfirm($target, _oprtTip[_oprt], function() {
				function postTime() {
					$.ajax({
						type: 'post',
						dataType: 'JSON',
						url: requestConfig.setting.timeOprt,
						data: 'oprt=' + _oprt + '&id=' + _id
					}).done(function (r) {
						if(r.resultType == 'true') {
							$.oaTip(r.resultMgs, 'success', 1000, function() {
								// 重新渲染区间列表
								me.renderList();
							});
						}else {
							// 请求失败
							$.oaTip(r.resultMgs, 'error', 2000);
						}
					}).fail(function () {
						// 请求失败
					});
				}

				if(_oprt === 'end') {
					$.ajax({
						type: 'post',
						dataType: 'JSON',
						url: requestConfig.setting.timeOprt,
						data: 'oprt=check&id=' + _id
					}).done(function (r) {
						if(r.resultType == 'true') {
							var $confirm = $.confirm({
								title: '确认提交',
								msg: '该区间下尚有未处理的组织单元，确认继续归档？',
								onconfirm: function(obj) {
									$confirm.remove();
									postTime();
								}
							});
						}else {
							postTime();
						}
					}).fail(function () {
						// 请求失败
					});
				}else {
					postTime();
				}
			});

			return false;
		}
	});
});