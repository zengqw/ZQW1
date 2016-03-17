define([
	'jquery',
	'underscore',
	'backbone',
	'text!tmpl/common/menu.html',
	'common/nav'
], function ($, _, B, TplMenu, Navs) {

	var Main = B.View.extend({
		_inited: false,
		events: {
			'click [data-action]': '_action'
		},
		initialize: function(options) {
			var self = this;
			self.app = options.app;
			self._inited = true;

			self.bind();
		},
		bind: function() {
			var self = this,
				app = self.app;

			self.listenTo(app, 'route', self._active);

			return self;
		},
		setElement: function(el) {
			var self = this,
				res;

			res = B.View.prototype.setElement.call(self, el);

			self.$view = self.$('[data-view]');
			self.$menu = self.$('[data-menu]');

			return res;
		},
		render: function(html) {
			var self = this;

			self.$view.html(html);

			return self;
		},
		_action: function(event) {
			var $target = $(event.currentTarget),

				action = $target.data('action');

			event.preventDefault();
		},
		_active: function(name) {

			var self = this;
			var	$menu = self.$menu,
				$target = self.$('[data-menu=' + name + ']');

			$menu.removeClass('active');
			$target.addClass('active');
		}
	}),

	App = B.Router.extend({
		initialize: function() {
		},
		bootstrap: function(elem) {
			var self = this;

			self.view = new Main({
				app: self,
				el: elem
			});

			if(!B.history.started) {
				B.history.start();
			}

			return self;
		},
		when: function(paths, config) {
			var self = this;
			_.map(paths.split(","), function(path){
				self.route(path, config.name || '', function() {
					var templateUrl = config.templateUrl,
						controllerUrl = config.controllerUrl,
						menuHtml,

						args = [].slice.call(arguments, 0);

					var curNav = _.findWhere(Navs, {hash: config.name});
					if(templateUrl) {
						// relative path
						templateUrl = 'text!../' + templateUrl + '.html';
					}

					/*如果不属于一级菜单，则默认跳转到欢迎页面*/
					if (!curNav){
						require([templateUrl, controllerUrl], function(html, ctrl) {
							self._render(html);
							// wait for dom ready
							ctrl && _.defer(function () {
								self._apply(ctrl, args);
							});
						});

						return;
					}

					menuHtml = _.template(TplMenu)({
						mainHash: config.name,
						children: curNav.children
					});

					if (curNav.autoMenu){
						require([templateUrl, controllerUrl], function(html, ctrl) {
							self._render(html);
							// wait for dom ready
							ctrl && _.defer(function () {
								self._apply(ctrl, args);
							});
						});
					}else{
						require([controllerUrl], function(ctrl) {
							self._render(menuHtml);
							// wait for dom ready
							ctrl && _.defer(function () {
								self._apply(ctrl, args);
							});
						});
					}
				});
			});
			return self;
		},
		otherwise: function(config) {
			var self = this;

			if('redirectTo' in config) {
				self.route('*error', 'error', function() {
					self.path(config.redirectTo);
				});
			}else {
				self.when('*error', 'error', config);
			}

			return self;
		},
		path: function(url) {
			var self = this;

			self.navigate(url, {
				trigger: true
			});

			return self;
		},
		$: function(selector) {
			var self = this,
				view = self.view;

			return view.$(selector);
		},
		_render: function(html) {
			var self = this,
				view = self.view;

			view.render(html);

			return self;
		},
		_apply: function(ctrl, args) {
			var self = this;

			if (_.isFunction(ctrl)) {
				ctrl.apply(self, args);
			} else {
				throw Error('Controller isn\'t a Function');
			}

			return self;
		}
	});

	// IE8
	'console' in window || (window.console = {});
	_.each(['clear', 'table', 'error', 'info', 'debug', 'log', 'assert', 'warn'], function (pro) {
		console[pro] = console[pro] || function () { };
	});

	// 浏览器接口
	if(!('keys' in Object)) {
		Object.keys = (function () {
			var hasOwnProperty = Object.prototype.hasOwnProperty,
				hasDontEnumBug = !({
					toString: null
				}).propertyIsEnumerable('toString'),
				dontEnums = [
					'toString',
					'toLocaleString',
					'valueOf',
					'hasOwnProperty',
					'isPrototypeOf',
					'propertyIsEnumerable',
					'constructor'
				],
				dontEnumsLength = dontEnums.length;

			return function (obj) {
				if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

				var result = [];

				for (var prop in obj) {
					if (hasOwnProperty.call(obj, prop)) result.push(prop);
				}

				if (hasDontEnumBug) {
					for (var i = 0; i < dontEnumsLength; i++) {
						if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
					}
				}
				return result;
			}
		})();
	}

	if(!('isArray' in Array)) {
		Array.isArray = function (vArg) {
			return Object.prototype.toString.call(vArg) === "[object Array]";
		};
	}

	if(!('forEach' in Array.prototype)) {
		Array.prototype.forEach = function forEach(callback, thisArg) {

			var T, k;

			if (this == null) {
				throw new TypeError("this is null or not defined");
			}

			// 1. Let O be the result of calling ToObject passing the |this| value as the argument.
			var O = Object(this);

			// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
			// 3. Let len be ToUint32(lenValue).
			var len = O.length >>> 0; // Hack to convert O.length to a UInt32

			// 4. If IsCallable(callback) is false, throw a TypeError exception.
			// See: http://es5.github.com/#x9.11
			if ({}.toString.call(callback) !== "[object Function]") {
				throw new TypeError(callback + " is not a function");
			}

			// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
			if (thisArg) {
				T = thisArg;
			}

			// 6. Let k be 0
			k = 0;

			// 7. Repeat, while k < len
			while (k < len) {

				var kValue;

				// a. Let Pk be ToString(k).
				//   This is implicit for LHS operands of the in operator
				// b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
				//   This step can be combined with c
				// c. If kPresent is true, then
				if (Object.prototype.hasOwnProperty.call(O, k)) {

					// i. Let kValue be the result of calling the Get internal method of O with argument Pk.
					kValue = O[k];

					// ii. Call the Call internal method of callback with T as the this value and
					// argument list containing kValue, k, and O.
					callback.call(T, kValue, k, O);
				}
				// d. Increase k by 1.
				k++;
			}
			// 8. return undefined
		};
	}

	if(!('indexOf' in Array.prototype)) {
		Array.prototype.indexOf = function (searchElement, fromIndex) {
			if (this === undefined || this === null) {
				throw new TypeError('"this" is null or not defined');
			}

			var length = this.length >>> 0; // Hack to convert object.length to a UInt32

			fromIndex = +fromIndex || 0;

			if (Math.abs(fromIndex) === Infinity) {
				fromIndex = 0;
			}

			if (fromIndex < 0) {
				fromIndex += length;
				if (fromIndex < 0) {
					fromIndex = 0;
				}
			}

			for (; fromIndex < length; fromIndex++) {
				if (this[fromIndex] === searchElement) {
					return fromIndex;
				}
			}

			return -1;
		};
	}

	if(!('bind' in Function.prototype)) {
		Function.prototype.bind = function (oThis) {
			if (typeof this !== 'function') {
				// closest thing possible to the ECMAScript 5
				// internal IsCallable function
				throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
			}

			var aArgs = Array.prototype.slice.call(arguments, 1),
				fToBind = this,
				fNOP = function () {},
				fBound = function () {
					return fToBind.apply(this instanceof fNOP ? this : oThis,
						aArgs.concat(Array.prototype.slice.call(arguments)));
				};

			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();

			return fBound;
		};
	}

	Object.defineProperty = function () {};
	Object.getOwnPropertyDescriptor = function () {};

	return new App();
});