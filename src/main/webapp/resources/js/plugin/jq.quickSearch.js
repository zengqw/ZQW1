define([
	'jquery',
	'underscore'
], function($, _) {
	$.fn.searchByItem = function(type) {
		var $input = $(this).find('input.input-text'),
			$value = $input.siblings('input[type="hidden"]'),
			$result = $input.siblings('.quick-search');
		var keyTime = null,
			lastKey = '';
		var _type = type,
			_name = $input.attr('name'),
			_url = _type=='studio' ? '/service/budget/workshop/workshop.jsp' : '/service/budget/product/productCode.jsp',
			_emptyTip = _type=='studio' ? '该工作室尚不存在' : '产品名称或产品代码输入有误';

		function keyEvent(target) {
			target.unbind('keydown').bind('keydown', function(e) {
				var $searchList = $result.find('ul');
				var searchNum = $searchList.find('li').length;
				var current = $searchList.find('li.hover').index();
				var prev, next;
				if(current == -1) {
					prev = searchNum - 1;
					next = 0;
				}else if(current == 0) {
					prev = searchNum - 1;
					next = 1;
				}else if(current == searchNum - 1) {
					prev = current - 1;
					next = 0;
				}else {
					prev = current - 1;
					next = current + 1;
				}
				switch(e.which) {
					case 13:
						if(current != -1) $searchList.find('li:eq(' + current + ')').trigger('click');
						$input.blur();
						break;
					case 38:
						$searchList.find('li:eq(' + prev + ')').trigger('mouseover');
						break;
					case 40:
						$searchList.find('li:eq(' + next + ')').trigger('mouseover');
						break;
				}
			});
		}
		function searchSite(key) {
			var $searchList = $result.find('ul');
			var _key = key, _result = '';

			$searchList.html('');
			$.toggleLoading(false);
			$.ajax({
				type: 'post',
				dataType: 'json',
				url: _url,
				data: 'oprt=list&' + _name + '=' + escape(_key),
				success: function(r) {
					if(r.resultType == 'true') {
						if(r.result.length == 0) {
							$value.val('');
							$searchList.html('<li class="empty">' + _emptyTip + '</li>');
							$result.show();
							return false;
						}

						if(_type == 'studio') {
							for(var i=0; i<r.result.length; i++) {
								_result += '<li class="ac_viewItem" itemName="' + r.result[i].S_WORKSHOP_NAME + '" itemId="' + r.result[i].ID + '"><em>' + r.result[i].S_WORKSHOP_NAME + '</em></li>';
							}
						}else if(_type == 'product') {
							var _productTPL =
								'<% for(var i=0; i<result.length; i++) { %>\
								<li class="ac_viewItem<% if(result[i].I_OBJ_STATUS == "2") { %> failure<% }else if(result[i].S_WORKSHOP_NAME != "") { %> occupied<% } %>" itemName="<%=result[i].S_PRODUCT_NAME%>" itemId="<%=result[i].S_PRODUCT_CODE%>">\
									<em><%=result[i].S_PRODUCT_NAME%>/<%=result[i].S_PRODUCT_CODE%></em>\
									<span class="statu">\
										<% if(result[i].I_OBJ_STATUS == "2") { %><i>已失效</i><% } %>\
										<% if(result[i].S_WORKSHOP_NAME != "") { %><%=result[i].S_WORKSHOP_NAME%><% } %>\
									</span>\
								</li>\
								<% } %>';

							_result = _.template(_productTPL)(r);
						}

						$searchList.html(_result);
						$result.show();
						keyEvent($input);
					}
				}
			});
		}

		$input.keyup(function() {
			var _key = $.trim($input.val());

			clearTimeout(keyTime);
			if(!_key) {
				lastKey = '';
				$result.hide();
			}else {
				if(lastKey != _key) {
					keyTime = setTimeout(function() {
						lastKey = _key;
						searchSite(_key);
					}, 200);
				}
			}
		}).focus(function() {
		}).blur(function() {
			var $input = $(this), _value = $.trim($input.val());
			if(_value == '') {
				$value.val('');
			}
		});
		$result.delegate('li.ac_viewItem', 'mouseover', function() {
			var $li = $(this);

			if($li.hasClass('hover')) return;

			$li.addClass('hover').siblings('li').removeClass('hover');
		}).delegate('li.ac_viewItem', 'click', function() {
			var $li = $(this);
			var _itemName = $li.attr('itemName'),
				_itemId = $li.attr('itemId');

			if($li.hasClass('failure')) {
				$.oaTip('该产品已失效', 'warning', 1000);
				return;
			}else if($li.hasClass('occupied')) {
				$.oaTip('该产品已关联了工作室', 'warning', 1000);
				return;
			}

			$input.val(_itemName);
			$value.val(_itemId);
			$result.hide();
		});
	}
});