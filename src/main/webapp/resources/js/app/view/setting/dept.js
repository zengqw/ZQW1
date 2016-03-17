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
			'click .ac_editDeptItem': 'editDeptItem',		// 新增、修改人员
			'click .ac_removeDeptItem': 'removeDeptItem',	// 删除人员
			'change .ac_uploadExcel': 'uploadExcel',	// 导入Excel
			'click .ac_exportDept': 'exportDept'			// 导出人员
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
				url: requestConfig.setting.dept + '?' + _data
			}).done(function (r) {
				if(r.resultType === 'true') {
					var _deptTPL = $('#workloadDept').html(),
						_operationTPL = $('#workloadOperation').html();
					var _deptList = _.template(_deptTPL)({'list': r.result, 'resultRight': r.resultRight}),
						_operationList = _.template(_operationTPL)({'resultRight': r.resultRight});

					// 存储人员类型列表，以供新增、编辑人员使用
					//me.hrmTypeList = r.hrmTypeList;

					$workloadData.html(_deptList);
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
		// 新增、修改人员
		editDeptItem: function(e) {
			var me = this;
			var $el = me.$el,
				$target = $(e.currentTarget),
				$tr = $target.parents('tr');
			var _oprt = $target.data('oprt'),
				_projectFormTPL = $('#deptForm').html(),
				_spriteTitle = _oprt==='add' ? '新建部门' : '修改部门',
				_spriteOption = {
					oprt: _oprt,
					objType: 1
				};

			// 修改人员
			if(_oprt === 'edit') {
				_spriteOption = {
					oprt: _oprt,
					id: $tr.data('id'),
					deptName: $tr.data('deptname'),
					supDeptId: $tr.data('supdeptid'),
					supDeptName: $tr.data('supdeptname'),
					code: $tr.data('code'),
					order: $tr.data('order')
				}
			}

			// 初始化弹窗
			var $projectSprite = interactiveEvent.sprite({
				title: _spriteTitle,
				msg: _.template(_projectFormTPL)(_spriteOption),
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
						url: requestConfig.setting.deptOprt,
						data: 'oprt=' + _oprt + '&' + _submitData.dataModel
					}).done(function (r) {
						if(r.resultType === 'true') {
							$.oaTip(r.resultMsg, 'success', 1000, function() {
								$projectSprite.remove();

								// 重新渲染项目列表
								var _data = $el.find('div.workload-search').find('input.search-key').val() || '',
									_pageIndex = $el.find('div.workload-page').find('li.current').attr('index') || 1;
								me.renderList({
									data: _data,
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
		// 删除人员
		removeDeptItem: function(e) {
			var me = this;
			var $target = $(e.currentTarget),
				$tr = $target.parents('tr');
			var _id = $tr.data('id');

			interactiveEvent.removeComfirm($target, '确定删除该部门？', function() {
				$.ajax({
					type: 'GET',
					dataType: 'JSON',
					url: requestConfig.setting.deptOprt + '?oprt=del&id=' + _id
				}).done(function (r) {
					if(r.resultType === 'true') {
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
		},
		// 上传Excel
		uploadExcel: function(e) {
			var me = this;
			var $file = $(e.currentTarget),
				$form = $file.parent(),
				$target = $form.siblings('a.import'),
				$loading = null;
			var _file = $file.val();

			$.toggleLoading(false);
			$form.ajaxForm({
				beforeSerialize: function() {
					$loading = $.sprite({
						className: 'interactive-loading-box',
						noArrow: false,
						arrowSize: {w:8, h:6},
						outerFix: {t:0, r:0, b:10, l:0},
						msg: '<span class="wait">文件正在上传，请稍后</span>',
						target: $target,
						direction: 'down',
						align: 'center',
						showButtons: false,
						loading: false,
						animate: 'slide'
					});
				},
				success: function(r) {
					var _data = eval('(' + r + ')');

					$loading.remove();
					$form[0].reset();

					if(_data.result && _data.result.length>0) {
						interactiveEvent.importError({
							errorList: _data.result,
							callback: function() {
								me.renderList({
									initialize: true
								});
							}
						});
					}else {
						if(_data.resultType === 'true') {
							$.oaTip('部门导入全部成功', 'success', 1500, function() {
								me.renderList({
									initialize: true
								});
							});
						}else {
							$.oaTip(_data.resultMgs, 'error', 1500);
						}
					}
				},
				error: function(r) {
					var _data = eval('(' + r + ')');
					
					$loading.remove();
					$form[0].reset();
					$.oaTip(_data.resultMgs, 'error', 2000);
				}
			});
			if(_file) {
				if(_file.match(/.(xls)$/ig)) {
					$form.submit();
				}else {
					$form[0].reset();
					$.oaTip('请上传2003版Excel文件', 'warning');
				}
			}
		},
		// 导出人员
		exportDept: function() {
			var $el = this.$el;
			var _data = $el.find('div.workload-search').find('input.search-key').val() || '';

			$.ajax({
				type: 'GET',
				dataType: 'JSON',
				url: requestConfig.setting.deptExp + '?' + _data
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