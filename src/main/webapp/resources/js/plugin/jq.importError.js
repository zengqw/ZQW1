define([
	'jquery',
	'plugin/jq.interactive'
], function($) {
	$.extend({
		importError: function(options) {
			var o = {
				errorList: []
			};
			$.extend(o, options);

			var _errorTPL =
				'<div class="error-title"><em>导入内容错误</em>，具体错误内容见如下表格：</div>\
				<div class="error-list">\
					<div class="error-head">\
						<em>出错行数及具体原因</em>\
					</div>\
					<div class="error-table">\
						<table width="100%" border="0" cellspacing="0" cellpadding="0">\
							<tbody>\
								<% for(var i=0; i<errorList.length; i++) { %>\
								<tr class="<% if(i%2==0) { %>odd<% }else { %>even<% } %>">\
									<td><%=errorList[i]%></td>\
								</tr>\
								<% } %>\
							</tbody>\
						</table>\
					</div>\
				</div>\
				';

			var $errorSprite = $.sprite({
				className: 'interactive-import-error',
				title: '导入内容错误',
				msg: _.template(_errorTPL)({errorList: o.errorList}),
				width: 600,
				height: 367,
				showButtons: false,
				loading: false,
				animate: 'swing',
				move: true,
				mask: true
			});
		}
	});
});