/**
 * validatorHelper.js
 * @autoor zq
 * Created by 2015-10-28 19:18
 */
define(["underscore"], function () {
	/**
	 * @module validatorHelper.js
	 */
	'use strict'
	return {
		isNotEmpty  :function(val){
			if (!$.trim(val)){
				return "不能为空";
			}
		},
		isContainsChiness:function(val){
			if(val &&  _.some(val.split(''), function(char){
					return escape(char).indexOf('%u') > -1 ? true : false;
				})){
				return "含有中文字符";
			}
		},
		positiveNum :function(val){
			var reg = /^([1-9]\d*|0)(\.\d*[1-9])?$/;
			if (val && !reg.test(val) || val == 0){
				return "必须为正数";
			}
		},
		calendarFormat:function(val){
			var reg = /^\d{4}-\d{2}-\d{2}$/;
			if (val && !reg.test(val)){
				return "日期格式必须为YYYY-MM-DD";
			}
		},
		calendarMonFormat:function(val){
			var reg = /^\d{4}-\d{2}$/;
			if (val &&  !reg.test(val)){
				return "年月格式必须为YYYY-MM";
			}
		},
		isAllChiness:function(val){
			if(val && !_.every(val.split(''), function(char){
					return escape(char).indexOf('%u') > -1 ? true : false;
				})){
				return "不全为中文";
			}
		},
		passwordFormat:function(val){
			if(val.length < 8){
				return "密码长度不能小于8位";
			}
		},
	}
})