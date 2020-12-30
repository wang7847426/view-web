/**
*后加载数据轮播图，自动轮播，方向绑定，焦点绑定
ajax加载数据
**/
define(function(require, exports, module) {
	function Scroll(options){
		this.option = options || {};
		this.next = this.option.next || $("#focus-next");
		this.prev = this.option.prev || $("#focus-prev");
		this.scroll = this.option.scroll || $("#focus-box");
		this.boxName = this.option.boxName || 'dl.box';
		this.dataOpt = this.option.dataOpt || null;
		this.event = this.option.event || "click";
		this.ms = this.option.ms || 3000;
		this.speed = this.option.speed || 300;
		this.box = null;
		this.boxWidth = 0;
		this.scrollWidth = 0;
		this.flagPlay = true;
		this.flagNext = true;
		this.flagPrev = true;
		this.init();
		this.page = 0;
		this.totalPage = 0;
	}
	Scroll.prototype = {
		init : function(){
			var _self = this;
			_self.bindEvent();
			_self.addbox("load");
		},
		ajaxData : function(options,m){
			var _self = this;
			if(!m){ 
				m=0;
				_self.page = 0;
				_self.totalPage = 0; 
			}else{
				_self.page+=m;
				_self.page > _self.totalPage ? _self.page = 1 : (_self.page < 1 ? _self.page = _self.totalPage : null);
			}
			options.opt.page = _self.page;
			$.ajax({
				url:options.url,
				type:"GET",
				data:options.opt,
				dataType:"jsonp",
				success:function(data){
					_self.page = data.page;
					_self.totalPage = data.totalPage;
					if(data.status == 1){
						if(m>0){
							_self.scroll.append(data.html);
							_self.boxCheck();
						}else if(m<0){
							_self.scroll.css("left",-_self.boxWidth+"px");
							_self.scroll.prepend(data.html);
							_self.boxCheck();
						}else{
							_self.scroll.append(data.html);
							_self.boxCheck();
						}
					}
				}
			})
		},
		boxCheck : function(){
			var _self = this;
			_self.box = _self.scroll.find(_self.boxName);
		    _self.scrollWidth = _self.boxWidth = _self.box.outerWidth();
			_self.scroll.width(_self.scrollWidth*_self.box.size());
		},
		addbox : function(t){
			var _self = this;
			if(t == "load"){
				_self.ajaxData(_self.dataOpt);
			}
			if(t == "prev"){	
				_self.ajaxData(_self.dataOpt,-1);
				_self.scroll.css("left",-_self.boxWidth+"px");
			}
			if(t == "next"){				
				_self.ajaxData(_self.dataOpt,1);
			}
		},
		removebox : function(o){
			var _self = this;
			if(o == "prev"){
				_self.box.eq(1).remove();
				_self.scroll.css("left","0px");
				_self.boxCheck();
			}
			if(o == "next"){
				_self.box.eq(0).remove();
				_self.scroll.css("left","0px");
				_self.boxCheck();
			}
		},
		prevScroll : function(s){
			var _self = this;
			_self.scroll.animate({left:"+=" + _self.boxWidth*s},_self.speed,function(){
				_self.removebox("prev");
				_self.flagPrev = true;
				_self.flagPlay = true;
			});
		},
		nextScroll : function(s){
			var _self = this;
		    _self.scroll.animate({left:"-=" + _self.boxWidth*s},_self.speed,function(){
				_self.removebox("next");
				_self.flagNext = true;
				_self.flagPlay = true;
			});
		},
		prevPlay : function(){
			var _self = this;
			_self.addbox("prev");
			_self.prevScroll(1);
		},
		nextPlay : function(){
			var _self = this;
			_self.addbox("next");
			_self.nextScroll(1);
		},
		bindEvent : function(){
			var _self = this;
		    _self.prev.click(function(){
				if(_self.flagPrev){ 
					_self.flagPrev = false;
					_self.prevPlay();
				}				
			});
			_self.next.click(function(){
				if(_self.flagNext){ 
					_self.flagNext = false;
					_self.nextPlay();
				}
			});
		}
	}
	module.exports = Scroll;
})