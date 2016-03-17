/**
 * product
 * @autoor zq
 * Created by 2015-10-29 11:11
 */
define([
	'jquery',
	'backbone',
	'common/fixedBox',
	'common/interactiveEvent',
	'common/remote'
], function ($, B, FixedBox, interactiveEvent, Remote) {
	return B.View.extend({
		events    : {
			'click .J_modify'   : 'modify',		                                // 单个修改
			'click .J_submit'   : 'submit'		                                // 批量修改
		},
		initialize: function (options) {
			var self = this;
			this.el = options.el;

			//渲染模板
			require([options.tpl], function (tpl) {
				self.el.innerHTML = tpl;
				self.cacheDom();
				self.render();
			});
		},
		config:{
			submitUrl: "propertyMng/equipType",
			keys         : [
				{
					text : "序列编号",
					key  : "code",
					fixed:true
				},
				{
					text : "名称",
					key  : "name",
					type : "text",
				},
				{
					text: "USGAAP使用月份",
					key : "usUseMonth",
					type:"text"
				},
				{
					text: "PRCGAAP使用月份",
					key : "prcUseMonth",
					type:"text"
				},
				{
					text: "USGAAP残值率",
					key : "usScrapRate",
					type:"text"
				},
				{
					text: "PRCGAAP残值率",
					key : "prcScrapRate",
					type:"text"
				}
			],
			controls : {
				text: "操作",
				uId: "nameEn",
				btns: [
					{
						type     : "modify",
						text     : "修改",
						className: "u-btn-modify J_modify"
					}
				]
			},
			needIndex: false,
			uId:"code"
		},
		cacheDom  : function () {
			this.$workOperation = $('.workload-operation');
			this.$workData = $('.workload-data-list');
			this.$btnSubmit = $('.J_submit');
		},
		render    : function () {
			var self = this;
			Remote({
				type: "POST",
				url : "propertyMng/equipType",
				data:{
					method: "query"
				},
				success:function(r){
					if (200 == r.code){
						self.config.data = r.result.data;
						self.fixedBox = self.fixedBox ? self.fixedBox.render(r.result.data) : new FixedBox({
							$el    : self.$workData,
							configs : self.config
						});
						self.$btnSubmit[r.result && r.result.data && r.result.data.length ? "removeClass" : "addClass"]("hide");
					}else{
						$.oaTip(r.desc, "error", 2000);
					}
				}
			});
		},
		modify: function(e){
			var $target = $(e.currentTarget),
				index = $target.parents("tr").index();
			this.dealTrsModify([index]);
		},
		dealTrsModify: function(indexArr){
			var self = this,
				obj = {},
				tr,
				data = _.reduce(indexArr, function(ret, index){
					tr = $(".fx-m table tbody tr").eq(index);
					obj = interactiveEvent.serializeFields($(tr), 'browser').dataJson;
					ret.push(_.extend(obj, {
						code: $(tr).data("id")
					}));
					return ret;
				}, []);
			Remote({
				type: "POST",
				url: this.config.submitUrl,
				data: {
					method:"modify",
					beans: JSON.stringify(data)
				},
				success: function(r){
					200 == r.code && self.render();
					$.oaTip(r.desc, 200 == r.code ? "success" : "error", 2000);
				}
			});
		},
		submit: function(){
			var indexArr = _.reduce($(".J_fixed_box .input-checkbox-hover[data-type='item']"), function(ret, chked){
				ret.push($(chked).parents("tr").index());
				return ret;
			}, []);
			if (!indexArr.length){
				$.oaTip("请先勾选需要修改的行", "warning", 2000);
				return;
			}
			this.dealTrsModify(indexArr);
		}
	});

})