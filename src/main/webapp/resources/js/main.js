require.config({
	urlArgs: "time=201601261559",
	paths  : {
		'jquery'	: 'vendor/jquery',
		'underscore': 'vendor/underscore',
		'backbone'  : 'vendor/backbone',
		'text'	  	: 'vendor/text',
		'cxcalendar'	  	: 'vendor/jquery.cxcalendar',
		'tableHeadFixer' : 'vendor/jquery.tableHeadFixer',
		
		'common'	: 'common',
		'plugin'	: 'plugin',

		'app'	   	: 'app',
		'controller': 'app/controller',
		'model'	 	: 'app/model',
		'view'	  	: 'app/view',
		
		'tmpl'		: '../tmpl'
	}
});

require(['app/boot']);