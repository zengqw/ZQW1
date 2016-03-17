define([
	'jquery',
	'underscore',
	'backbone',
	'common/requestConfig',
	'common/interactiveEvent'
], function($, _, B, requestConfig, interactiveEvent) {
	return B.View.extend({
		events: {
			'click .ac_showRoleUser': 'showRoleUser',
			'click .ac_createRoleUser': 'createRoleUser',
			'click .ac_removeRoleUser': 'removeRoleUser',
			'click .ac_expRoleUser': 'expRoleUser'	// 导出角色列表
		},
		initialize: function(options) {
			var me = this;
			var $el = me.$el;

			me.renderRoleMenu();
			// 搜索
			$el.find('div.workload-operation').workloadSearch({
				callback: function(options) {
					me.renderRoleUser(options);
				}
			});
		},
		// 渲染角色菜单
		renderRoleMenu: function() {
			var $el = this.$el;
			var $roleMenu = $el.find('div.role-menu').find('ul');
			
			$.ajax({
				type: 'GET',
				dataType: 'JSON',
				url: requestConfig.setting.role
			}).done(function (r) {
				if(r.resultType == 'true') {
					var _roleTPL = $('#roleMenu').html();
					var _roleList = _.template(_roleTPL)({'list': r.result});

					$roleMenu.html(_roleList);
					$roleMenu.find('li:first').trigger('click');
				}else {
					// 请求失败
				}
			}).fail(function () {
				// 请求失败
			});
		},
		// 渲染角色成员列表
		renderRoleUser: function(options) {
			var me = this;
			var $el = me.$el;
			var o = {
				pageSize: interactiveEvent.getPageSize(),
				pageIndex: 1
			};
			$.extend(o, options);

			var $workloadOperate = $el.find('div.workload-operate-box'),
				$workloadData = $el.find('div.workload-data-list'),
				$workloadFooter = $el.find('div.workload-data-footer');
			var _data = 'code=' + me.role + '&pageSize=' + o.pageSize + '&pageIndex=' + o.pageIndex;
			if(o.data !== undefined) _data += '&' + o.data;

			// 工作量录入者、工作量审核者、产品负责人三种角色不显示新建按钮
			if(me.role==='inputer' || me.role==='checker' || me.role==='producter' || me.role==='employee') {
				$workloadOperate.find('a.create').hide();
			}

			$.ajax({
				type: 'GET',
				dataType: 'JSON',
				url: requestConfig.setting.roleUser + '?' + _data
			}).done(function (r) {
				r.role = me.role;
				console.info(r);
				if(r.resultType == 'true') {
					var _userTPL = $('#roleUser').html();
					var _userList = _.template(_userTPL)(r);

					if(r.resultRight.indexOf(',2,')>=0) {
						$workloadOperate.show();
						if(me.role!=='inputer' && me.role!=='checker' && me.role!=='producter' && me.role!=='employee') {
							$workloadOperate.find('a.create').show();
						}
					}

					$workloadData.html(_userList);
					// 分页
					$workloadFooter.workloadPage({
						fieldNum: r.result.length,
						totalPage: r.totalPage,
						pageSize: r.pageSize,
						pageIndex: r.pageIndex,
						callback: function(options) {
							me.renderRoleUser(options);
						}
					});
				}else {
					// 请求失败
				}
			}).fail(function () {
				// 请求失败
			});
		},
		// 切换角色菜单
		showRoleUser: function(e) {
			var me = this;
			var $target = $(e.currentTarget),
				$search = me.$el.find('div.workload-search');
			var _role = $target.data('role');

			if($target.hasClass('active')) return;
			$target.addClass('active').siblings('li').removeClass('active');

			// 清空当前搜索条件
			$search.find('input').val('');

			// 存储当前角色，以供渲染角色列表使用
			me.role = _role;
			me.renderRoleUser();
		},
		// 增加角色成员
		createRoleUser: function() {
			var me = this;
			var $el = me.$el,
				$currentRole = $el.find('div.role-menu').find('li.active');
			var _userFormTPL = $('#roleUserForm').html(),
				_spriteOption = {
					roleName: $currentRole.text(),
					roleCode: $currentRole.data('role')
				};

			// 初始化弹窗
			var $createSprite = interactiveEvent.sprite({
				title: '新增角色成员',
				msg: _.template(_userFormTPL)(_spriteOption),
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
						url: requestConfig.setting.roleOprt,
						data: 'oprt=add&' + _submitData.dataModel
					}).done(function (r) {
						if(r.resultType == 'true') {
							$.oaTip('角色成员添加成功', 'success', 1000, function() {
								$createSprite.remove();
								me.renderRoleUser({
									role: _spriteOption.roleCode
								});
							});
						}else {
							// 请求失败
							$.oaTip(r.resultMgs, 'error', 2000);
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
		// 删除角色成员
		removeRoleUser: function(e) {
			var me = this;
			var $el = me.$el,
				$target = $(e.currentTarget),
				$tr = $target.parents('tr');
			var _role = $el.find('div.role-menu').find('li.active').data('role');
				_userId = $target.data('user');

			interactiveEvent.removeComfirm($target, '确定删除该角色人员？', function() {
				$.ajax({
					type: 'GET',
					dataType: 'JSON',
					url: requestConfig.setting.roleOprt + '?oprt=del&code=' + _role + '&userIds=' + _userId
				}).done(function (r) {
					if(r.resultType == 'true') {
						$.oaTip('人员删除成功', 'success', 1000, function() {
							me.removeRefresh();
						});
					}else {
						// 请求失败
					}
				}).fail(function () {
					// 请求失败
				});
			});
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
				me.renderRoleUser({
					role: me.role,
					pageIndex: _current
				});
			}else {
				me.renderRoleUser({
					role: me.role,
					pageIndex: _current-1
				});
			}
		},
		// 导出角色列表
		expRoleUser: function() {
			var me = this;
			var $el = this.$el;
			var _data = 'code=' + me.role+'&'+$el.find('div.workload-search').find('input.search-key').val() || '';

			$.ajax({
				type: 'GET',
				dataType: 'JSON',
				url: requestConfig.setting.roleUserExp + '?' + _data
			}).done(function (r) {
				if(r.resultType == 'true') {
					location.href = requestConfig.excelOut;
				}else {
					$.oaTip(r.resultMgs, 'error', 2000);
				}
			}).fail(function () {
				// 请求失败
				$.oaTip(r.resultMgs, 'error', 2000);
			});

			return false;
		}
	});
});