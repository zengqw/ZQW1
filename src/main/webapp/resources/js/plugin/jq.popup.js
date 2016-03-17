/**
 * @弹窗主体内容
 * Author: gzxushaolong
 */
define(["jquery", "underscore", "backbone", "plugin/jq.eventrouter", "plugin/jq.interactive", "plugin/jq.mousewheel.min", "plugin/jq.jscrollpane.min"], function($, _, Backbone) {
	var URL = {
		getUserInfoByQueryKey: ['/service/hrm/common/getUserInfoByQueryKey.jsp'],
		NeteaseDept: ['/service/hrm/resource/HrmDepartment.jsp', '/service/hrm/resource/HrmSubDepartment.jsp', '/service/hrm/resource/getUserFromDeptId.jsp', '/service/hrm/resource/getUserByNameAndDepId.jsp', '/service/hrm/resource/SelectCommonRecursion.jsp'],
		WorkloadDept: ['/service/workload/common/HrmDepartment.jsp', '/service/workload/common/HrmSubDepartment.jsp']
	}
	var TPL = {
		myDept:
			'<%\
				var _deptLen = dept.length-1, _dept2Len = myDept.dept2.length-1, _dept3Len = myDept.dept3.length-1, _isSingle = isSingle;\
				for(var i=0; i<=_deptLen; i++) {\
			%>\
				<% if(dept[i].hasChild == "true") { %>\
					<dl class="<%= i==_deptLen ? \'end\' : \'mid\'%>" level="1" child="1" deptId="<%=dept[i].deptId%>" parentId="<%=parentId%>">\
						<% if(dept[i].deptId == myDept.mine.userDept1.deptId) { %>\
							<dt class="main-dept"><i class="fold fold-show ac_showSubDept"></i><strong><%=dept[i].deptName%></strong></dt>\
							<dd>\
							<% for(var j=0; j<=_dept2Len; j++) { %>\
								<% if(myDept.dept2[j].hasChild == "true") { %>\
									<dl class="<%= j==_dept2Len ? \'end\' : \'mid\'%>" level="2" child="1" deptId="<%=myDept.dept2[j].deptId%>" parentId="<%=dept[i].deptId%>">\
										<% if(myDept.dept2[j].deptId == myDept.mine.userDept2.deptId) { %>\
											<% if(_dept3Len > 0) { %>\
												<dt class="sub-dept"><i class="fold fold-show ac_showSubDept"></i><strong><%=myDept.dept2[j].deptName%></strong></dt>\
												<dd>\
												<% for(var y=0; y<=_dept3Len; y++) { %>\
													<dl class="<%= y==_dept3Len ? \'end\' : \'mid\'%>" level="3" child="0" deptId="<%=myDept.dept3[y].deptId%>" parentId="<%=myDept.dept2[j].deptId%>">\
														<dt class="sub-dept alone<% if(myDept.dept3[y].deptId == myDept.mine.userDept3.deptId) { %> hover<% } %>"><i class="fold"></i><strong><%=myDept.dept3[y].deptName%></strong></dt>\
													</dl>\
												<% } %>\
												</dd>\
											<% }else { %>\
												<% if(myDept.dept2[j].hasChild == "true") { %>\
													<dt class="sub-dept hover"><i class="fold ac_showSubDept"></i><strong><%=myDept.dept2[j].deptName%></strong></dt>\
													<dd></dd>\
												<% }else { %>\
													<dt class="sub-dept alone hover"><i class="fold"></i><strong><%=myDept.dept2[j].deptName%></strong></dt>\
												<% } %>\
											<% } %>\
										<% }else { %>\
											<dt class="sub-dept"><i class="fold ac_showSubDept"></i><strong><%=myDept.dept2[j].deptName%></strong></dt>\
											<dd><dd>\
										<% } %>\
									</dl>\
								<% }else { %>\
									<dl class="<%= j==_dept2Len ? \'end\' : \'mid\'%>" level="2" child="0" deptId="<%=myDept.dept2[j].deptId%>" parentId="<%=dept[i].deptId%>">\
										<dt class="sub-dept alone<% if(myDept.dept2[j].deptId == myDept.mine.userDept2.deptId) { %> hover<% } %>"><i class="fold"></i><strong><%=myDept.dept2[j].deptName%></strong></dt>\
									</dl>\
								<% } %>\
							<% } %>\
							</dd>\
						<% }else { %>\
							<dt class="main-dept"><i class="fold ac_showSubDept"></i><strong><%=dept[i].deptName%></strong></dt>\
							<dd></dd>\
						<% } %>\
					</dl>\
				<% }else { %>\
					<dl class="<%= i==_deptLen ? \'end\' : \'mid\'%>" level="1" child="0" deptId="<%=dept[i].deptId%>" parentId="<%=parentId%>">\
						<dt class="main-dept alone"><i class="fold"></i><strong><%=dept[i].deptName%></strong></dt>\
					</dl>\
				<% } %>\
			<% } %>',
		dept:
			'<%\
				var _deptType = "", _deptLen = dept.length-1, _isSingle = isSingle, _selectType = selectType, _onlyMain = onlyMain;\
				switch(level) {\
					case 1:\
						_deptType = "main-dept";\
						break;\
					case 2:\
						_deptType = "sub-dept";\
						break;\
					case 3:\
						_deptType = "end-dept";\
						break;\
				}\
				for(var i=0; i<=_deptLen; i++) {\
			%>\
				<dl class="<%= i==_deptLen ? \'end\' : \'mid\'%>" level="<%=level%>" child="<%= dept[i].hasChild==\'true\' ? \'1\' : \'0\'%>" deptId="<%=dept[i].deptId%>" parentId="<%=parentId%>">\
					<dt class="<%=_deptType%><%= dept[i].hasChild==\'false\' ? \' alone\' : \'\'%>"><% if(!_onlyMain) { %><i class="fold ac_showSubDept"></i><% } %><strong><%=dept[i].deptName%></strong><% if(_selectType=="main" || level>1) { %><a href="#" class="<%=(_isSingle==1 ? \'input-radio\' : \'input-checkbox\')%> ac_selectDept"></a><% } %></dt>\
					<% if(dept[i].hasChild == "true") { %>\
					<dd></dd>\
					<% } %>\
				</dl>\
			<% } %>',
		employe:
			'<% for(var i=0; i<employe.length; i++) { %>\
			<li class="ac_selecteEmploye" data-uid="<%=employe[i].id%>" data-badge="<%=employe[i].loginId%>" data-did="<%=employe[i].dept3Id%>" data-dept="<%=employe[i].dept1Name%> → <%=employe[i].dept2Name%><% if(employe[i].dept2Id != employe[i].dept3Id) { %> → <%=employe[i].dept3Name%><% } %>" data-company="<%=employe[i].claimCompName%>" data-email="<%=employe[i].email%>" data-job="<%=employe[i].jobTitle%>" title="双击选中员工">\
				<strong><%=employe[i].lastName%></strong> |\
				<span><%=employe[i].dept1Name%> → <%=employe[i].dept3Name%></span>\
			</li>\
			<% } %>',
		singleEmploye:
			'<% for(var i=0; i<employe.length; i++) { %>\
				<li class="<%=(i%2==0 ? \'odd\' : \'even\')%> ac_selecteEmploye" uid="<%=employe[i].id%>" title="双击选中员工">\
					<strong><%=employe[i].lastName%></strong>\
					<span><%=employe[i].dept1Name%> → <%=employe[i].dept3Name%></span>\
				</li>\
			<% } %>'
	}
	var JQ = {
		versionId: $('#versionId').val()
	}
	var Popup = function(options) {
		var o = {
			type: '',
			initValue: '',
			selectType: 'sub',
			onlyMain: false,
			subordinate: false,
			workloadDept: false,	// 是否为工作量统计系统专属部门
			clearButton: true,
			success: function() {},
			callback: function() {}
		};
		$.extend(o, options);

		switch(o.type) {
			// 选择多个员工
			case 'MultiNeteaseUser':
			// 选择单个员工
			case 'SingleNeteaseUser':
				require(['text!tmpl/interactive/user.html?' + JQ.versionId, 'plugin/jq.searchUser'], function(tpl, searchUser) {
					"use strict";
					if(o.type == 'MultiNeteaseUser') {
						var hasPressCtrl = false, hasPressShift = false;
						/*$(document).on('keydown', function(e){
							if(e.ctrlKey || e.metaKey){
								hasPressCtrl = true;
							}
							if(e.keyCode === 16){
								hasPressShift = true;
							}
						}).on('keyup', function(e){

							if(e.ctrlKey || e.metaKey){
								hasPressCtrl = false;
							}
							if(e.keyCode === 16){
								hasPressShift = false;
							}
						});*/
					}
					var Sector = null;
					var Scrollbar = {
						tree: null,
						employe: []
					};
					var UserPopupView = Backbone.View.extend({
						tagName: 'div',
						className: 'netease-user',
						id: 'neteaseUser',
						events: {
							'click .ac_selectDept': 'selectDept',
							'click .ac_selectBox': 'selectBox',
							'click .ac_selectItem': 'selectItem',
							'click .ac_showSubDept': 'getSubDept',
							'click .selector-tree dt strong': 'getSubDept',
							'click .ac_selecteEmploye': 'getFocus',
							'dblclick .ac_selecteEmploye': 'selecteEmploye',
							'dblclick .user-item': 'removeSelf',
							'keydown .user-input': 'editUser',
							'click .choice-toolbar .addAll': 'addGroup',
							'click .choice-toolbar .subordinate': 'showSubordinate',
						},
						cache: {}, // 缓存返回结果
						initialize: function() {
							Sector = this;

							Sector.firstLoad = true;

							Sector.render(o.type);

							// 初始化已选员工
							Sector.choiceBox = Sector.$el.find('.push-list');

							Sector.userInput = Sector.$el.find('input');

							Sector.userInputWraper = Sector.userInput.parent();

							Sector.initEmploye();

							Sector.getDept();
						},
						selectDept: function(e) {
							var $target = $(e.currentTarget);
							require(["popup/jq.popup"], function(Popup) {
								Popup({
									type: 'SingleNeteaseDept',
									selectType: 'main',
									callback: function(r) {
										var _id = r[0].id.split(','), _title = r[0].title.replace(/,/g, ' → ');

										if(_id.length == 1) {
											$target.siblings('input[name="subcompanyid"]').val(_id[0]);
											$target.siblings('input[name="departmentid"]').val('');
										}else {
											$target.siblings('input[name="subcompanyid"]').val(_id[0]);
											$target.siblings('input[name="departmentid"]').val(_id[_id.length-1]);
										}
										$target.find('span.browser-text').text(_title);
									},
									clear: function() {
										$target.find('span.browser-text').text('');
										$target.siblings('input[name="subcompanyid"]').val('');
										$target.siblings('input[name="departmentid"]').val('');
									}
								});
							});
						},
						selectBox: function(e) {
							var $target = $(e.currentTarget),
								$select = $target.parent();
							var _value = $select.siblings('input').val(),
								_limit = $target.attr('limit');

							if($select.hasClass('oa-select-hover')) {
								$select.removeClass('oa-select-hover');
							}else {
								// 收起其他下拉菜单
								$('div.oa-select-hover').each(function() {
									$(this).removeClass('oa-select-hover');
								});

								$select.addClass('oa-select-hover');
								if(_value!=-1 && _value!='') $select.find('li.ac_selectItem[val="' + _value + '"]').addClass('hover');

								if(_limit == '0') $select.find('ul').addClass('oa-select-auto');
							}
						},
						selectItem: function(e) {
							var $target = $(e.currentTarget),
								$li = $target,
								$select = $li.parent().parent(),
								$em = $select.find('em'),
								$input = $select.siblings('input.select-value');
							var _value = $li.attr('val');

							if($li.hasClass('hover')) {
								$select.removeClass('oa-select-hover');
								return;
							}

							if(_value=='-1' || _value=='') {
								$li.siblings('li').removeClass('hover');
								$input.val('').siblings('span.require').show();
							}else {
								$li.addClass('hover').siblings('li').removeClass('hover');
								$input.val(_value).siblings('span.require').hide();
							}
							$em.text($li.text());
							$select.removeClass('oa-select-hover');
						},
						getDept: function() {
							var $tree = $(Sector.el).find('div.selector-tree'),
								$loading = $tree.siblings('div.loading');

							$loading.show();
							$.showLoading = false;
							$.ajax({
								type: 'post',
								dataType: 'json',
								url: URL.NeteaseDept[0],
								success: function(r) {
									$loading.hide();
									$tree.html(_.template(TPL.myDept)({
										dept: r[1].dept1,
										myDept: {
											dept2: r[2].dept2,
											dept3: r[3].dept3,
											mine: r[4]
										},
										level: 1,
										parentId: 0,
										isSingle: 0,
										selectType: 'sub',
										onlyMain: o.onlyMain
									}));
									// 自定义滚动条并定位到当前部门
									var _scrollTop = $tree.find('dt.hover').offset().top - $tree.offset().top;
									$tree.jScrollPane({
										showArrows: true
									});
									Scrollbar.tree = $tree.data('jsp');
									Scrollbar.tree.scrollToY(_scrollTop);

									// 初始化当前部门同事
									if(r[3].dept3.length == 0) var _deptId = r[4].userDept2.deptId;
									else var _deptId = r[4].userDept3.deptId;

									// #3045 【OA改版】试用期评估_员工姓名窗口需屏蔽自己，默认显示直接下属，前端添加参数。
									// 首次加载默认选择下属
									if(o.onlySubordinate && Sector.firstLoad){

										Sector.showSubordinate();

										Sector.firstLoad = false;
									}
									else{
										Sector.showEmployer(_deptId);
									}
								}
							});
						},
						getSubDept: function(e) {
							var $tree = $(Sector.el).find('div.selector-tree'),
								$target = $(e.currentTarget),
								$parent = $target.parent().parent(),
								$fold = $parent.find('i.fold:first');
							var _level = parseInt($parent.attr('level')),
								_child = $parent.attr('child'),
								_deptId = $parent.attr('deptId');

							$tree.find('.hover').removeClass('hover');
							$target.parent().addClass('hover');

							if(_child == 0) {
								if(_level > 1) {
									Sector.showEmployer(_deptId);
								}
								return;
							}

							if($fold.hasClass('fold-show')) {
								$fold.removeClass('fold-show');
								$parent.find('dd:first').hide();

								Scrollbar.tree.reinitialise();
								return;
							}else {
								$fold.addClass('fold-show');

								if(_level > 1) {
									Sector.showEmployer(_deptId);
								}

								if($parent.find('dd:first').find('dl').length > 0) {
									$parent.find('dd:first').show();

									Scrollbar.tree.reinitialise();
									return;
								}

								$.showLoading = false;
								$.ajax({
									type: 'post',
									dataType: 'json',
									url: URL.NeteaseDept[1],
									data: 'deptId=' + _deptId,
									success: function(r) {
										$parent.find('dd:first').html(_.template(TPL.dept)({
											dept: r,
											level: _level+1,
											parentId: _deptId,
											isSingle: 0,
											selectType: 'sub',
											onlyMain: o.onlyMain
										}));
										Scrollbar.tree.reinitialise();
									}
								});
							}
						},
						initEmploye: function(date) {
							if(o.initValue){
								var _list = o.initValue.split(','),
									that = this;

								$.each(_list, function(i, o){
									var val = o.split('|');
									var fakeItem = $('<span unselectable="on" class="user-item" data-uid="' + val[0] + '" data-department="'+ val[2] +'">' + val[1] + '</span>');
									that.userInputWraper.prepend(fakeItem);
								});
							}
						},
						showEmployer: function(key, type, url) {
							var $push = $(Sector.el).find('div.push-list').find('div.scroll-list'),
								that = this,
								$loading = $push.siblings('div.loading'),
								$empty = $push.siblings('div.empty-tip');

							// #3045 【OA改版】试用期评估_员工姓名窗口需屏蔽自己，默认显示直接下属，前端添加参数。
							// 这样子改动我比较无语
							var requestUserURL = URL.NeteaseDept[2];
							if(o.onlySubordinate) requestUserURL = URL.NeteaseDept[4];

							// 添加强行更改请求地址参数
							if(url) requestUserURL = url;

							var _url = type == 'user' ? URL.NeteaseDept[3] : requestUserURL,
								_data = type == 'user' ? key : 'deptId=' + key,
								exec = function(r) {
									(typeof o.filter === 'function') && (r = o.filter(r));

									if(typeof r !== 'object'){
										r = {};
										console && console.error('过滤器应返回对象');
									}

									that.$el.find('.user-list').data('groupId', key);

									$loading.hide();

									// 根据已经选中的条目，对请求的数据进行筛选显示
									var selectedIds = [], rTemp = [];
									$(Sector.el).find('.user-input').find('[uid]').each(function(i, o){
										selectedIds.push($(o).attr('uid'));
									});

									$.each(r, function(i, o){
										if(_.indexOf(selectedIds, o.id) === -1){
											rTemp.push(o);
										}
									});

									r = rTemp;

									if(r.length == 0) {
										$push.find('ul').empty();
										$empty.show();

										if(Scrollbar.employe.length > 0) Scrollbar.employe[0].reinitialise();
										return;
									}

									$push.find('ul').html(_.template(TPL.employe)({
										employe: r
									}));

									if(Scrollbar.employe.length == 0) {
										$push.jScrollPane({
											showArrows: true
										});
										Scrollbar.employe[0] = $push.data('jsp');
									}else {
										Scrollbar.employe[0].reinitialise();
									}
								};

							// 只显示直接下属
							if(o.subordinate) _data += '&suborDinate=true';

							// 剔除本人
							if(o.withoutSelf) _data += '&withOutSelf=true';

							// 只显示直接试用期，只对onlySubordinate=true有效
							if(o.probation) _data += '&probation=true';

							$.showLoading = false;
							$loading.show();
							$empty.hide();

							if(typeof that.cache[_data] !== 'undefined'){
								exec(that.cache[_data]);
							}
							else{
								$.ajax({
									type: 'post',
									dataType: 'json',
									url: _url,
									data: _data,
									success: function(r) {

										that.cache[_data] = r;

										exec(that.cache[_data]);
									}
								});
							}
						},
						getFocus: function(e) {
							var $li = $(e.currentTarget),
								$parent = $li.parent();

							// 单点多选模式
							if(hasPressCtrl){
								$li.toggleClass('hover');
							}

							// 范围多选模式
							if(hasPressShift){
								var start = $parent.find('li.hover:first').index();

								// 先移除本来选中的，与原生操作一致
								$parent.find('li').removeClass('hover').each(function(i, o){

									if(i >= start && i <= $li.index()){
										$(o).addClass('hover');
									}
									else if(i <= start && i >= $li.index()){
										$(o).addClass('hover');
									}
								});
							}

							// 正常模式
							if(!hasPressCtrl && !hasPressShift){
								$li.addClass('hover');
								$li.siblings('li').removeClass('hover');
							}
						},
						focusInput: function(typed){
							var inputEl = Sector.userInput;

							if(typed) {
								inputEl.removeClass('hack').val('');
							}else {
								inputEl.addClass('hack');
							}

							inputEl.parent().addClass('active');

							inputEl.parent().find('.tips').hide();

							setTimeout(function(){
								inputEl.focus();
							}, 100);

							return inputEl;
						},
						addGroup: function(){
							var that = this;
							that.choiceBox.find('li').each(function(){
								that.selecteEmploye($(this));
							});
						},
						showSubordinate: function(){
							var that = this;
							that.showEmployer('', '', URL.NeteaseDept[4]);
						},
						removeSelf: function(e){
							Sector.removeItem($(e.currentTarget));
						},
						editUser: function(e){
							var target = $(e.currentTarget).find('input'),
								that = this,
								prevEl = target.prev('.user-item'),
								selectedItemEl = target.siblings('.selected');

							// 回退删除条目
							if((e.keyCode === 8) && target.val().length === 0 && prevEl.length > 0 && !target.hasClass('hack')){

								if(selectedItemEl.length > 0){
									that.removeItem(selectedItemEl);
									Sector.focusInput(true);
									return false;
								}

								if(prevEl.hasClass('selected')){

									that.removeItem(prevEl);
									Sector.focusInput(true);
								}
								else{
									prevEl.addClass('selected');
									target.addClass('hack');
								}
								return false;
							}

							// 直接删除条目
							if((e.keyCode === 46 || e.keyCode === 8) && selectedItemEl.length > 0 ){

								that.removeItem(selectedItemEl);

								Sector.focusInput(true);

								return false;
							}

							var selectedEl = target.parent().find('.selected');

							if((e.keyCode === 37 || e.keyCode === 39) && Sector.userInput.val().length === 0){

								if(selectedEl.length > 0){
									if(e.keyCode === 37){
										target.insertBefore(selectedEl.filter(':first'));
									}
									else{
										target.insertAfter(selectedEl.filter(':last'));
									}
								}
								else{
									if(e.keyCode === 37){
										target.insertBefore(target.prev());
									}
									else{
										target.insertAfter(target.next());
									}
								}

								selectedEl.removeClass('selected');

								Sector.focusInput(true);

								return false;
							}

							if(hasPressCtrl && e.keyCode === 65 && Sector.userInput.val().length === 0){
								target.siblings('.user-item').addClass('selected');
								Sector.focusInput(false);
								return false;
							}
						},
						selecteEmploye: function(e) {
							var target = e.currentTarget ? $(e.currentTarget) : e;
							var _uid = target.data('uid'),
								_badge = target.data('badge'),
								_deptId = target.data('did'),
								_deptName = target.data('dept'),
								_email = target.data('email'),
								_company = target.data('company'),
								_job = target.data('job'),
								_uids = '';
							var _tpl =
								'<span data-uid="' + _uid + '" data-badge="' + _badge + '" data-did="' + _deptId + '" data-dept="' + _deptName + '" data-email="' + _email + '" data-company="' + _company + '" data-job="' + _job + '" unselectable="on" class="user-item">'
									+ target.find('strong').text() +
								'</span>';

							target.remove();

							$(Sector.el).find('.user-input .user-item').each(function() {
								_uids += $(this).attr('uid') + "|";
							});

							if(_uids.indexOf(_uid) < 0) Sector.focusInput(true).before($(_tpl));

							if(Sector.choiceBox.find('li').length === 0) Sector.choiceBox.find('.empty-tip').show();

							// 重新初始化滚动条
							Scrollbar.employe[0].reinitialise();
							Scrollbar.employe[0].scrollToY(0);

							// 如果为单选用户操作，则直接提交
							if(o.type == 'SingleNeteaseUser') {
								$('#jq-interactive-SingleNeteaseUser').find('a.ac_interactiveConfirm').trigger('click');
							}
						},
						saveFlow: function() {
							var _employe = [];

							$(Sector.el).find('.user-input .user-item').each(function() {
								var $this = $(this);
								_employe.push({
									id: $this.data('uid'),
									title: $this.text(),
									badge: $this.data('badge'),
									deptId: $this.data('did'),
									deptName: $this.data('dept'),
									email: $this.data('email'),
									company: $this.data('company'),
									job: $this.data('job')
								});
							});

							// Hack Code #3007 【OA改版】试用期评估_单选，点确定按钮，不能返回值
							if(o.type == 'SingleNeteaseUser' && _employe.length === 0) {
								var currentEl = $(Sector.el).find('.push-list .ac_selecteEmploye.hover');

								if(currentEl.length === 1){
									_employe.push({
										id: currentEl.data('uid'),
										title: currentEl.find('strong').text(),
										badge: currentEl.data('badge'),
										deptId: currentEl.data('did'),
										deptName: currentEl.data('dept'),
										email: currentEl.data('email'),
										company: currentEl.data('company'),
										job: currentEl.data('job')
									});
								}
							}

							return _employe;
						},
						removeItem: function(item){
							item.remove();

							this.showEmployer(this.$el.find('.user-list').data('groupId'));
						},
						bindEvent: function(obj){
							var $el = $(obj),
								that = this;

							var userInputEl = $el.find('input');

							var userInputWraperEl = userInputEl.parent();

							userInputWraperEl.on('click', function(e){
								if($(e.target).is(userInputWraperEl)){
									return false;
								}
							});

							// 记录鼠标移动的偏移量
							var _cursor_start_pos = 0,
								_get_cursor_index = function(e){

									var _mouse_position_x = 0,
										_mouse_position_y = 0,
										_mouse_position_z = 0;

									var parentOffset = Sector.userInputWraper.offset();

									_mouse_position_x = e.pageX - parentOffset.left;
									_mouse_position_y = e.pageY - parentOffset.top;
									_mouse_position_z = (_mouse_position_x) + ( parseInt((_mouse_position_y - 2) / 24)) * 710;

									_mouse_position_z = parseInt(_mouse_position_z);

									var elSizeX = [], elSizeY = [];

									userInputWraperEl.find('.user-item').each(function(){

										elSizeX.push( parseInt( ($(this).position().left) + ( parseInt(($(this).position().top - 2) / 24)) * 710 ) );

									});

									for(var i = elSizeX.length - 1; i > -1; i--){

										if( _mouse_position_z > elSizeX[i] + 3){

											break;
										}
									}

									return i;
								};

							var isMousedown = false;

							userInputWraperEl
							.on('mousedown', function(e){
								
								_cursor_start_pos = _get_cursor_index(e);

								isMousedown = true;

								userInputWraperEl.find('.user-item').removeClass('selected');

								if($(e.target).hasClass('tips')){
									that.focusInput(true);
								}

								if($(e.target).is(userInputWraperEl)){

									that.focusInput(true);

									if(_cursor_start_pos === -1){
										Sector.userInput.insertBefore( userInputWraperEl.find('.user-item').eq(0) );
									}
									else{
										Sector.userInput.insertAfter( userInputWraperEl.find('.user-item').eq(_cursor_start_pos) );
									}
									return false;
								}
							})
							.on('mousemove', function(e){

								var itemEl = $(e.target);

								if(isMousedown){

									var startIndex = _cursor_start_pos + 1, endIndex = _get_cursor_index(e), tmp;

									if(startIndex > endIndex){
										tmp = endIndex;
										endIndex = startIndex;
										startIndex = tmp;
									}

									userInputWraperEl.find('.user-item').each(function(i, o){

										if(i >= startIndex && i <= endIndex){
											$(o).addClass('selected');
										}
										else{
											$(o).removeClass('selected');
										}
									});
								}
							})
							.on('mouseup', function(){
								isMousedown = false;
								return false;
							});

							this.searchTips = searchUser(userInputEl, userInputWraperEl, function(obj){
								that.selecteEmploye(obj, true);
							}, {
								subordinate: o.subordinate,
								onlySubordinate: o.onlySubordinate
							});

							userInputWraperEl.on('click', '.user-item', function(){

								$(this).addClass('selected').siblings().removeClass('selected');

								that.focusInput(false).insertAfter($(this));

								return false;

							});

							$('body').on('click', function(){
								userInputWraperEl.find('.user-item').removeClass('selected');
								userInputWraperEl.removeClass('active');
								if(userInputWraperEl.find('.user-item').length === 0){
									userInputWraperEl.find('.tips').show();
								}
							});

							if(o.type == 'SingleNeteaseUser'){
								$el.find('.ope.addAll').remove();
							}
						},
						render: function(type) {
							Sector.el.innerHTML = tpl;
							var $el = $(Sector.el),
								that = this;

							var $sprite = $.sprite({
								type: o.type,
								title: o.title || '选择相关人员',
								width: 720,
								height: 480,
								heightLimit: false,
								move: true,
								mask: true,
								confirmButton: true,
								loading: false,
								onsuccess: function(obj) {
									$(obj).empty();
									$(obj)[0].appendChild(Sector.el);
									that.bindEvent(obj);
								},
								onconfirm: function() {
									var _employe = Sector.saveFlow();

									if(_employe.length == 0) {
										$.oaTip('请选择相关人员', 'warning');
									}else {
										o.callback(_employe);
										$sprite.remove();
										Sector.removeView();
									}
								},
								onclear: function() {
									o.clear();
									$sprite.remove();
									Sector.removeView();
								},
								onclose: function() {
									Sector.removeView();

									// 由于弹出框关闭区域太多动作默认禁用，所以手动把搜索提示删除
									that.searchTips && that.searchTips.remove();
								}
							});
						},
						removeView: function() {
							//userPopupView.remove();
							userPopupView = null;
							UserPopupView = null;
						}
					});
					var userPopupView = new UserPopupView();
				});
				break;
			// 选择多个部门
			case 'MultiNeteaseDept':
			// 选择单个部门
			case 'SingleNeteaseDept':
				require(["text!tmpl/interactive/dept.html?" + JQ.versionId], function(tpl) {
					var Sector = null;
					var Scrollbar = {
						tree: null,
						employe: []
					}
					var DeptPopupView = Backbone.View.extend({
						tagName: 'div',
						className: 'netease-user',
						id: 'neteaseUser',
						events: {
							'click .ac_showSubDept': 'getSubDept',
							'click .selector-tree dt strong': 'getSubDept',
							'click .ac_selectDept': 'selectDept'
						},
						initialize: function() {
							Sector = this;
							Sector.render(o.type);
							Sector.getDept();
						},
						getDept: function() {
							var $tree = $(Sector.el).find('div.selector-tree'),
								$loading = $tree.siblings('div.loading');
							var _isSingle = o.type == 'SingleNeteaseDept' ? 1 : 0,
								_url = URL.NeteaseDept[0];

							if(o.workloadDept) _url = URL.WorkloadDept[0];

							$.showLoading = false;
							$loading.show();
							$.ajax({
								type: 'post',
								dataType: 'json',
								url: _url,
								success: function(r) {
									$loading.hide();
									$tree.html(_.template(TPL.dept)({
										dept: r[1].dept1,
										level: 1,
										parentId: 0,
										isSingle: _isSingle,
										selectType: o.selectType,
										onlyMain: o.onlyMain
									}));
									// 自定义滚动条
									$tree.jScrollPane({
										showArrows: true
									});
									Scrollbar.tree = $tree.data('jsp');
								}
							});
						},
						getSubDept: function(e) {
							var $tree = $(Sector.el).find('div.selector-tree'),
								$target = $(e.currentTarget),
								$parent = $target.parent().parent(),
								$fold = $parent.find('i.fold:first'),
								$btn = $parent.find('a.ac_selectDept:first');
							var _level = parseInt($parent.attr('level')),
								_child = $parent.attr('child'),
								_deptId = $parent.attr('deptId'),
								_isSingle = o.type == 'SingleNeteaseDept' ? 1 : 0,
								_url = URL.NeteaseDept[1];

							if(o.workloadDept) _url = URL.WorkloadDept[1];

							$tree.find('dt.hover').removeClass('hover');
							$target.parent().addClass('hover');

							if((o.type == 'MultiNeteaseDept' && !$btn.hasClass('input-checkbox-hover')) || (o.type == 'SingleNeteaseDept' && !$btn.hasClass('input-radio-hover'))) $btn.trigger('click');

							if(o.onlyMain) return;

							if(_child == 0) return;

							if($fold.hasClass('fold-show')) {
								$fold.removeClass('fold-show');
								$parent.find('dd:first').hide();

								Scrollbar.tree.reinitialise();
								return;
							}else {
								$fold.addClass('fold-show');

								if($parent.find('dd:first').find('dl').length > 0) {
									$parent.find('dd:first').show();

									Scrollbar.tree.reinitialise();
									return;
								}

								$.showLoading = false;
								$.ajax({
									type: 'post',
									dataType: 'json',
									url: _url,
									data: 'deptId=' + _deptId,
									success: function(r) {
										$parent.find('dd:first').html(_.template(TPL.dept)({
											dept: r,
											level: _level+1,
											parentId: _deptId,
											isSingle: _isSingle,
											selectType: o.selectType,
											onlyMain: o.onlyMain
										}));
										Scrollbar.tree.reinitialise();
									}
								});
							}
						},
						selectDept: function(e) {
							var $target = $(e.currentTarget),
								$parent = $target.parent().parent(),
								$tree = $(Sector.el).find('div.selector-tree');
							var	_level = parseInt($parent.attr('level')),
								_operate = $target.hasClass('input-checkbox-hover') ? 'remove' : 'add';

							$tree.find('dt.hover').removeClass('hover');
							$target.parent().addClass('hover');

							if(o.type == 'SingleNeteaseDept') {
								if($target.hasClass('input-radio-hover')) {
									$target.removeClass('input-radio-hover');
									return false;
								}

								$tree.find('a.input-radio-hover').removeClass('input-radio-hover');
								$target.addClass('input-radio-hover');

								return false;
							}

							$target.toggleClass('input-checkbox-hover');

							// switch(_level) {
							// 	case 1:
							// 	case 2:
							// 		$parent.find('.ac_selectDept').each(function() {
							// 			if($(this).hasClass('input-checkbox-hover'))
							// 				$(this).removeClass('input-checkbox-hover');

							// 			if($(this).hasClass('input-checkbox-lock'))
							// 				$(this).removeClass('input-checkbox-lock');
							// 		});

							// 		if(_operate == 'add') {
							// 			$target.addClass('input-checkbox-hover');

							// 			if(_level == 2) {
							// 				var $mainSelect = $parent.parent().parent().find('dt.main-dept').find('.ac_selectDept');

							// 				$mainSelect.removeClass('input-checkbox-hover').addClass('input-checkbox-lock');
							// 			}
							// 		}
							// 		break;
							// 	case 3:
							// 		if(_operate == 'add') {
							// 			var $subDept = $parent.parent().parent(),
							// 				$mainDept = $subDept.parent().parent(),
							// 				$subSelect = $subDept.find('dt.sub-dept').find('.ac_selectDept'),
							// 				$mainSelect = $mainDept.find('dt.main-dept').find('.ac_selectDept');

							// 			$subSelect.removeClass('input-checkbox-hover').addClass('input-checkbox-lock');
							// 			$mainSelect.removeClass('input-checkbox-hover').addClass('input-checkbox-lock');
							// 		}
							// 		$target.toggleClass('input-checkbox-hover');
							// 		break;
							// }

							return false;
						},
						saveDept: function() {
							var $tree = $(Sector.el).find('div.selector-tree');
							var _dept = [];

							if(o.type == 'SingleNeteaseDept') {
								var $radio = $(Sector.el).find('div.selector-tree').find('a.input-radio-hover'),
									$parent = $radio.parent().parent();
								var _level = parseInt($parent.attr('level'));

								if($radio.length > 0) {
									var _id = [], _title = [];
									var _newId = '', _newTitle = '';
									for(var i=0; i<_level; i++) {
										_id.push($parent.attr('deptId'));
										_title.push($parent.find('strong:first').text());

										$parent = $parent.parent().parent();
									}

									for(var j=_id.length-1; j>=0; j--) {
										if(j == 0) {
											_newId += _id[j];
											_newTitle += _title[j];
										}else {
											_newId += _id[j] + ',';
											_newTitle += _title[j] + ',';
										}
									}

									_dept.push({
										id: _newId,
										title: _newTitle
									});
								}

								return _dept;
							}

							$(Sector.el).find('.ac_selectDept').each(function() {
								var $target = $(this),
									$parent = $target.parent().parent();
								var _level = parseInt($parent.attr('level')),
									_title = '';

								if($target.hasClass('input-checkbox-hover')) {
									_dept.push({
										id: $parent.attr('deptId'),
										title: $parent.find('dt:first').find('strong').text()
									});
								}
							});

							return _dept;
						},
						render: function(type) {
							Sector.el.innerHTML = tpl;
							var $el = $(Sector.el);
							var $sprite = $.sprite({
								type: o.type,
								title: '选择部门',
								width: 720,
								height: 570,
								move: true,
								mask: true,
								confirmButton: true,
								loading: false,
								clearButton: o.clearButton,
								onsuccess: function(obj) {
									$(obj).empty();
									$(obj)[0].appendChild(Sector.el);
								},
								onconfirm: function() {
									var _dept = Sector.saveDept();

									if(_dept.length == 0) {
										$.oaTip('请选择部门', 'warning');
									}else {
										o.callback(_dept);
										$sprite.remove();
										Sector.removeView();
									}
								},
								onclear: function() {
									o.clear();
									$sprite.remove();
									Sector.removeView();
								},
								onclose: function() {
									Sector.removeView();
								}
							});
						},
						removeView: function() {
							//deptPopupView.remove();
							deptPopupView = null;
							DeptPopupView = null;
						}
					});
					var deptPopupView = new DeptPopupView();
				});
				break;
		}
	}
	return Popup;
});
