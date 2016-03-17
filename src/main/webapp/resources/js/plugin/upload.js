/*
 * Created by tzxn1833 on 2015/7/15.
 * 文件上传
 * */

define(['plugin/swfupload'], function () {

    var setting = {
        upload_url                  : '/resume/resumeAttach/insert.api',
        file_post_name              : 'file',
        button_placeholder_id       : "upload_btn",
        flash_url                   : 'resources/js/plugin/swfupload.swf',
        file_types                  : '*',
        button_width                : 110,
        button_height               : 30,
        file_size_limit             : '20 MB',
        button_action               : SWFUpload.BUTTON_ACTION.SELECT_FILES,
        button_cursor               : SWFUpload.CURSOR.HAND,
        button_window_mode          : SWFUpload.WINDOW_MODE.TRANSPARENT,
        button_text                 : '',
        custom_settings             : {
            wrap: '#upload_wrap'
        },
        file_queue_error_handler    : fileQueueError,
        file_queued_handler         : fileQueued,
        file_dialog_complete_handler: fileDialogComplete,
        upload_progress_handler     : uploadProgress,
        upload_error_handler        : uploadError,
        upload_success_handler      : uploadSuccess
    }, inited;

    //对话框关闭时，如果选择的文件加入到上传队列中成功触发
    function fileQueued(file) {
        try {
            this.oProgress = new FileProgress(file, this.customSettings.wrap);
        } catch (ex) {
            this.debug(ex);
        }
    }

    //对话框关闭时，文件加入上传队列不管成功还是失败都触发
    function fileDialogComplete(numFilesSelected, numFilesQueued) {
        try {
            if (numFilesQueued > 0) {
                this.startUpload();
            }
        } catch (ex) {
            this.debug(ex);
        }
    }

    //对话框关闭时，如果选择的文件加入到上传队列中失败触发
    function fileQueueError(file, errorCode, message) {
        switch (errorCode) {
            case -110:
                $.oaTip('文件大小不超过' + this.settings.file_size_limit, 'error');
                break;
            case -130:
                $.oaTip('上传文件类型错误', 'error');
                break;
        }
    }

    //由flash定时器触发，文件上传中触发
    function uploadProgress(file, bytesLoaded, bytesTotal) {
        try {
            this.oProgress.setProgress(bytesLoaded, bytesTotal);
        } catch (ex) {
            this.debug(ex);
        }
    }

    //只要上传被终止或者没有成功完成，那么该事件都会被触发
    function uploadError(file, errorCode, message) {
        try {
            this.cancelUpload(file.id, false);
            var tips = '上传失败';
            switch (errorCode) {
                case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                    tips = '文件太大';
                    break;
            }
            $.oaTip(tips, 'error', 2000, function () {
                $('#' + file.id).remove();
            });
        } catch (ex) {
            this.debug(ex);
        }
    }

    //服务端返回了200的HTTP状态时，触发此事件
    function uploadSuccess(file, serverData) {
        try {
            this.oProgress.setComplete(serverData);
        } catch (ex) {
            this.debug(ex);
        }
    }

    /**
     * 上传队列UI Constructor
     * */
    function FileProgress(file, wrapId) {
        this.id = file.id;
        this.wrapper = $(wrapId);
        this.init(file);
    }

    FileProgress.prototype = {
        init       : function (file) {
            if (!inited) {
                inited = !0;
                var TPL = '<div class="upload-area">\
                        <table class="table table-hover table-striped">\
                            <thead>\
                                <tr>\
                                    <th width="35%">文件名</th>\
                                    <th width="15%">大小</th>\
                                    <th width="35%">状态</th>\
                                    <th width="15%">操作</th>\
                                </tr>\
                            </thead>\
                            <tbody class="upload-cnt"></tbody>\
                            <tfoot>\
                                <tr>\
                                    <td colspan="4"></td>\
                                </tr>\
                            </tfoot>\
                        </table>\
                    </div>';
                this.wrapper.append(TPL);
            }
            var tpl = '<tr id="' + this.id + '">\
                        <td class="file-name">' + file.name + '</td>\
                        <td class="file-size">' + (file.size / (1024 * 1024)).toFixed(2) + 'MB</td>\
                        <td class="file-state">\
                            <div class="upload-progress"><div class="progress"></div></div>\
                        </td>\
                        <td><a class="ico ico-delete" href="javascript://">删除</a></td>\
                    </tr>';

            this.wrapper.find('.upload-cnt').append(tpl);
            this.target = $('#' + this.id);
        },
        setProgress: function (bytesLoaded, bytesTotal) {
            this.target.find('.progress').width((bytesLoaded / bytesTotal * 100).toFixed(0) + '%');
        },
        setComplete: function (serverData) {
            try {
                serverData = $.parseJSON(serverData);
                if (serverData.error === true) {
                    this.setError(serverData);
                    return false;
                }
                this.target.find('.file-state').html('<span class="text-success">上传成功</span>');

            } catch (e) {
                console.log('services data error');
            }
        },
        setError   : function (serverData) {
            var that = this;
            $.oaTip(serverData.desc, 'error');
            this.target.find('.file-state').html('<span class="text-danger">上传失败</span>');
            setTimeout(function () {
                that.target.remove();
            }, 3000);
        },
        setCancel  : function (target) {
            target.cancelUpload(this.id, false);
        }
    };

    return {
        upload: function (options) {
            return new SWFUpload($.extend(true, {}, setting, options));
        }
    };
});