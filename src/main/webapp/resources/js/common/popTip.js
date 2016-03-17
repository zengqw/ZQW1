define([
	'jquery',
	'underscore',
	'backbone',
	'common/tool'
], function($, _, _B, Tool) {
	return _B.View.extend({
		initialize: function() {
			this.$el = $(this.el);
			this.$input = this.$el.find('.ux-search-input');
			this.containerEl = this.$el.find('.user-search-tips-popup');
			this.containerEl = $('<div class="pop-tip">');
			this.showPopTip();

		},
		template: _.template([
							'<p><%= text %></p>'
					].join('')),
		selectUser: function(e){
			Tool.stop(e);
		},
		hideDropList: function(){
			var self = this;
			this.$el.val('');
			setTimeout(function(){
				//self.containerEl.hide();
			}, 200);
		},
		showPopTip: function(){
			var self = this;
			this.containerEl.html(this.template({
				text: this.$el.text()
			})).appendTo($('body'));
			var target = $(this.el);
			this.containerEl.css({left:target.offset().left, top:target.offset().top + target.outerHeight()}).show();
			setTimeout(function(){
				self.containerEl.hide();
			}, 1000);
		}
	});
});
