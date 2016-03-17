/**
 * tool.js
 * @autoor zq
 * Created by 2015-10-10 10:15
 */
define(['underscore'], function (_) {

    !Date.prototype.format && (Date.prototype.format = function (format) {
        format = format || 'yyyy-MM-dd';

        if (isNaN(this.getMonth())) {
            return '';
        }

        var o = {
            "M+": this.getMonth() + 1,  //month
            "d+": this.getDate(),       //day
            "h+": this.getHours(),      //hour
            "m+": this.getMinutes(),    //minute
            "s+": this.getSeconds(),    //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S" : this.getMilliseconds() //millisecond
        };

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }

        return format;
    });

    /*---------------------------
     功能:停止事件冒泡
     ---------------------------*/
    function stopBubble(e) {
        //如果提供了事件对象，则这是一个非IE浏览器
        if (e && e.stopPropagation)
        //因此它支持W3C的stopPropagation()方法
            e.stopPropagation();
        else
        //否则，我们需要使用IE的方式来取消事件冒泡
            window.event.cancelBubble = true;
    }

    //阻止浏览器的默认行为
    function stopDefault(e) {
        //阻止默认浏览器动作(W3C)
        if (e && e.preventDefault)
            e.preventDefault();
        //IE中阻止函数器默认动作的方式
        else
            window.event.returnValue = false;
        return false;
    }

    return {
        stop: function (e) {
            stopBubble(e);
            stopDefault(e);
        },

        formatNumber: function (num, precision, separator) {
            var parts;
            // 判断是否为数字
            if (!isNaN(parseFloat(num)) && isFinite(num)) {
                // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
                // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
                // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
                // 的值变成了 12312312.123456713
                num = Number(num);
                // 处理小数点位数
                num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
                // 分离数字的小数部分和整数部分
                parts = num.split('.');
                // 整数部分加[separator]分隔, 借用一个著名的正则表达式
                parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));

                return parts.join('.');
            }
            return NaN;
        },

        transferComma: function (str) {
            return 'string' === typeof str ? str.replace(/(\n)|(\r)|(，)/g, ',') : '';
        },

        // 属性分组（数据分组）
        makeGroup: function (listGroup, data) {
            var children, obj, list = [];
            _.each(listGroup, function (item, index) {
                children = [];
                _.each(item.children, function (itemChild, index) {
                    _.each(data, function (itemData, index) {
                        if (itemChild.key === itemData.key) {
                            obj = {};
                            _.extend(obj, itemChild, itemData);
                            children.push(obj)
                        }
                    });
                });
                if (children.length) {
                    obj = {};
                    _.extend(obj, item);
                    obj.children = children;
                    list.push(obj);
                }
            });

            return list;
        }
    }
});