define([
    'jquery',
    'underscore',
    'backbone',
    'common/requestConfig',
    'plugin/jq.interactive',
    'plugin/jq.quickSearch',
    'plugin/jq.form',
    'plugin/jq.importError'
], function($, _, B, requestConfig, store) {

    var gameIds = '2528,2558,2559,2560,2561,2562,2563,2564,2565,2566,2567,2568,2569,2571,2572,2573,2574,3383';
    var linkUrl = '/service/hrm/resource/HrmDepartment.jsp?dept1Ids='+gameIds;

    var popwin = {};

    popwin.budgetInteractive = function(_this, e) {
        var me  = _this;
        var $target = $(e.currentTarget),
            $list = null,
            $input = null,
            $popupValue = null;
        var _interactiveValue = $target.attr('srv'),
            _interactiveType = $target.attr('rev');
            _interactiveOptions = {};

        if($target.hasClass('input-browse')) $list = $target.find('.browser-text');
        else $list = $target.siblings('.browser-text');

        $input = $list.parent().siblings('input[type="hidden"][serialize="true"]');
        $popupValue = $input.siblings('input[name="popupValue"]');


        // 弹窗参数配置
        _interactiveOptions = {
            type: _interactiveValue,
            callback: function(r) {
                getInteractiveValue('select', r);
            },
            clear: function() {
                getInteractiveValue('clear');
            }
        }
        if(_interactiveValue == 'SingleNeteaseDept') {
            _interactiveOptions.selectType = 'main';
            _interactiveOptions.onlyMain = true;
           
        }
        if(_interactiveValue == 'MultiNeteaseDept') {
            _interactiveOptions.selectType = 'main';
            _interactiveOptions.onlyMain = false;

        }

        _interactiveOptions.linkUrl = linkUrl;

        if($popupValue.length > 0) _interactiveOptions.initValue = $popupValue.val();

        // 弹窗回调处理
        function getInteractiveValue(type, data) {
            // 单选处理
            if(_interactiveType == 'single') {
                // 选择
                if(type == 'select') {
                    $list.text(data[0].title);
                    $target.siblings('a.clear-input').show().siblings('span.require').hide();
                    // 工作室负责人需要显示工号
                    if(_interactiveValue == 'SingleNeteaseUser') {
                        if(data[0].loginId == 'undefined') $list.text(data[0].title);
                        else $list.text(data[0].title + '(' + data[0].loginId + ')');
                    }
                    $input.val(data[0].id);
                // 清除
                }else if(type == 'clear') {
                    $list.text('');
                    $input.val('');
                    $target.siblings('span.require').show().siblings('a.clear-input').hide();
                }
                return;
            }

            // 多选处理
            if(_interactiveType == 'multi') {
                // 选择
                if(type == 'select') {
                    $list.text(data[0].title);
                    $input.val(data[0].id);

                    var _selectTPL = '',
                        _ids = [],
                        _popupValue = '';
                                    
                    for(var i=0; i<data.length; i++) {
                        _selectTPL += '<li><span>' + data[i].title + '</span><a href="#" class="remove ac_removeSelector" selectorId="' + data[i].id + '"></a></li>';
                        _ids.push(data[i].id);

                        if(i > 0) _popupValue += ',';
                        _popupValue += data[i].id + '|' + data[i].title + '|' + data[i].dept;
                    }
                                    
                    $list.html(_selectTPL);
                    $input.val(_ids);
                    $popupValue.val(_popupValue);

                    $target.siblings('a.clear-input').show().siblings('span.require').hide();

                    //popwin.interactiveEvent(_this ,$obj);
                // 清除
                }else if(type == 'clear') {
                    $list.empty();
                    $input.val('');
                    $popupValue.val('');
                    $target.siblings('span.require').show().siblings('a.clear-input').hide();
                }
                return;
            }
        }

        // 弹窗引用
        require(["plugin/jq.popup"], function(Popup) {
            console.info(_interactiveOptions)
            Popup(_interactiveOptions);
        });

        return false;
    };

    popwin.interactiveEvent = function(_this, _obj) {
        var me = _this;
        var $obj = $(_obj);

        // 选择人员、部门弹窗
        $obj.find('.ac_budgetInteractive').unbind('click').bind('click', function() {
            var $target = $(this),
                $list = null,
                $input = null,
                $popupValue = null;
            var _interactiveValue = $target.attr('srv'),
                _interactiveType = $target.attr('rev');
                _interactiveOptions = {};

            if($target.hasClass('input-browse')) $list = $target.find('.browser-text');
            else $list = $target.siblings('.browser-text');

            $input = $list.parent().siblings('input[type="hidden"][serialize="true"]');
            $popupValue = $input.siblings('input[name="popupValue"]');


            // 弹窗参数配置
            _interactiveOptions = {
                type: _interactiveValue,
                callback: function(r) {
                    getInteractiveValue('select', r);
                },
                clear: function() {
                    getInteractiveValue('clear');
                }
            }

            _interactiveOptions.linkUrl = linkUrl;

            if(_interactiveValue == 'SingleNeteaseDept') _interactiveOptions.selectType = 'main';
            if($popupValue.length > 0) _interactiveOptions.initValue = $popupValue.val();

            // 弹窗回调处理
            function getInteractiveValue(type, data) {
                // 单选处理
                if(_interactiveType == 'single') {
                    // 选择
                    if(type == 'select') {
                        $list.text(data[0].title);
                        
                        $target.siblings('a.clear-input').show().siblings('span.require').hide();

                        // 工作室负责人需要显示工号
                        if(_interactiveValue == 'SingleNeteaseUser') {
                            if(data[0].loginId == 'undefined') $list.text(data[0].title);
                            else $list.text(data[0].title + '(' + data[0].loginId + ')');
                        }
                        // 选择所属部门带出成本中心
                        // if(_interactiveValue == 'SingleNeteaseDept') {
                        //  var _ids = data[0].id.split(',');

                        //  $input.each(function(index) {
                        //      if(_ids[index]) $(this).val(_ids[index]);
                        //  });

                        //  $.ajax({
                        //      type: 'GET',
                        //      dataType: 'JSON',
                        //      url: requestConfig['manage']['costCenter'] + '?oprt=costcenter&ids=' + _ids[_ids.length-1]
                        //  }).done(function (r) {
                        //      if(r.resultType == 'true') {
                        //          $obj.find('input[name="S_COSTCENTER"]').val(r.result[0].S_COSTCENTER);
                        //      }
                        //  }).fail(function () {
                        //      // 请求失败
                        //  });

                        //  return;
                        // }

                        $input.val(data[0].id);
                    // 清除
                    }else if(type == 'clear') {
                        $list.text('');
                        $input.val('');
                        $target.siblings('span.require').show().siblings('a.clear-input').hide();
                    }
                    return;
                }

                // 多选处理
                if(_interactiveType == 'multi') {
                    // 选择
                    if(type == 'select') {
                        $list.text(data[0].title);
                        $input.val(data[0].id);

                        var _selectTPL = '',
                            _ids = [],
                            _popupValue = '';
                                        
                        for(var i=0; i<data.length; i++) {
                            _selectTPL += '<li><span>' + data[i].title + '</span><a href="#" class="remove ac_removeSelector" selectorId="' + data[i].id + '"></a></li>';
                            _ids.push(data[i].id);

                            if(i > 0) _popupValue += ',';
                            _popupValue += data[i].id + '|' + data[i].title + '|' + data[i].dept;
                        }
                                        
                        $list.html(_selectTPL);
                        $input.val(_ids);
                        $popupValue.val(_popupValue);

                        $target.siblings('a.clear-input').show().siblings('span.require').hide();

                        popwin.interactiveEvent(_this, $(_obj));
                    // 清除
                    }else if(type == 'clear') {
                        $list.empty();
                        $input.val('');
                        $popupValue.val('');
                        $target.siblings('span.require').show().siblings('a.clear-input').hide();
                    }
                    return;
                }
            }

            // 弹窗引用
            require(["plugin/jq.popup"], function(Popup) {
                Popup(_interactiveOptions);
            });

            return false;
        });

        $obj.find('.ac_removeSelector').unbind('click').bind('click', function() {
            var $target = $(this),
                $li = $target.parent();
            var _selectorId = $target.attr('selectorId');

            __checkImportId($li.parents('div.input-browse').siblings('input[name="popupValue"]'), _selectorId);
            if($li.parents('div.input-browse').siblings('input[selector="dept"]')){
            	 __checkImportId($li.parents('div.input-browse').siblings('input[selector="dept"]'), _selectorId);
            }
           
            if($li.parents('div.input-browse').siblings('input[selector="user"]')){
            	__checkImportId($li.parents('div.input-browse').siblings('input[selector="user"]'), _selectorId);
            }
            
            $li.remove();
            return false;
        });
        // 删除后处理
        function __checkImportId(target, id) {
            var $target = $(target);
            if($target.val() == null){
            	return;
            }
            var _ids = $target.val().split(','),
                _num = 0
            for(var i=0; i<_ids.length; i++) {
                if(_ids[i].indexOf(id) >= 0) delete _ids[i];
            }
            _ids = _.compact(_ids)
            $target.val(_ids);
        }

        // 更改填写控制状态
        $obj.find('.ac_changeControl').unbind('click').bind('click', function() {
            var $target = $(this);
            var _status = $target.attr('status');

            if($target.hasClass('radio-hover')) return false;

            $target.addClass('radio-hover').siblings().removeClass('radio-hover');
            $target.siblings('input.browser-value').val(_status);
            return false;
        });

        // 模拟下拉菜单
        $obj.find('.ac_selectBox').unbind('click').bind('click', function() {
            var $target = $(this),
                $select = $target.parent();
            var _value = $select.siblings('input').val(),
                _limit = $target.attr('limit');

            if($select.hasClass('select-hover')) {
                $select.removeClass('select-hover');
            }else {
                // 收起其他下拉菜单
                $('div.select-hover').each(function() {
                    $(this).removeClass('select-hover');
                });
                
                $select.addClass('select-hover');
                if(_value!=-1 && _value!='') $select.find('li.ac_selectItem[val="' + _value + '"]').addClass('hover');

                if(_limit == '0') $select.find('ul').addClass('select-auto');
            }
        });
        $obj.find('.ac_selectItem').unbind('click').bind('click', function() {
            var $li = $(this),
                $select = $li.parent().parent(),
                $em = $select.find('em'),
                $input = $select.siblings('input.select-value');
            var _value = $li.attr('val');

            if($li.hasClass('hover')) {
                $select.removeClass('select-hover');
                return;
            }

            if(_value=='-1' || _value=='') {
                $li.siblings('li').removeClass('hover');
                $input.val('').siblings('span.require').show();
            }else {
                $li.addClass('hover').siblings('li').removeClass('hover');
                $input.val(_value).siblings('span.require').hide();
            }
            $em.text($li.text());
            $select.removeClass('select-hover');
        });

        return false;
    };

    popwin.removeSelector = function (_this, e){
        var $target = $(e.currentTarget),
            $li = $target.parent();
        var _selectorId = $target.attr('selectorId');

        popwin.__checkImportId($li.parents('div.input-browse').siblings('input[name="popupValue"]'), _selectorId);
        
        if($li.parents('div.input-browse').siblings('input[selector="dept"]')){
        	popwin.__checkImportId($li.parents('div.input-browse').siblings('input[selector="dept"]'), _selectorId);
        }
        if($li.parents('div.input-browse').siblings('input[selector="user"]')){
        	popwin.__checkImportId($li.parents('div.input-browse').siblings('input[selector="user"]'), _selectorId);
        }
        
        
        $li.remove();

        if($("#selectDeptSpan")){
            var deptText = $("#selectDeptSpan").text();
            if(deptText == '' || deptText == ''){
                $("#selectDeptSpan").text('请选择部门');
            }
        }
        
        

        return false;
    };

    popwin.__checkImportId = function (target, id) {
        var $target = $(target);
        if($target.val() == null){
        	return;
        }
        var _ids = $target.val().split(','),
            _num = 0
        for(var i=0; i<_ids.length; i++) {
            if(_ids[i].indexOf(id) >= 0) delete _ids[i];
        }
        _ids = _.compact(_ids)
        $target.val(_ids);
    };

    popwin.removeComfirm = function(obj, tip, callback) {
        var $target = $(obj);

        $target.addClass('remove-hover');
        var $removeComfirm = $.sprite({
            className: 'interactive-confirm-box',
            noArrow: false,
            arrowSize: {w:8, h:6},
            outerFix: {t:0, r:0, b:10, l:0},
            msg: '<strong>' + tip + '</strong><a href="#" class="comfirm">确认</a><a href="#" class="cancel">取消</a>',
            target: $target,
            direction: 'down',
            align: 'right',
            showButtons: false,
            loading: false,
            animate: 'slide',
            easyClose: true,
            onsuccess: function(obj) {
                var $obj = $(obj);

                $obj.find('a').unbind('click').bind('click', function() {
                    if($(this).hasClass('comfirm')) {
                        callback();
                    }else {
                        $target.removeClass('remove-hover');
                    }
                    $removeComfirm.remove();

                    return false;
                });
            },
            onclose: function() {
                $target.removeClass('remove-hover');
            }
        });
        return false;
    };

    popwin.selectBox = function(_this,e) {
        var $target = $(e.currentTarget),
            $select = $target.parent();
        var _value = $select.find('input.select-value').val(),
            _limit = $target.attr('limit');

        if($select.hasClass('select-hover')) {
            $select.removeClass('select-hover');
        }else {
            // 收起其他下拉菜单
            $('div.select-hover').each(function() {
                $(this).removeClass('select-hover');
            });
            
            $select.addClass('select-hover');
            if(_value!=-1 && _value!='') $select.find('li.ac_selectItem[val="' + _value + '"]').addClass('hover');

            if(_limit == '0') $select.find('ul').addClass('select-auto');
        }
    };

    popwin.selectItem = function(_this,e) {
            var $li = $(e.currentTarget),
                $select = $li.parent().parent(),
                $em = $select.find('em'),
                $input = $select.find('input.select-value');
            var _value = $li.attr('val');

            if($li.hasClass('hover')) {
                $select.removeClass('select-hover');
                return;
            }

            if(_value=='-1' || _value=='') {
                $li.siblings('li').removeClass('hover');
                $input.val('').siblings('span.require').show();
            }else {
                $li.addClass('hover').siblings('li').removeClass('hover');
                $input.val(_value).siblings('span.require').hide();
            }
            $em.text($li.text());
            $select.removeClass('select-hover');
        };


    return popwin;
    
});