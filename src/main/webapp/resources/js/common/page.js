/**
 * Created by tzxn1833 on 2015/7/6.
 */
define(['jquery', 'underscore', 'backbone', 'plugin/store'], function ($, _, B, store) {

    return B.View.extend({
        el            : 'body',
        events        : {
            'click.system_page .acG_changePageSize': 'changePageSize',
            'click.system_page .acG_changePage'    : 'changePage'
        },
        initialize    : function (url, data, callback, option) {
            this.$el.off('click.system_page');
            this.pageSizeName = 'OA_PageSize';

            // 分配在实例上而不是在原型链
            this.data = {
                pageSizeArr: [10, 30, 50, 200, 2000],
                pageSize   : data.pageSize || 10,
                pageIndex  : data.pageIndex || 1,                                     //当前在第几页
                recordCounts  : 0                                    //一共有几页
            };
            // 初始配置
            this.option = $.extend({
                selector: '#system_page'
            }, option);

            this.render(url, data, callback);
        },
        render        : function (url, data, callback) {
            var that = this;
            // 缓存参数
            this.url = url;
            this.getData = data;
            this.callback = callback;
            // 设置分页 serialize序列化后
            if (typeof data === 'string') {
                data += '&pageSize=' + this.data.pageSize;
                data += '&pageIndex=' + this.data.pageIndex;
            } else {
                data.pageSize = this.data.pageSize;
                data.pageIndex = this.data.pageIndex;
            }

            // 获取数据
            $.ajax({
                url     : url,
                data    : data,
                dataType: 'json',
                success : function (response) {
                	console.log(response);
                    if (response && (response.resultType == 'true' || !response.error || response.code == '200')) {
                        var pageInfo = response.result.page || {};
                        $.extend(that.data, {
                            recordCount: ~~pageInfo.recordCount,
                            pageIndex  : ~~pageInfo.pageIndex,
                            pageSize   : ~~pageInfo.pageSize,
                            pageTotal   : ~~pageInfo.pageTotal,
                            recordCounts  : ~~pageInfo.recordCounts
                        });

                        response.data = response.result.data;
                        // 连续的序列号码
                        response.result._continuedIndex = (that.data.pageIndex - 1) * that.data.pageSize;
                        callback && callback(response);

                        $(that.option.selector).empty().prev('.system-page-empty').remove();
                        //列表为空处理，前提是是有分页标记
                        if (!_.isEmpty(pageInfo) && that.data.recordCounts == 0) {
                            $(that.option.selector).before(that.emptyTPL);
                            return;
                        }
                        if (that.data.recordCounts > 1) {
                            $(that.option.selector).html(_.template(that.TPL)(that.data));
                        }
                    } else {
                        console.log('没有符合条件的数据 from module/page.js');
                        $(that.option.selector).before(that.emptyTPL);
                    }
                    
                    if(response.code == 613){
                        // session  超时 重定向到登录页
                        window.location.href = "/ams/login";
                    }
                },
                error   : function (response, state) {
                	console.log(response);
                    console.log('请求失败 from module/page.js');
                    if (response.responseText.indexOf("DOCTYPE html") > -1){
                        window.location.href = "/ams/login";
                    }else{
                        $.oaTip("数据解析有误","error", 2000);
                    }

//                    $(that.option.selector).before(that.emptyTPL);
                }
            });
        },
        changePage    : function (event) {
            var index = $(event.currentTarget).data('index');
            if (index == this.data.pageIndex) {
                return;
            }
            this.data.pageIndex = index;
            this.render(this.url, this.getData, this.callback);
        },
        changePageSize: function (event) {
            var index = $(event.currentTarget).data('index');
            if (index == this.data.pageSize) {
                return;
            }

            store.set(this.pageSizeName, index);
            this.data.pageSize = index;
            this.data.pageIndex = 1;
            this.render(this.url, this.getData, this.callback);
        },
        TPL           : '<div class="oa-page">\
                            <em>总共有<%=recordCounts%>条</em>\
                            <div class="size">\
                                <em>每页<%=pageSize%>条</em>\
                                <div class="size-list">\
                                    <ul>\
                                    <%_.each(pageSizeArr,function(item){%>\
                                        <li class="acG_changePageSize <%if(pageSize == item){print(\'hover\')}%>" data-index="<%=item%>">每页<%=item%>条</li>\
                                    <%})%>\
                                    </ul>\
                                </div>\
                            </div>\
                            <div class="total">\
                                <em><%=Math.min(pageIndex,recordCounts)%>/<%=pageTotal%></em>\
                                <div class="page-list">\
                                    <ul>\
                                        <%for(var index = 1;index <= ~~pageTotal; ++index){%>\
                                        <li class="<%if(pageIndex == index){print(\'current\')}%>"><a href="javascript://" data-index="<%=index%>" class="acG_changePage"><%=index%>/<%=pageTotal%></a></li>\
                                        <%}%>\
                                    </ul>\
                                </div>\
                            </div>\
                            <a href="javascript:void(0);" class="prev <%if(pageIndex-1 <1){%>prev-disabled<%}else{%>acG_changePage<%}%>" data-index="<%=pageIndex-1%>"></a>\
                            <a href="javascript:void(0);" class="next <%if(pageIndex+1 >recordCounts){%>next-disabled<%}else{%>acG_changePage<%}%>" data-index="<%=pageIndex+1%>"></a>\
                        </div>',
        emptyTPL      : '<div class="ux-infolist system-page-empty"><div class="ux-infolist_empty" style="">当前列表空空如也</div></div>'
    });
});