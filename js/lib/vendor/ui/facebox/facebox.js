// QQ表情插件
define([
    "jquery",
    "lib/HBY",
], function($, HBY) {
    $.fn.facebox = function(options) {
        var defaults = {
            key: 'faceBox',
            target: '#content',
            iconPath: 'face/',
            context: null,
            css: null,
            className: 'facebox',
            itemClassPrefix: '',
            tag: []
        };
        var cursorPos, cursorContainer;
        var option = $.extend(defaults, options);
        var theEl = option.context ? option.context.$('#' + option.key) : $('#' + option.key);
        var targetEl = option.context ? option.context.$(option.target) : $(option.target);
        if (!theEl.length) {
            theEl = $('<div id="' + option.key + '" style="display:none;"></div>');
            var htmlStr = '<ul>';
            for (var i = 0; i < option.tag.length; i++) {
                var labFace = option.tag.length ? option.tag[i] : '[' + option.key + i + ']';
                htmlStr += '<li class="' + option.itemClassPrefix + i + '">';
                htmlStr += '<a href="javascript:void(0);" title="' + labFace + '">';
                htmlStr += '<img src="' + option.iconPath + i + '.gif" />';
                htmlStr += '</a></li>';
            }
            htmlStr += '</ul>';
            theEl.html(htmlStr);
            $(this).parent().append(theEl);
            theEl.find('li').off().on('mouseenter click', function(event) {
                switch (event.type) {
                    case 'mouseenter':
                        $(this).css('opacity', 1);
                        break;
                    case 'click':
                        theEl.hide();
                        addComma(targetEl, $(this).find('a').attr('title'), option.iconPath);
                        break;
                }
            }).on('mouseleave', function(e) {
                $(this).css('opacity', 0);
            });
            // 触发更新光标位置
            targetEl.off('click keyup').on('click keyup', onKey);
            if (option.css) theEl.css(option.css);
            if (option.className) theEl.addClass(option.className);
        }
        if (theEl.length) {
            $(this).click(function(event) {
                theEl.toggle();
                event.stopPropagation();
            });

            $(document).click(function() {
                theEl.hide();
            });
        }
        function onKey(event){
            var el = $(event.currentTarget);
            getCursorPos(el);
        }
        //取光标位置
        function getCursorPos(el) {
            var sel, range;
            setTimeout(function() {
                if (window.getSelection) {
                    sel = window.getSelection();
                    range = sel.getRangeAt(0);
                    cursorPos = range.startOffset;
                    cursorContainer = range.startContainer;
                    // console.warn(range.startOffset);
                } else if (document.selection) {
                    sel = document.selection;
                    range = sel.createRange();
                    range.moveStart('character', -1);
                    cursorPos = range.text.length;
                } // Firefox support
                else if (el.selectionStart || el.selectionStart == '0') {
                    cursorPos = el.selectionStart;
                }
            }, 0);
        }
        // 插入内容
        function addComma(selector, text) {
            var sel, range;
            var el = selector[0];
            el.focus();
            if(!selector.html().length) cursorPos = 0;
            // console.warn(selector.html().length, cursorPos);
            text = HBY.ux.util.IM.textToFace(text);
            if (window.getSelection) {
                sel = window.getSelection();
                range = sel.getRangeAt(0);
                range.collapse(false);
                if (cursorPos) {
                    range.collapse(true);
                    range.setStart(cursorContainer, cursorPos);
                    range.setEnd(cursorContainer, cursorPos);
                }
                var node = range.createContextualFragment(text);
                var oLastNode = node.lastChild;
                range.insertNode(node);
                if (oLastNode) {
                    range.setEndAfter(oLastNode);
                    range.setStartAfter(oLastNode);
                }
                cursorPos = range.startOffset;
                cursorContainer = range.startContainer;
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (document.selection) {
                sel = document.selection;
                range = sel.createRange();
                range.collapse(true);
                range.setEnd(el, pos);
                range.setStart(el, pos);
                // range.collapse(false);
                range.pasteHTML(text);
                range.select();
            }
        }
        return theEl;
    };
});
