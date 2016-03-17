define([
	'jquery',
	'underscore',
	'backbone',
	'common/requestConfig',
	'common/interactiveEvent',
	'plugin/jq.form'
], function($, _, B, requestConfig, interactiveEvent) {
	return B.View.extend({
		events: {
			'click .ac_showMessage': 'showMessage',		// 显示消息详情
			'click .ac_exportMessage': 'exportMessage'	// 导出历史消息
		},
		initialize: function(options) {
			var me = this;
			var $el = me.$el;

			me.renderList({
				initialize: true
			});
		},
		// 渲染人员列表
		renderList: function(options) {
			var me = this;
			var $el = this.$el;
			var o = {
				pageSize: interactiveEvent.getPageSize(),
				pageIndex: 1
			};
			$.extend(o, options);

			var $workloadData = $el.find('div.workload-data-list'),
				$workloadFooter = $el.find('div.workload-data-footer'),
				$workloadOperation = $el.find('div.workload-operation');
			var _data = 'oprt=list&pageSize=' + o.pageSize + '&pageIndex=' + o.pageIndex;
			if(o.data !== undefined) _data += '&' + o.data;

			$.ajax({
				type: 'GET',
				dataType: 'JSON',
				url: requestConfig.setting.message + '?' + _data
			}).done(function (r) {
				if(r.resultType === 'true') {
					var _messageTPL = $('#workloadMessage').html(),
						_operationTPL = $('#workloadOperation').html();
					var _messageList = _.template(_messageTPL)({'list': r.result, 'resultRight': r.resultRight}),
						_operationList = _.template(_operationTPL)({'resultRight': r.resultRight});

					// 存储历史消息列表，以供查看消息详情使用
					me.messageList = r.result;

					$workloadData.html(_messageList);
					// 分页
					$workloadFooter.workloadPage({
						fieldNum: r.result.length,
						totalPage: r.totalPage,
						pageSize: r.pageSize,
						pageIndex: r.pageIndex,
						callback: function(options) {
							me.renderList(options);
						}
					});
					
					// 搜索
					if(o.initialize) {
						$workloadOperation.html(_operationList);
						$workloadOperation.workloadSearch({
							callback: function(options) {
								me.renderList(options);
							}
						});
					}
				}else {
					// 请求失败
				}
			}).fail(function () {
				// 请求失败
			});
		},
		// 显示消息详情
		showMessage: function(e) {
			var me = this;
			var $target = $(e.currentTarget);
			var _msgId = $target.attr('msgId'),
				_messageTPL = $('#messageDetail').html(),
				_messageItem = _.findWhere(me.messageList, {id: _msgId});

			// 初始化弹窗
			var $messageSprite = interactiveEvent.sprite({
				title: '消息详情',
				className: 'interactive-message',
				msg: _.template(_messageTPL)(_messageItem),
				width: 700,
				confirmButton: false,
				closeText: '关闭',
				easyClose: true
			});

			return false;
		},
		// 导出历史消息
		exportMessage: function() {
			var $el = this.$el;
			var _data = $el.find('div.workload-search').find('input.search-key').val() || '';

			$.ajax({
				type: 'GET',
				dataType: 'JSON',
				url: requestConfig.setting.messageExp + '?' + _data
			}).done(function (r) {
				if(r.resultType === 'true') {
					location.href = requestConfig.excelOut;
				}else {
					// 请求失败
				}
			}).fail(function () {
				// 请求失败
			});

			return false;
		}
	});
});