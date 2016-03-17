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
			'click .ac_editOrgItem': 'editOrgItem',		// 新建、修改组织单元
			'click .ac_removeOrgItem': 'removeOrgItem',	// 删除组织单元
			'change .ac_uploadExcel': 'uploadExcel',	// 导入Excel
			'click .ac_exportOrg': 'exportOrg',			// 导出组织单元
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
				$workloadOperation = $el.find('div.workload-operation');
			var _data = 'pageSize=' + o.pageSize + '&pageIndex=' + o.pageIndex;
			if(o.data !== undefined) _data += '&' + o.data;

			$.ajax({
				type: 'post',
				dataType: 'JSON',
				url: requestConfig.setting.org + '?' + _data
			}).done(function (r) {
				if(r.resultType == 'true') {
					var _orgTPL = $('#workloadOrg').html(),
						_operationTPL = $('#workloadOperation').html();
					var _orgList = _.template(_orgTPL)({'list': r.result, 'resultRight': r.resultRight}),
						_operationList = _.template(_operationTPL)({'resultRight': r.resultRight});

					// 保存当前组织单元数据
					me.orgList = r.result;

					$workloadData.html(_orgList);
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
		// 新建、修改组织单元
		editOrgItem: function(e) {
			var me = this;
			var $el = me.$el,
				$target = $(e.currentTarget),
				$tr = $target.parents('tr');
			var _oprt = $target.data('oprt'),
				_orgFormTPL = $('#orgForm').html(),
				_operateTip = _oprt=='add' ? '组织单元新建成功' : '组织单元修改成功',
				_spriteTitle = _oprt=='add' ? '新建组织单元' : '修改组织单元',
				_spriteOption = {
					oprt: _oprt
				};

			// 修改单元
			if(_oprt == 'edit') {
				var _orgItem = _.findWhere(me.orgList, {id: $tr.data('id').toString()});
				_spriteOption = {
					oprt: _oprt,
					id: _orgItem.id,
					name: _orgItem.name,
					personal: _orgItem.personal,
					objType: _orgItem.objType,
					objstatus: _orgItem.objstatus,
					deptIds: _orgItem.deptIds.split(','),
					deptNames: _orgItem.deptNames.split(','),
					alias: _orgItem.alias,
					inputerIds: _orgItem.inputerIds.split(','),
					inputerNames: _orgItem.inputerNames.split(','),
					checkerIds: _orgItem.checkerIds.split(','),
					checkerNames: _orgItem.checkerNames.split(','),
					isDownPro: _orgItem.isDownPro,
					desc: _orgItem.desc
				};
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
						url: requestConfig.setting.orgOprt,
						data: 'oprt=' + _oprt + '&' + _submitData.dataModel
					}).done(function (r) {
						if(r.resultType == 'true') {
							$.oaTip(_operateTip, 'success', 1000, function() {
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
		// 删除组织单元
		removeOrgItem: function(e) {
			var me = this;
			var $target = $(e.currentTarget),
				$tr = $target.parents('tr');
			var _id = $tr.data('id');

			interactiveEvent.removeComfirm($target, '确定删除该组织单元？', function() {
				$.ajax({
					type: 'GET',
					dataType: 'JSON',
					url: requestConfig.setting.orgOprt + '?oprt=del&id=' + _id
				}).done(function (r) {
					if(r.resultType == 'true') {
						$.oaTip('组织单元删除成功', 'success', 1000, function() {
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
							$.oaTip('组织单元导入全部成功', 'success', 1500, function() {
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
		// 导出组织单元
		exportOrg: function() {
			var $el = this.$el;
			var _data = $el.find('div.workload-search').find('input.search-key').val() || '';

			$.ajax({
				type: 'GET',
				dataType: 'JSON',
				url: requestConfig.setting.orgExp + '?' + _data
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