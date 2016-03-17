define([
	'jquery',
	'underscore'
], function($, _) {
	return function(target, uidArea, callback, option){
		var containerEl = $('<div></div>').addClass('user-search-tips-popup'),
			lastKey = '',
			index = -1;
		
		var requestURL = '/service/hrm/common/getUserInfoByQueryKey.jsp';

		option = $.extend({
			subordinate: false,
			onlySubordinate: false
		}, option);
		
		if(option.onlySubordinate){
			requestURL = '/service/hrm/common/getRecursionUserInfoByQueryKey.jsp';
		}

		target.on('keyup', function(){

			if(target.hasClass('hack')){

			}
			else{
				var output = [];

				var uid = (function(){
					var a = [];

					uidArea.find('[uid]').each(function(){
						a.push($(this).attr('uid'));
					});

					return a;
				})()

				var _key = $.trim($(this).val());


				if(_key.length){

					var length = 13, i = 1;
 
					while( i < _key.length){
						if(/[^\u4e00-\u9fa5]/.test(_key[i])){
							length += 6;
						}
						else{
							length += 12;
						}
						i++;
					}

					$(this).css('width', length );
				}
				else{
					$(this).css('width', '' );
				}

				if(lastKey === _key){

				}
				else{
					lastKey = _key;

					$.showLoading = false;
					$.ajax({
						type: 'get',
						dataType: 'json',
						url: requestURL + '?queryKey=' + escape(_key) + (option.subordinate ? ('&managerId=' + $('#userId').val()) : ''),
						success: function(obj){

							var rTemp = [];

							if(!('userInfo' in obj)){
								obj = {
									userInfo: obj
								}
							}

							$.each(obj.userInfo, function(i, o){
								if(_.indexOf(uid, o.userId) === -1){
									rTemp.push(o);
								}
							});

							obj.userInfo = rTemp;

							if(_key.length && obj.userInfo.length){
								$.each(obj.userInfo, function(i, o){
									output.push('<li data-uid="' + o.userId + '" data-badge="' + o.loginId + '" data-did="' + o.dept3Id + '" data-dept="' + (o.dep1Name + ' → ' + o.dep2Name + (o.dep2Id!=o.dept3Id ? ' → '+o.dept3Name : '')) + '" data-email="' + o.email + '"><strong>'+o.lastName+'</strong><i>|</i><span>' + (o.dep1Name + ' → ' + o.dept3Name) + '</span></li>');
									
								});

								output = '<dl>' + output.join('') + '</dl>';

								if(target.data('is_user_search_tips_initialize')){
									containerEl.html(output).show();
								}
								else{
									target.data('is_user_search_tips_initialize', true);
									containerEl.html(output).appendTo($('body'));
								}
								
								index = -1;

								containerEl.css({left:target.offset().left, top:target.offset().top + target.outerHeight()});
							}
							else{
								containerEl.hide();
							}
						}
					});					
				}
			}
			
		});

		target.on('blur', function(e){
			$(this).val('').trigger('keyup');
			setTimeout(function(){
				containerEl.hide();
			}, 200);
		});

		target.on('keydown', function(e){

			var itemEl = containerEl.find('li');

			if((e.keyCode === 38 || e.keyCode === 40) && !target.hasClass('hack')){

				itemEl.removeClass('selected');

				if(e.keyCode === 38){
					index--;
				}
				else{
					index++;
				}

				if(index < 0){
					index = itemEl.length - 1;
				}
				if(index > itemEl.length - 1){
					index = 0;
				}
				itemEl.eq(index).addClass('selected');

				return false;
			}
			if(e.keyCode === 13 && itemEl.filter('.selected').length === 1){

				callback && callback(itemEl.filter('.selected'));

				containerEl.hide();
				return false;
			}
		});

		containerEl.on('mousedown', 'li', function(){
			callback && callback($(this));
			containerEl.hide();
			return false;
		});

		return containerEl;
	};
});