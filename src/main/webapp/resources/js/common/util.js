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
    var util = {};

    util.serializeJson = function(_id) {
       var serializeObj={};
       var _this = $("#"+_id);
        $(_this.serializeArray()).each(function(){
        serializeObj[this.name]=this.value;
        });
        return serializeObj;
    };

    // 上传Excel
    util.impExcel = function(_this,e) {
        var me = _this;
        var $file = $(e.currentTarget),
            $form = $file.parent(),
            $uploadBox = $form.parent().parent(),
            $loading = $uploadBox.find('.ajax-loading');
        var _file = $file.val();

        $form.ajaxForm({
            beforeSerialize: function() {
                $loading.show();
            },
            success: function(r) {
                console.info(r);
                var _data = eval('(' + r + ')');
                console.info(_data);
                if(_data.resultType == 'true') {
                    $loading.hide();
                    $.oaTip('导入成功', 'success', 1000);
                    me.renderList({
                        type: me.hash
                    });
                }else {
                    $loading.hide();
                    $form[0].reset();

                    if(_data.errorList && _data.errorList.length > 0) {
                        $.importError({
                            errorList: _data.errorList
                        });
                        me.renderList({
                            type: me.hash
                        });
                    }else {
                        $.oaTip(_data.result, 'error', 2000);
                    }
                }

            },
            error: function(r) {
                var _data = eval('(' + r + ')');
                
                $loading.hide();
                $form[0].reset();
                $.oaTip(_data.result, 'error', 2000);
            }
        });
        if(_file) {
            if(_file.match(/.(xls|xlsx)$/ig)) {
                $form.submit();
            }else {
                $form[0].reset();
                $.oaTip('请上传Excel', 'warning');
            }
        }
    };


    util.tableLock = function(_table, _row, _col) {
        var $tab = jQuery("table#"+_table);
        
        if($tab.length){
            
            var div=$tab[0].parentNode; 
            div.onscroll = function(){
                //锁定行
                var scrollTop = this.scrollTop, 
                    scrollLeft = this.scrollLeft;
                for(var i=0;i<_row;i++){
                    var tr = $tab[0].rows[i]; 
                    var st = scrollTop-(scrollTop==0?1:2)+"px";
                    jQuery(tr).find("th,td").css({
                        "top":st,
                        "z-index":300,
                        "position":"relative"
                    });
                }
                //锁定列
                var effectsTd = [];
                $tab.find("tr").each(function(k,v){
                    var $tr = jQuery(v);
                    $tr.find("td,th").each(function(index,td){
                        if(index<_col){
                            effectsTd[effectsTd.length] = td;
                        }
                    });
                });
                if(effectsTd.length){
                    var tt = scrollLeft-(scrollLeft==0?1:2);
                    jQuery(effectsTd).css({
                        "left": tt+"px",
                        "z-index":100,
                        "position":"relative"
                    });
                }
                //锁定行和列
                var effectsTh = [];
                $tab.find("tr").each(function(index,tr){
                    var $tr = jQuery(tr);
                    $tr.find("th,td").each(function(ind,th){
                        if(ind < _col && index<_row){
                            effectsTh[effectsTh.length]  = th;
                        }
                    });
                });
                if(effectsTh.length){
                    var tt = this.scrollLeft-(this.scrollLeft==0?1:2);
                    jQuery(effectsTh).css({
                        "left": tt+"px",
                        "z-index":400,
                        "position":"relative"
                    });
                }
            };
            
        }
    };

    // 表单数据序列化
    util.serializeFields = function(form) {
        var $form = $(form);
        var dataModel = '',         // 实际传送的表单值
            isNotEmpty = true,      // 是否全部已输入
            firstEmptyEl = null;    // 第一个未输入元素

        $form.find('input[serialize="true"]').each(function() {
            var $input = $(this);
            var _name = $input.attr('name'),
                _isMandatory = $input.attr('isMandatory'),
                _escape = $input.attr('escape'),
                _value = $input.val().trim();

            // 当输入框未输入时
            if(!_value && isNotEmpty && _isMandatory=='1') {
                isNotEmpty = false;
                firstEmptyEl = $input;
            }

            // 中文转码
            if(_escape == '1') _value = escape(_value);

            if(dataModel == '') dataModel += _name + '=' + _value;
            else dataModel += '&' + _name + '=' + _value;
        });

        return {
            dataModel: dataModel,
            isNotEmpty: isNotEmpty,
            firstEmptyEl: firstEmptyEl
        };
    };

    return util;
    
});