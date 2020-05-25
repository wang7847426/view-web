var jQuery = jQuery.noConflict();
/**
*发帖页面编辑器|焦点定位，插入表情，插入链接，粘贴过滤html标签
**/
define(function(require, exports, module) {
    function Editor(option) {
        var self = this;
        this.option = option || {};
        this.editorObj = this.option.editorObj;
        this.replaceStr = ["div", "p", "br"];
        this.writing = true;
        this.range = null;
        this.init();
    }
    Editor.prototype = {
        init: function() {
            this.bindEvent();

        },
        bindEvent: function() {
            var self = this;
            self.getFocus();
            //绑定ctrl+v粘贴事件
            if (self.editorObj[0].addEventListener) {
                self.editorObj[0].addEventListener("paste", function() {
                    self.pasteHandler.call(self)
                }, false);
            } else {
                self.editorObj[0].attachEvent("onpaste", function() {
                    self.pasteHandler.call(self)
                });
            }
            //焦点定位
            this.saveRange();
            self.editorObj.bind({
                keyup: function() {
                    self.saveRange.call(self)
                },
                mouseup: function() {
                    self.saveRange.call(self)
                },
                change: function() {
                    self.saveRange.call(self)
                }
            });
            //绑定插入表情
            this.clickFace();
            //绑定插入链接url
            this.clickUrl();
        },
        getFocus: function() {
            this.editorObj.focus();
        },
        //点击表情
        clickFace: function() {
            var self = this;
            jQuery('.js_face').find('a').live("click", function() {
                if (self.editorObj.attr('data-flag') == 'true') {
                    self.insertFace.call(self, jQuery(this));
                }
            });
        },
        //插入表情
        insertFace: function(_this) {
            var self = this;
            var strFace = _this.attr("data-value");
            var strSrc = _this.find("img").attr("src");
            var strTitle = _this.attr('title');
            var newStr;
            jQuery('#popFace').addClass('fn-hide');
            newStr = '<img src="' + strSrc + '" alt="' + strFace + '">';
            self.insertHtml(newStr)
        },
        //点击插入链接
        clickUrl: function() {
            var self = this;
            var self = this;
            var btn = jQuery(".url_btn");
            var doneTxt = null;
            btn.live('click', function(e) {
                e.preventDefault();
                if (self.editorObj.attr('data-flag') == 'true') {
                    self.handleLinkHtml.call(self);
                }
            })
        },
        //插入链接
        handleLinkHtml: function() {
            var self = this;
            var linkAdd = jQuery("#url_input_1").val();
            var linkTxt = jQuery("#url_input_2").val();
            if (linkAdd.length > 0 && linkTxt.length == 0) {
                doneTxt = '<a href="' + linkAdd + '">' + linkAdd + '</a>';
            } else if (linkAdd.length > 0 && linkTxt.length > 0) {
                doneTxt = '<a href="' + linkAdd + '">' + linkTxt + '</a>';
            } else if (linkAdd.length == 0) {
                jQuery(".url_menu").remove();
                jQuery(".edit_box").removeClass("hasLink");
                return;
            }
            self.insertHtml(doneTxt)
            jQuery(".url_menu").remove();
            jQuery(".edit_box").removeClass("hasLink");
        },
        saveRange: function() {
            var self = this;
            var selection = window.getSelection ? window.getSelection() : document.selection;
            var range = selection.createRange ? selection.createRange() : selection.getRangeAt(0);
            self.range = range;
        },
        insertHtml: function(str) {
            var self = this;
            //强制IE9兼容
            if ((typeof Range !== "undefined") && !Range.prototype.createContextualFragment) {
                Range.prototype.createContextualFragment = function(html) {
                    var frag = document.createDocumentFragment()
                      , div = document.createElement("div");
                    frag.appendChild(div);
                    div.outerHTML = html;
                    return frag;
                }
                ;
            }
            var range = self.range;
            if (!window.getSelection) {
                self.editorObj.focus();
                var range = self.range;
                range.pasteHTML(str);
                range.collapse(false);
                range.select();
            } else {
                self.editorObj.focus();
                var selection = window.getSelection ? window.getSelection() : document.selection;
                var range = self.range;
                range.collapse(false);
                var hasR = range.createContextualFragment(str);
                var hasR_lastChild = hasR.lastChild;
                while (hasR_lastChild && hasR_lastChild.nodeName.toLowerCase() == "br" && hasR_lastChild.previousSibling && hasR_lastChild.previousSibling.nodeName.toLowerCase() == "br") {
                    var e = hasR_lastChild;
                    hasR_lastChild = hasR_lastChild.previousSibling;
                    hasR.removeChild(e)
                }
                range.insertNode(hasR);
                if (hasR_lastChild) {
                    range.setEndAfter(hasR_lastChild);
                    range.setStartAfter(hasR_lastChild);
                }
                selection.removeAllRanges();
                selection.addRange(range);
            }
        },
        pasteHandler: function() {
            var self = this;
            //粘贴开始执行-把原来数据分隔两份
            self.insertHtml("###-XBIAO-@@@");
            var arr = new Array();
            //定义一数组 
            var content = self.editorObj[0].innerHTML;
            arr = content.split("###-XBIAO-@@@");
            //字符分割
            //清空输入框
            self.editorObj[0].innerHTML = '';
            //粘贴完执行
            setTimeout(function() {
                //获取粘贴数据过滤，拼接原来的数据
                var content = self.editorObj[0].innerHTML;
                content = self.replaceHtml(content);
                var reg = /.*<br><\/div>$/g;
                if (reg.test(arr[0])) {
                    arr[0] = arr[0].replace(/(.*)(<br><\/div>)$/g, '$1');
                    arr[1] = '<br></div>' + arr[1];
                }
                content = arr[0] + content + arr[1];
                //存放到输入框
                self.editorObj[0].innerHTML = '';
                self.insertHtml(content);
            }, 1);
        },
        replaceHtml: function(content) {
            var self = this;
            content = content.replace(/_moz_dirty=""/gi, "").replace(/\[/g, "[[-").replace(/\]/g, "-]]").replace(/<\/ ?tr[^>]*>/gi, "[br]").replace(/<\/ ?td[^>]*>/gi, "&nbsp;&nbsp;").replace(/<(ul|dl|ol)[^>]*>/gi, "[br]").replace(/<(li|dd)[^>]*>/gi, "[br]").replace(/<p [^>]*>/gi, "[br]").replace(new RegExp("<(/?(?:" + self.replaceStr.join("|") + ")[^>]*)>","gi"), "[$1]").replace(new RegExp('<span([^>]*class="?at"?[^>]*)>',"gi"), "[span$1]").replace(/<[^>]*>/g, "").replace(/\[\[\-/g, "[").replace(/\-\]\]/g, "]").replace(new RegExp("\\[(/?(?:" + self.replaceStr.join("|") + "|img|span)[^\\]]*)\\]","gi"), "<$1>");
            if (!/firefox/.test(navigator.userAgent.toLowerCase())) {
                content = content.replace(/\r?\n/gi, "<br>");
            }
            return content;
        }
    }
    module.exports = Editor;
})
