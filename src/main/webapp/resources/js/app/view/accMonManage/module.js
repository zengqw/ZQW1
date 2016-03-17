/**
 * product
 * @autoor zq
 * Created by 2015-10-29 11:11
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'common/remote',
	'common/interactiveEvent'
], function ($, _, B, Remote) {
	return B.View.extend({
		events       : {
			'click .J_btn_forward': 'forwardMonth'
		},
		initUrl      : "/ams/goAcctMonthManage/queryCurrAcctMonth",
		forwardUrl   : "/ams/goAcctMonthManage/goCarryForwardAcctMonth",
		initialize   : function (options) {
			var self = this;
			_.extend(this, options);
			//渲染模板
			require([options.tpl], function (tpl) {
				self.el.innerHTML = tpl;
				self.render();
			});
		},
		nextAcctMonth: null,
		render       : function () {
			var self = this,
				tpl = $("#J_tpl_" + self.type).html(),
				_html;
			Remote({
				type   : "GET",
				url    : self.initUrl,
				data   : {},
				success: function (r) {
					if (200 == r.code) {
						_html = _.template(tpl)(r.data);
						self.nextAcctMonth = r.data.nextAcctMonth;
						$(self.el).html(_html);
						self.cacheDom();
					} else {
						$.oaTip(r.msg, "error", 2000);
					}
				}
			});
		},
		cacheDom     : function () {
			this.$curMonth = $(".J_month");
			this.$btnForward = $(".J_btn_forward");
		},
		updateRender : function (month) {
			this.$curMonth.text(month);
			this.$btnForward.hide();
		},
		forwardMonth : function () {
			var self = this;
			var $confirm = $.confirm({
				title    : '提示',
				msg      : '结转后，会计期将会变为' + this.nextAcctMonth + "，您确定要结转吗？",
				onconfirm: function () {
					Remote(
						{
							type   : "POST",
							url    : self.forwardUrl,
							data   : {},
							success: function (r) {
								if (200 == r.code) {
									$confirm.remove();
									self.updateRender.call(self, r.data.nextAcctMonth);
									$.oaTip(r.msg, "success", 2000);
								} else {
									$.oaTip(r.msg, "error", 2000);
								}

							}
						}
					);

				}
			});

		}

	});
});