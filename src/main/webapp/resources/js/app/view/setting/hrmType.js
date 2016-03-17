define([
	'jquery',
	'underscore',
	'backbone',
	'common/requestConfig',
	'common/interactiveEvent'
], function($, _, B, requestConfig, interactiveEvent) {
	return B.View.extend({
		events: {
			'click .ac_editHrmType': 'editHrmType',		// 新建、修改组织单元
			'click .ac_removeHrmType': 'removeHrmType'	// 删除组织单元
		},
		initialize: function(options) {
			var me = this;
			var $el = me.$el;

			me.renderList({
				initialize: true
			});
		},
		// 渲染组织单元列表
		renderList: function(options) {
			var me = this;
			var $el = me.$el;
			var o = {
				pageSize: interactiveEvent.getPageSize(),
				pageIndex: 1
			};
			$.extend(o, options);

			var $workloadData = $el.find('div.workload-data-list'),
				$workloadFooter = $el.find('div.workload-data-footer'),
				$workloadOperation = $el.find('div.workload-operate-box');
			var _data = 'pageSize=' + o.pageSize + '&pageIndex=' + o.pageIndex;

			$.ajax({
				type: 'post',
				dataType: 'JSON',
				url: requestConfig.setting.hrmType + '?' + _data
			}).done(function (r) {
				if(r.resultType == 'true') {
					var _hrmTPL = $('#workloadHrmType').html(),
						_operationTPL = $('#workloadOperation').html();
					var _hrmList = _.template(_hrmTPL)({'list': r.result, 'resultRight': r.resultRight, 'maxOrder': r.maxOrder}),
						_operationList = _.template(_operationTPL)({'resultRight': r.resultRight});

					$workloadData.html(_hrmList);
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

					if(o.initialize) {
						// 操作按钮
						$workloadOperation.html(_operationList);
					}
				}else {
					// 请求失败
				}
			}).fail(function () {
				// 请求失败
			});
		},
		// 新建、修改组织单元
		editHrmType: function(e) {
			var me = this;
			var $el = me.$el,
				$target = $(e.currentTarget),
				$tr = $target.parents('tr');
			var _oprt = $target.data('oprt'),
				_orgFormTPL = $('#hrmTypeForm').html(),
				//_operateTip = _oprt=='add' ? '人员类型新建成功' : '人员类型修改成功',
				_spriteTitle = _oprt=='add' ? '新建人员类型' : '修改人员类型',
				_spriteOption = {
					oprt: _oprt,
					order: $("#maxOrder").val()
				};

			// 修改单元
			if(_oprt == 'edit') {
				_spriteOption = {
					oprt: _oprt,
					id: $tr.data('id'),
					name: $tr.data('name'),
					order: $tr.data('order'),
					code: $tr.data('code'),
					desc: $tr.find('td.desc-item').text()
				}
			}

			// 初始化弹窗
			var $projectSprite = interactiveEvent.sprite({
				title: _spriteTitle,
				msg: _.template(_orgFormTPL)(_spriteOption),
				onconfirm: function(obj, target) {
					var $target = $(target);
					if($target.hasClass('interactive-lock')) return false;
					// 锁定提交按钮，防止连续提交
					$target.addClass('interactive-lock');
					
					var _submitData = interactiveEvent.serializeFields($(obj).find('form'));

					if(!_submitData.isNotEmpty) {
						var _errorTip = '页面有必填项未填写';
						var $firstEmptyEl = _submitData.firstEmptyEl.parents('dl');
						
						$.oaTip(_errorTip, 'warning', 1500, function() {
							interactiveEvent.setElMiddle($firstEmptyEl, function () {
								$.sTool.errorBlink($firstEmptyEl);
							});
						});

						// 解锁提交按钮
						$target.removeClass('interactive-lock');

						return false;
					}

					$.ajax({
						type: 'POST',
						dataType: 'JSON',
						url: requestConfig.setting.hrmTypeOprt,
						data: 'oprt=' + _oprt + '&' + _submitData.dataModel
					}).done(function (r) {
						if(r.resultType == 'true') {
							$.oaTip(r.resultMsg, 'success', 1000, function() {
								$projectSprite.remove();

								// 重新渲染项目列表
								var _pageIndex = $el.find('div.workload-page').find('li.current').attr('index') || 1;
								me.renderList({
									pageIndex: _pageIndex
								});
							});
						}else {
							// 请求失败
							$.oaTip(r.resultMsg, 'error', 2000);
						}

						// 解锁提交按钮
						$target.removeClass('interactive-lock');
					}).fail(function () {
						// 请求失败
					});
				}
			});

			return false;
		},
		// 删除组织单元
		removeHrmType: function(e) {
			var me = this;
			var $target = $(e.currentTarget),
				$tr = $target.parents('tr');
			var _id = $tr.data('id');

			interactiveEvent.removeComfirm($target, '确定删除该人员类型？', function() {
				$.ajax({
					type: 'GET',
					dataType: 'JSON',
					url: requestConfig.setting.hrmTypeOprt + '?oprt=del&id=' + _id
				}).done(function (r) {
					if(r.resultType == 'true') {
						$.oaTip(r.resultMsg, 'success', 1000, function() {
							me.removeRefresh();
						});
					}else {
						// 请求失败
						$.oaTip(r.resultMsg, 'error', 2000);
					}
				}).fail(function () {
					// 请求失败
				});
			});

			return false;
		},
		// 删除后刷新
		removeRefresh: function() {
			var me = this;
			var $el = me.$el,
				$workloadDataList = $el.find('div.workload-data-list'),
				$page = $el.find('div.workload-page');
			var _len = $workloadDataList.find('tbody').find('tr').length,
				_pages = parseInt($page.attr('pages')),
				_current = parseInt($page.find('div.page-list').find('li.current').attr('index')) || 1;

			if(_len>1 || _pages===1) {
				me.renderList({
					pageIndex: _current
				});
			}else {
				me.renderList({
					pageIndex: _current-1
				});
			}
		}
	});
});