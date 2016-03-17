define([
	'jquery',
	'underscore',
	'plugin/store',
	'plugin/jq.interactive'
], function($, _, store) {
	var $body = $('body');
	var _events = {};

	// 清空(表单)操作
	$body.on('click', '.ac_resetForm', function () {
		// 输入框 & textarea
	    $('input[type="text"][serialize="true"], textarea[serialize="true"]').val('');
		// 下拉选择框
		$('ul.select-auto').each(function () {
            $('<li class="ac_selectItem" val="">请选择</li>').prependTo($(this)).trigger('click').remove();
        })
	});

	// 初始化弹窗
	_events.sprite = function(options) {
		var o = {
			width: 540,				// 弹窗主体宽度
			confirmButton: true,	// 显示确认按钮
			clearButton: false,		// 不显示清除安安
			loading: false,			// 弹窗加载成功后不显示loading效果
			animate: 'swing',		// 弹窗出现采用向下抖动效果
			move: true,				// 允许拖动弹窗
			mask: true				// 显示遮罩
		};
		$.extend(o, options);

		return $.sprite(o);
	};
	// 表单数据序列化
	_events.serializeFields = function(form, type) {
		var $form = $(form);
		var dataModel = '',			// 实际传送的表单值
			dataJson = {},          //实际传送的json格式的值
			isNotEmpty = true,		// 是否全部已输入
			firstEmptyEl = null;	// 第一个未输入元素

		$form.find('input[serialize="true"], textarea[serialize="true"]').each(function () {
			var $input = $(this);
			var _name = $input.attr('name'),
				_isMandatory = $input.attr('isMandatory'),
				_escape = $input.attr('escape'),
				_fieldValue = $input.attr('fieldValue'),
				_value = $.trim($input.val());

			if(_fieldValue !== undefined) _value = _fieldValue;

			// 当输入框未输入时
			if(!_value && isNotEmpty && _isMandatory == '1') {
				isNotEmpty = false;
				firstEmptyEl = $input;
			}

			dataJson[_name] = _value;
			// 中文转码
			if(_escape == '1') _value = encodeURI(_value);

			// 针对Browser字段的特殊处理：Browser存的是ID，显示的是Text
			if(type==='browser' && $input.hasClass('browser-value')) {
				_value += '|' + $input.siblings('div.input-browse').find('.browser-text').text();
			}

			if(dataModel == '') dataModel += _name + '=' + _value;
			else dataModel += '&' + _name + '=' + _value;


		});

		return {
			dataModel   : dataModel,
			dataJson    : dataJson,
			isNotEmpty  : isNotEmpty,
			firstEmptyEl: firstEmptyEl
		};
	};
	// 将页面定位到元素所在位置
	_events.setElMiddle = function($middleEl, callback) {
		if(!$middleEl || !$middleEl.is(':visible')) {
			return callback && callback();
		}
		var offsetTop = $middleEl.offset().top,
			height = $(window).height(),
			scrollTop = offsetTop - height / 2 + $middleEl.outerHeight() / 2;
		$("html,body").animate({scrollTop: scrollTop}, 500, "swing", function () {
			callback && callback();
		});
	};
	// 删除二次确认
	_events.removeComfirm = function(obj, tip, callback) {
		var $target = $(obj);
		var _class = $target.data('class') + '-hover';

		$target.addClass(_class);
		var $removeComfirm = $.sprite({
			className: 'interactive-confirm-box',
			noArrow: false,
			arrowSize: {w:8, h:6},
			outerFix: {t:0, r:0, b:10, l:0},
			msg: '<strong>' + tip + '</strong><a href="#" class="comfirm">确认</a><a href="#" class="cancel">取消</a>',
			target: $target,
			direction: 'down',
			align: 'right',
			showButtons: false,
			loading: false,
			animate: 'slide',
			easyClose: true,
			onsuccess: function(obj) {
				var $obj = $(obj);

				$obj.find('a').unbind('click').bind('click', function() {
					if($(this).hasClass('comfirm')) {
						callback();
					}else {
						$target.removeClass(_class);
					}
					$removeComfirm.remove();

					return false;
				});
			},
			onclose: function() {
				$target.removeClass(_class);
			}
		});
	};
	// 删除后处理
	_events.checkImportId = function(target, id) {
		var $target = $(target);
		var _ids = $target.val().split(','),
			_num = 0

		for(var i=0; i<_ids.length; i++) {
			if(_ids[i].indexOf(id) >= 0) {
				delete _ids[i];
				_num++;
			}
		}
		_ids = _.compact(_ids);

		if(_num ===0) _ids.push(id);

		$target.val(_ids);
	};
	// 惰性加载
	var _debounceTimeout = null;
	_events.debounce = function(func, wait, immediate) {
		return function() {
			var context = this, args = arguments;
			var later = function() {
				_debounceTimeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !_debounceTimeout;

			clearTimeout(_debounceTimeout);
			_debounceTimeout = setTimeout(later, wait);

			if(callNow) func.apply(context, args);
		};
	};
	// 导入错误提示框
	_events.importError = function(options) {
		var o = {
			errorList: []
		};
		$.extend(o, options);

		var _errorTPL =
			'<div class="error-title"><em>本次导入结果见如下表格：</em></div>\
			<div class="error-list">\
				<div class="error-head">\
					<em>所有导入行结果清单(红色字体代表导入失败)</em>\
				</div>\
				<div class="error-table">\
					<table width="100%" border="0" cellspacing="0" cellpadding="0">\
						<tbody>\
							<% for(var i=0; i<errorList.length; i++) { %>\
							<tr class="<%=(i%2===0 ? \'odd\' : \'even\')%><%=(errorList[i].resultType==="false" ? \' error\' : \'\')%>">\
								<td><%=errorList[i].resultMgs%></td>\
							</tr>\
							<% } %>\
						</tbody>\
					</table>\
				</div>\
			</div>\
			';

		var $errorSprite = $.sprite({
			className: 'interactive-import-error',
			title: '导入结果提示窗',
			msg: _.template(_errorTPL)({errorList: o.errorList}),
			width: 600,
			height: 367,
			showButtons: false,
			loading: false,
			animate: 'swing',
			move: true,
			mask: true,
			onclose: function() {
				if(o.callback) o.callback();
			}
		});
	};
	// 获取本地pageSize设置
	_events.getPageSize = function() {
		var _pageSize = store.get('Workload_PageSize');

		if(!_pageSize) _pageSize = 10;
		else _pageSize = parseInt(_pageSize);

		return _pageSize;
	};
	// 还原搜索项
	_events.restoreSearchKey = function(obj, key) {
		if(key===null || key==='') return;

		var $searchForm = $(obj);
		var _searchKey = key.split('&');

		for(var i=0; i<_searchKey.length; i++) {
			var _searchItem = _searchKey[i].split('='),
				_name = _searchItem[0],
				_value = _searchItem[1];
			var $input = $searchForm.find('input[name="' + _name + '"]');
			var _type = $input.attr('type'),
				_className = $input.attr('class');

			$input.val(_value);

			if(_type === 'hidden') {
				switch(_className) {
					case 'select-value':
						var $parent = $input.parent(),
							$curLi = $parent.find('li[val="' + _value + '"]');
							$curLi.trigger('click');

						if ($curLi.length < 1){
							var $em = $parent.find("em");
							$em.text($em.attr('data-default') || "请选择");
							$parent.find("li.hover").removeClass("hover");
						}
						break;
					case 'browser-value':
						var _browserValue = _value.split('|');

						$input.val(_browserValue[0]);
						$input.siblings('div.input-browse').find('.browser-text').text(_browserValue[1]);
						break;
				}
			}
		}

		$searchForm.find('input.search-key').val(key);
	};
	// 还原中文参数转义
	_events.parseEscape = function(params) {
		var _params = decodeURIComponent(params).split('&'),
			_result = [];

		for(var i=0; i<_params.length; i++) {
			var _item = _params[i].split('='),
				_name = _item[0],
				_value = _item[1];

			if(_value.indexOf('|') >= 0) _value = _value.split('|')[0];
			if(_item[0]) _result.push(_name + '=' + escape(_value));
		}

		return _result.join('&');
	};

	// 分页插件
	$.fn.workloadPage = function(options) {
		var $target = $(this);
		var o = {
			fieldNum: 0,
			totalPage: 1
		};
		$.extend(o, options);

		var _pageTPL =
			'<div class="workload-page" pages="<%=pages%>" size="<%=size%>"<% if(hash) { %> hash="<%=hash%>"<% } %>>\
				<div class="size">\
					<em>每页<%=size%>条</em>\
					<div class="size-list">\
					<ul>\
						<% for(var i=1; i<=5; i++) { %>\
							<li class="ac_changePageSize<% if(i*10 == size) { %> hover<% } %>" index="<%=i*10%>">每页<%=i*10%>条</li>\
						<% } %>\
					</ul>\
					</div>\
				</div>\
				<div class="total ac_showPageBox">\
					<em><%=current%>/<%=pages%></em>\
					<div class="page-list">\
					<ul>\
					<% for(var i=1; i<=pages; i++) { %>\
						<li  <% if(current==i) { %> class="current" <% } %> index="<%=i%>">\
							<a href="#" class="ac_changePage"><%=i%>/<%=pages%></a>\
						</li>\
					<% } %>\
					</ul>\
					</div>\
				</div>\
				<a href="#" class="prev <% if(current == 1) { %>prev-disabled <% } %>ac_changePage" srv="prev"></a>\
				<a href="#" class="next <% if(current ==pages) { %>next-disabled <% } %>ac_changePage" srv="next"></a>\
			</div>';

		if(parseInt(o.totalPage)>1 || o.fieldNum>10) {
			// 加载分页数据
			$target.html(_.template(_pageTPL)({
				hash: o.hash,
				pages: o.totalPage,
				size: o.pageSize,
				current: o.pageIndex
			}));

			// 定义分页事件
			$target.find('div.ac_showPageBox').hover(function() {
				$(this).find('div.page-list').show();
			}, function() {
				$(this).find('div.page-list').hide();
			});
			$target.find('.ac_changePage').unbind('click').bind('click', function() {
				var $target = $(this),
					$page = $target.parents('div.workload-page'),
					$current = $page.find('li.current'),
					$searchKey = $('div.workload-search').find('input.search-key');
				var _pages = $page.attr('pages'),
					_size = parseInt($page.attr('size')),
					_current = parseInt($current.attr('index')),
					_hash = $page.attr('hash');

				if($target.hasClass('current')) return false;

				if($target.attr('srv') == 'prev') {
					// 上一页
					if(_current == 1) return false;
					_current--;
				}else if($target.attr('srv') == 'next') {
					// 下一页
					if(_current == _pages) return false;
					_current++;
				}else {
					_current = parseInt($target.text());
				}

				if($searchKey.length > 0) {
					var _searchKey = $searchKey.val();
					if(_hash === undefined) {
						o.callback({
							pageIndex: _current,
							pageSize: _size,
							data: _searchKey
						});
					}else {
						if(_searchKey !== '') location.hash = _hash + '/' + _current + '/' + _searchKey;
						else location.hash = _hash + '/' + _current;
					}
				}else {
					if(_hash === undefined) {
						o.callback({
							pageIndex: _current,
							pageSize: _size
						});
					}else {
						location.hash = _hash + '/' + _current;
					}
				}

				return false;
			});
			$target.find('.ac_changePageSize').unbind('click').bind('click', function() {
				var $target = $(this),
					$page = $target.parents('div.workload-page'),
					$searchKey = $('div.workload-search').find('input.search-key');
				var _size = parseInt($target.attr('index'));

				// 将分页设置存储到本地
				store.set('Workload_PageSize', _size);

				if($searchKey.length > 0) {
					o.callback({
						pageSize: _size,
						data: $searchKey.val()
					});
				}else {
					o.callback({
						pageSize: _size
					});
				}

				return false;
			});
		}else {
			$target.empty();
		}
	}
	// 搜索插件
	$.fn.workloadSearch = function(options) {
		var $target = $(this),
			$searchContainer =  $target.find('div.workload-search'),
			$searchForm = $target.find('div.search-form');
		var o = {};
		$.extend(o, options);

		// 展开、收起搜索框
		$target.find('.show-search').unbind('click').bind('click', function() {
			var $this = $(this);

			if($this.hasClass('show-search-hover')) {
				$this.removeClass('show-search-hover');
				$searchContainer.hide();
			}else {
				$this.addClass('show-search-hover');
				$searchContainer.show();
			}
		});
		// 搜索
		// $searchForm.find('a.ac_searchWorkload').unbind('click').bind('click', function() {
		// 	var $this = $(this);
		// 	var _hash = $this.data('hash');

		// 	if(_hash === undefined) {
		// 		var _submitData = _events.serializeFields($target);

		// 		o.callback({
		// 			data: _submitData.dataModel
		// 		});
		// 		$searchForm.find('input.search-key').val(_submitData.dataModel);
		// 	}else {
		// 		var _submitData = _events.serializeFields($target, 'browser');

		// 		location.hash = _hash + '/1/' + unescape(_submitData.dataModel);
		// 	}

		// 	return false;
		// });
		// 清除搜索条件
		$searchForm.find('a.ac_clearSearchKey').unbind('click').bind('click', function() {
			var _hash = $(this).data('hash');

			if(_hash === undefined) {
				$searchForm.find('input[serialize="true"]').each(function() {
					var $input = $(this);
					var _labelName = $input.attr('labelName');

					$input.val('');

					// 人员、部门选择器
					if($input.hasClass('browser-value')) {
						$input.siblings('div.input-browse').find('span.browser-text').text('');
					// 下拉菜单
					}else if($input.hasClass('select-value')) {
						$input.parents('div.select-box').find('li[val="-1"]').trigger('click');
					}else if($input.hasClass('input-month')) {
						$input.removeAttr('fieldvalue');
					}
				});
				$searchForm.find('a.ac_searchWorkload').trigger('click');
			}else {
				location.hash = _hash;
			}

			return false;
		});
		// 监测键盘Enter事件
		$searchForm.unbind('keydown').bind('keydown', function(e) {
			switch(e.which) {
				case 13:
					$searchForm.find('a.ac_searchWorkload').trigger('click');
					break;
			}
		});
	}

	// 选择人员、部门弹窗
	$body.delegate('.ac_workloadInteractive', 'click', function() {
		var $target = $(this),
			$list = null,
			$input = null,
			$popupValue = null;
		var _fieldName = $target.attr('fieldName'),
			_interactiveValue = $target.attr('srv'),
			_interactiveType = $target.attr('rev'),
			_isWorkloadDept = $target.attr('workloadDept'),
			_interactiveOptions = {};

		if($target.hasClass('input-browse')) $list = $target.find('.browser-text');
		else $list = $target.siblings('.browser-text');

		$input = $list.parent().siblings('input[type="hidden"][serialize="true"]');
		$popupValue = $input.siblings('input[name="popupValue"]');


		// 弹窗参数配置
		_interactiveOptions = {
			type: _interactiveValue,
			callback: function(r) {
				getInteractiveValue('select', r);
			},
			clear: function() {
				getInteractiveValue('clear');
			}
		}
		if(_interactiveValue === 'SingleNeteaseDept') _interactiveOptions.selectType = 'main';
		if($popupValue.length > 0) _interactiveOptions.initValue = $popupValue.val();
		if(_isWorkloadDept === '1') _interactiveOptions.workloadDept = true;

		// 弹窗回调处理
		function getInteractiveValue(type, data) {
			// 单选处理
			if(_interactiveType == 'single') {
				// 选择
				if(type == 'select') {
					$list.text(data[0].title);
					$input.val(data[0].id);

					$target.siblings('a.clear-input').show().siblings('span.require').hide();

					// 选择单个人员显示工号
					if(_interactiveValue == 'SingleNeteaseUser') {
						console.info(data);
						if(data[0].badge == 'undefined') $list.text(data[0].title);
						else $list.text(data[0].title + '(' + data[0].badge + ')');
					// 选择单个部门只保存末级部门
					}else if(_interactiveValue == 'SingleNeteaseDept') {
						var _deptId = data[0].id.split(',');

						$input.val(_deptId[_deptId.length-1]);
					}
					// 人员管理“员工姓名”字段特殊处理
					if(_fieldName == 'hrmUserName') {
						var $form = $list.parents('div.workload-create-form');

						$list.text(data[0].title);
						$input.val(data[0].title);
						$form.find('input[name="loginId"]').val(data[0].badge);
						$form.find('input[name="email"]').val(data[0].email);
						$form.find('input[name="deptId"]').val(data[0].deptId).siblings('div.input-browse').find('span.browser-text').text(data[0].deptName);
					}
				// 清除
				}else if(type == 'clear') {
					$list.text('');
					$input.val('');
					$target.siblings('span.require').show().siblings('a.clear-input').hide();
				}
				return;
			}

			// 多选处理
			if(_interactiveType == 'multi') {
				// 选择
				if(type == 'select') {
					$list.text(data[0].title);
					$input.val(data[0].id);

					var _selectTPL = '',
						_ids = [],
						_popupValue = '';

					for(var i=0; i<data.length; i++) {
						_selectTPL += '<li><span>' + data[i].title + '</span><a href="#" class="remove ac_removeSelector" selectorId="' + data[i].id + '"></a></li>';
						_ids.push(data[i].id);

						if(i > 0) _popupValue += ',';
						_popupValue += data[i].id + '|' + data[i].title + '|' + data[i].dept;
					}

					$list.html(_selectTPL);
					$input.val(_ids);
					$popupValue.val(_popupValue);

					$target.siblings('a.clear-input').show().siblings('span.require').hide();

					// me.interactiveEvent($(obj));
				// 清除
				}else if(type == 'clear') {
					$list.empty();
					$input.val('');
					$popupValue.val('');
					$target.siblings('span.require').show().siblings('a.clear-input').hide();
				}
				return;
			}
		}

		// 弹窗引用
		require(["plugin/jq.popup"], function(Popup) {
			Popup(_interactiveOptions);
		});

		return false;
	}).delegate('.ac_removeSelector', 'click', function() {
		var $target = $(this),
			$li = $target.parent();
		var _selectorId = $target.attr('selectorId');

		_events.checkImportId($li.parents('div.input-browse').siblings('input.browser-value'), _selectorId);
		_events.checkImportId($li.parents('div.input-browse').siblings('input[name="popupValue"]'), _selectorId);
		$li.remove();

		return false;
	})
	// 选择月份
	.delegate('.ac_selectMonth', 'click', function() {
		var $target = $(this),
			$parent = $target.parent(),
			$startMonth = $parent.find('input[data-type="start"]'),
			$endMonth = $parent.find('input[data-type="end"]');
		var _fieldValue = $target.attr('fieldValue'),
			_monthTPL =
				'<dl>\
					<dt>\
						<strong data-year="<%=year%>"><%=year%>年</strong>\
						<div class="year-scope">\
							<a href="#" class="ac_changeYear" data-type="prev">&lt; 上一年</a><a href="#" class="ac_changeYear" data-type="next">下一年 &gt;</a>\
						</div>\
					</dt>\
					<dd>\
						<ul>\
							<% for(var i=1; i<13; i++) { %>\
							<li class="ac_selectMonth<% if(i === month) { %> hover<% } %>" data-month="<%=i%>"><%=i%>月</li>\
							<% } %>\
						</ul>\
					</dd>\
				</dl>',
			_yearOption = {
				year: new Date().getFullYear(),
				month: 0
			};

		if(_fieldValue!==undefined && _fieldValue!=='') {
			_yearOption = {
				year: _fieldValue.split('-')[0],
				month: parseInt(_fieldValue.split('-')[1])
			};
		}

		var $monthSprite = $.sprite({
			className: 'interactive-month-selector',
			noArrow: true,
			msg: _.template(_monthTPL)(_yearOption),
			outerFix: {t:0, r:0, b:-1, l:0},
			target: $target,
			direction: 'down',
			align: 'left',
			showButtons: false,
			loading: false,
			animate: 'none',
			easyClose: true,
			onsuccess: function(obj) {
				var $obj = $(obj);

				$obj.find('a.ac_changeYear').unbind('click').bind('click', function() {
					var $this = $(this),
						$year = $this.parent().siblings('strong[data-year]');
					var _year = $year.data('year'),
						_type = $this.data('type');

					if(_type === 'prev') _year--;
					else _year++;

					$year.data('year', _year).text(_year + '年');

					return false;
				});
				$obj.find('li.ac_selectMonth').unbind('click').bind('click', function() {
					var $li = $(this),
						$year = $li.parents('dl').find('strong[data-year]');
					var _year = $year.data('year'),
						_month = $li.data('month'),
						_startTime = [],
						_startYear = 0,
						_startMonth = 0,
						_endTime = [],
						_endYear = 0,
						_endMonth = 0;

					if($startMonth.length > 0 && $endMonth.length > 0) {
						var _type = $target.data('type');

						// 起始月不能大于结束月
						if(_type == 'start') {
							_startYear = _year;
							_startMonth = _month;
							_endTime = $endMonth.attr('fieldValue');

							if(_endTime !== undefined) {
								_endYear = parseInt(_endTime.split('-')[0]);
								_endMonth = parseInt(_endTime.split('-')[1]);
							}
						}else if(_type == 'end') {
							_startTime = $startMonth.attr('fieldValue');
							_endYear = _year;
							_endMonth = _month;

							if(_startTime !== undefined) {
								_startYear = parseInt(_startTime.split('-')[0]);
								_startMonth = parseInt(_startTime.split('-')[1]);
							}
						}

						if(_startMonth!=0 && _endMonth!=0 && (_startYear>_endYear || (_startYear===_endYear && _startMonth>_endMonth))) {
							$.oaTip('起始月份不能大于结束月份', 'warning', 2000);
							$target.val('').attr('fieldValue', '');
							$monthSprite.remove();
							return;
						}
					}

					$target.val(_year + '年' + _month + '月').attr('fieldValue', _year+'-'+(_month<10 ? '0'+_month : _month)).focus();
					$monthSprite.remove();
				});
			}
		});
	})
	//click outer of drop-down list then hide drop-down list
	.delegate(":not([class='ac_selectBox'])", "click", function(e){
		var $target = $(e.target);
		if ($target.hasClass("ac_selectBox") || $target.hasClass("ac_selectBox_edit") || $target.hasClass("ac_selectBox_append") || $target.hasClass('ac_select-search-input')){
			return;
		}else{
			$('div.select-box-hover').length && $('div.select-box-hover').each(function() {
				$(this).removeClass('select-box-hover').find('.ac_select-search-input').val('').trigger('keyup');
			});
		}
	})
	//focus input then close calendar box
	.delegate(".J_input", "focus", function(e){
		var $target = $(e.target);
			$(".J_calendar").trigger("closeBox");
			$(".J_calendar_month").trigger("closeBox");
	})
	// 模拟下拉菜单
	.delegate('.ac_selectBox, .ac_selectBox_edit, .ac_selectBox_append', 'click', function() {
		var $target = $(this),
			$select = $target.parent();
		var _value = $select.find('input').val(),
			_limit = $target.attr('limit');

		if($select.hasClass('select-box-hover')) {
			$select.removeClass('select-box-hover');
		}else {
			// 收起其他下拉菜单
			$('div.select-box-hover').each(function() {
				$(this).removeClass('select-box-hover');
			});

			$select.addClass('select-box-hover');
			if(_value!=-1 && _value!='') $select.find('li.ac_selectItem[val="' + _value + '"]').addClass('hover');

			if(_limit == '0') $select.find('ul').addClass('select-auto');
		}
	}).delegate('.ac_selectItem', 'click', function() {
		var $li         = $(this),
			$select     = $li.parent().parent(),
			$em         = $select.find('em'),
			$input      = $select.find('input.select-value'),
			originVal   = $input.attr("data-origin") || "";
		var _value = $li.attr('val');

		if($li.hasClass('hover') && !$input.hasClass("ac_selectBox_append")) {
			$select.removeClass('select-box-hover');
			return;
		}

		if(_value=='') {
			$li.siblings('li').removeClass('hover');
			$input.val('').siblings('span.require').show();
		}else {
			$li.addClass('hover').siblings('li').removeClass('hover');
			$input.val($input.hasClass("ac_selectBox_append") ? (originVal + _value) : _value).siblings('span.require').hide();
		}

		$input.trigger("change");
		$em.text($li.text());
		$select.removeClass('select-box-hover');
	})
	// 下拉搜索功能
	.on('keyup', '.ac_select-search-input', function () {
			var _this = this,
				$this = $(_this),
				$siblings = $this.parent().nextAll();
			if (_this.__value === $this.val()) {
				return;
			}
			if (!_this.__timeout) {
				_this.__timeout = setTimeout(function () {
					$siblings.hide().filter(function (){
						return $(this).text().toLowerCase().indexOf($this.val().toLowerCase()) > -1;
					}).show();
					_this.__value = $this.val();
					_this.__timeout = null;
				}, 120);
			}
	})
	// 模拟单选按钮
	.delegate('.ac_inputRadio', 'click', function() {
		var $target = $(this),
			$input = $target.siblings('input.input-value');
		var _name = $input.attr('name'),
			_value = $target.data('value');

		if($target.hasClass('input-radio-hover')) return;

		$target.addClass('input-radio-hover').siblings('label').removeClass('input-radio-hover');
		$input.val(_value);

		// 人员管理：是否系统人员
		if(_name === 'objType') {
			var $form = $target.parents('form'),
				$oaItem = $form.find('dl.oa-user-item'),
				$nonOaItem = $form.find('dl.non-oa-user-item'),
				$loginId = $form.find('input[name="loginId"][serialize="true"]'),
				$id = $form.find('input[name="id"][serialize="true"]');

			if(_value === 1) {
				$oaItem.show();
				$oaItem.find('input[name="name"]').attr({'serialize':'true', 'isMandatory':'1'});
				$nonOaItem.hide();
				$nonOaItem.find('input[name="name"]').attr({'serialize':'true', 'isMandatory':'1'});
				if($id.length === 0) $loginId.val('').attr('readonly', 'readonly');
			}else if(_value === 2) {
				$oaItem.hide();
				$oaItem.find('input[name="name"]').attr({'serialize':'false', 'isMandatory':'0'});
				$nonOaItem.show();
				$nonOaItem.find('input[name="name"]').attr({'serialize':'true', 'isMandatory':'1'});
				if($id.length === 0) $loginId.removeAttr('readonly');
			}
		// 组织单元管理：填写方式
		}else if(_name === 'personal') {
			var $form = $target.parents('form'),
				$unitItem = $form.find('dl.unit-item'),
				$inputerItem = $form.find('dl.inputer-item');

			if(_value === 1) {
				$unitItem.show();
				$inputerItem.hide().find('input[name="inputerIds"]').val('-1').siblings('input[name="popupValue"]').val('');
				$inputerItem.find('ul.browser-text').empty();
			}else if(_value === 0) {
				$unitItem.hide();
				$unitItem.find('.input-radio-hover').removeClass('input-radio-hover');
				$unitItem.find('input[name="objType"]').val('');
				$inputerItem.show();
				if($inputerItem.find('input[name="inputerIds"]').val() == '-1') {
					$inputerItem.find('input[name="inputerIds"]').val('');
				}
			}
		}
	})
	//模拟复选框组
	.delegate(".ac-checkbox-list .input-checkbox", "click", function(e){
			var $target = $(e.currentTarget),
				$list = $target.parents('.ac-checkbox-list'),
				_type = $target.data('type'),
				$input = $list.find("input"),
				_value;

			var _updateValue = function(){
				return _.reduce($list.find(".input-checkbox-hover[data-type='item']"), function (ret, chk) {
					ret.push($(chk).data("value"));
					return ret;
				}, []).join(",");
			};

			$target.toggleClass('input-checkbox-hover');

			switch (_type){
				case 'all':

					if(!$target.hasClass('input-checkbox-hover')) $list.find('.input-checkbox-hover:not([data-type="all"])').removeClass('input-checkbox-hover');
					else $list.find('.input-checkbox[data-type="item"]:not(".input-checkbox-hover")').addClass('input-checkbox-hover');

					_value = $target.hasClass('input-checkbox-hover') ? _updateValue() : "";
					break;

				case 'item':

					var _len = $list.find('.input-checkbox[data-type="item"]').length,
						_checks = $list.find('.input-checkbox-hover[data-type="item"]').length;

					if(_len === _checks) $list.find('.input-checkbox[data-type="all"]').addClass('input-checkbox-hover');
					else $list.find('.input-checkbox[data-type="all"]').removeClass('input-checkbox-hover');


					_value = _updateValue();
					break;

				case 'single':

					_value = $target.hasClass('input-checkbox-hover') ? true : false;
					break;
			}

			$input.val(_value);

			$input.trigger("change");
			return false;
	})
	//模拟单选框组
	.delegate(".ac-radiobox-list .input-radio", "click", function(e){
		var $target = $(e.currentTarget),
			$list = $target.parents('.ac-radiobox-list');

		$list.find('.input-radio').removeClass('input-radio-hover');
		$target.addClass('input-radio-hover');

		$list.find("input").val($target.data("value"));
		return false;
	});

	return _events;
});