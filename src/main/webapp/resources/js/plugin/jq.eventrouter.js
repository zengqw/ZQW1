/**
 * @事件代理
 * Author: gzxushaolong
 */
define(["jquery"], function($) {
	var cache = {};
	$.publish = function() {
		var message = arguments[0], args = [], i = 1;
		while(i < arguments.length) {
			args.push(arguments[i++]);
		}
		args.push(message);
		if(!cache[message]) {
			cache[message] = [];
		}
		cache[message].push(args);

		$(window).trigger(message, args);
		return $;
	};

	$.subscribe = function() {
		var messages = $.trim(arguments[0]).replace(/\s+/," "),
			arrMsg = messages.split(" "),
			callback = arguments[1], 
			fetchCache = (typeof arguments[2] == "undefined") ? true : arguments[2];

		if(fetchCache) {
			for(var i=0; i<arrMsg.length; i++) {
				var message = arrMsg[i];
				if(cache[message]) {
					for(var j=0; j<cache[message].length; j++) {
						callback.apply(window, cache[message][j]);
					}
				}
			}
		}
		$(window).bind(messages+'.oa', function() {
			var args = [], i = 1;
			while(i < arguments.length) {
				args.push(arguments[i++]);
			}
			callback.apply(this, args);
		});
		return $;
	};

	var __acPatten = /ac_[A-z]+/g;
	function __getActions(actions) {
		var tmp = actions.match(__acPatten);
		if(tmp&&tmp.length)
			return tmp.join(',').replace('ac_','').split(',');
		else
			return [];
	}
	$.fn.eventrouter = function(event) {
		event = event || 'click';
		$(this)[event](function(e) {
			try {
				var target = e.target || e.srcElement || e.originalTarget,
				actions = __getActions(target.className),
				key = 0;
				if(!actions.length && '_abutton'.indexOf(target.parentNode.nodeName)) {
					target = target.parentNode;
					actions = __getActions(target.className);
				}
				do {
					$.publish('click_' + actions[key], target, e);
				}while(actions[++key]);

				if(actions.length && target.tagName == 'A') {
					return false;
				}
			}catch(e) {
				return false;
			}
		});
	}
});