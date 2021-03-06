/**
 * TextAreaExpander plugin for jQuery
 * v1.0
 * Expands or contracts a textarea height depending on the
 * quatity of content entered by the user in the box.
 *
 * By Craig Buckler, Optimalworks.net
 *
 * As featured on SitePoint.com:
 * http://www.sitepoint.com/blogs/2009/07/29/build-auto-expanding-textarea-1/
 *
 * Please use as you wish at your own risk.
 */

/**
 * Usage:
 *
 * From JavaScript, use:
 *     $(<node>).TextAreaExpander(<minHeight>, <maxHeight>);
 *     where:
 *       <node> is the DOM node selector, e.g. "textarea"
 *       <minHeight> is the minimum textarea height in pixels (optional)
 *       <maxHeight> is the maximum textarea height in pixels (optional)
 *
 * Alternatively, in you HTML:
 *     Assign a class of "expand" to any <textarea> tag.
 *     e.g. <textarea name="textarea1" rows="3" cols="40" class="expand"></textarea>
 *
 *     Or assign a class of "expandMIN-MAX" to set the <textarea> minimum and maximum height.
 *     e.g. <textarea name="textarea1" rows="3" cols="40" class="expand50-200"></textarea>
 *     The textarea will use an appropriate height between 50 and 200 pixels.
 */

define([
    'jquery'
], function($) {
    // jQuery plugin definition
    $.fn.TextAreaExpander = function(minHeight, maxHeight,adjust) {
        var len = arguments.length;
        switch(len){
            case 0:
                break;
            case 1:
                var arg1 = arguments[0];
                if(typeof arg1 === 'function'){
                    adjust = arg1;
                    minHeight = maxHeight = null;
                }
                break;
            case 2:
                var arg2 = arguments[1];
                if(typeof arg2 === 'function'){
                    adjust = arg2;
                    maxHeight = null;
                }
                break;
        }

        var hCheck = !($.browser.msie || $.browser.opera);
        // resize a textarea
        function ResizeTextarea(e) {

            // event or initialize element?
            e = e.target || e;
            var $e = $(e);
            if(!$e.is(':visible')){
                return;
            }
            // find content length and box width
            var vlen = e.value.length,
                ewidth = e.offsetWidth;
            if (vlen != e.valLength || ewidth != e.boxWidth) {

                if (hCheck && (vlen < e.valLength || ewidth != e.boxWidth)){
                    e.style.height = e.expandMin+"px";
                }
                var h = Math.max(e.expandMin, Math.min($e.prop('scrollHeight'), e.expandMax));

                e.style.overflow = (e.scrollHeight > h ? "auto" : "hidden");

                e.style.height = h + "px";

                e.valLength = vlen;
                e.boxWidth = ewidth;
                e.adjust && (typeof e.adjust === 'function') && e.adjust($e);
            }

            return true;
        };

        // initialize
        this.each(function() {

            // is a textarea?
            if (this.nodeName.toLowerCase() != "textarea") return;

            // set height restrictions
            var p = this.className.match(/expand(\d+)\-*(\d+)*/i);
            var $that = $(this),
                height = $that.height()+parseInt($that.css('padding-top'),10)+parseInt($that.css('padding-bottom'),10);

            this.expandMin = this.expandMin||Math.max(minHeight || (p ? parseInt('0' + p[1], 10) : 0), height);
            this.expandMax = this.expandMax||maxHeight || (p ? parseInt('0'+p[2], 10) : 99999);
            this.adjust = adjust;

            // initial resize
            ResizeTextarea(this);
            // zero vertical padding and add events
            if (!this.Initialized) {
                this.Initialized = true;
                $(this).css("padding-top", 0).css("padding-bottom", 0);
                $(this).bind("keyup", ResizeTextarea).bind("focus", ResizeTextarea);
            }
        });

        return this;
    };
});