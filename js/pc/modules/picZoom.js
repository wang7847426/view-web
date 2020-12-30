/**
*网友晒单作业，图片触摸放大
by:zmt@2016/1/26
**/
define(function(require, exports, module) {
	function Piczoom(option){
		this.obj = option.ele;
		this.height = option.height;
		this.width = option.width;
		this.flag = false;
		this.bigpic = "<span class='bigpic'><img src='http://www.xbiao.com/images/opacity.gif'/></span>";
		this.bigpicCls = ".bigpic";
		this.init();
	}
	Piczoom.prototype = {
		init : function(){
			this.bindEvent();
		},
		bindEvent : function(){
			this.objBindEvent();
			this.bigPicBindEvent();
		},
		objBindEvent : function(){
			var self = this;
			$(document).on('mouseenter','.zypic a',function(){
				var _this = $(this);
				$('body').append($(self.bigpic));
				$(self.bigpicCls).find('img').attr('src',_this.find('img').attr('data-src'));
				self.chkPicPostion(_this);
			})
			$(document).on('mouseleave','.zypic a',function(){
				setTimeout(function(){
					if(!self.flag){
						$(self.bigpicCls).remove();
					}
				},1)
			})
		},
		chkPicPostion : function(obj){
			var self = this;
			var chaHeight;
			var bigPicHeight = $(".bigpic").height();
			if($(window).height() - (obj.offset().top - $(window).scrollTop()) < 300){
				$(self.bigpicCls).addClass('bigpic-anti');
				chaHeight = - (bigPicHeight + 10);
			}else{
				chaHeight = self.height;
			}
			
			$(self.bigpicCls).css({
				'left' : function(){
					return obj.offset().left - (220 - self.width)/2 + 'px';
				},
				'top' : function(){
					return obj.offset().top + chaHeight + 'px';
				}
			})
		},
		bigPicBindEvent : function(){
			var self = this;
			$(document).on('mouseleave',self.bigpicCls,function(){
				self.flag = false;
				$(self.bigpicCls).remove();
			})
			$(document).on('mouseenter',self.bigpicCls,function(){
				self.flag = true;
			})
		}
	}
	module.exports = Piczoom;
})
