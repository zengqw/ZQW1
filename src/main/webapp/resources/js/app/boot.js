define([
	'jquery',
	'underscore',
    'common/loadingConfig'
], function($, _) {

    //展示对应的一级权限导航入口
    var showControlMenu = function(power) {
        $(".workload-option [data-menu=" + power.menu + "]").removeClass("hide");
    };
	require(['app/index'], function(app) {
	    var routerControl = function() {
			app
            /*欢迎页面*/
            .when('welcome', {
                templateUrl   : 'tmpl/welcome'
            })
            /*资产登记*/
            .when('equipManage', {
                templateUrl   : 'tmpl/equipManage/index',
                controllerUrl : 'controller/equipManage/index',
                name		  : 'equipManage'
            })
            .when('equipManage/:type', {
                templateUrl   : 'tmpl/equipManage/index',
                controllerUrl : 'controller/equipManage/index',
                name		  : 'equipManage'
            })
            /*资产统计*/
            .when('equipStat', {
                controllerUrl : 'controller/module',
                name		  : 'equipStat'
            })
            .when('equipStat/:type', {
                controllerUrl : 'controller/module',
                name		  : 'equipStat'
            })
	        /*盘点管理*/
            .when('checkManage', {
                templateUrl   : 'tmpl/checkManage/index',
                controllerUrl : 'controller/index',
                name		  : 'checkManage'
            })
	        .when('checkManage/:type', {
	            templateUrl   : 'tmpl/checkManage/index',
	            controllerUrl : 'controller/index',
	            name		  : 'checkManage'
	        })
	        /*资产查询*/
			.when('equipSearch', {
				controllerUrl : 'controller/module',
				name		  : 'equipSearch'
			})
            /*资产修改*/
            .when('assetModify(/:id)', {
                controllerUrl : 'controller/module',
                name		  : 'assetModify'
            })
            /*日志查询*/
			.when('logSearch(/:type)', {
				controllerUrl : 'controller/module',
				name		  : 'logSearch'
			})
            /*资产审核*/
            .when('assetsVerify', {
                controllerUrl : 'controller/module',
                name		  : 'assetsVerify'
            })
            /*用户管理*/
            .when('userManage', {
                controllerUrl : 'controller/index',
                name		  : 'userManage'
            })
            .when('userManage/:type(/:action)', {
                controllerUrl : 'controller/index',
                name		  : 'userManage'
            })
            /*属性管理*/
            .when('propertyManage', {
                templateUrl   : 'tmpl/propertyManage/index',
                controllerUrl : 'controller/propertyManage/index',
                name		  : 'propertyManage'
            })
            /*属性管理*/
            .when('propertyManage/:type', {
                templateUrl   : 'tmpl/propertyManage/index',
                controllerUrl : 'controller/propertyManage/index',
                name		  : 'propertyManage'
            })
            /*数据导入*/
            .when('dataTransfer', {
                controllerUrl : 'controller/module',
                name		  : 'dataTransfer'
            })
            .when('dataTransfer/:type', {
                controllerUrl : 'controller/module',
                name		  : 'dataTransfer'
            })
            /*税务报废*/
            .when('taxScrap', {
                controllerUrl : 'controller/module',
                name		  : 'taxScrap'
            })
            .when('taxScrap/:type', {
                controllerUrl : 'controller/module',
                name		  : 'taxScrap'
            })
            /*折旧统计*/
            .when('dpcStats', {
                controllerUrl : 'controller/module',
                name		  : 'dpcStats'
            })
            .when('dpcStats/:type', {
                controllerUrl : 'controller/module',
                name		  : 'dpcStats'
            })
            /*会计期管理*/
            .when('accMonManage', {
                controllerUrl : 'controller/module',
                name		  : 'accMonManage'
            })
            .when('accMonManage/:type', {
                controllerUrl : 'controller/module',
                name		  : 'accMonManage'
            })
            /*属性查看*/
            .when('propertyView', {
                controllerUrl : 'controller/module',
                name		  : 'propertyView'
            })
            /*修改密码*/
            .when('password', {
                controllerUrl : 'controller/module',
                name		  : 'password'
            })
            /*显示控制*/
            .when('displayControl', {
                controllerUrl : 'controller/module',
                name		  : 'displayControl'
            })
            /*批量删除*/
            .when('multiDelete', {
                controllerUrl : 'controller/module',
                name		  : 'multiDelete'
            })
            /*批量修改*/
            .when('multiModify', {
                controllerUrl : 'controller/module',
                name		  : 'multiModify'
            })
           /*模板下载*/
            .when('tmpDownload', {
                controllerUrl : 'controller/module',
                name		  : 'tmpDownload'
            })
           /*帮助*/
            .when('help', {
                controllerUrl : 'controller/module',
                name		  : 'help'
            })
            .when('help/:type', {
                controllerUrl : 'controller/module',
                name		  : 'help'
            })
            /*批量查询*/
            .when('multiSearch', {
                controllerUrl : 'controller/module',
                name		  : 'multiSearch'
            })
            /*批量导入*/
            .when('multiImport', {
                controllerUrl : 'controller/module',
                name		  : 'multiImport'
            })
            /*公共组件*/
            .when('unit/module', {
                templateUrl   : 'tmpl/module/index',
                controllerUrl : 'controller/module',
                name		  : 'module'
            })
            /*错误定向处理*/
            .when('#error', {
                templateUrl   : 'tmpl/error',
                controllerUrl : 'controller/error',
                name		  : 'error'
            });
	       app.bootstrap(document.body);
		}

        routerControl();

	});
});