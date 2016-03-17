/**
 * config.js.js
 * @autoor zq
 * Created by 2015-10-09 19:55
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'common/interactiveEvent',
	'common/tool',
	'common/fixedBox',
	'common/remote'
], function ($, _, B, interactiveEvent, Tool, FixedBox, Remote) {

	return B.View.extend({
		events    : {
			'click .J_delete'         : 'deleteUser',		// 删除用户
			'click .ac_searchWorkload': 'search',		    // 执行搜索
			'click .J_setting'        : 'setting'		    // 设置用户类型
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
		config: {
			fetchUrl: "userManage/initUsageViewMng",
			modifyUrl: "userManage/setUsageCode",
			configs : {
				keys     : [
					{
						text : "编码",
						key  : "sn",
						fixed: true
					},
					{
						text: "名称",
						key : "name"
					},
					{
						text: "类型",
						key : "usageName"
					}],
				needIndex: true
			}
		},
		cacheDom  : function () {
			this.$workOperation = $('.workload-operation');
			this.$workData = $('.workload-data-list');
			this.$settingBox = $('.J_setting_box');
		},
		bindEvent : function () {
			this.$workOperation.workloadSearch();
		},
		refresh   : function () {
			var formData = interactiveEvent.serializeFields($('.workload-operation'), 'browser').dataModel;
			this.renderList(formData);
		},
		search    : function (e) {
			this.refresh();
			Tool.stop(e);
		},
		renderList: function (data) {
			var self = this;
			this.fixedBox = this.fixedBox ? this.fixedBox.render(data) : new FixedBox(_.extend({
				$el     : this.$workData,
				data    : data,
				callback: function(r){
					self.$settingBox[r.result && r.result.data && r.result.data.length ? "removeClass" : "addClass"]("hide");
				}
			}, self.config));
		},
		setting: function(){
			var self = this,
				sns = _.reduce($(".input-checkbox-hover"), function(ret, chked){
				ret.push($(chked).parents("tr").data("id"));
				return ret;
			}, []);
			if (!sns.length){
				$.oaTip("请先选择需要设置的用户", "warning", 2000);
				return;
			}
			Remote({
				type: "POST",
				url: this.config.modifyUrl,
				data: {
					sns: sns.join(","),
					usageClass: $(".J_usageClass").val()
				},
				success: function(r){
					if (200 == r.code){
						self.refresh();
					}else{
						$.oaTip(r.desc, 200 == r.code ? "success" : "error", 2000);
					}
				}
			});
		}
	});
});