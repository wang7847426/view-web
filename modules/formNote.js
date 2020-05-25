var jQuery = jQuery.noConflict();
/**
*发帖页面输入框和文本框提示功能和添加文本框功能
**/
define(function(require, exports, module){
  var Editor = require('./editor');
  function FormNote(option){
    this.option = option || {};
    this.formBox = this.option.formBox || jQuery("#postForm");
    this.inputBox = this.option.inputBox || jQuery(".editable");  //获取所有有文字提示的输入框
    this.formTitle = this.option.formTitle || jQuery(".form_input");  //获取帖子标题
    this.noteWord = this.option.noteWord || jQuery(".title_word_count");  //获取剩余文字提示元素
    this.titleMinNum = this.option.titleMinNum || 4;   //标题最小字数
    this.titleMaxNum = this.option.titleMaxNum || 40;  //标题最大字数
    this.textMinNum = this.option.textMinNum || 4;     //文本框最小字数
    this.textMaxNum = this.option.textMaxNum || 1000;   //文本框最大字数
    this.wordStyle = this.option.wordStyle || 'note_word';  //提示文字颜色样式
    this.textCount = this.option.textCount;
    this.addTextBtn = this.option.addTextBtn || jQuery(".edit_addword");
    this.textBoxContainer = this.option.textBoxContainer || jQuery(".edit_add_area");  //文本框容器
    this.textBox = this.option.textBox || jQuery(".edit_add_box");
    this.addPicBox = this.option.addPicBox || jQuery(".upload_pic_box ul");
    this.addPic = this.option.addPic || jQuery(".upload_pic_box").find('li img');
    this.postBtn = this.option.postBtn || jQuery(".post_post");
    this.closeBox = this.option.closeBox;
    this.oneInsert = this.option.oneInsert || jQuery(".insert_key");
    this.that = this.option.that;
    this.init();
  }
  FormNote.prototype = {
    init : function(){
      var _self = this;
      _self.judgeBoxValue();
      _self.judgeInputValue();
      _self.addBoxHandle();
      _self.inputBox.each(function(){
        var editor = new Editor({'editorObj':jQuery(this)});
        var code = jQuery(this).html().replace(/&lt;br\s*\/?&gt;/gi,"\r\n");
        jQuery(this).html(code);
      })
      _self.addPicBox.on('click','li em',function(){
        if(jQuery(this).parent('li').hasClass("act")) return;
        if(jQuery(this).parent('li').hasClass("noImg")) return;
        jQuery(this).parent('li').addClass("act");
        var pic = jQuery(this).find('img');
        var picSrc = pic.attr('src');
        var picAid = pic.attr('aid');
        _self.addTextBox(pic,picSrc,picAid);
        _self.countInsertPic();
      });
      _self.addPicBox.on('click','li a',function(){
        _self.delAlbumPic(jQuery(this));
      });
      _self.textBoxContainer.on('click','.edit_close_box',function(){
        _self.judgeBoxCount(jQuery(this));
      });
      _self.addTextBtn.bind('click',function(){
        _self.addTextBox();
      });
      _self.oneInsert.bind('click',function(){
        _self.oneClickInsert();
      });
      _self.arrange();
      _self.saveData();
      _self.moveChange();
    },
    arrange : function(){
      var _self = this;
      var editBox = jQuery(".edit_add_box");
      editBox.arrangeable({dragSelector: '.edit_move_section'});
    },
    saveData : function(){
      var _self = this;
      jQuery(document).on('mouseup','.edit_move_section',function(){
        setTimeout(function(){
          var draftsName = jQuery("#uid").val();
          var t = _self.addFormString();
          localStorage.setItem(draftsName,t);
        },0);         
      });
    },
    addFormString : function(){
      var form = jQuery("#postForm");
          var formInput = jQuery.trim(jQuery("#formTitle").val());
          var formTextarea = form.find(".editable");
          var req_a = jQuery(".req_sel").find("a");
          var free_a = jQuery(".free_sel").find("a");
          var nav = '';
          var str = '';

          for(var i=0,j=req_a.length;i<j;i++){
              if(req_a.eq(i).hasClass("act")){
                  nav = req_a.eq(i).attr("data-id");
              }
          }

          for(var m=0,n=free_a.length;m<n;m++){
              if(free_a.eq(m).hasClass("act")){
                  nav += '_&_' + free_a.eq(m).attr("data-id");
              }
          }

          if(formInput.length != 0 && formInput != jQuery("#formTitle").attr('data-placeholder')){
              str += 'title@#@' + formInput + '_&_';
          }else{
              str += 'title@#@null' + '_&_';
          }
          str += '0@#@' + jQuery.trim(formTextarea.eq(0).html()) + '_&_';

          for(var i=1;i<formTextarea.length;i++){
              if(formTextarea.eq(i).parents(".edit_add_box").hasClass("hg")){
                  str += i + '@#@' + jQuery.trim(formTextarea.eq(i).html()) + '@#@img=' + formTextarea.eq(i).parents(".edit_add_box").find("img").attr("src") + '@#@aid=' + formTextarea.eq(i).parents(".edit_add_box").find("img").attr("aid") + '_&_';    
              }else{
                  str += i + '@#@' + jQuery.trim(formTextarea.eq(i).html()) + '_&_';    
              }
          }
          str = str.substring(0,str.length-3);

          return nav + "@@##@@" + str;
    },
    //判断标题框剩余字数
    judgeWordNum : function(){
      var _self = this;
      var returnContent = '';
      var formTitle_len = jQuery.trim(_self.formTitle.val()).length;
      if(formTitle_len<_self.titleMinNum){
        _self.noteWord.html('还需要输入<span class="red">'+ (_self.titleMinNum-formTitle_len) + '</span>个字');
      }else if(formTitle_len >= _self.titleMinNum && formTitle_len<=_self.titleMaxNum){
        _self.noteWord.html('还允许输入<span>'+ (_self.titleMaxNum-formTitle_len) + '</span>个字');
      }else if(formTitle_len > _self.titleMaxNum){
        _self.noteWord.html('超出标题长度<span class="red">'+ (formTitle_len-_self.titleMaxNum) + '</span>个字');
      }
      if(jQuery.trim(_self.formTitle.val()) == _self.formTitle.attr("data-placeholder")){returnContent = '';}else{
        returnContent = jQuery.trim(_self.formTitle.val()).substr(0,_self.titleMaxNum);
      }
      return returnContent;
    },
    //标题框文字提示功能
    judgeInputValue : function(){
      var _self = this;
      if(_self.formTitle.val() == ''){
        _self.formTitle.val(_self.formTitle.attr("data-placeholder"));
      }
      _self.formTitle.bind('focus',function(){
        if(jQuery(this).val() == jQuery(this).attr("data-placeholder")){
          jQuery(this).val('');
        }else{
          _self.judgeWordNum();
        }
        jQuery(this).removeClass(_self.wordStyle);
        _self.noteWord.show();
      }).bind('blur',function(){
        if(jQuery(this).val() == ''){
          jQuery(this).val(jQuery(this).attr("data-placeholder"));
          jQuery(this).addClass(_self.wordStyle);
        }
      }).bind('keyup',function(){
        _self.judgeWordNum();
      });
    },
    //所有文本框文字提示功能
    judgeBoxValue : function(){
      var _self = this;
      _self.inputBox.each(function(i){
        if(jQuery(this).html() != '') return;
        jQuery(this).addClass(_self.wordStyle);
        var placeholder = jQuery(this).attr("data-placeholder");
        jQuery(this).html(placeholder);
      }); 
    },
    //为动态添加的文本框定义事件
    addBoxHandle : function(){
      var _self = this;
      var replaceStr=["br",'div'];
      _self.formBox.on('focus','.editable',function(){
        _self.inputBox = jQuery(".editable");
        _self.inputBox.removeAttr("data-flag");
        jQuery(this).attr('data-flag','true');
        if(jQuery(this).html() == jQuery(this).attr("data-placeholder")){
          jQuery(this).html('').removeClass(_self.wordStyle);
        }else{
          jQuery(this).removeClass(_self.wordStyle);
        }
      }).on('blur','.editable',function(){
        if(jQuery(this).html() == ''){
          jQuery(this).html(jQuery(this).attr("data-placeholder"));
          jQuery(this).addClass(_self.wordStyle);
          jQuery(this).siblings('textarea').val('');
        }else{
          var tea = jQuery(this).siblings('textarea');
          var teaVal = jQuery.trim(tea.val());
          teaVal = teaVal.replace(/{:\S+?(?=:):}/g,"1");
          teaVal = teaVal.replace(/\[url\=\S+?(?=])](\S+)\[\/url\]/g,"$1");
          _self.textCount = teaVal.length;
          if(_self.textCount < 4 && _self.textCount > 0){
            _self.addNumNote(jQuery(this),'正文不足4个字');
          }
          if(_self.textCount >1000){
            if(this.id != 'formText'){
              _self.addNumNote(jQuery(this),'正文不能超过1000个字');
            } 
          }
          var thisHtml = jQuery(this).html().replace(/(<img src=\S+\s+alt=\")({\S+})\">/g,"$2");
            thisHtml = thisHtml.replace(/<a\s\S+="(\S+)">(\S+)<\/a>/g,"[url=$1]$2[/url]");
            if (/firefox/.test(navigator.userAgent.toLowerCase())) {
                    thisHtml = thisHtml.replace(/_moz_dirty=""/gi, "").replace(/\[/g, "[[-").replace(/\]/g, "-]]").replace(/<\/ ?tr[^>]*>/gi, "[br]").replace(/<\/ ?td[^>]*>/gi, "").replace(/<(ul|dl|ol)[^>]*>/gi, "[br]").replace(/<(li|dd)[^>]*>/gi, "[br]").replace(/<p [^>]*>/gi, "[br]").replace(new RegExp("<(/?(?:" + replaceStr.join("|") + ")[^>]*)>", "gi"), "[$1]").replace(new RegExp('<span([^>]*class="?at"?[^>]*)>', "gi"), "[span$1]").replace(/<[^>]*>/g, "").replace(/\[\[\-/g, "[").replace(/\-\]\]/g, "]").replace(new RegExp("\\[(/?(?:" + replaceStr.join("|") + "|img|span)[^\\]]*)\\]", "gi"), "<$1>").replace(/<\/div>/gi, "").replace(/<div>/gi, "\r\n").replace(/<br>|<br \/>/g,'\r\n');         
                }else{
                    thisHtml = thisHtml.replace(/_moz_dirty=""/gi, "").replace(/\[/g, "[[-").replace(/\]/g, "-]]").replace(/<\/ ?tr[^>]*>/gi, "[br]").replace(/<\/ ?td[^>]*>/gi, "").replace(/<(ul|dl|ol)[^>]*>/gi, "[br]").replace(/<(li|dd)[^>]*>/gi, "[br]").replace(/<p [^>]*>/gi, "[br]").replace(new RegExp("<(/?(?:" + replaceStr.join("|") + ")[^>]*)>", "gi"), "[$1]").replace(new RegExp('<span([^>]*class="?at"?[^>]*)>', "gi"), "[span$1]").replace(/<[^>]*>/g, "").replace(/\[\[\-/g, "[").replace(/\-\]\]/g, "]").replace(new RegExp("\\[(/?(?:" + replaceStr.join("|") + "|img|span)[^\\]]*)\\]", "gi"), "<$1>").replace(/<\/div>/gi, "").replace(/<div>/gi, "\r\n").replace(/<\s*br\s*\/?>/g,'');
                }
            thisHtml = thisHtml.replace(/&nbsp;/g,' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, "''").replace(/&#039;/g, "'");
            thisHtml = thisHtml.replace(/<br>|<br \/>/g,'\r\n');
            tea.val(thisHtml);
        }
      });
    },
    //文字不足4个字或超出200字或保存草稿箱提示
    addNumNote : function(str,con){
      var _self = this;
      str.parents(".eox").append('<div id="edit_note">'+ con +'</div>');
      var note = jQuery("#edit_note");
      note.fadeIn();
      var t = setTimeout(function(){
        note.fadeOut(500,function(){
          jQuery('#edit_note').remove();
        });     
      },1500);
      note.bind('mouseover',function(){
        clearTimeout(t);
        jQuery(this).hide();
      });
    },
    //添加纯文本框或带图片的文本框
    addTextBox : function(pic,src,aid){
      var _self = this;
      var _html = '';
      if(src){
        var width = pic.width(),
          height = pic.height(),
          regular = 160/118;
        var w_h = width/height;
        if(w_h >= regular){
          width = '100%';height="auto";
        }else{
          height = '100%';width="auto";
        }
        _html = '<div class="edit_add_box eox hg"><div class="edit_move_section"><span><i class="icon_drag"></i></span></div><div class="edit_addtext clearfix"><div class="left edit_addpic_area"><img src="'+ src +'" alt="" aid="'+ aid +'" width="'+ width +'" height="'+ height +'"></div><div class="right edit_addtext_area"><div contenteditable="true" class="editable ele_1" data-placeholder="可添加1000字以内的描述" data-aid="'+ aid +'"></div><textarea name="attachnew['+ aid +'][description]" data-aid="'+ aid +'" class="edit_textarea"></textarea>  </div></div><a href="javascript:;" class="edit_close_box"></a></div>';
      }else{
        _html = '<div class="edit_add_box eox"><div class="edit_move_section"><span><i class="icon_drag"></i></span></div><div class="edit_addtext clearfix"><div class="edit_addtext_area"><div contenteditable="true" class="editable ele_2" data-placeholder="正文不少于4个字"></div><textarea name="" class="edit_textarea"></textarea></div></div><a href="javascript:;" class="edit_close_box"></a></div>';
      }
      _self.textBoxContainer.append(_html);
      _self.inputBox = jQuery(".editable");
      _self.judgeBoxValue();
      _self.arrange();
      var editor = new Editor({'editorObj':_self.inputBox.last()});
      
      _self.textBox = jQuery(".edit_add_box");
      _self.moveChange();
    },
    //点击图片右上角的叉删除带图片的文本框
    delAlbumPic : function(img){
      var _self = this;
      var parentObj = jQuery(img).parent('li');
        var siblingsImg = jQuery(img).siblings("em").find('img');
        var picAid = siblingsImg.attr('aid');
        var t;

      if(parentObj.hasClass("act")){
        var addBox = _self.textBoxContainer.find(".edit_add_box");
        addBox.each(function(){
          if(jQuery(this).hasClass("hg")){
            var imgAid = jQuery(this).find("img").attr('aid');
            if(imgAid == picAid){
              var close = jQuery(this).find(".edit_close_box");
              t = _self.judgeBoxCount(close);
            };
          }
        });
        if(!t) return false;
        parentObj.removeClass("act");
        jQuery(".contiune_note span").html(parseInt(jQuery(".contiune_note span").html()) - 1);
        _self.arrange();
      }else{
        _self.addWarn('是否确认删除图片？');
        var sure = jQuery(".warn_sure");
        var cancel = jQuery(".warn_cancel,.close_warn_box");
        sure.on('click',function(){
          jQuery(this).parents(".warn").remove();
          parentObj.remove();         
          return true;
        });
        cancel.on('click',function(){
          jQuery(this).parents(".warn").remove();
          return false;
        });
      }                   
    },
    delSmallPicAct : function(aid){
      var _self = this;
      var picLi = jQuery(".upload_pic_box").find('li');
      picLi.each(function(){
        var liImgAid = jQuery(this).find('img').attr('aid');
        if(liImgAid == aid){
          jQuery(this).removeClass("act");
        }
      });
    },
    clickCloseBox : function(close){
      var _self = this;
      var index = close.parent(".edit_add_box").index() + 2;
      if(close.parent(".edit_add_box").hasClass("hg")){
        var parentAid = close.parent(".edit_add_box").find("img").attr("aid");
        _self.delSmallPicAct(parentAid);
        _self.handleData(index);
        close.parent(".edit_add_box").remove();
      }else{
        _self.handleData(index);
        close.parent(".edit_add_box").remove();
      }
      _self.arrange();
    },
    handleData : function(index){
      var draftsName = jQuery("#uid").val();
      var navInfo = localStorage.getItem(draftsName).split("@@##@@")[0];
      var loadInfo = localStorage.getItem(draftsName).split("@@##@@")[1];
      loadInfo = loadInfo.split("_&_");
      loadInfo.splice(index,1);
      loadInfo = loadInfo.join("_&_");
      var newInfo = navInfo + '@@##@@' + loadInfo;
      localStorage.setItem(draftsName,newInfo);
    },
    //一键插入功能
    oneClickInsert : function(){
      var _self = this;
      var _li = jQuery(".upload_pic_box").find('li');
      _li.each(function(){
        if(jQuery(this).hasClass("act")) return;
        if(jQuery(this).hasClass("noImg")) return;
        jQuery(this).addClass("act");
        var pic = jQuery(this).find("img");
        var picSrc = pic.attr('src');
        var picAid = pic.attr('aid');
        _self.addTextBox(pic,picSrc,picAid);
        _self.countInsertPic();
      });
    },
    //计算已插入的小图片的数量
    countInsertPic: function(){
      var smallPicLength = jQuery(".upload_pic_box ul li.act").length;
      jQuery(".contiune_note span").html(smallPicLength);
    },
    //判断文本框有没有文字
    judgeBoxCount : function(close){
      var _self = this;
      var text = close.parents(".edit_add_box").find(".edit_textarea").val();
      var edit = close.parents(".edit_add_box").find(".editable").attr("data-placeholder");
      if(text.length > 0 && text != edit){
        _self.addWarn('删除后内容将不能恢复，是否确认删除？');
        var sure = jQuery(".warn_sure");
        var cancel = jQuery(".warn_cancel,.close_warn_box");
        sure.on('click',function(){
          jQuery(this).parents(".warn").remove();
          _self.clickCloseBox(close);
          return true;
        });
        cancel.on('click',function(){
          jQuery(this).parents(".warn").remove();
          return false;
        });
      }else if(text == edit || text.length == 0){
        _self.clickCloseBox(close);
        return true;
      }
    },
    //添加动态提示
    addWarn : function(txt){
      var box = '<div class="warn"><i class="warn_bg"></i><div class="warn_box"><div class="warn_title_box"><div class="warn_title left">提示信息</div><a href="javascript:;" class="close_warn_box right"></a></div><div class="warn_info">'+ txt +'</div><div class="warn_handle_box"><a href="javascript:;" class="warn_sure">确认</a><a href="javascript:;" class="warn_cancel">取消</a></div></div></div>';
      jQuery("body").append(box);
    },
    moveChange : function(){
      var _self = this;
      var span = _self.textBox.find(".edit_move_section");
      span.on('mouseenter',function(){
        jQuery(this).find("span").html('上下拖拽修改排序');
      });
      span.on('mouseleave',function(){
        jQuery(this).find("span").html('<i class="icon_drag"></i>');
      });
    }
  }
  module.exports = FormNote;
})