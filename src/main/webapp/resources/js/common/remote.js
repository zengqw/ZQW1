/**
 * remote.js
 * @autoor zq
 * Created by 2015-10-16 10:15
 */
define(['jquery'], function() {
	return function Remote(config){

		$.ajax({
			type: config.type || "GET",
			dataType: config.dataType || 'JSON',
			data: config.data || {},
			url: config.url
		}).done(function (r) {

			//为了兼容统一的数据格式{status:"", code:"**":, result:{}, desc:"**"},之前的数据格式也支持{code:,data:{},msg:"**"}
			r.desc = r.msg = r.desc ? r.desc : r.msg;
			r.code = parseInt(r.code);
			r.data = r.result ? r.result.data : r.data;

			if(r.code == 613){
				// session  超时 重定向到登录页
			    window.location.href = "/ams/login";
			}else{
				config.success && config.success(r);
			}
		}).fail(function (response) {
			// 请求失败
			if (response.responseText.indexOf("DOCTYPE html") > -1){
				window.location.href = "/ams/login";
			}else{
				$.oaTip("数据解析有误","error", 2000);
			}
		});
	}

});