/**
 * 只依赖于jQuery库的辅助工具库，积累一些较常用但其他库不含有的常用工具方法
 * @author:wxz
 * @date:2014-03-06
 */
define(["jquery"], function ($) {
    var window = this || (0, eval)('this'),
        document = window['document'],
        navigator = window['navigator'];
    if (typeof $ !== "function") {
        throw new Error("sharpTool.js工具库需要依赖于jQuery库");
    }

    var previoussTool = window.sTool;
    var sTool = {};
    // 用于用回原来已有的sTool变量
    sTool.noConflict = function () {
        window.sTool = previoussTool;
        return this;
    };
    // =============扩展现代浏览器基本功能=================
    String.prototype.trim = String.prototype.trim || function () {
        return this.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
    };
    // Number下需要修复的方法是toFixed，某些浏览器不会对最后一位小数做四舍五入操作
    if (0.9.toFixed(0) !== '1') {
        Number.prototype.toFixed = function (n) {
            var power = Math.pow(10, n);
            var fixed = (Math.round(this * power) / power).toString();
            if (n == 0) {
                return fixed;
            }
            if (fixed.indexOf('.') < 0) {
                fixed += '.';
            }
            var padding = n + 1 - (fixed.length - fixed.indexOf('.'));
            for (var i = 0; i < padding; i++) {
                fixed += '0';
            }
            return fixed;
        };
    }
    var text = $.fn.text;
    $.fn.text = function () {
        var $tar = $(this),
            args = [].slice.call(arguments);
        try {
            return text.apply($tar, args);
        } catch (e) {
            return $tar.val.apply($tar, args);
        }
    };
    var html = $.fn.html;
    $.fn.html = function () {
        var $tar = $(this),
            args = [].slice.call(arguments);
        try {
            return html.apply($tar, args);
        } catch (e) {
            return $tar.text.apply($tar, args);
        }
    };
    // ================== 基本的工具（字符串、日期） =========================
    // 后面会使用到的
    var hasUnderscore = "_" in window && (typeof _ === "function");
    var each;
    if (hasUnderscore && (typeof _.each === "function")) {
        each = _.each;
    } else {
        var nativeForEach = Array.prototype.forEach,
            breaker = {};
        each = function (obj, iterator, context) {
            if (obj == null) return;
            if (nativeForEach && obj.forEach === nativeForEach) {
                obj.forEach(iterator, context);
            } else if (obj.length === +obj.length) {
                for (var i = 0,
                         l = obj.length; i < l; i++) {
                    if (iterator.call(context, obj[i], i, obj) === breaker) return;
                }
            } else {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (iterator.call(context, obj[key], key, obj) === breaker) return;
                    }
                }
            }
        };
    }
    // ***将伪数组转化为真正的数组***
    var arrayLikeToArray = function (arrayLike) {
        var arr, length;
        try {
            // works in every browser except IE
            arr = [].slice.call(arrayLike);
            return arr;
        } catch (err) {
            // slower, but works in IE
            arr = [];
            length = arrayLike.length;

            for (var i = 0; i < length; i++) {
                arr.push(arrayLike[i]);
            }

            return arr;
        }
    };
    // ***关于日期的操作***
    var getDateYear = function (date) {
        if (!/^\d{4}[\/-]?(0?[1-9]|1[0-2])$/g.test(date)) {
            return new Date(date).getFullYear();
        }
        return parseInt(date.match(/^(\d{4})[\/-]?(\d{1,2})$/)[1], 10);
    };
    var getDateMonth = function (date) {
        if (!/^\d{4}[\/-]?(0?[1-9]|1[0-2])$/g.test(date)) {
            return new Date(date).getMonth() + 1;
        }
        return parseInt(date.match(/^(\d{4})[\/-]?(\d{1,2})$/)[2], 10);
    };
    var getDateDate = function (date) {
        try {
            if (!/^\d{4}[\/-]?(0?[1-9]|1[0-2])[\/-]?(0?[1-9]|[1-3][0-9])$/g.test(date)) {
                return new Date(date).getDate();
            }
            return parseInt(date.match(/^(\d{4})[\/-]?(\d{1,2})[\/-]?(\d{1,2})$/)[3], 10);
        } catch (e) {
            return -1;
        }

    };

    var getZeroDate = function (date) {
        var year = getDateYear(date),
            mon = getDateMonth(date),
            day = getDateDate(date);
        mon = mon > 9 ? mon : ('0' + mon);
        if (~day) {
            day = day > 9 ? day : ('0' + day);
            return year + '-' + mon + '-' + day;
        } else {
            return year + '-' + mon;
        }

    };
    var transDate = function (d) {
        if (/^\d{4}-\d{1,2}(-\d{1,2})?$/g.test(d)) {
            d = d.replace(/-/g, '/');
        }
        return d;
    };
    // 比较两个日期的大小，返回值：1:d1>d2 -1:d1<d2 0:d1=d2
    var dateCompare = function (d1, d2) {
        if (d1 == null && d2 != null) {
            return 1;
        } else if (d1 != null && d2 == null) {
            return -1;
        } else if (d1 == null && d2 == null) {
            return 0;
        }
        if (typeof d1 === "object") {
            d1 = d1.getFullYear() + "/" + (d1.getMonth() + 1);
        }
        if (typeof d2 === "object") {
            d2 = d2.getFullYear() + "/" + (d2.getMonth() + 1);
        }
        d1 = transDate(d1);
        d2 = transDate(d2);
        if ("parse" in Date) {
            d1 = Date.parse(new Date(d1));
            d2 = Date.parse(new Date(d2));
        } else {
            d1 = new Date(d1).getTime();
            d2 = new Date(d2).getTime();
        }

        return d1 == d2 ? 0 : d1 > d2 ? 1 : -1;
    };
    var getBetweenDates = function (d1, d2) {
        console.error(d1, d2);
        if (!dateCheck(d1)) {
            return [];
        }
        d1 = transDate(d1);
        if ($.isNumeric(d2)) {
            var secs = new Date(d1).getTime();
            var ss = secs + d2 * 24 * 60 * 60 * 1000;
            var date2 = new Date(ss);
            d2 = date2.getFullYear() + '/' + (date2.getMonth() + 1) + '/' + date2.getDate();
        }
        d2 = transDate(d2);
        var sep = '-';
        var result = [];
        var curYear = getDateYear(d1),
            curMonth = getDateMonth(d1),
            curDate;
        curDate = curYear + sep + (curMonth > 9 ? curMonth : ("0" + curMonth));
        var i = 0;
        for (; ; i++) {
            if (dateCompare(curDate, d2) === 1 || i > 100) {
                break;
            }
            result[result.length] = curDate;
            if (++curMonth > 12) {
                curYear++;
                curMonth = 1;
            }
            curDate = curYear + sep + (curMonth > 9 ? curMonth : ("0" + curMonth));
        }
        return result;
    };
    var getBetweenDays = function (d1, d2) {
        if (!dateCheck(d1)) {
            return [];
        }
        if ($.isNumeric(d2)) {
            var secs = new Date(d1).getTime();
            var ss = secs + d2 * 24 * 60 * 60 * 1000;
            var date2 = new Date(ss);
            d2 = date2.getFullYear() + '/' + (date2.getMonth() + 1) + '/' + date2.getDate();
        }
        var sep = '-';
        var result = [];
        var curDate = d1;
        var i = 0;
        for (; ; i++) {
            if (dateCompare(curDate, d2) === 1 || i > 100) {
                break;
            }
            result[result.length] = curDate;
            var d = new Date(new Date(transDate(curDate)).getTime() + 24 * 60 * 60 * 1000),
                mon = d.getMonth() + 1,
                date = d.getDate();
            mon = mon > 9 ? mon : ('0' + mon);
            date = date > 9 ? date : ('0' + date);
            curDate = d.getFullYear() + sep + mon + sep + date;
        }
        return result;
    };
    var getBetweenMons = function (d1, d2) {
        var sy, sm, ey, em;
        if (_.isDate(d1)) {
            sy = d1.getFullYear();
            sm = d1.getMonth();
        } else {
            sy = new Date(d1).getFullYear();
            sm = new Date(d1).getMonth();
        }
        if (_.isDate(d2)) {
            ey = d1.getFullYear();
            em = d1.getMonth();
        } else {
            ey = new Date(d2).getFullYear();
            em = new Date(d2).getMonth();
        }
        return ey * 12 + em - sy * 12 - sm + 1;
    };
    var getBetDatesNozero = function (d1, d2) {
        var resAry = getBetweenDates(d1, d2);
        _.each(resAry, function (v, k) {
            var spAry = v.split("-");
            resAry[k] = spAry[0] + "-" + parseInt(spAry[1], 10);
        });
        return resAry;
    };
    var isLeapYear = function (year) {
        if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0))
            return true;
        else
            return false;
    };
    var dateCheck = function (date) {
        var re = date.match(/^(\d{4})[-/]?(\d{1,2})[-/]?(\d{1,2})$/),
            yy, mm, dd, day_t;
        if (re == null) {
            return false;
        } else {
            yy = re[1];
            mm = re[2];
            dd = re[3];
            day_t = new Date(re[1], re[2] - 1, re[3]);
            if (yy != day_t.getFullYear() || mm != (day_t.getMonth() + 1) || dd != day_t.getDate()) {
                return false;
            }
        }
        return true;
    };
    var getBetweenDateNum = function (d1, d2) {
        if (!dateCheck(d1) || !dateCheck(d2)) {
            return -1;
        }
        d1 = transDate(d1);
        d2 = transDate(d2);
        return (new Date(d2).getTime() - new Date(d1).getTime()) / 1000 / 60 / 60 / 24 + 1;
    };
    var transTimeToHHMM = function (time) {
        if (/\d{1,2}:\d{1,2}/g.test(time)) {
            var ary = time.split(':'),
                h = +ary[0],
                m = +ary[1];
            h < 10 && (h = "0" + h);
            m < 10 && (m = "0" + m);
            return h + ":" + m;
        }
        return '';
    };
    // 获取多少天前/后的日期
    var getDate = function (date, gap) {
        if (!arguments.length) {
            date = gap = 0;
        }
        if ($.isNumeric(date)) {
            var dObj = new Date();
            gap = date;
            date = dObj.getFullYear() + '/' + (dObj.getMonth() + 1) + '/' + dObj.getDate();
        }
        date = date.replace(/-/g, '/');
        var dObj = new Date(new Date(date).getTime() + gap * 24 * 60 * 60 * 1000);
        return dObj.getFullYear() + '-' + (dObj.getMonth() + 1) + '-' + dObj.getDate();
    };
    var getNumMonths = function (date, num) {
        var mon = getDateMonth(date);
        if (mon) {
            var curMon = num + (+mon);
            if (curMon > 0) {
                var year = getDateYear(date) + Math.floor(curMon / 12),
                    curMon = curMon % 12,
                    day = getDateDate(date);
                if (day != -1) {
                    return getZeroDate(year + '-' + curMon + '-' + day);
                } else {
                    return getZeroDate(year + '-' + curMon);
                }
            }else if(curMon == 0){
                var year = getDateYear(date) -1,
                    curMon = 12,
                    day = getDateDate(date);
                return getZeroDate(year + '-' + curMon + '-' + day);
            } else {
                var year = getDateYear(date) + Math.floor(curMon / 12),
                    curMon = 12 + curMon % 12,
                    day = getDateDate(date);
                if (day != -1) {
                    return getZeroDate(year + '-' + curMon + '-' + day);
                } else {
                    return getZeroDate(year + '-' + curMon);
                }
            }
        }
    };
    var getNewDate = function (date, month) {
        var _date = new Date(date),
            _newDate = _date,
            _month = '',
            _day = '';

        _newDate.setMonth(_date.getMonth() + month);
        _newDate.setDate(_date.getDate() - 1);

        _month = _newDate.getMonth() + 1;
        _day = _newDate.getDate();

        if (_month < 10) _month = '0' + _month;
        if (_day < 10) _day = '0' + _day;

        return _newDate.getFullYear() + '-' + _month + '-' + _day;
    }
    // 获取当前的年月日
    var getCurDate = function (gap) {
        gap = gap || '-';
        var date = new Date(),
            mon = date.getMonth() + 1,
            day = date.getDate(),
            curDate = date.getFullYear() + gap + (mon < 10 ? "0" + mon : mon) + gap + (day < 10 ? "0" + day : day);
        return curDate;
    };
    // ***字符串的操作***
    var trim = function (string) {
        return string === null || string === undefined ? '' :
            string.trim ?
                string.trim() :
                string.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
    };
    // stringTokenize("adsdadsadsds","a"); ==> ["dsd", "ds", "dsds"]
    var stringTokenize = function (string, delimiter) {
        var result = [];
        var tokens = (string || "").split(delimiter);
        for (var i = 0, j = tokens.length; i < j; i++) {
            var trimmed = sTool.trim(tokens[i]);
            if (trimmed !== "")
                result.push(trimmed);
        }
        return result;
    };
    var stringStartsWith = function (string, startsWith) {
        string = string || "";
        if (startsWith.length > string.length)
            return false;
        return string.substring(0, startsWith.length) === startsWith;
    };
    var stringEndsWith = function (string, endsWith) {
        string = string || "";
        var sLen = string.length,
            eLen = endsWith.length;
        if (eLen > sLen) {
            return false;
        }
        return string.substring(sLen - eLen) === endsWith;
    };
    var strRealLen = function (str) {
        str && (str = str + "");
        str = str.replace(/\n/g,'<br>');// 服务端保存换行用4个字符
        var realLength = 0;
        var len = str.length;
        var charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) {
                realLength += 1;
            } else {
                // 如果是中文则长度加2
                realLength += 2;
            }
        }
        return realLength;
    };
    var endWith = function (str, lastStr) {
        return str.substring(str.length - lastStr.length) === lastStr;
    };
    /**
      * 计算字符串所占的内存字节数，默认使用UTF-8的编码方式计算，也可制定为UTF-16
      * UTF-8 是一种可变长度的 Unicode 编码格式，使用一至四个字节为每个字符编码
      *
      * 000000 - 00007F(128个代码)      0zzzzzzz(00-7F)                             一个字节
      * 000080 - 0007FF(1920个代码)     110yyyyy(C0-DF) 10zzzzzz(80-BF)             两个字节
      * 000800 - 00D7FF
        00E000 - 00FFFF(61440个代码)    1110xxxx(E0-EF) 10yyyyyy 10zzzzzz           三个字节
      * 010000 - 10FFFF(1048576个代码)  11110www(F0-F7) 10xxxxxx 10yyyyyy 10zzzzzz  四个字节
      *
      * 注: Unicode在范围 D800-DFFF 中不存在任何字符
      * {@link http://zh.wikipedia.org/wiki/UTF-8}
      *
      * UTF-16 大部分使用两个字节编码，编码超出 65535 的使用四个字节
      * 000000 - 00FFFF  两个字节
      * 010000 - 10FFFF  四个字节
      *
      * {@link http://zh.wikipedia.org/wiki/UTF-16}
      * @param  {String} str
      * @param  {String} charset utf-8, utf-16
      * @return {Number}
      */
    var sizeOf = function (str, charset) {
        var total = 0,
            charCode,
            i,
            len;
        charset = charset ? charset.toLowerCase() : '';
        if (charset === 'utf-16' || charset === 'utf16') {
            for (i = 0, len = str.length; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode <= 0xffff) {
                    total += 2;
                } else {
                    total += 4;
                }
            }
        } else {
            for (i = 0, len = str.length; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode <= 0x007f) {
                    total += 1;
                } else if (charCode <= 0x07ff) {
                    total += 2;
                } else if (charCode <= 0xffff) {
                    total += 3;
                } else {
                    total += 4;
                }
            }
        }
        return total;
    };
    var transAryToHash = function (ary) {
        if (Object.prototype.toString.call(ary) === "[object Object]") {
            return ary;
        }
        if (!$.isArray(ary)) {
            return null;
        }
        var result = {};
        $.each(ary, function (k, v) {
            result[k] = v;
        });
        return result;
    };
    var html_encode = function (str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&gt;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        s = s.replace(/\n/g, "<br>");
        return s;
    };

    var html_decode = function (str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&gt;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        s = s.replace(/<br>/g, "\n");
        return s;
    };
    var numberToUpperMoney = function (n) {
            var fraction = ['角', '分'];
            var digit = [
                '零', '壹', '贰', '叁', '肆',
                '伍', '陆', '柒', '捌', '玖'
            ];
            var unit = [
                ['元', '万', '亿'],
                ['', '拾', '佰', '仟']
            ];
            var head = n < 0 ? '欠' : '';
            n = Math.abs(n);
            var s = '';
            for (var i = 0; i < fraction.length; i++) {
                s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
            }
            s = s || '整';
            n = Math.floor(n);
            for (var i = 0; i < unit[0].length && n > 0; i++) {
                var p = '';
                for (var j = 0; j < unit[1].length && n > 0; j++) {
                    p = digit[n % 10] + unit[1][j] + p;
                    n = Math.floor(n / 10);
                }
                s = p.replace(/(零.)*零$/, '')
                    .replace(/^$/, '零')
                    + unit[0][i] + s;
            }
            return (head + s.replace(/(零.)*零元/, '元')
                .replace(/(零.)+/g, '零')
                .replace(/^整$/, '零元整')).trim();
        },
        addCommaToNum = function (number) {
            if (!$.isNumeric(number)) {
                return number;
            }
            number = '' + number;
            if (number.split('.')[0].length > 3) {
                number = number.replace(/(?=(?:\d{3})+(?!\d))/g, ',');
                if (number.indexOf(',') === 0) {
                    number = number.substring(1);
                }
                return number;
            } else {
                return number;
            }
        },
        getIntNum = function (num) {
            if (typeof num === 'undefined' || !$.isNumeric(num)) {
                return 0;
            }
            num = String(num);
            return num.split('.')[0].length;
        },
        getDotNum = function (num) {
            if (typeof num === 'undefined' || !$.isNumeric(num)) {
                return 0;
            }
            num = String(num);
            return (num.split('.')[1] || '').length;
        };
    var transDataToArg = function (data, esc) {
            var strs = [];
            $.each(data, function (pro, val) {
                strs[strs.length] = pro + '=' + (esc ? escape(val) : val);
            });
            return strs.join('&');
        },
        transArgToData = function (arg,unesc) {
            var data = {};
            $.each(arg.split('&'), function (index, item) {
                item = item.split('=');
                data[item[0]] = item[1];
            });
            return data;
        };
    $.extend(sTool, {
        each: each,
        // 日期操作
        getDateYear: getDateYear,
        getDateMonth: getDateMonth,
        getDateDate: getDateDate,
        dateCompare: dateCompare,
        getBetweenDates: getBetweenDates,
        getBetweenDays: getBetweenDays,
        getBetDatesNozero: getBetDatesNozero,
        isLeapYear: isLeapYear,
        dateCheck: dateCheck,
        getBetweenDateNum: getBetweenDateNum,
        getBetweenMons: getBetweenMons,
        getDate: getDate,
        getCurDate: getCurDate,
        transTimeToHHMM: transTimeToHHMM,
        getNumMonths: getNumMonths,
        getNewDate: getNewDate,
        getZeroDate: getZeroDate,
        // 字符串操作
        trim: trim,
        stringTokenize: stringTokenize,
        stringStartsWith: stringStartsWith,
        stringEndsWith: stringEndsWith,
        html_encode: html_encode,
        html_decode: html_decode,
        numberToUpperMoney: numberToUpperMoney,
        addCommaToNum: addCommaToNum,
        strRealLen: strRealLen,
        sizeOf: sizeOf,
        getIntNum: getIntNum,
        getDotNum: getDotNum,
        endWith: endWith,
        // 对象数组转化
        transAryToHash: transAryToHash,
        arrayLikeToArray: arrayLikeToArray,
        transDataToArg: transDataToArg,
        transArgToData: transArgToData
    });
    // ================== 浏览器探测 ===================
    // 如果是要检测的浏览器，则返回浏览器版本，否则会返回false
    var w = window,
        ver = w.opera ? (opera.version().replace(/\d$/, "") - 0) : parseFloat((/(?:IE|fox\/|ome\/|ion\/)(\d+\.\d)/.exec(navigator.userAgent) || [, 0])[1]);
    var ie = !!w.VBArray && Math.max(document.documentMode || 0, ver),
        firefox = !!w.netscape && ver,
        opera = !!w.opera && ver,
        chrome = !!w.chrome && ver,
        safari = /apple/i.test(navigator.vendor) && ver;
    var isIe6 = ie === 6,
        isIe7 = ie === 7,
        isIe8 = ie === 8,
        isIeModern = ie > 8;
    $.extend(sTool, {
        isIe: !!ie,
        isIe6: isIe6,
        isIe7: isIe7,
        isIe8: isIe8,
        ieVersion: ie,// 向后兼容
        ie: ie,
        isIeModern: isIeModern,
        firefox: firefox,
        opera: opera,
        chrome: chrome,
        safari: safari
    });
    if (!$.browser) {
        $.browser = {
            msie: ie,
            opera: opera,
            chrome: chrome,
            firefox: firefox,
            version: ie
        };
    }
    // ========================= 动态加载CSS或JS文件（用于页面加载完成后加载页面底部浏览器支持、所有权等公共子部分）============================
    sTool.loadJSOrCSS = function (url, success, error, charset) {
        var isScriptOnload = !!document.addEventListener,
            rReadyState = /loaded|complete|undefined/,
            head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
        var script, link;
        // CSS模块的处理
        if (~url.indexOf('.css')) {
            link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;

            if (charset) {
                link.charset = charset;
            }

            link.onload = function () {
                link = link.onload = link.onerror = null;
                success && success();
            };
            link.onerror = function () {
                link = link.onload = link.onerror = null;
                error && error();
            };
            head.insertBefore(link, head.firstChild);
            return;
        }

        // JS模块的处理
        script = document.createElement('script');
        script.async = true;

        if (charset) {
            script.charset = charset;
        }

        if (isScriptOnload) {
            script.onerror = function () {
                script.onerror = script.onload = null;
                head.removeChild(script);
                script = null;
                error && error();
            };
        }

        script[ isScriptOnload ? 'onload' : 'onreadystatechange' ] = function () {
            if (isScriptOnload || rReadyState.test(script.readyState)) {
                script[ isScriptOnload ? 'onload' : 'onreadystatechange' ] = null;
                head.removeChild(script);
                script = null;
                // 加载成功
                success && success();
            }
        };

        script.src = url;
        head.insertBefore(script, head.firstChild);
    };
    // ======================== 本地存储 ============================
    var cookieOpe = {
        setItem: function (name, value, days) {
            days = days || 30; //此 cookie 将被默认保存 30 天
            var exp = new Date();
            exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + (exp.toGMTString || exp.toUTCString).call(exp);
        },
        getItem: function (name) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr != null) return unescape(arr[2]);
            return null;
        },
        removeItem: function (name) {//删除cookie
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = cookieOpe.getItem(name);
            if (cval != null) document.cookie = name + "=" + cval + ";expires=" + (exp.toGMTString || exp.toUTCString).call(exp);
        }
    };
    var storage = sTool.storage = ("localStorage" in window) ? localStorage : cookieOpe;
    // ======================== 性能优化工具（图片加载等） ==========================
    /**
     * 图片头数据加载就绪事件 - 更快获取图片尺寸
     * @version    2011.05.27
     * @author    TangBin
     * @see        http://www.planeart.cn/?p=1121
     * @param    {String}    图片路径
     * @param    {Function}    尺寸就绪
     * @param    {Function}    加载完毕 (可选)
     * @param    {Function}    加载错误 (可选)
     * @example imgReady('http://www.google.com.hk/intl/zh-CN/images/logo_cn.png', function () {
			alert('size ready: width=' + this.width + '; height=' + this.height);
		});
     */
    var imgReady = (function () {
        var list = [],
            intervalId = null,

        // 用来执行队列
            tick = function () {
                var i = 0;
                for (; i < list.length; i++) {
                    list[i].end ? list.splice(i--, 1) : list[i]();
                }
                ;
                !list.length && stop();
            },

        // 停止所有定时器队列
            stop = function () {
                clearInterval(intervalId);
                intervalId = null;
            };

        return function (url, ready, load, error) {
            var onready, width, height, newWidth, newHeight, img = new Image();

            img.src = url;

            // 如果图片被缓存，则直接返回缓存数据
            if (img.complete) {
                ready.call(img);
                load && load.call(img);
                return;
            }
            ;

            width = img.width;
            height = img.height;

            // 加载错误后的事件
            img.onerror = function () {
                error && error.call(img);
                onready.end = true;
                img = img.onload = img.onerror = null;
            };

            // 图片尺寸就绪
            onready = function () {
                newWidth = img.width;
                newHeight = img.height;
                if (newWidth !== width || newHeight !== height ||
                    // 如果图片已经在其他地方加载可使用面积检测
                    newWidth * newHeight > 1024) {
                    ready.call(img);
                    onready.end = true;
                }
                ;
            };
            onready();

            // 完全加载完毕的事件
            img.onload = function () {
                // onload在定时器时间差范围内可能比onready快
                // 这里进行检查并保证onready优先执行
                !onready.end && onready();

                load && load.call(img);

                // IE gif动画会循环执行onload，置空onload即可
                img = img.onload = img.onerror = null;
            };

            // 加入队列中定期执行
            if (!onready.end) {
                list.push(onready);
                // 无论何时只允许出现一个定时器，减少浏览器性能损耗
                if (intervalId === null) intervalId = setInterval(tick, 40);
            }
            ;
        };
    })();
    /**
     * 用于加载一张或多张图片，待所有图片完全加载完成后再做事情
     * @version    2013.11.22
     * @author    Wangxiangzhong
     * @param    {Array}    所有图片路径数组
     * @param    {Function}    所有图片加载完毕
     * @param    {Function}    有一张加载错误则执行
     * @example  allImgsReady(["imgsrc0","imgsrc1"],function(){alert("allSuccess");},function(){alert("failed");});
     });
     */
    var allImgsReady = function (imgSrcs, successFunc, errorFunc) {
        imgSrcs instanceof Array || (imgSrcs = [imgSrcs]);
        var imgsNum = imgSrcs.length,
            errorOccured = false;
        each(imgSrcs,
            function (src, key) {
                errorOccured || imgReady(src,
                    function () {
                    },
                    function () {
                        imgsNum--;
                        if (!imgsNum) {
                            successFunc && successFunc(imgSrcs);
                        }
                    },
                    function () {
                        errorOccured = true;
                        errorFunc && errorFunc();
                    });
            });
    };
    $.extend(sTool, {
        imgReady: imgReady,
        allImgsReady: allImgsReady
    });

    function launchFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    // 启动全屏!
    var toFullScreen = function () {
        return launchFullscreen(document.documentElement);
    };
    // 退出全屏模式!
    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    $.extend(sTool, {
        toFullScreen: toFullScreen,
        exitFullscreen: exitFullscreen
    });
    $.extend(sTool, {
        moneyAdd: function ($el, money) {
            var offset = $el.offset(),
                top = offset.top - 20,
                left = offset.left,
                $body = $(document.body),
                $moneyEl;
            if (!($moneyEl = $body.find('div._moneyAdd')).length) {
                $body.append('<div class="_moneyAdd"></div>');
                $moneyEl = $body.find('div._moneyAdd');
            }
            $moneyEl.is(':animated') && $moneyEl.dequeue();
            $moneyEl.delay(30).text(money).css({
                top: top + 'px',
                left: left + 'px'
            }).show().delay(10).animate({
                top: ((top - 5) < 0 ? (top + 5) : (top - 10)) + 'px'
            }, 300, 'swing', function () {
                $moneyEl.show().animate({
                    opacity: 0
                }, 500, 'swing', function () {
                    $moneyEl.hide().css({
                        opacity: 1
                    });
                });
            });
        },
        /**
         * @param: $parabolaEl 运动的元素
         * @param: $target 运动终点元素
         * @param: callback 运动完后的回调
         * */
        funParabola: function ($parabolaEl, $target, callback) {
            require(['tool/parabola'], function (parabola) {
                parabola($parabolaEl[0], $target[0], {
                    speed: 2500,
                    curvature: 0.0004,
                    complete: function () {
                        $parabolaEl.hide();
                        callback && callback();
                    }
                }).mark().init();
            });
        },

        errorBlink: function ($el) {
            $el = $($el);
            var oriBg = $el.css("background") || $el.css("background-color") || 'transparent';
            var Timer = null;
            var i = 0;

            Timer = setInterval(function () {
                i++;
                i == 6 ? clearInterval(Timer) : (i % 2 == 0 ? $el.css({
                    'background-color': '#ffd4d4'
                }) : $el.css({
                    'background': oriBg
                }));
            }, 120);
        },
        drag: function ($dragTitle, $dragElem) {
            $dragTitle = $($dragTitle);
            $dragElem = $($dragElem);
            var dragTitle = $dragTitle[0],
                dragElem = $dragElem[0];
            var move = false,
                moveElemTop, moveElemLeft,
                disTop, disLeft;

            var movex, moveY;
            var moveHandler = function (e) {
                    if (move) {
                        $dragElem.css({
                            top: e.pageY - disTop + "px",
                            left: e.pageX - disLeft + "px"
                        });
                    }
                    return false;
                },
                upHandler = function (e) {
                    move = false;
                    $(document).unbind("mousemove", moveHandler);
                    $(document).unbind("mouseup", upHandler);
                    return false;
                };
            $dragTitle.unbind("mousedown").bind("mousedown", function (e) {
                move = true;
                moveElemTop = dragElem.offsetTop;
                moveElemLeft = dragElem.offsetLeft;
                disTop = e.pageY - moveElemTop;
                disLeft = e.pageX - moveElemLeft;
                $(document).bind("mousemove", moveHandler);
                $(document).bind("mouseup", upHandler);
                return false;
            });

        }
    });

    var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];    // 加权因子
    var ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];            // 身份证验证位值.10代表X
    function IdCardValidate(idCard) {
        idCard = trim(idCard.replace(/ /g, ""));               //去掉字符串头尾空格
        if (idCard.length == 15) {
            return isValidityBrithBy15IdCard(idCard);       //进行15位身份证的验证
        } else if (idCard.length == 18) {
            var a_idCard = idCard.split("");                // 得到身份证数组
            if (isValidityBrithBy18IdCard(idCard) && isTrueValidateCodeBy18IdCard(a_idCard)) {   //进行18位身份证的基本验证和第18位的验证
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * 判断身份证号码为18位时最后的验证位是否正确
     * @param a_idCard 身份证号码数组
     * @return
     */
    function isTrueValidateCodeBy18IdCard(a_idCard) {
        var sum = 0;                             // 声明加权求和变量
        if (a_idCard[17].toLowerCase() == 'x') {
            a_idCard[17] = 10;                    // 将最后位为x的验证码替换为10方便后续操作
        }
        for (var i = 0; i < 17; i++) {
            sum += Wi[i] * a_idCard[i];            // 加权求和
        }
        valCodePosition = sum % 11;                // 得到验证码所位置
        if (a_idCard[17] == ValideCode[valCodePosition]) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 验证18位数身份证号码中的生日是否是有效生日
     * @param idCard 18位书身份证字符串
     * @return
     */
    function isValidityBrithBy18IdCard(idCard18) {
        var year = idCard18.substring(6, 10);
        var month = idCard18.substring(10, 12);
        var day = idCard18.substring(12, 14);
        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
        // 这里用getFullYear()获取年份，避免千年虫问题
        if (temp_date.getFullYear() != parseFloat(year)
            || temp_date.getMonth() != parseFloat(month) - 1
            || temp_date.getDate() != parseFloat(day)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 验证15位数身份证号码中的生日是否是有效生日
     * @param idCard15 15位书身份证字符串
     * @return
     */
    function isValidityBrithBy15IdCard(idCard15) {
        var year = idCard15.substring(6, 8);
        var month = idCard15.substring(8, 10);
        var day = idCard15.substring(10, 12);
        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
        // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
        if (temp_date.getYear() != parseFloat(year)
            || temp_date.getMonth() != parseFloat(month) - 1
            || temp_date.getDate() != parseFloat(day)) {
            return false;
        } else {
            return true;
        }
    }

    // 数据验证
    $.extend(sTool, {
        // 身份证验证
        identityCodeValid: IdCardValidate,
        phoneValid: function (code) {
            return /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/g.test(code);
        },
        // 银行卡号验证
        accountValid: function (code) {
            return /^\d{16,19}$|^\d{6}[- ]\d{10,13}$|^\d{4}[- ]\d{4}[- ]\d{4}[- ]\d{4,7}$/g.test(code);
        },
        numValid: function (code) {
            return /^(\d+\s*)+$/g.test(code);
        }
    });
    //window.sTool = sTool;
    // 扩展给$对象
    $.extend({
        sTool: sTool
    });
    // ############### 给jQuery扩展动画效果 ###################
    // t: current time, b: begInnIng value, c: change In value, d: duration
    /**
     * $(element).slideUp(1000, method, callback});
     * $(element).slideUp({
	 *     duration: 1000,
	 *     easing: method,
	 *     complete: callback
	 * });
     * */
    $.easing['jswing'] = $.easing['swing'];
    $.extend($.easing, {
        def: 'easeOutQuad',
        swing: function (x, t, b, c, d) {
            return $.easing[$.easing.def](x, t, b, c, d);
        },
        easeInQuad: function (x, t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOutQuad: function (x, t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOutQuad: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        easeInCubic: function (x, t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOutCubic: function (x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOutCubic: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        easeInQuart: function (x, t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOutQuart: function (x, t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOutQuart: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        easeInQuint: function (x, t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOutQuint: function (x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOutQuint: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        easeInSine: function (x, t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOutSine: function (x, t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOutSine: function (x, t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        easeInExpo: function (x, t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOutExpo: function (x, t, b, c, d) {
            return (t == d) ? b + c : c * ( -Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOutExpo: function (x, t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * ( -Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function (x, t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOutCirc: function (x, t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOutCirc: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        easeInElastic: function (x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOutElastic: function (x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        },
        easeInOutElastic: function (x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (!p) p = d * (.3 * 1.5);
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        },
        easeInBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        easeInBounce: function (x, t, b, c, d) {
            return c - $.easing.easeOutBounce(x, d - t, 0, c, d) + b;
        },
        easeOutBounce: function (x, t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOutBounce: function (x, t, b, c, d) {
            if (t < d / 2) return $.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
            return $.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    });
    /*
     json2.js
     2013-05-26

     Public Domain.

     NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

     See http://www.JSON.org/js.html


     This code should be minified before deployment.
     See http://javascript.crockford.com/jsmin.html
     */


    // Create a JSON object only if one does not already exist. We create the
    // methods in a closure to avoid creating global variables.
    if (typeof JSON !== 'object') {
        JSON = {};
    }

    (function () {
        'use strict';

        function f(n) {
            // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        }

        if (typeof Date.prototype.toJSON !== 'function') {
            Date.prototype.toJSON = function () {
                return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null;
            };

            String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
                return this.valueOf();
            };
        }

        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap, indent, meta = { // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            },
            rep;

        function quote(string) {

            // If the string contains no control characters, no quote characters, and no
            // backslash characters, then we can safely slap some quotes around it.
            // Otherwise we must also replace the offending characters with safe escape
            // sequences.
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable,
                function (a) {
                    var c = meta[a];
                    return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                }) + '"' : '"' + string + '"';
        }

        function str(key, holder) {

            // Produce a string from holder[key].
            var i, // The loop counter.
                k, // The member key.
                v, // The member value.
                length, mind = gap,
                partial, value = holder[key];

            // If the value has a toJSON method, call it to obtain a replacement value.
            if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

            // If we were called with a replacer function, then call the replacer to
            // obtain a replacement value.
            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }

            // What happens next depends on the value's type.
            switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':

                    // JSON numbers must be finite. Encode non-finite numbers as null.
                    return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':

                    // If the value is a boolean or null, convert it to a string. Note:
                    // typeof null does not produce 'null'. The case is included here in
                    // the remote chance that this gets fixed someday.
                    return String(value);

                // If the type is 'object', we might be dealing with an object or an array or
                // null.
                case 'object':

                    // Due to a specification blunder in ECMAScript, typeof null is 'object',
                    // so watch out for that case.
                    if (!value) {
                        return 'null';
                    }

                    // Make an array to hold the partial results of stringifying this object value.
                    gap += indent;
                    partial = [];

                    // Is the value an array?
                    if (Object.prototype.toString.apply(value) === '[object Array]') {

                        // The value is an array. Stringify every element. Use null as a placeholder
                        // for non-JSON values.
                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }

                        // Join all of the elements together, separated with commas, and wrap them in
                        // brackets.
                        v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }

                    // If the replacer is an array, use it to select the members to be stringified.
                    if (rep && typeof rep === 'object') {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            if (typeof rep[i] === 'string') {
                                k = rep[i];
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    } else {

                        // Otherwise, iterate through all of the keys in the object.
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }

                    // Join all of the member texts together, separated with commas,
                    // and wrap them in braces.
                    v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        }

        // If the JSON object does not yet have a stringify method, give it one.
        if (typeof JSON.stringify !== 'function') {
            JSON.stringify = function (value, replacer, space) {

                // The stringify method takes a value and an optional replacer, and an optional
                // space parameter, and returns a JSON text. The replacer can be a function
                // that can replace values, or an array of strings that will select the keys.
                // A default replacer method can be provided. Use of the space parameter can
                // produce text that is more easily readable.
                var i;
                gap = '';
                indent = '';

                // If the space parameter is a number, make an indent string containing that
                // many spaces.
                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }

                    // If the space parameter is a string, it will be used as the indent string.
                } else if (typeof space === 'string') {
                    indent = space;
                }

                // If there is a replacer, it must be a function or an array.
                // Otherwise, throw an error.
                rep = replacer;
                if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
                    throw new Error('JSON.stringify');
                }

                // Make a fake root object containing our value under the key of ''.
                // Return the result of stringifying the value.
                return str('', {
                    '': value
                });
            };
        }

        // If the JSON object does not yet have a parse method, give it one.
        if (typeof JSON.parse !== 'function') {
            JSON.parse = function (text, reviver) {

                // The parse method takes a text and an optional reviver function, and returns
                // a JavaScript value if the text is a valid JSON text.
                var j;

                function walk(holder, key) {

                    // The walk method is used to recursively walk the resulting structure so
                    // that modifications can be made.
                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }

                // Parsing happens in four stages. In the first stage, we replace certain
                // Unicode characters with escape sequences. JavaScript handles many characters
                // incorrectly, either silently deleting them, or treating them as line endings.
                text = String(text);
                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx,
                        function (a) {
                            return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                        });
                }

                // In the second stage, we run the text against regular expressions that look
                // for non-JSON patterns. We are especially concerned with '()' and 'new'
                // because they can cause invocation, and '=' because it can cause mutation.
                // But just to be safe, we want to reject all unexpected forms.
                // We split the second stage into 4 regexp operations in order to work around
                // crippling inefficiencies in IE's and Safari's regexp engines. First we
                // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
                // replace all simple value tokens with ']' characters. Third, we delete all
                // open brackets that follow a colon or comma or that begin the text. Finally,
                // we look to see that the remaining characters are only whitespace or ']' or
                // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
                if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                    // In the third stage we use the eval function to compile the text into a
                    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                    // in JavaScript: it can begin a block or an object literal. We wrap the text
                    // in parens to eliminate the ambiguity.
                    j = eval('(' + text + ')');

                    // In the optional fourth stage, we recursively walk the new structure, passing
                    // each name/value pair to a reviver function for possible transformation.
                    return typeof reviver === 'function' ? walk({
                            '': j
                        },
                        '') : j;
                }

                // If the text is not JSON parseable, then a SyntaxError is thrown.
                throw new SyntaxError('JSON.parse');
            };
        }
    }());
});