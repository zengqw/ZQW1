/**
 * validator.js
 * @autoor zq
 * Created by 2015-10-28 16:58
 */
define(['underscore'], function (_) {
	/**
	 * @module validator.js
	 */
	'use strict'
	var Validator = function(config, obj){
		this.config     = config;
		this.valsObj    = obj;
		this.errMsg     = [];
		this.errModel   = [];
	};
	Validator.prototype = {
		constructor: Validator,
		validate: function(){
			var value,
				msg,
				errMsg  = this.errMsg,
				errModel= this.errModel,
				config  = this.config,
				obj     = this.valsObj,
				validator,
				label;
			for (var p in config){
				if (!obj.hasOwnProperty(p))
					return;
				value       = obj[p];
				validator   = config[p].validator;
				label       = config[p].label;
				_.reduce(validator, function(ret, func){
					msg = func(value);
					msg && ret.push("<div>" + label + ":" + msg + "</div>");
					msg && errModel.push({
						key: p,
						msg: msg
					});
					return ret;
				},errMsg);
			}
		},
		hasErrors:function(){
			return this.errMsg.length ? true : false;
		},

		clearErrorTips: function () {
			$(".error-tip.active").removeClass("active");
		},
		reset: function(config, obj){
			this.config     = config;
			this.valsObj    = obj;
			this.errMsg     = [];
			this.errModel   = [];
			return this;
		},
		getErrors: function(){
			return this.hasErrors() ? this.errMsg.join("") : "";
		},
		getErrorsModel: function(){
			return this.hasErrors() ? this.errModel : "";
		},
		hideErrorTip: function (key) {
			$(".J_" + key).find(".error-tip").text('').removeClass("active");
		},

		showErrorTip: function (errModels) {
			var $dl;
			_.map(errModels, function (model) {
				$dl = $(".J_" + model.key);
				$dl.find(".error-tip").text(model.msg).addClass("active");  //show error tip
			});
		}
	};

	return Validator;
});