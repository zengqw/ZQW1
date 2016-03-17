/**
 * Created by wjjn3481 on 2016/1/8.
 */
define([
    'jquery',
    'underscore',
    'plugin/upload',
    'text!tmpl/common/uploadFile.html'
], function ($, _, Upload, uploadFile) {

    $('body').append(uploadFile);

    return function (options) {

        // options : {
        //    selector : 这个上传组件插入到此DOM，【非必须】
        //    uploadUrl : 上传的Url, 【非必须】
        //    fileType : 上传文件类型, 【非必须】
        //    uploadBtnText : 上传按钮显示的文字, 【非必须】
        //    tips : 上传的温馨提示, 【非必须】
        //    callback : 回调函数, 【非必须】
        // }
        options = $.extend({}, options);

        var attach = {},
            settings = {
                upload_url                  : options.uploadUrl || '/ams/modifyAsset/batchModifyByExcel',
                button_width                : 93,
                file_size_limit             : '20 MB',
                file_types                  : options.fileType || "*.xls;*.csv;*.xlsx",
                file_queue_limit            : 1,
                file_dialog_complete_handler: function (numFilesSelected, numFilesQueued) {
                    var _this = this;
                    if (numFilesQueued > 0) {
                        //_this.addPostParam('code', '');
                        _this.startUpload();
                    }
                },
                file_queued_handler         : function (file) {
                    var _this = this;
                    attach.name = file.name;
                    attach.fileId = file.id;
                    attach.add = true;   // 上传状态是新添加
                    $(this.customSettings.wrap).append(_.template($('#tpl_upload_item').html())(attach)).find('.delete-link').click(function () {
                        _this.cancelUpload(file.id, false);
                        $('#' + file.id).remove();
                    });
                },
                upload_progress_handler     : function (file, bytesLoaded, bytesTotal) {
                    $('#' + file.id).find('.progress').text(bytesLoaded / bytesTotal * 100 + '%');
                },
                upload_success_handler      : function (file, serverData) {
                    serverData = $.parseJSON(serverData);
                    if (serverData.code != 200) {
                        if(serverData.code == 613){
                            // session  超时 重定向到登录页
                            window.location.href = "/ams/login";
                        }
                        $.oaTip(serverData.desc, 'error');
                        setTimeout(function () {
                            $('#' + file.id).remove();
                        }, 2000);
                        return false;
                    }

                    var msg = _.template($('#tpl_upload_msg').html())(serverData);
                    $(options.selector || '.workload-data').append(msg);

                    $.oaTip(serverData.desc, 'success');
                    attach.add = false;
                    $('#' + file.id).after(_.template($('#tpl_upload_item').html())(attach)).remove();

                    // callback
                    options.callback && 'function' === typeof options.callback && options.callback(serverData);
                }
            };

        // 插入上传节点
        $(options.selector || '.workload-data').append(_.template($('#tpl_upload_wrap').html())({
            uploadBtnText : options.uploadBtnText || '',
            tips : options.tips || ''
        }));

        // 上传初始化
        Upload.upload(settings);
    }
});