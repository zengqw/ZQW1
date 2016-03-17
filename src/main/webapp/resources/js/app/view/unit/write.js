define([
	'jquery',
	'underscore',
	'backbone',
	'common/requestConfig',
	'common/interactiveEvent',
	'plugin/jq.mousewheel.min',
	'plugin/jq.jscrollpane.min',
	'plugin/jq.form',
	'plugin/jq.textareaExpander'
], function($, _, B, requestConfig, interactiveEvent) {
	var Scrollbar = null;
	var AutoSaveTimer = null,
		AutoSaveInterval = 3000000;
	
	// 监听浏览器窗口缩放，重新渲染自定义滚动条
	var reinitialiseScrollbar = interactiveEvent.debounce(function() {
		if(Scrollbar === null) return;

		var $workloadBody = $('div.workload-data-body');
		var ScrollHeight = $(window).height() - 301;
		$workloadBody.css({
			height: ScrollHeight
		});
		Scrollbar.reinitialise();
	}, 100);
	$(window).unbind('resize').bind('resize', reinitialiseScrollbar);

	return B.View.extend({
		events: {
			'click .input-checkbox': 'selectCheckbox',				// 模拟复选框
			'click .ac_postNotice': 'postNotice',					// 消息提醒
			'focus .input-text': 'inputFocus',						// 输入框获取焦点
			'keyup .input-project': 'searchPorject',				// 搜索产品
			'keyup .input-text': 'checkInput',						// 检测输入
			'blur .input-text': 'checkInput',						// 检测输入
			'click .ac_switchWorkloadType': 'switchWorkloadType',	// 切换工作量统计单位
			'click .ac_removeWriteItem': 'removeWriteItem',			// 移除或清空工作量记录
			'click .ac_copyWriteItem': 'copyWriteItem',				// 复制上月工作量记录
			'click .ac_addWriteItem': 'addWriteItem',				// 增加工作量记录
			'click .ac_recoverWriteItem': 'recoverWriteItem',		// 恢复工作量记录
			'click .ac_submitWorkload': 'submitWorkload',			// 提交、保存工作量记录
			'change .ac_uploadExcel': 'uploadExcel',				// 上传Excel
			'click .ac_exportExcel': 'exportExcel',					// 导出工作量记录
			'click .ac_exportDemo': 'exportDemo'					// 导出默认模板
		},
		initialize: function(options) {
			var me = this;
			var $el = me.$el;

			me.type = options.type;
			me.orgTimeId = options.id;
			me.hash = location.hash;
			me.renderUnitWrite(me.type, me.orgTimeId);

			// 当前位置文案处理
			var $location = $el.siblings('div.workload-location');
			if(me.type === 'todo') $location.find('em.location-name').text('> 工作量录入(待处理)');
			else $location.find('em.location-name').text('> 工作量录入(已处理)');
		},
		// 渲染填写列表
		renderUnitWrite: function() {
			var me = this;
			var $el = me.$el;
			var $workloadLocation = $el.siblings('div.workload-location'),
				$workloadData = $el.find('div.workload-data-list'),
				$workloadOperation = $el.find('div.workload-operation'),
				$workloadFloatName = $el.find('div.workload-float-name');
			
			$.ajax({
				type: 'GET',
				dataType: 'JSON',
				url: requestConfig.unit.list + '?orgTimeId=' + me.orgTimeId
			}).done(function (r) {
				r.summary.type = me.type;
				r.summary.orgTimeId = me.orgTimeId;
				
				if(r.resultType === 'true') {
					var _operationTPL = $('#unitWriteOperation').html(),
						_operationList = _.template(_operationTPL)(r),
						_writeTPL = $('#unitWrite').html(),
						_writeList = _.template(_writeTPL)(r);

					me.projectList = r.globalProductList;
					// 保存当前工作量数据
					me.saveUnitData(r);

					$workloadOperation.html(_operationList);
					$workloadData.html(_writeList);
					// Textarea输入框自动换换
					$workloadData.find('textarea').TextAreaExpander();

					// 退回原因
					if(r.summary.returnMsg && r.summary.returnMsg!=='') {
						var $workloadTip = $el.find('div.workload-tip');

						$workloadTip.show().find('p').text('退回原因：' + r.summary.returnMsg);

						if($workloadOperation.find('div.msg-box').length > 0) $workloadFloatName.css({top: 150});
						else $workloadFloatName.css({top: 120});
					}

					// 普通员工，到此为止
					if(r.summary.isEmployee === 'true') return;

					// 导出权限
					if(r.summary.editable === 'true') {
						// if(r.summary.objType === '1') $el.find('div.workload-search').find('li.ac_switchWorkloadType[data-type="day"]').trigger('click');
						// else $el.find('div.workload-search').find('li.ac_switchWorkloadType[data-type="percent"]').trigger('click');

						if(r.summary.processStatus !== '25') {
							$workloadLocation.find('em.tip').text('请用导出的文件作为导入模板');
						}
					}

					// 自定义滚动条
					var $workloadBody = $workloadData.find('div.workload-data-body');
					var ScrollHeight = $(window).height() - 301;
					$workloadBody.css({
						height: ScrollHeight
					});
					$workloadBody.jScrollPane({
						showArrows: true
					});
					Scrollbar = $workloadBody.data('jsp');

					$workloadBody.bind('jsp-scroll-y', function(event, scrollPositionY, isAtTop, isAtBottom) {
						if(!isAtTop) {
							var _easyScroll = interactiveEvent.debounce(function() {
								var _scrollPositionY = parseInt(scrollPositionY),
									_index = Math.ceil(_scrollPositionY / 31),
									_userName = $workloadBody.find('tr:eq(' + (_index-1) + ')').data('name');
								
								$workloadFloatName.html('<span>' + _userName + '</span>').show();
							}, 100);

							_easyScroll();
						}else {
							$workloadFloatName.hide();
						}
					});

					// 启动自动保存
					// me.autoSaveWorkload();
				}else {
					// 请求失败
				}
			}).fail(function () {
				// 请求失败
			});
		},
		// 保存当前工作量数据
		saveUnitData: function(data) {
			var me = this;
				me.unitData = {
					result: {},
					period: data.period,
					summary: data.summary
				};
			var _year = data.period.currPeriod.split('年')[0],
				_month = data.period.currPeriod.split('年')[1].split('月')[0],
				_date = new Date(_year, _month, 0);

			me.unitData.days = _date.getDate();

			if(data.result.length === 0) return;

			for(var i=0; i<data.result.length; i++) {
				me.unitData.result[data.result[i].summary.hrmId] = data.result[i];
			}
		},
		// 重新刷新填写列表
		refreshUnitWrite: function(data) {
			var me = this;
			var $el = me.$el;
			var newUnitData = {
				result: [],
				summary: {}
			};

			if(data.result.length === 0) return;

			for(var i in data.result) {
				if(me.unitData.result[i]) {
					me.unitData.result[i].currList = [];
					me.unitData.result[i].currList = data.result[i];
				}
			}

			for(var i in me.unitData.result) {
				newUnitData.result.push(me.unitData.result[i]);
			}
			newUnitData.period = me.unitData.period;
			newUnitData.summary = me.unitData.summary;
			newUnitData.summary.objType = data.resultObjType;

			if(newUnitData.result.length > 0) {
				var _writeTPL = $('#unitWrite').html(),
					_writeList = _.template(_writeTPL)(newUnitData);
				var $workloadData = $el.find('div.workload-data-list');

				$workloadData.html(_writeList);

				if(newUnitData.summary.objType === '1') $el.find('div.workload-search').find('li.ac_switchWorkloadType[data-type="day"]').trigger('click');
				else $el.find('div.workload-search').find('li.ac_switchWorkloadType[data-type="percent"]').trigger('click');
			}
		},
		// 模拟复选框
		selectCheckbox: function(e) {
			var me = this;
			var $target = $(e.currentTarget),
				$workloadData = me.$el.find('div.workload-data-list'),
				$tbody = $workloadData.find('tbody');
				
			var _type = $target.data('type');				

			if(_type === 'all') {
				if($target.hasClass('input-checkbox-hover')) $tbody.find('.input-checkbox-hover').removeClass('input-checkbox-hover');
				else $tbody.find('.input-checkbox:not(".input-checkbox-hover")').addClass('input-checkbox-hover');
			}

			$target.toggleClass('input-checkbox-hover');

			if(_type === 'item') {
				var _len = $tbody.find('.input-checkbox').length,
					_checks = $tbody.find('.input-checkbox-hover').length;

				if(_len === _checks) $workloadData.find('.input-checkbox[data-type="all"]').addClass('input-checkbox-hover');
				else $workloadData.find('.input-checkbox[data-type="all"]').removeClass('input-checkbox-hover');
			}

			 return false;
		},
		// 消息提醒
		postNotice: function(e) {
			var me = this;
			var $target = $(e.currentTarget);
			var _popoTPL = $('#workloadPopo').html(),
				_hrmData = $target.data('hrm').split(','),
				_hrmIds = [];

			for(var i=0; i<_hrmData.length; i++) {
				var _hrmItem = _hrmData[i].split('|');
				_hrmIds.push({
					name: _hrmItem[0],
					loginId: _hrmItem[1],
					hrmId: _hrmItem[2]
				});
			}

			// 初始化弹窗
			var $popoSprite = interactiveEvent.sprite({
				title: '消息提醒',
				msg: _.template(_popoTPL)({hrmIds: _hrmIds}),
				onsuccess: function(obj) {
					var $obj = $(obj);

					// 选择录入者、审批者
					$obj.find('.input-checkbox').unbind('click').bind('click', function() {
						var $checkbox = $(this),
							$input = $checkbox.siblings('input[type="hidden"]');
						var _value = $checkbox.data('value');

						$checkbox.toggleClass('input-checkbox-hover');

						interactiveEvent.checkImportId($input, _value);
					});
					// 选择提醒方式
					$obj.find('div.notice-type span').unbind('click').bind('click', function() {
						$(this).toggleClass('hover');
					});
				},
				onconfirm: function(obj, target) {
					var $obj = $(obj),
						$target = $(target);
					var _orgTimeIds = me.orgTimeId,
						_inputerIds = $obj.find('input[name="inputerIds"]').val(),
						_content = $obj.find('textarea[name="content"]').val(),
						_notice = $obj.find('div.notice-type').find('span.hover').length;

					if(_inputerIds==='') {
						$.oaTip('请至少选择一位提醒人员', 'warning', 1500);
						return false;
					}else if(_notice === 0) {
						$.oaTip('请至少选择一种提醒方式', 'warning', 1500);
						return false;
					}else if(_content === '') {
						$.oaTip('提醒内容不能为空', 'warning', 1500, function() {
							$obj.find('textarea[name="content"]').focus();
						});
						return false;
					}else {
						if($target.hasClass('interactive-lock')) return false;
						// 锁定提交按钮，防止连续提交
						$target.addClass('interactive-lock');

						// 发送方式
						var _noticeType = [];
						$obj.find('div.notice-type').find('span.hover').each(function(index) {
							_noticeType.push($(this).data('type'));
						});
						
						$.ajax({
							type: 'POST',
							dataType: 'JSON',
							url: requestConfig.msg,
							data: 'orgTimeIds=' + _orgTimeIds + '&hrmIds=' + _inputerIds + '&types=' + _noticeType + '&content=' + escape(_content)
						}).done(function (r) {
							if(r.resultType === 'true') {
								$.oaTip('提醒消息发送成功', 'success', 1500, function() {
									$popoSprite.remove();
								});
							}else {
								$.oaTip(r.resultMsg, 'error', 2000);
							}
						}).fail(function () {
							// 请求失败
						});

						// 解锁提交按钮
						$target.removeClass('interactive-lock');
					}
				}
			});

			return false;
		},
		// 输入框获取焦点
		inputFocus: function(e) {
			var me = this;
			var $target = $(e.currentTarget),
				$inputItem = $target.parent(),
				$td = $inputItem.parent(),
				$tr = $td.parent(),
				$tbody = $tr.parent();
			var _uid = $tr.data('uid'),
				_name = $target.attr('name');
			var $items = $tbody.find('tr[data-uid="' + _uid + '"]');

			$tbody.find('td.item-focus').removeClass('item-focus');
			$tbody.find('tr.focus').removeClass('focus');
			$td.addClass('item-focus');
			$items.addClass('focus');

			// 服务项目
			if(_name === 'productName') {
				setTimeout(function() {
					me.searchPorject($target);
				}, 10);
			}else if(_name==='dayCount' || _name==='dayPercent') {
				setTimeout(function() {
					$target.select();
				}, 10);
			}
		},
		searchPorject: function(target) {
			var me = this;
			var $target = $(target),
				$inputItem = $target.parent(),
				$tr = $inputItem.parents('tr');
			var _uid = $tr.data('uid'),
				_productList = me.unitData.result[_uid].productList,
				_searchTPL =
					'<div class="mini-project-search">\
						<input type="text" placeholder="输入项目名称或编号" class="input-project">\
						<ul>\
							<% for(var i=0; i<productList.length; i++) { %>\
								<li class="ac_selectProjectItem" data-id="<%=productList[i].id%>" data-code="<%=productList[i].code%>" data-name="<%=productList[i].name%>">\
									<% if(productList[i].code !== productList[i].name) { %>\
										<%=productList[i].code%> | <%=productList[i].name%>\
									<% }else { %>\
										<%=productList[i].code%>\
									<% } %>\
								</li>\
							<% } %>\
						</ul>\
					</div>';
			var $projectSprite = $.sprite({
				className: 'interactive-project-selector',
				noArrow: true,
				msg: _.template(_searchTPL)({'productList': _productList}),
				outerFix: {t:0, r:0, b:0, l:1},
				target: $inputItem,
				direction: 'down',
				align: 'left',
				showButtons: false,
				loading: false,
				animate: 'none',
				easyClose: true,
				onsuccess: function(obj) {
					var $obj = $(obj);

					$obj.find('input.input-project').focus();
					$obj.find('input.input-project').unbind('keyup').bind('keyup', function() {
						var $input = $(this),
							$searchBox = $input.parent(),
							$ul = $searchBox.find('ul');
						var _key = $.trim($input.val()),
							_loadingTPL = '<div class="search-loading">努力搜索中……</div>',
							_emptyTPL = '<div class="search-empty">未找到相关项目</div>';
							_projectTPL =
								'<%\
									var _upperKey = key.toUpperCase(),\
										_lowerKey = key.toLowerCase();\
									for(var i=0; i<result.length; i++) {\
										var _id = result[i].id,\
											_code = result[i].code,\
											_name = result[i].name,\
											_projectItem = _code;\
										if(_code !== _name) _projectItem = _code + " | " + _name;\
										_projectItem = _projectItem.replace(_upperKey, \'<i class="key">\' + _upperKey + \'</i>\').replace(_lowerKey, \'<i class="key">\' + _lowerKey + \'</i>\');\
								%>\
										<li class="ac_selectProjectItem" data-id="<%=_id%>" data-code="<%=_code%>" data-name="<%=_name%>">\
											<%=_projectItem%>\
										</li>\
								<% } %>';
						var _easySearch = interactiveEvent.debounce(function() {
							$ul.html(_loadingTPL);

							if(_key === '') {
								$ul.html(_.template(_projectTPL)({'result': _productList, 'key': _key}));
								return;
							}
							
							$.toggleLoading(false);
							$.ajax({
								type: 'GET',
								dataType: 'JSON',
								url: requestConfig.unit.search + '?name=' + escape(_key)
							}).done(function (r) {
								r.key = _key;
								if(r.resultType === 'true') {
									if(r.result.length === 0) {
										$ul.html(_emptyTPL);
										return;
									}
									
									$ul.html(_.template(_projectTPL)(r));
								}else {
									// 请求失败
								}
							}).fail(function () {
								// 请求失败
							});
						}, 200);

						_easySearch();
					});

					// 选择服务项目
					$obj.delegate('li.ac_selectProjectItem', 'click', function() {
						var $li = $(this);
						var _projectId = $li.data('id'),
							_projectCode = $li.data('code'),
							_projectName = $li.data('name'),
							_projectResult = _projectCode;

						if(_projectCode !== _projectName) _projectResult += ' | ' + _projectName;

						$inputItem.find('input[name="productId"]').val(_projectId);
						$inputItem.find('input[name="productName"]').val(_projectResult);
						$projectSprite.remove();
					});
				}
			});
		},
		// 检测输入
		checkInput: function(e) {
			var me = this;
			var $target = $(e.currentTarget),
				$tr = $target.parents('tr'),
				$body = $tr.parent();
			var _timer = e.type==='keyup' ? 2000 : 0,
				_uid = $tr.data('uid'),
				_userName =  $tr.data('name'),
				_fieldName = $target.attr('name'),
				_fieldValue = $.trim($target.val());
			var _easyCheck = interactiveEvent.debounce(function() {
				// 为空处理
				if(_fieldValue === '') {
					$target.removeAttr('fieldValue');
					return;
				}

				// 个人填写模式，提示语姓名统一为“您”
				if(me.unitData.summary.personal==='1' && me.unitData.summary.role.indexOf(',employee,')>=0) _userName = '您';
				
				switch(_fieldName) {
					case 'dayCount':
						// 非数字
						if(isNaN(_fieldValue)) {
							$target.val('');
							$.operateTip({
								type: 'error',
								msg: '工作量不能为非数字'
							});
						}else {
							_fieldValue = parseFloat(_fieldValue);

							// 工作量小于等于零
							if(_fieldValue <= 0) {
								$target.val('');
								$.operateTip({
									type: 'error',
									msg: '单条工作量必须大于零'
								});

								return;
							}
							$target.val(_fieldValue.toFixed(2));

							// 验证个人工作量总和
							var $dayCounts = $body.find('tr[data-uid="' + _uid + '"]').find('input[name="dayCount"]');
							var _dayCount = 0;
							$dayCounts.each(function() {
								var _value = $.trim($(this).val());
								if(_value != '') _dayCount += parseFloat(_value);
							});
							
							if(_dayCount > me.unitData.days) {
								$.operateTip({
									type: 'error',
									msg: _userName + '的工作量总和超过当月天数(' + me.unitData.days + '天)，请留意。'
								});
							}
						}						
						break;
					case 'dayPercent':
						// 非数字
						if(isNaN(_fieldValue)) {
							if(_fieldValue.indexOf('%') >= 0) {
								var _percent = _fieldValue.split('%')[0];

								if(isNaN(_percent)) {
									$target.attr('fieldValue', '').val('');
									$.operateTip({
										type: 'error',
										msg: '请填写正确的百分比'
									});
									return;
								}else {
									_percent = parseFloat(_percent);

									if(parseFloat(_percent) <= 0) {
										$target.attr('fieldValue', '').val('');
										$.operateTip({
											type: 'error',
											msg: '百分比不能小于或等于零'
										});
										return;
									}else {
										_percent = _percent.toFixed(2);
										$target.attr('fieldValue', _percent).val(_percent + '%');
									}
								}
							}else {
								$target.val('');
								$.operateTip({
									type: 'error',
									msg: '请填写数字或百分比'
								});
							}
						}else {
							_fieldValue = parseFloat(_fieldValue);

							// 工作量小于等于零
							if(_fieldValue <= 0) {
								$target.attr('fieldValue', '').val('');
								$.operateTip({
									type: 'error',
									msg: '单条工作量必须大于零'
								});
								return
							// 当输入小于1的小数，自动乘以100转换为百分比
							}else if(_fieldValue <= 1) {
								_fieldValue = (_fieldValue*100).toFixed(2);
								$target.attr('fieldValue', _fieldValue).val(_fieldValue + '%');
							// 当输入大于1的小数，自动加上百分比号
							}else {
								_fieldValue = _fieldValue.toFixed(2)
								$target.attr('fieldValue', _fieldValue).val(_fieldValue + '%');
							}
						}

						// 验证个人工作量总和
						var $dayPercents = $body.find('tr[data-uid="' + _uid + '"]').find('input[name="dayPercent"]');
						var _dayPercent = 0;
						$dayPercents.each(function() {
							var _value = $.trim($(this).val());
							if(_value != '') _dayPercent += parseFloat(_value.split('%')[0]);
						});
						
						if(_dayPercent > 100) {
							$.operateTip({
								type: 'error',
								msg: _userName + '的工作量总和超过100%，请留意。'
							});
						}else if(_dayPercent < 99.99) {
							$.operateTip({
								type: 'error',
								msg: _userName + '的工作量总和小于100%，请留意。'
							});
						}
						break;
				};
			}, _timer);

			_easyCheck();
		},
		// 切换工作量统计单位
		switchWorkloadType: function(e) {
			var me = this;
			var $target = $(e.currentTarget),
				$parent = $target.parent().parent(),
				$workloadHead = me.$el.find('div.workload-data-head'),
				$workloadData = me.$el.find('div.workload-data-body');
			var _type = $target.data('type'),
				_unitText = $target.text();

			if(_type === 'percent') {
				$workloadData.removeClass('workload-data-day').addClass('workload-data-percent');
				$workloadData.find('input[name="objType"][serialize="true"]').val('2');
				$workloadData.find('input[name="dayCount"]').attr('isMandatory', '0');
				$workloadData.find('input[name="dayPercent"]').attr('isMandatory', '1');
			}else {
				$workloadData.removeClass('workload-data-percent').addClass('workload-data-day');
				$workloadData.find('input[name="objType"][serialize="true"]').val('1');
				$workloadData.find('input[name="dayCount"]').attr('isMandatory', '1');
				$workloadData.find('input[name="dayPercent"]').attr('isMandatory', '0');
			}

			$workloadHead.find('th.time-item').find('em').text('(' + _unitText + ')');
			$parent.find('em').text('工作量统计单位：' + _unitText);
		},
		// 移除或清空工作量记录
		removeWriteItem: function(e) {
			var me = this;
			var $tr = $(e.currentTarget).parents('tr');
			var _uid = $tr.data('uid'),
				_operate = $tr.data('operate');

			if(_operate === 'empty') {
				$tr.find('input, textarea').val('');
				$tr.find('input[name="dayPercent"]').attr('fieldValue', '');
				// $tr.find('input.input-text:first').focus();

				$.operateTip({
					msg: '您清空了一行工作记录'
				});
			}else if(_operate === 'remove') {
				// $tr.prev().find('input.input-text:first').focus();
				$tr.remove();

				$.operateTip({
					msg: '您删除了一行工作记录'
				});

				// 工作量记录重新排序
				me.serializeOrder(_uid);
				// 重新渲染自定义滚动条
				if(Scrollbar !== null) Scrollbar.reinitialise();
			}

			return false;
		},
		// 复制上月工作量记录
		copyWriteItem: function(e) {
			var $el = this.$el,
				$target = $(e.currentTarget),
				$tr = $target.parents('tr'),
				$tbody = $tr.parent();
			var _type = $target.data('type'),
				_uid = $tr.data('uid'),
				_objType = $el.find('input[name="objType"][serialize="true"]').val(),
				_prevObjType = $el.find('input[name="prevObjType"][serialize="false"]').val(),
				_prevUnit = _prevObjType==='1' ? 'day' : 'percent';
			var $items = $tbody.find('tr[data-uid="' + _uid + '"][data-operate="empty"]');

			if(_type === 'all') {
				$items = $el.find('div.workload-data-body').find('tr[data-operate="empty"]');
			}else if(_type === 'single') {
				$items = $tr;
			}

			var _emptyAll = 0;
			$items.each(function() {
				var $this = $(this);
				var _emptyItem = 0;
				_.each('project time desc'.split(' '), function(className) {
					var $hisItem = $this.find('td.history-' + className),
						$curItem = $this.find('td.' + className + '-item');
					var _historyValue = $.trim($hisItem.text());

					if(_historyValue !== '') {
						if(className === 'project') {
							var _projectId = $hisItem.data('id'),
								_projectCode = $hisItem.data('code'),
								_projectName = $hisItem.data('name');

							if(_projectCode !== _projectName) _historyValue = _projectCode + ' | ' + _projectName;
							else _historyValue = _projectCode;
							$curItem.find('input[name="productId"]').val(_projectId).siblings('input.input-text').val(_historyValue);
						}else if(className === 'time') {
							if(_prevObjType === _objType) {
								if(_prevObjType === '1') {
									$curItem.find('input[name="dayCount"]').val(_historyValue);
								}else {
									$curItem.find('input[name="dayPercent"]').attr('fieldValue', _historyValue.split('%')[0]).val(_historyValue);
								}
							}
						}else {
							$curItem.find('.input-text').val(_historyValue);
						}
					}else {
						_emptyItem++;
					}
				});
				if(_emptyItem === 3) _emptyAll++;
			});
			// 上月工作量填写单位不一致
			if(_prevObjType !== _objType) {
				$.operateTip({
					type: 'error',
					msg: '上月工作量统计单位与当前不一致'
				});
			}
			// 上月工作量为空
			if(_emptyAll === $items.length) {
				$.operateTip({
					type: 'error',
					msg: '上月工作量为空'
				});
			}

			return false;
		},
		// 增加工作量记录
		addWriteItem: function(e) {
			var me = this;
			var $target = $(e.currentTarget),
				$tbody = me.$el.find('div.workload-data-list').find('tbody'),
				$tr = null;
			var _objType = $tbody.find('input[name="objType"][serialize="true"]').val(),
				_type = $target.data('type');

			if(_type === 'personal') $tr = $tbody.find('tr:first');
			else $tr = $target.parents('tr');

			var _uid = $tr.data('uid'),
				_name = $tr.data('name'),
				_checkbox = $tr.data('checkbox') || 'false',
				_writeTPL = $('#unitWriteItem').html(),
				_writeItem = _.template(_writeTPL)({objType:_objType, userId:_uid, userName:_name, checkbox: _checkbox});
			var $lastItem = $tbody.find('tr[data-uid="' + _uid + '"]:last');
			
			$lastItem.after(_writeItem);
			// Textarea输入框自动换换
			$tbody.find('tr[data-uid="' + _uid + '"]:last').find('textarea').TextAreaExpander();

			$.operateTip({
				msg: '您新增了一行工作记录'
			});

			// 工作量记录重新排序
			me.serializeOrder(_uid);
			// 重新渲染自定义滚动条
			if(Scrollbar !== null) Scrollbar.reinitialise();

			return false;
		},
		// 恢复工作量记录
		recoverWriteItem: function(e) {
			var me = this;
			var $target = $(e.currentTarget),
				$tr = $target.parents('tr'),
				$tbody = $tr.parent();
			var _hrmId = $tr.data('uid');

			$.ajax({
				type: 'GET',
				dataType: 'JSON',
				url: requestConfig.unit.recover + '?orgTimeId=' + me.orgTimeId + '&hrmId=' + _hrmId
			}).done(function (r) {
				if(r.resultType == 'true') {
					var $items = $tbody.find('tr[data-uid="' + _hrmId + '"]');

					$items.each(function(index) {
						var $item = $(this);
						if(r.result[index]) {
							var _dataItem = r.result[index];
							var _projectId = _dataItem.productId,
								_projectCode = _dataItem.productCode,
								_projectName = _dataItem.productName,
								_projectItem = _projectCode;
							if(_projectCode !== _projectName) _projectItem = _projectCode + ' | ' + _projectName;

							// 服务项目
							$item.find('input[name="productId"]').val(_projectId).siblings('input[name="productName"]').val(_projectItem);
							// 工作量
							if(_dataItem.objType === '1') $item.find('input[name="dayCount"]').val(_dataItem.dayCount);
							else $item.find('input[name="dayPercent"]').val(_dataItem.dayPercent);
							// 备注
							 $item.find('textarea[name="remark"]').val(_dataItem.remark);
						}else {
							var _operate = $item.data('operate');

							if(_operate === 'empty') $item.find('input, textarea').val('');
							else $item.remove();
						}
					});

					$.operateTip({
						msg: $tr.data('name') + '的工作记录已恢复'
					});
				}else {
					// 请求失败
				}
			}).fail(function () {
				// 请求失败
			});

			return false;
		},
		// 工作量记录重新排序
		serializeOrder: function(uid) {
			var $tbody = this.$el.find('div.workload-data-body').find('tbody'),
				$items = $tbody.find('tr[data-uid="' + uid + '"]');

			$items.each(function(index) {
				$(this).data('index', index);
			});
		},
		// 工作量记录表单数据序列化
		serializeFields: function(form) {
			var me = this;
			var $form = $(form);
			var dataModel = '',			// 实际传送的表单值
				isNotEmpty = true,		// 是否全部已输入
				emptyUser = '、',		// 输入不完整的用户
				dayError = false,		// 天数或百分比验证是否错误
				dayTip = [];			// 天数小于17天或大于25天、百分比小于100%或超过100%错误信息
			var _objType = $form.find('input[name="objType"][serialize="true"]').val(),
				_hrmIds = ',',
				_dayInfo = {};

			$form.find('tbody').find('tr').each(function() {
				var $tr = $(this);
				var _uid = $tr.data('uid'),
					_userName = $tr.data('name'),
					_index = $tr.data('index');

				var _emptyNum = 0,	// 必填项为空数量
					_enterNum = 0;	// 输入框为空数量
				$tr.find('input[serialize="true"], textarea[serialize="true"]').each(function () {
					var $input = $(this);
					var _name = $input.attr('name'),
						_isMandatory = $input.attr('isMandatory'),
						_escape = $input.attr('escape'),
						_fieldValue = $input.attr('fieldValue');
						_value = $.trim($input.val());

					if(_fieldValue !== undefined) _value = _fieldValue;

					// 当输入框未输入时
					// 服务项目为空时，后端默认值为-1
					if(_name==='productId' && _value==='-1') _value = '';
					if(!_value || _value=='') {
						if((_objType==='1' && _name!=='dayPercent') || (_objType==='2' && _name!=='dayCount')) {
							_enterNum ++;
							if(_isMandatory === '1') _emptyNum ++;
						}
					}

					// 中文转码
					if (_escape === '1') _value = escape(_value);

					dataModel += '&' + (_name+'_'+_uid+'_'+_index) + '=' + _value;
				});

				// 必填项为空
				// 首先判断是否为当前用户的第一条记录
				// 如果不是第一条记录，则判断是否至少填写了一个输入框(总共有4个输入框)
				if(_emptyNum>0 && (_hrmIds.indexOf(',' + _uid + ',')<0 || (_hrmIds.indexOf(',' + _uid + ',')>=0 && _enterNum<3))) {
					isNotEmpty = false;
					if(emptyUser.indexOf('、' + _userName + '、') < 0) {
						emptyUser += _userName + '、';
					}
				}

				// 相同的用户ID只取1次
				if(_hrmIds.indexOf(',' + _uid + ',') < 0) {
					_hrmIds += _uid + ',';

					dataModel += ('&count_'+_uid) + '=' + $form.find('tr[data-uid="' + _uid + '"]').length;
				}

				// 存储每行工作量，用于单个人工作量总和验证
				if(!_dayInfo[_uid]) {
					_dayInfo[_uid] = {}
					_dayInfo[_uid]['name'] = _userName;
					_dayInfo[_uid]['value'] = [];
				}
	
				if(_objType === '1') _dayInfo[_uid]['value'].push($tr.find('input[name="dayCount"][serialize="true"]').val());
				else _dayInfo[_uid]['value'].push($tr.find('input[name="dayPercent"][serialize="true"]').attr('fieldValue'));
			});

			dataModel += '&hrmIds=' + _hrmIds.substring(1, _hrmIds.length-1);
			dataModel += '&objType=' + _objType;
			emptyUser = emptyUser.substring(1, emptyUser.length-1);

			// 单个人工作量总和验证
			for(var i in _dayInfo) {
				var _sum = 0;
				for(var j=0; j<_dayInfo[i].value.length; j++) {
					if(_dayInfo[i].value[j] != '') _sum += parseFloat(_dayInfo[i].value[j]);
				}

				if(_objType === '1') {
					if(_sum > me.unitData.days) {
						dayTip.push(_dayInfo[i].name + '的工作量总和超过当月天数(' + me.unitData.days + '天)');
						dayError = true;
					}
				}else if(_objType === '2') {
					if(_sum < 99.99) {
						dayTip.push(_dayInfo[i].name + '的工作量总和小于100%');
						dayError = true;
					}else if(_sum > 100) {
						dayTip.push(_dayInfo[i].name + '的工作量总和超过100%');
						dayError = true;
					}
				}
			}

			return {
				dataModel: dataModel,
				isNotEmpty: isNotEmpty,
				emptyUser: emptyUser,
				dayError: dayError,
				dayTip: dayTip
			};
		},
		// 提交、保存工作量记录
		submitWorkload: function(e) {
			var me = this;
			var $el = me.$el,
				$target = $(e.currentTarget);
			var _oprt = $target.data('oprt'),
				_submitData = me.serializeFields($el.find('form')),
				_isPersonal = me.unitData.summary.personal==='1' ? true : false,
				_role = me.unitData.summary.role;

			// clearTimeout(AutoSaveTimer);
			// 提交状态下才会验证工作量输入是否完整
			if(_oprt==='save' || _oprt==='commit') {
				if(!_submitData.isNotEmpty || _submitData.dayError) {
					var _confirmOption = {},
						_confirmTitle = _oprt==='commit' ? '提交' : '保存';
						_msg = '';

					// 工作量录入不完成
					// 普通员工填写
					if(_isPersonal && _role.indexOf(',employee,')>=0) {
						_msg += '<em>您的工作量录入存在以下问题：</em>';

						if(!_submitData.isNotEmpty) _msg += '<p>1、工作量录入不完整</p>';
						if(_submitData.dayError) {
							if(!_submitData.isNotEmpty) _msg += '<p>2、' + _submitData.dayTip[0].split('的')[1] + '</p>';
							else _msg += '<p>1、' + _submitData.dayTip[0].split('的')[1] + '</p>';
						}

						_msg += '<br>';
					// 非普通员工填写
					}else {
						if(!_submitData.isNotEmpty) {
							_msg += '<em>以下人员的工作量录入不完整：</em><p>' + _submitData.emptyUser + '</p><br>';
						} 
						// 工作量录入格式有问题
						if(_submitData.dayError) {
							_msg += '<em>以下人员的工作量录入存在问题：</em><p>';

							for(var i=0; i<_submitData.dayTip.length; i++) {
								_msg += (i+1) + '、' + _submitData.dayTip[i] + '<br>';
							}

							_msg += '</p><br>';
						}
					}
					_msg += '<strong>是否忽略以上问题，继续' + _confirmTitle + '？</strong>';

					_confirmOption = {
						title: _confirmTitle + '确认框',
						msg: _msg,
						confirmText: '继续' + _confirmTitle,
						closeText: '返回修改',
						onconfirm: function(obj) {
							$confirm.remove();
							me.confirmSubmit({
								oprt: _oprt,
								data: 'oprt=' + _oprt + '&orgTimeId=' + me.orgTimeId + _submitData.dataModel
							});
						},
						onclose: function() {
							// 重新启动自动保存
							// me.autoSaveWorkload();
						}
					};
					// if(_oprt==='commit') _confirmOption.confirmButton = false;
					var $confirm = $.confirm(_confirmOption);
				}else {
					me.confirmSubmit({
						oprt: _oprt,
						data: 'oprt=' + _oprt + '&orgTimeId=' + me.orgTimeId + _submitData.dataModel
					});
				}
			// 冻结
			}else if(_oprt === 'freeze') {
				me.confirmSubmit({
					oprt: _oprt,
					data: 'oprt=commit&orgTimeId=' + me.orgTimeId + _submitData.dataModel
				});
			// 解冻
			}else if(_oprt === 'thaw') {
				me.confirmSubmit({
					oprt: _oprt,
					data: 'oprt=commit&orgTimeId=' + me.orgTimeId
				});
			// 退回
			}else if(_oprt === 'returnBack') {
				var _type = $target.data('type');

				// 批量退回
				if(_type === 'single') {
					var _hrmIds = [];

					$el.find('div.workload-data-body').find('.input-checkbox-hover').each(function() {
						_hrmIds.push($(this).parents('tr').data('uid'));
					});

					if(_hrmIds.length === 0) {
						$.oaTip('请选择需要退回的员工', 'warning', 1500);
						return false;
					}
				}

				var $confirm = $.confirm({
					title: '退回操作',
					msg: '<em>请填写退回原因：</em><textarea name="msg" class="input-text"></textarea>',
					onconfirm: function(obj) {
						var _msg = $.trim($(obj).find('textarea[name="msg"]').val()),
							_url = requestConfig.unit.returnBack + '?orgTimeId=' + me.orgTimeId + '&msg=' + escape(_msg);
						if(_type === 'single') _url += '&hrmIds=' + _hrmIds;

						if(_msg === '') {
							$.oaTip('请填写退回原因', 'warning', 1000, function() {
								$(obj).find('textarea[name="msg"]').focus();
							});
							return false;
						}else {
							$.ajax({
								type: 'GET',
								dataType: 'JSON',
								url: _url,
							}).done(function (r) {
								if(r.resultType === 'true') {
									$confirm.remove();
									$.oaTip('工作量录入退回成功', 'success', 1000, function() {
										if(_type !== 'single') location.hash = 'home/todo';
										else me.renderUnitWrite(me.type, me.orgTimeId);
									});
								}else {
									// 请求失败
								}
							}).fail(function () {
								// 请求失败
							});
						}
					}
				});

				return false;
			}

			return false;
		},
		// 自动保存工作量记录
		autoSaveWorkload: function() {
			var me = this;
			var $el = me.$el;
			var _submitData = me.serializeFields($el.find('form'));

			clearTimeout(AutoSaveTimer);
			AutoSaveTimer = setTimeout(function() {
				if(location.hash !== me.hash) {
					clearTimeout(AutoSaveTimer);
					return;
				}
				
				me.confirmSubmit({
					auto: true,
					data: 'oprt=save&orgTimeId=' + me.orgTimeId + _submitData.dataModel
				});
				me.autoSaveWorkload();
			}, AutoSaveInterval);
		},
		// 确认提交工作量记录
		confirmSubmit: function(options) {
			var me = this;
			var o = {
				auto: false
			}
			$.extend(o, options);

			if(o.auto) $.toggleLoading(false);
			$.ajax({
				type: 'POST',
				dataType: 'JSON',
				url: requestConfig.unit.save,
				data: o.data
			}).done(function (r) {
				if(r.resultType === 'true') {
					if(o.auto) {
						$.operateTip({
							msg: '已为您自动保存为草稿'
						});
					}else {
						switch(o.oprt) {
							case 'commit':
								$.oaTip('工作量录入提交成功', 'success', 1000, function() {
									history.back();
								});
								break;
							case 'thaw':
								$.oaTip('工作量录入解冻成功', 'success', 1000, function() {
									me.renderUnitWrite(me.orgTimeId);
								});
								break;
							case 'freeze':
								$.oaTip('工作量录入冻结成功', 'success', 1000, function() {
									me.renderUnitWrite(me.orgTimeId);
								});
								break;
							case 'save':
								$.oaTip('工作量录入保存成功', 'success', 1000, function() {
									me.renderUnitWrite(me.orgTimeId);
								});
								break;
						}
					}
				}else {
					$.oaTip(r.resultMsg, 'error', 2000);
				}
			}).fail(function () {
				// 请求失败
			});
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

					if(_data.resultMgs && _data.resultMgs.length>0) {
						interactiveEvent.importError({
							errorList: _data.resultMgs,
							callback: function() {
								// 重新刷新填写列表
								me.refreshUnitWrite(_data);
							}
						});
					}else {
						$.oaTip('工作量导入全部成功', 'success', 1500, function() {
							me.renderUnitWrite(me.type, me.orgTimeId);
						});
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
				if(_file.match(/.(xls|xlsx)$/ig)) {
					$form.submit();
				}else {
					$form[0].reset();
					$.oaTip('请上传Excel文件', 'warning');
				}
			}
		},
		// 导出工作量记录
		exportExcel: function() {
			var me = this;
			var _url = me.type==='todo' ? requestConfig.unit.exp : requestConfig.unit.expDone;

			$.ajax({
				type: 'GET',
				dataType: 'JSON',
				url: _url + '?orgTimeIds=' + me.orgTimeId
			}).done(function (r) {
				if(r.resultType == 'true') {
					location.href = requestConfig.excelOut;
				}else {
					// 请求失败
				}
			}).fail(function () {
				// 请求失败
			});

			return false;
		},
		// 导出默认模板
		exportDemo: function() {
			$.ajax({
				type: 'GET',
				dataType: 'JSON',
				url: requestConfig.unit.expDemo
			}).done(function (r) {
				if(r.resultType == 'true') {
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