/**
 * Created by wjjn3481 on 2015/12/30.
 */
define(['jquery', 'common/remote'], function ($, Remote) {
    return function (options){
        var opts = {};
        $.extend(opts, options);

        Remote({
            url : opts.url,
            type : opts.type || 'GET',
            dataType : opts.dataType || "JSON",
            data : opts.data,
            success : function (res) {
                if (200 === res.code) {
                    opts.callback && 'function' === typeof opts.callback && opts.callback(res);
                    window.location.href = "common/exportExcel";
                } else {
                    $.oaTip(res.desc, "error");
                }
            }
        });
    }
});