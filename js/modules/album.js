/**
*相册浏览，点击小图，加载大图
**/
define(function(require, exports, module) {
	require("jquery-easing");
	function Album(options){
		this.option = options || {};
		this.obj = this.option.obj || $('.appr_box');
		this.count = this.option.count || 4;
		this.wth = this.option.wth || 112;
		this.bigPrev = this.option.bigPrev || this.obj.find('.bigPrev');
		this.bigNext = this.option.bigNext || this.obj.find('.bigNext');
		this.smallPrev = this.option.smallPrev || this.obj.find('.smallPrev');
		this.smallNext = this.option.smallNext || this.obj.find('.smallNext');
		this.smallPicList = this.option.smallPicList || this.obj.find('.smallpic_list');
		this.smallPicItem = this.option.smallPicItem || this.smallPicList.find('li');
		this.bigPicList = this.option.bigPicList || this.obj.find('.bigpicdata').html();
		this.bigPicIntroList = this.option.bigPicIntroList || this.obj.find('.bigpicintrodata').html();
		this.nowPage = this.option.nowPage || this.obj.find('.nowpage');
		this.totalPage = this.option.totalPage || this.obj.find('.totalPage');
		this.flagIndex = 0;
		this.flagNext = true;
		this.flagPrev = true;
		this.prevCount = 0;
		this.nextCount = 0;
		this.boxImgData = new Array();
		this.boxImgIntroData = new Array();
		this.init();	
	}
	Album.prototype.init = function(){
		this.smallPicList.width(this.smallPicItem.size()*this.wth);
		var reg1 = new RegExp("&lt;","g");
		var reg2 = new RegExp("&gt;","g");
		this.boxImgData = this.bigPicList.replace(reg1,"<").replace(reg2,">").split(",");
		this.boxImgIntroData = this.bigPicIntroList.split("|");
		this.initCheck(this.flagIndex);
		this.bindEvent();
		this.loadingBigPic(this.flagIndex);
		this.totalPage.html(this.smallPicItem.size());
	};
	Album.prototype.bindEvent = function(){
		var self = this;
		self.bigPrev.live('click',function(){
			if(self.flagIndex == 0){
				self.picEnd();
			}else{
				self.initCheck(--self.flagIndex);
				self.loadingBigPic(self.flagIndex);
			}
		});
		self.bigNext.live('click',function(){
			if(self.flagIndex == self.smallPicItem.length-1){
				self.picEnd();
			}else{
				self.initCheck(++self.flagIndex);
				self.loadingBigPic(self.flagIndex);
			}
		});
		self.smallNext.live("click", function(){
			if(self.nextCount < self.count && self.nextCount > 0){
				self.nextScroll(self.nextCount);
			}
			else if(self.nextCount >= self.count){
				self.nextScroll(self.count);
			}else{
				self.picEnd();
			}
		});
		self.smallPrev.live("click", function(){
			if(self.prevCount < self.count && self.prevCount >= 0){
				self.prevScroll(self.prevCount);
			}
			else if(self.prevCount >= self.count){
				self.prevScroll(self.count);
			}
		});
		self.smallPicItem.live("click",function(){
			self.flagIndex = $(this).index();
			self.initCheck(self.flagIndex);
			self.loadingBigPic(self.flagIndex);
		});
		self.bindKey();
	};
	Album.prototype.bindKey = function(){
		//按左右键切换图片
		var self = this;
		$(document).bind("keyup",function(evt){
			evt = (evt) ? evt : window.event;
			if (evt.keyCode) {
			   self.stopPlay();
			   if(evt.keyCode == 37){
			   	self.bigPrev.click();
			   }
			   else if(evt.keyCode == 39){
			   	self.bigNext.click();
			   }
			}
		})
	};
	Album.prototype.picEnd = function(){
		var self = this;
		self.flagIndex = 0;
		self.initCheck(0);
		self.loadingBigPic(self.flagIndex);
		self.nextScroll(self.nextCount);
	};
	//检测按钮
	Album.prototype.checkButton = function(){
		var self = this;
		self.prevCount = - parseInt(self.smallPicList.css("left"))/self.wth;
		self.nextCount = self.smallPicItem.size() - self.count + parseInt(self.smallPicList.css("left"))/self.wth;
		
		if(self.prevCount > 0 && self.nextCount > 0){
			self.smallNext.attr("title", "下"+self.count+"张");
			self.smallPrev.attr("title", "上"+self.count+"张");
		}
		else if(self.prevCount > 0 && self.nextCount <= 0){
			self.smallNext.attr("title", "");
		}
		else if(self.prevCount <= 0 && self.nextCount > 0){
			self.smallPrev.attr("title", "");
		}
		else if(prevCount <= 0 && nextCount <= 0){
			self.smallNext.attr("title", "");
			self.smallPrev.attr("title", "");
		}
	};
	Album.prototype.initCheck = function(index){
		var self = this;
		if(self.smallPicItem.size() > self.count){
			if(index > 2 && index < self.smallPicItem.size() - 2){ 
				self.smallPicList.animate({"left":-self.wth*(index-2)});
			}
			else if(index >= self.smallPicItem.size() -3 && index <= self.smallPicItem.size() - 1){
				self.smallPicList.animate({"left":-self.wth*(self.smallPicItem.size()-4)});
			}
			else if(index <= 2 && index >= 0){
				self.smallPicList.animate({"left":0});
			}
		}
		self.smallPicItem.eq(index).addClass("active").siblings().removeClass('active');
		self.nowPage.html(parseInt(index)+1);
		setTimeout(function(){self.checkButton();},500);
	};
	Album.prototype.loadingBigPic = function(flagIndex){
		//picSrc = decodeURI(picSrc);
		var _self = this;
		var picSrc = _self.boxImgData[flagIndex];
		var picIntro = _self.boxImgIntroData[flagIndex];
		var bigPic = _self.obj.find('#bigPic');
		var loadPic = _self.obj.find('#loadingPic');
		var picTitle = _self.obj.find('#picTitle');
		var viewpic = $('.i-viewpic');
		var img = new Image();
		var loadNextImg = new Image();
		var loadPrevImg = new Image();
		img.src = picSrc;
		bigPic.attr('src',picSrc) ;
		viewpic.attr('href',picSrc);
		picTitle.html(picIntro);
		loadPic.show();
		if(flagIndex==0){
			_self.bigPrev.hide();
		}else{
			_self.bigPrev.show();
		}
		if(img.complete){
			loadPic.hide();
			loadNextImg.src = _self.boxImgData[flagIndex < _self.smallPicItem.size()-1 ? flagIndex+1 :_self.smallPicItem.size()-1];
			loadPrevImg.src = _self.boxImgData[flagIndex>0?flagIndex-1:0];
		}
		img.onload =  function(){
			loadPic.hide();
			loadNextImg.src = _self.boxImgData[flagIndex<_self.smallPicItem.size()-1?flagIndex+1:_self.smallPicItem.size()-1];
			loadPrevImg.src = _self.boxImgData[flagIndex>0?flagIndex-1:0];
		}
	};
	Album.prototype.nextScroll = function(n){
		if(!this.flagNext) return false;
		this.flagNext = false;
		this.flagPrev = true;
		var self = this;
		if( n != 0){
			self.smallPicList.animate({left:parseInt(self.smallPicList.css("left")) - self.wth*n}, {
				duration: "slow", 
				easing:"easeInOutExpo",
				complete:function(){
					self.flagNext = true;
					self.checkButton();
					
				}
			});
		}
		else{
			self.smallPicList.animate({left:0}, {
				duration: "slow", 
				easing:"easeOutExpo",
				complete:function(){
					self.flagNext = true;
					self.checkButton();
				}
			});
		}	
	};
	Album.prototype.prevScroll = function(n){
		if(!this.flagPrev) return false;
		this.flagNext = true;
		this.flagPrev = false;
		var self = this;
		if( n != 0){
			self.smallPicList.animate({left:parseInt(self.smallPicList.css("left")) + self.wth*n}, {
				duration: "slow", 
				easing:"easeInOutExpo",
				complete:function(){
					self.flagPrev = true;
					self.checkButton();
				}
			});
		}
		else{
			self.smallPicList.animate({left:-parseInt(self.wth*self.count*(self.smallPicItem.size()/self.count-1))}, {
				duration: "slow", 
				easing:"easeOutExpo",
				complete:function(){
					self.flagPrev = true;
					self.checkButton();
				}
			});
		}
	};
	module.exports = Album;
})