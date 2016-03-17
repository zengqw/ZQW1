/**
 * fixedBox.js
 * @info 通用表格视图组件
 * @autoor zq
 * Created by 2015-12-15 08:55
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'common/page',
	'text!tmpl/common/fixedBox.html',
	'common/interactiveEvent'
], function ($, _, B, pageAjax, tpl) {

	return B.View.extend({
		events     : {
			'click .J_fixed_box .input-checkbox'    : 'selectCheckbox',  // 模拟复选框
			'mouseover .fx-unit table tbody tr'     : 'dealHoverTr',     // table 隔行变色
			'mouseout .fx-unit table tbody tr'      : 'dealHoverTr'      // table 隔行变色
		},
		initialize : function (options) {
			_.extend(this, options);
			this.$workData = this.$el;
			this.$workData.html(tpl);
			this.cacheDom();
			this.render();
		},
		defaultConfig:{
            controls      : false,
            needIndex     : false,
            colorControl  : false,
            continuedIndex: 0,
            uId           : ""
		},
		cacheDom   : function () {
			this.$fixedBox = this.$el.find(".J_fixed_box");
			this.tplFixed = this.$el.find("#J_tpl_fixed_box").html();
		},
		data:[],
		getData: function(){
			return this.data;
		},
		bindEvent:function(){
			var $calendar = $(".J_fixed_box .J_calendar");
			$calendar.length && $calendar.cxCalendar({
				type: "YYYY-MM-DD"
			});
		},
		render     : function (data) {
			var self = this,
				_html;
			if (self.fetchUrl){
				data = data ? data : self.data;
				new pageAjax(self.fetchUrl, data, function (r) {
					if (200 == r.code) {
						r.data = r.result.data;
						self.data = self.configs.data = "[object Array]" === Object.prototype.toString.call(r.data) ? r.data : r.data.list || r.data.dataList;
                        self.defaultConfig.continuedIndex = 0;
                        self.defaultConfig.continuedIndex = r.result._continuedIndex;
						if (r.result && r.result.data && r.result.data.tableTitle && "[object Array]" === Object.prototype.toString.call(r.result.data.tableTitle) && r.result.data.tableTitle.length) {
							_html = _.template(self.tplFixed)(_.extend({}, self.defaultConfig, self.configs, {keys : r.result.data.tableTitle}));
						} else {
							_html = _.template(self.tplFixed)(_.extend({}, self.defaultConfig, self.configs));
						}

						self.$fixedBox.html(_html);
						self.bindEvent();
						self.fixedBox();

						// callback
						self.callback && 'function' === typeof self.callback && self.callback(r);
					} else {
						$.oaTip(r.desc, "error", 2000);
					}
				});
			}else{
				_html = _.template(self.tplFixed)(_.extend({}, self.defaultConfig, self.configs));
				self.$fixedBox.html(_html);
			}
		},

		dealHoverTr: function (e) {
			var $target = $(e.currentTarget),
				index = $target.index(),
				type = "mouseover" === e.type ? "addClass" : "removeClass";

			_.map(['fx-l', 'fx-r', 'fx-m'], function (cl) {
				$("." + cl + " table tbody tr").eq(index)[type]('hover')
			});
		},
		// 模拟复选框
		selectCheckbox     : function (e) {
			var $target = $(e.currentTarget),
				$table = $target.parents('table'),
				$table = $table.hasClass("table-fixed") ? $table.siblings("table") : $table,
				$parent= $table.parent(),
				$tbody = $table.find('tbody'),
				index = $target.parents('tr').index(),
				_len;

			var _type = $target.data('type');

			if (_type === 'all') {
				if ($target.hasClass('input-checkbox-hover')){
					$tbody.find('.input-checkbox-hover').removeClass('input-checkbox-hover');
					$(".fx-l tbody tr, .fx-r tbody tr, .fx-m tbody tr").removeClass("selected");
				} else {
					$tbody.find('.input-checkbox:not(".input-checkbox-hover")').addClass('input-checkbox-hover');
					$(".fx-l tbody tr, .fx-r tbody tr, .fx-m tbody tr").addClass("selected");
				}
			}

			$target.toggleClass('input-checkbox-hover');
			_len = $tbody.find('.input-checkbox').length;
			_checks = $tbody.find('.input-checkbox-hover').length;
			if (_type === 'item') {
				if (_len === _checks) $parent.find('.input-checkbox[data-type="all"]').addClass('input-checkbox-hover');
				else $parent.find('.input-checkbox[data-type="all"]').removeClass('input-checkbox-hover');


				_.map([$('.fx-l table tbody tr'), $('.fx-r table tbody tr'), $('.fx-m table tbody tr')], function(trs){
					trs.eq(index)[$target.hasClass('input-checkbox-hover') ? 'addClass' : 'removeClass']('selected');
				});
			}

			return false;
		},
		resize     : function (init) {
			$.each([this.$LTable, this.$CTable, this.$RTable], function (i, $table) {
				if (init) {
					$table.after($table.clone().addClass('table-fixed'));
					$table.next().children('tbody,tfoot').remove();
				}
				$table.next().width($table.width());
				var arr = [], i = 0;
				$table.each(function () {
					if ($(this).parent().attr('class') === 'content') {
						$table.find('thead th').each(function () {
							if (i === 0) {
								arr.push($(this).width() + 1);
							} else {
								arr.push($(this).width());
							}
							i++;
						});
					} else {
						$table.find('thead th').each(function () {
							arr.push($(this).width());
						});
					}
				});
				$table.next().find('thead th').each(function (i) {
					this.style.width = arr[i] + 'px';
				});
			});
		},
		fixedBox   : function () {
			var self = this;
			self.$fixedBox.on('scroll', function (event) {
				event.preventDefault();
				if (!this.__height || parseInt(self.$CTable.height()) != parseInt(this.__height)) {
					this.scrollTop = 0;
				}
				if (!this.__init || !$(".table-fixed").length) {
					this.__init = !0;
					self.$LTable = self.$fixedBox.children('.fx-l').children('table');
					self.$CTable = self.$fixedBox.children('.fx-m').find('table');
					self.$RTable = self.$fixedBox.children('.fx-r').children('table');
					self.resize(true);
				}
				self.$CTable[0].parentElement.style.top = this.scrollTop + 'px';
				self.$LTable.next()[0].style.top = this.scrollTop + 'px';
				self.$RTable.next().css('top', this.scrollTop + 'px');
				self.$CTable[0].style.top = -this.scrollTop + 'px';
				if (self.$CTable.height() > 500){
					self.$fixedBox.find(".content").css("maxHeight", "517px");
				}else{
					self.$fixedBox.find(".content").css("maxHeight", "500px");
				}
			});

			self.$fixedBox.on('mouseenter', function () {
				self.$CTable = self.$fixedBox.children('.fx-m').find('table');
				this.__height = self.$CTable.height();
				self.resize();
			});

			self.$fixedBox.trigger("scroll");
		}
	});
});