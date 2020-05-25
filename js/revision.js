var jQuery = jQuery.noConflict();
jQuery(function(){
//标题输入框文字提示功能和文本框文字提示功能
seajs.use('modules/formNote',function(FormNote){
    var formNote = new FormNote();
});
//轮询模块
seajs.use('modules/polling',function(Polling){
    var polling = new Polling();
});
//点击空白表情框和超链接框消失
document.onclick = function(e){
    e = e || event;
    var target = e.target || e.srcElement;
    
    var faceBox = jQuery("#popFace").get(0);
    var faceBtn = jQuery(".edit_addface").get(0);
    var linkBox = jQuery(".url_menu").get(0);
    var linkBtn = jQuery(".edit_addlink").get(0);
    var faceFlag = true;
    var linkFlag = true;
    var tanFlag = true;

    if(jQuery(target).closest('#popFace').length && target.parentNode.tagName.toLowerCase() != 'a' && !jQuery(target).parent("div").hasClass("pop-content-bottom")){
        faceFlag = false;
    }
    if(jQuery(target).closest('.url_menu').length){
        linkFlag = false;
    }
    if(target !== faceBox && target !== faceBtn && faceFlag){
        jQuery("#popFace").addClass('fn-hide');
    }else{
        jQuery("#popFace").removeClass('fn-hide');
    }
    if(target !== linkBox && target !== linkBtn && linkFlag){
        jQuery(".url_menu").remove();
        jQuery(".edit_box").removeClass("hasLink");
    }
}
jQuery(".drafts_bg").click(function(){
    jQuery(".drafts").hide();
});
jQuery("body").on('click','.warn_bg',function(){
    jQuery(this).parent('.warn').remove();
});
//分类选择功能
var req = jQuery(".req_sel");
var free = jQuery(".free_sel");
var req_btn = req.find("a");
var free_btn = free.find("a");
var watchClassify = jQuery("#watchClassify");
var watchModel = jQuery("#watchModel");
watchClassify.val(req.find("a.act").attr('data-id'));
watchModel.val(free.find("a.act").attr('data-id'));

req_btn.bind('click',function(){
    if(jQuery(this).hasClass("act"))return;
    jQuery(this).addClass("act").siblings().removeClass("act");
    watchClassify.val(jQuery(this).attr("data-id"));
});

free_btn.bind('click',function(){
    if(jQuery(this).hasClass("act")){
        jQuery(this).removeClass("act");
        watchModel.val('');
    }else{
        jQuery(this).addClass("act").siblings().removeClass("act");
        watchModel.val(jQuery(this).attr("data-id"));
    }
});
//先遍历小图片，查看有多少张
var smallPicLength = jQuery(".upload_pic_box ul li.act").length;
jQuery(".contiune_note span").html(smallPicLength);
//计算上传小图片尺寸
function preload(file,src,aid,title){ 
    var img=new Image();
    img.src=src;
    img.setAttribute('aid',aid);
    img.setAttribute('title',title);
    img.onload=function(){  
        var w = img.width;
        var h = img.height;
        var regular = 78/58;
        var w_h = w/h;
        if(w_h-regular>=0){
            img.style.width='100%';
            img.style.height='auto';
        }else{
            img.style.width='auto';
            img.style.height='100%';
        }
        jQuery( '#'+file.id+" img").replaceWith(img);
        jQuery('#'+file.id+' em').click();
    };  
}

//上传文件功能
var fid=jQuery("#fid").val();
var uid=jQuery("#uid").val();
var hash=jQuery("#hash").val();

var uploader = WebUploader.create({
    auto: true,
    swf: XBIAO_ROOT +'/js/pc/Uploader.swf',
    server: BBS_ROOT+'/misc.php?mod=swfupload&action=swfupload&operation=upload&simple=2&image=1&fid=' + fid,
    formData:{'uid':uid,'hash':hash,'Upload':''},
    pick: '#upload_btn',
    accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
    },
    fileVal:'Filedata'    
});

uploader.on( 'fileQueued', function( file ) {
    if(!jQuery(".upload_pic_area").hasClass('act')){
        jQuery(".upload_commend").hide();
        jQuery(".upload_pic_area").show().addClass("act");
        jQuery(".upload_pic_box").show();
        jQuery(".contiune_handle").show();
    } 
    var $li = '<li id="'+ file.id +'"><em><img src="'+XBIAO_ROOT+'/images/wap3.0/article/loading.gif"></em><i>已插入</i><a href="javascript:;"></a></li>';
    jQuery('.upload_pic_box ul').prepend($li);

    var $img = jQuery('#'+file.id+' img');
    var thumbnailWidth = 78 ,thumbnailHeight = 58;
    uploader.makeThumb( file, function( error, src ) {
        if ( error ) {
            $img.replaceWith('<span>不能预览</span>');
            jQuery("#"+file.id).addClass("noImg");
            return;
        }
        $img.attr( 'src', src );
    }, thumbnailWidth, thumbnailHeight );
});
// 文件上传过程中创建进度条实时显示。
uploader.on( 'uploadProgress', function(file, percentage ) {
    jQuery('.upload_progress').show();
    jQuery('.upload_bar i').css({'width': percentage * 100 + '%'}); 
});
jQuery(document).on('click','.cancel_upload',function(){
    uploader.stop(true);
});

uploader.on('uploadSuccess', function(file,responseText) {

    var dataarr = responseText._raw.split('|');

    if(dataarr[0] == 'DISCUZUPLOAD' && dataarr[2] == 0) {
        var pic = BBS_ROOT + "/data/layoutPic/forum/" + dataarr[5];
        var aid = dataarr[3];
        var title = dataarr[6];
        preload(file,pic,aid,title);
    }
    else {
        jQuery( '#'+file.id+" em").html(dataarr[7]);
    }
});

uploader.on( 'uploadComplete', function( file ) {
    var num = jQuery(".upload_pic_box ul li.act").length;
    jQuery(".contiune_note span").html(num);
    if(num >1000){alert(每天上传图总数不超过1000张);return;}
    jQuery(".upload_progress").hide();
    jQuery('.upload_bar i').css({'width': 0});  
});

//另外两个按钮也触发上传文件事件
jQuery(".edit_addpic,.contiune_upload").bind('click',function(){
    jQuery(".webuploader-element-invisible").click();
});

//草稿箱显隐
jQuery(".edit_draft").bind('click',function(){
    jQuery(".drafts").show();
});

jQuery(".close_drafts_box,.close_dbox").bind('click',function(){
    jQuery(".drafts").hide();
});

//隐藏表情层
jQuery(".pop-content-bottom").bind('click',function(){
    jQuery('#popFace').addClass('fn-hide');
});

//显示表情层
jQuery(".edit_addface").bind('click',function(){
    jQuery('#popFace').removeClass("fn-hide");
});
//创建链接框
jQuery(".edit_addlink").bind('click',function(){
    if(jQuery(".edit_box").hasClass("hasLink")) return;
    var linkHtml = '<div class="url_menu"><div class="url_menu_box"><a href="javascript:;" class="url_close"></a><div><p>请输入链接地址：</p><input type="text" id="url_input_1"><p>请输入链接文字：</p><input type="text" id="url_input_2"></div><div class="url_btn_box"><button class="url_btn"><span>提交</span></button></div></div></div>';
    jQuery(".edit_box").append(linkHtml).addClass("hasLink");
});
//删除链接框
jQuery(".url_close").live('click',function(){
    jQuery(".url_menu").remove();
    jQuery(".edit_box").removeClass("hasLink");
})


//组合message内容
function setContent(){
    var html='';
    jQuery(".edit_textarea").each(function(){
        var aid=jQuery(this).attr("data-aid");
        var content=jQuery(this).val();
        if(aid>0){
            if(jQuery(this).val()=='可添加1000字以内的描述'){
                jQuery(this).val('')
            }
            html+="[attachimg]"+aid+"[/attachimg]";
        }else{
            html+=content;
        }
        html += '\r\n';
    });
    jQuery("#message").val(html);
    return jQuery("#message").val();
}

//提交表单
jQuery("#formSubmit").bind('click',function(){
    jQuery("#formSubmit_b").trigger('click');
})
jQuery("#formSubmit_b").bind('click',function(e){
    e.preventDefault();
    setContent();
    if(proRequest()){
        jQuery("#submit_bt").click();
    }
});

function proRequest(){
    var formTitle = jQuery("#formTitle");
    var formText = jQuery("#formText");
    var title = jQuery.trim(formTitle.val());
    var text = jQuery.trim(formText.html());
    var hideText = formText.siblings('textarea').val();
    var cassVal = jQuery("#watchClassify").val();

    if(cassVal.length == 0){
        addWarn('请选择主题分类');
        return false;
    }
    if(title.length<4 || title == formTitle.attr('data-placeholder')){
        addWarn('标题不能少于4个字',formTitle);
        return false;
    }else if(title.length >40){
        addWarn('标题不能大于40个字',formTitle);
        return false;
    }
    if(hideText.length<4 || text == formText.attr('data-placeholder')){
        addWarn('正文不能少于4个字',formText);
        return false;
    }
    return true;
}


//草稿本地保存
    if (!('localStorage' in window)) {
 
       window.localStorage = (function() {
           var documentElement, isIE = !!document.all;
     
           if (isIE) {
               documentElement = document.documentElement;
               documentElement.addBehavior('#default#userdata');
           }
     
           return {
               setItem: function(key, value) {
                   if (isIE) {
                       documentElement.setAttribute('value', value);
                       documentElement.save(key);
                   }
                   else {
                       window.globalStorage[location.hostname][key] = value;
                   }
               },
               getItem: function(key) {
                   if (isIE) {
                       documentElement.load(key);
                       return documentElement.getAttribute('value');
                   }
     
                   return window.globalStorage[location.hostname][key];
               },
               removeItem: function(key) {
                   if (isIE) {
                       documentElement.removeAttribute('value');
                       documentElement.save(key);
                   }
                   else {
                       window.globalStorage[location.hostname].removeItem(key);
                   }
               }
           };
       })();
     
    }
    var draftsName = jQuery("#uid").val();
    //保存草稿
    function saveUserData(){
        var saveDrafts = addFormString();
        localStorage.setItem(draftsName,saveDrafts);
        addNumNote(jQuery("#formText"),'每30秒系统自动保存');
    }

    //读取草稿
    function loadUserData(){
        var form = jQuery("#postForm");
        var formInput = jQuery("#formTitle");
        var formTextarea = form.find(".editable");
        var navInfo = localStorage.getItem(draftsName).split("@@##@@")[0];
        var loadInfo = localStorage.getItem(draftsName).split("@@##@@")[1];
        var req_a = jQuery(".req_sel").find("a");
        var free_a = jQuery(".free_sel").find("a");
        var fenge = '_&_';
        var firstSel,secondSel;

        if(navInfo.indexOf(fenge) == -1){
            firstSel = navInfo;
        }else{
            firstSel = navInfo.split('_&_')[0];
            secondSel = navInfo.split('_&_')[1];
        }

        req_a.each(function(i){
            if(jQuery(this).attr("data-id") == firstSel){
                jQuery(this).addClass("act").siblings().removeClass("act");
            }else{
                jQuery(this).removeClass("act");
            }
        });

        free_a.each(function(i){
            if(jQuery(this).attr("data-id") == secondSel){
                jQuery(this).addClass("act").siblings().removeClass("act");
            }else{
                jQuery(this).removeClass("act");
            }
        });

        if(!loadInfo){emptyForm();return false;}
        var arr = loadInfo.split('_&_');
        var str = [];
        for(var i=0;i<arr.length;i++){
            str.push(arr[i].split('@#@')[1]);
        }
        if(str[0] == 'null'){
            formInput.val('').blur();
        }else{
            formInput.val(str[0]);
        }
        if(arr.length > 2 ){
            var reslen = arr.length - 2 - jQuery(".edit_add_box").length;
            if(reslen > 0){
                addEditBox(arr, reslen);
            }
        }
        for(var n=0;n<str.length;n++){
            formTextarea.eq(n).html(str[n+1]);
            transformInHidden();
        }
    }

    //添加文本框
    function addEditBox(arr, reslen){
        var img,text,aid;
        for(var j=arr.length-reslen;j<arr.length;j++){
            if(arr[j].indexOf('@#@img=') > -1){
                img = arr[j].split("@#@img=")[1].split("@#@aid=")[0];
                text = arr[j].split("@#@")[1];
                aid = arr[j].split("@#@aid=")[1];
                createEditBox(true, img, text, aid);
            }else{
                text = arr[j].split("@#@")[1];
                createEditBox(false, img, text);
            }                
        }
    }

    //创建文本框
    function createEditBox(bol, img, text, aid){
        var _html = '';
        if(bol){
            _html += '<div class="edit_add_box hg"><div class="edit_move_section"><span><i class="icon_drag"></i></span></div><div class="edit_addtext clearfix"><div class="left edit_addpic_area"><img src="'+ img +'" alt="" aid="'+ aid +'"></div><div class="right edit_addtext_area"><p contenteditable="true" class="editable ele_1" data-placeholder="可添加200字以内的描述">'+ text +'</p><textarea name="" class="edit_textarea"></textarea></div></div><a href="javascript:;" class="edit_close_box"></a></div>'
        }else{
            _html += '<div class="edit_add_box"><div class="edit_move_section"><span><i class="icon_drag"></i></span></div><div class="edit_addtext clearfix"><div class="edit_addtext_area"><p contenteditable="true" class="editable ele_2" data-placeholder="正文不少于4个字">'+ text +'</p><textarea name="" class="edit_textarea"></textarea></div></div><a href="javascript:;" class="edit_close_box"></a></div>';
        }
        jQuery(".edit_add_area").append(_html);
        if(aid){
            jQuery(".upload_pic_box li").each(function(){
                var imgAid = jQuery(this).find("img").attr("aid");
                if(imgAid == aid){
                    jQuery(this).addClass("act");
                }
            });
        }
        var lastBox = jQuery(".edit_add_box:last");
        var pic = lastBox.find(".edit_addpic_area img");
        var width = pic.width(),
            height = pic.height(),
            regular = 160/118;
        var w_h = width/height;
        if(w_h >= regular){
            pic.css({'width': '100%','height': 'auto'});
        }else{
            pic.css({'width': 'auto','height': '100%'});
        }
        // seajs.use('modules/editor',function(Editor){
        //     var inputBox = lastBox.find(".editable");
        //     var editor = new Editor({'editorObj': inputBox});
        // });
        lastBox.find(".editable").addClass("note_word").blur();
        var editBox = jQuery(".edit_add_box");
        editBox.arrangeable({dragSelector: '.edit_move_section'});
    }

    //删除草稿
    function delUserData(){
        localStorage.removeItem(draftsName);
    }
    //编辑器主动转换方法
    transformInHidden();
    function transformInHidden(){
        var editContent = jQuery(".editable");
        for(var i=0;i<editContent.length;i++){
            var editHtml = editContent.eq(i).html();
            var delHtml = editHtml.replace(/&nbsp;/g," ").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, "''").replace(/&#039;/g, "'");
            editContent.eq(i).html(delHtml);
            editHtml = editHtml.replace(/(<img src=\S+\s+alt=\")({\S+})\">/g,"$2");
            editHtml = editHtml.replace(/<a\s\S+="(\S+)">(\S+)<\/a>/g,"[url=$1]$2[/url]");
            editContent.eq(i).siblings("textarea").val(editHtml);
        }
    }
    //提示
    function addNumNote(str,con){
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
    }
    //上传保存
    function autoSaveForm(){
        setContent();
        if(proRequest()){
            changeWord();
            jQuery("#postsave").val(1);
            jQuery("#submit_bt").click();
        }
    }

    function changeWord(){
        jQuery(".edit_save").addClass('gray').html('<i class="edit_kind_icon i_save"></i>保存中...');
    }

    function returnWord(){
        jQuery(".edit_save").removeClass('gray').html('<i class="edit_kind_icon i_save"></i>保存');
        addNumNote(jQuery("#formText"),'保存成功');
    }
    //点击保存
    jQuery(".edit_save").bind('click',function(){
        autoSaveForm();
    }); 
    //30秒自动保存
    setInterval(saveUserData,30000);

    jQuery(".recovery").bind('click',function(){
        addConfirmBox('此操作将覆盖当前帖子内容，确定要恢复数据吗？');
        var sure = jQuery(".warn_sure");
        var cancel = jQuery(".warn_cancel,.close_warn_box");
        sure.on('click',function(){
            jQuery(this).parents(".warn").remove();
            loadUserData();
            return true;
        });
        cancel.on('click',function(){
            jQuery(this).parents(".warn").remove();
            return false;
        });      
    });

    function addConfirmBox(txt){
        var box = '<div class="warn"><i class="warn_bg"></i><div class="warn_box"><div class="warn_title_box"><div class="warn_title left">提示信息</div><a href="javascript:;" class="close_warn_box right"></a></div><div class="warn_info">'+ txt +'</div><div class="warn_handle_box"><a href="javascript:;" class="warn_sure">确认</a><a href="javascript:;" class="warn_cancel">取消</a></div></div>';
        jQuery("body").append(box);
    }

    jQuery(".empty_drafts_box").bind('click',function(){
        var dl = jQuery(".drafts_container").find("dl");
        if(dl.length == 0) return false;
        addConfirmBox('确定清空草稿箱吗？');
        var sure = jQuery(".warn_sure");
        var cancel = jQuery(".warn_cancel,.close_warn_box");
        sure.on('click',function(){
            jQuery(this).parents(".warn").remove();
            jQuery.ajax({
                url : BBS_ROOT + '/forum.php?mod=newpost&action=deldraft',
                data : {'tid': 0},
                type : 'get',
                dataType : 'json',
                success : function(data){
                    if(data.status == 1){
                        jQuery(".drafts_container").empty();    
                    }
                }
            });
            return true;
        });
        cancel.on('click',function(){
            jQuery(this).parents(".warn").remove();
            return false;
        });
    });

    jQuery(".dust_btn").on('click',function(){
        var tid = jQuery(this).attr("data-tid");
        var _this = jQuery(this);
        addConfirmBox('是否确定删除草稿？');
        var sure = jQuery(".warn_sure");
        var cancel = jQuery(".warn_cancel,.close_warn_box");
        sure.on('click',function(){
            jQuery(this).parents(".warn").remove();
            jQuery.ajax({
                url : BBS_ROOT + '/forum.php?mod=newpost&action=deldraft',
                data : {'tid': tid},
                type : 'get',
                dataType : 'json',
                success : function(data){
                    if(data.status == 1){
                        _this.parent("dl").remove();    
                    }
                }
            });
            return true;
        });
        cancel.on('click',function(){
            jQuery(this).parents(".warn").remove();
            return false;
        });
    });

    //拼接所有表单字段
    function addFormString(){
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
    }

    jQuery(".code_box").click(function(){
        console.log(addFormString());
    })

    //清空表单
    jQuery(".edit_empty").bind('click',function(){
        judgeWarn('你要清空编辑区的全部内容吗？');
        var sure = jQuery(".warn_sure");
        var cancel = jQuery(".warn_cancel");
        sure.on('click',function(){
            jQuery(this).parents(".warn").remove();
            emptyForm();
            return true;
        });
        cancel.on('click',function(){
            jQuery(this).parents(".warn").remove();
            return false;
        });      
    });
    function emptyForm(){
        var form = jQuery("#postForm");
        var formInput = jQuery("#formTitle");
        var formTextarea = form.find(".editable");
        formInput.val('').blur();
        for(var i=0;i<formTextarea.length;i++){
            formTextarea.eq(i).html('').blur();
            formTextarea.eq(i).siblings(".edit_textarea").val('');
        }     
    }
    
//表情与超链接同步和转换功能
    jQuery("#postForm").on('keyup','.editable',function(event){
        if(jQuery(this).html() == ''){
            jQuery(this).siblings('textarea').val('');
        }
        var textArea = jQuery(this).siblings(".edit_textarea");
        // var _val=textArea.val();
        // if(_val.length == 0){
        //     jQuery(this).wrapInner('<div></div>');
        // }
        var replaceStr=["br",'div'];
        var htmlCode = jQuery(this).html().replace(/(<img src=\S+\s+alt=\")({\S+})\">/g,"$2");
        htmlCode = htmlCode.replace(/<a\s\S+="(\S+)">(\S+)<\/a>/g,"[url=$1]$2[/url]");
        if (/firefox/.test(navigator.userAgent.toLowerCase())) {
            htmlCode = htmlCode.replace(/_moz_dirty=""/gi, "").replace(/\[/g, "[[-").replace(/\]/g, "-]]").replace(/<\/ ?tr[^>]*>/gi, "[br]").replace(/<\/ ?td[^>]*>/gi, "").replace(/<(ul|dl|ol)[^>]*>/gi, "[br]").replace(/<(li|dd)[^>]*>/gi, "[br]").replace(/<p [^>]*>/gi, "[br]").replace(new RegExp("<(/?(?:" + replaceStr.join("|") + ")[^>]*)>", "gi"), "[$1]").replace(new RegExp('<span([^>]*class="?at"?[^>]*)>', "gi"), "[span$1]").replace(/<[^>]*>/g, "").replace(/\[\[\-/g, "[").replace(/\-\]\]/g, "]").replace(new RegExp("\\[(/?(?:" + replaceStr.join("|") + "|img|span)[^\\]]*)\\]", "gi"), "<$1>").replace(/<\/div>/gi, "").replace(/<div>/gi, "\r\n").replace(/<br>|<br \/>/g,'\r\n');         
        }else{
            htmlCode = htmlCode.replace(/_moz_dirty=""/gi, "").replace(/\[/g, "[[-").replace(/\]/g, "-]]").replace(/<\/ ?tr[^>]*>/gi, "[br]").replace(/<\/ ?td[^>]*>/gi, "").replace(/<(ul|dl|ol)[^>]*>/gi, "[br]").replace(/<(li|dd)[^>]*>/gi, "[br]").replace(/<p [^>]*>/gi, "[br]").replace(new RegExp("<(/?(?:" + replaceStr.join("|") + ")[^>]*)>", "gi"), "[$1]").replace(new RegExp('<span([^>]*class="?at"?[^>]*)>', "gi"), "[span$1]").replace(/<[^>]*>/g, "").replace(/\[\[\-/g, "[").replace(/\-\]\]/g, "]").replace(new RegExp("\\[(/?(?:" + replaceStr.join("|") + "|img|span)[^\\]]*)\\]", "gi"), "<$1>").replace(/<\/div>/gi, "").replace(/<div>/gi, "\r\n").replace(/<\s*br\s*\/?>/g,'');
        }
        htmlCode = htmlCode.replace(/&nbsp;/g,' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, "''").replace(/&#039;/g, "'");
        textArea.val(htmlCode);
    });
});
function judgeWarn(txt){
    var box = '<div class="warn"><i class="warn_bg"></i><div class="judge_box"><div class="judge_info"><i></i>'+ txt +'</div><div class="warn_handle_box"><a href="javascript:;" class="warn_sure">确认</a><a href="javascript:;" class="warn_cancel">取消</a></div></div></div>';
    jQuery("body").append(box);
}

function addWarn(txt,fn){
    var box = '<div class="warn"><i class="warn_bg"></i><div class="warn_box"><div class="warn_title_box"><div class="warn_title left">提示信息</div><a href="javascript:;" class="close_warn_box right"></a></div><div class="warn_info">'+ txt +'</div><div class="warn_handle_box"><a href="javascript:;" class="warn_sure">确认</a></div></div></div>';
    jQuery("body").append(box);
    var sure = jQuery(".warn_sure");
    var cancel = jQuery(".close_warn_box");
    sure.on('click',function(){
        jQuery(this).parents(".warn").remove();
        fn.focus();
        return true;
    });
    cancel.on('click',function(){
        jQuery(this).parents(".warn").remove();
        return false;
    });
}
//初始化右侧图片
 function initial(){
    var tidVal = jQuery("#tid").val();
    var pidVal = jQuery("#pid").val();
    jQuery.ajax({
        url : BBS_ROOT + '/misc.php?',
        type : 'get',
        data : {
            mod : 'newpost', 
            action : 'getAjaxPic', 
            tid : tidVal,
            pid : pidVal
        },
        dataType : 'json',
        success : function(data){          
            if(data.status == 1){
                if(data.imagelist.length != 0){
                    if(!jQuery(".upload_pic_area").hasClass('act')){
                        jQuery(".upload_commend").hide();
                        jQuery(".upload_pic_area").show().addClass("act");
                        jQuery(".upload_pic_box").show();
                        jQuery(".contiune_handle").show();
                    } 
                    creatPicHtml(data);
                }
            }                  
        }
    });
}
function creatPicHtml(data){
    jQuery.each(data.imagelist,function(i,val){
        reload(val.attachment,val.aid,val.filename);
    }); 
}

function reload(src,aid,title){
    var _html = ''; 
    var img=new Image();
    img.src=src;
    img.setAttribute('aid',aid);
    img.setAttribute('title',title);
    img.onload=function(){  
        var w = img.width;
        var h = img.height;
        var regular = 78/58;
        var w_h = w/h;
        if(w_h-regular>=0){
            img.style.width='100%';
            img.style.height='auto';
        }else{
            img.style.width='auto';
            img.style.height='100%';
        }
        _html += '<li><em><img src="'+XBIAO_ROOT+'/images/wap3.0/article/loading.gif"></em><i>已插入</i><a href="javascript:;"></a></li>';
        jQuery(".upload_pic_box ul").prepend(_html);
        jQuery(".upload_pic_box ul li:first img").replaceWith(img);
        var num = jQuery(".upload_pic_box ul li.act").length;
        jQuery(".contiune_note span").html(num);
        if(num >1000){alert(每天上传图总数不超过1000张);return;}
    };
    
}