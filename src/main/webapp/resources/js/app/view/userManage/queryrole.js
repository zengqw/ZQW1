/**
 * queryrole.js.js
 * @autoor zq
 * Created by 2015-10-09 19:55
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'common/interactiveEvent',
	'common/tool',
	'view/common/table'
], function ($, _, B, interactiveEvent, Tool, TableView) {

	return B.View.extend({
		events    : {
			'click .J_delete'         : 'deleteUser',		// 删除用户
			'click .ac_searchWorkload': 'search'		        // 执行搜索
		},
		initialize: function (options) {
			var self = this;
			this.el = options.el;

			//渲染模板
			require([options.tpl], function (tpl) {
				self.el.innerHTML = tpl;
				self.cacheDom.apply(self);
				self.bindEvent.apply(self);
				self.refresh();

			});
		},
		cacheDom  : function () {
			this.$workOperation = $('.workload-operation');
			this.$workData = $('.workload-data-list');
		},
		bindEvent : function () {
			var self = this;
			this.$workOperation.workloadSearch();
			this.tableView = new TableView({
				$el    : self.$workData,
				url    : "userManage/queryRole",
				cols   : [20, 40, 40],
				theads : ["ID", "角色名称", "操作"],
				unitTpl: $("#J_unit_tpl").html()
			});
		},
		refresh   : function () {
			var data = interactiveEvent.serializeFields(this.$workOperation, 'browser').dataModel;
			this.renderList(data);
		},
		search    : function (e) {
			this.refresh();
			Tool.stop(e);
		},
		renderList: function (data) {
			this.tableView.render(data);
		}
	});
});