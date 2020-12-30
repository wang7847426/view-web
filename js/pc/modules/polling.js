var jQuery = jQuery.noConflict();
/**
*发帖页面轮询检测功能
**/
define(function(require, exports, module){
	function Polling(option){
		this.option = option || {};
		this.timing = this.option.timing;
 		this.twoCode = this.option.twoCode || jQuery(".code_box");
 		this.twoCodeTime = this.option.twoCodeTime || 600000;
 		this.picTestTime = this.option.picTestTime || 2000;
 		this.commend = this.option.commend || jQuery(".upload_commend");
 		this.picProgress = this.option.picProgress || jQuery(".upload_progress");
 		this.picContainer = this.option.picContainer || jQuery(".upload_pic_box ul");
		this.init();
	}
	Polling.prototype = {
		init : function(){
			var _self = this;
			setInterval(_self.ajaxGetPic.bind(_self),_self.picTestTime);
			_self.testQrCode();
		},
		ajaxQrCode : function(){
			var _self = this;
			jQuery(".code_box img").attr('src',BBS_ROOT + '/misc.php?mod=newpost&action=qrcode&time=' + Math.random());	
		},
		ajaxGetPic : function(){
			var _self = this;
			jQuery.ajax({
				url : BBS_ROOT + '/misc.php?mod=newpost&action=getPic',
				type : 'get',
				dataType : 'json',
				success : function(data){
					if(data.status == 1){
						if(!jQuery(".upload_pic_area").hasClass('act')){
		                    jQuery(".upload_commend").hide();
		                    jQuery(".upload_pic_area").show().addClass("act");
		                    jQuery(".upload_pic_box").show();
		                    jQuery(".contiune_handle").show();
		                } 
						_self.createPicHtml(data);
					}					
				}
			});
		},
		createPicHtml : function(data){
			var _self = this;
			jQuery.each(data.imagelist,function(i,val){
				_self.reload(val.attachment,val.aid,val.filename);
			});
			var num = _self.picContainer.find('li.act').length;
			if(num >1000){
				return false;
			}else{
				jQuery(".contiune_note span").html(num);
			}			
		},
		reload : function(src,aid,title){
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
            	jQuery(".upload_pic_box ul li:first em").click();
            	var num = jQuery(".upload_pic_box ul li.act").length;
        		jQuery(".contiune_note span").html(num);
        		if(num >1000){alert(每天上传图总数不超过1000张);return;}
	        };
		},
		testQrCode : function(){
			var _self = this;
			setTimeout(function(){
				jQuery(".code_overdue").show(function(){
					jQuery(".code_overdue").bind('click',function(){
						_self.ajaxQrCode();
						jQuery(this).hide();
						setTimeout(_self.testQrCode,_self.twoCodeTime);
					});
				});
			},_self.twoCodeTime);
		}
	}
	module.exports = Polling;
})