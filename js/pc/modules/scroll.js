/**
*后加载数据轮播图，自动轮播，方向绑定，焦点绑定
2种数据形式dataType
element ： 标签加载
textarea ： 数据加载
**/
define(function(require, exports, module) {
	function Scroll(options){
		this.option = options || {};
		this.next = this.option.next || $("#focus-next");
		this.prev = this.option.prev || $("#focus-prev");
		this.scroll = this.option.scroll || $("#focus-box");
		this.boxName = this.option.boxName || 'dl.box';
		this.navBox = this.option.navBox || $("#focus-nav");
		this.index = this.option.index;
		this.active = this.option.active || "act";
		this.dataId = this.option.dataId;
		this.dataType = this.option.dataType;
		this.tag = this.option.tag || "b";
		this.event = this.option.event || "click";
		this.ms = this.option.ms || 3000;
		this.speed = this.option.speed || 300;
		this.center = 0;
		this.dataArr = [];
		this.box = null;
		this.boxWidth = 0;
		this.scrollWidth = 0;
		this.reg1 = new RegExp("&lt;","g");
		this.reg2 = new RegExp("&gt;","g");
		this.interval = null;
		this.flagPlay = true;
		this.flagNext = true;
		this.flagPrev = true;
		this.init();
	}
	Scroll.prototype = {
		init : function(){
			var _self = this;
			_self.initData();
			_self.createNav();
			_self.bindEvent();
			_self.reset();
		    _self.navRun(0);
			_self.addbox("load");
		},
		initData : function(){
			var _self = this;
			if(_self.dataType == 'textarea'){
				_self.dataArr =  _self.dataId.html().replace(_self.reg1,"<").replace(_self.reg2,">").split(",");
				_self.dataArr.pop();
			}else if(_self.dataType == 'element'){
				_self.dataArr = _self.dataId.find(_self.boxName);
			}
		},
		boxCheck : function(){
			var _self = this;
			_self.box = _self.scroll.find(_self.boxName);
		    _self.scrollWidth = _self.boxWidth = _self.box.outerWidth();
			_self.scroll.width(_self.scrollWidth*_self.box.size());
		},
		createNav : function(){
			var _self = this;
			if (_self.dataArr.length > 1) {
			   for(var i = 0;i < _self.dataArr.length;i++){
				   $("<" + _self.tag + "/>").appendTo(_self.navBox);
			   }
			}
			_self.nav = _self.navBox.find(this.tag);
		},
		addbox : function(t,x){
			var _self = this;
			if(t == "load"){
				_self.dataType == 'textarea' ? $(_self.dataArr[0]).appendTo(_self.scroll) : _self.dataArr.eq(0).clone().appendTo(_self.scroll);
				_self.boxCheck();
			}
			if(t == "prev"){	
				_self.dataType == 'textarea' ? $(_self.dataArr[x]).prependTo(_self.scroll) : _self.dataArr.eq(x).clone().prependTo(_self.scroll);	
				_self.boxCheck();
				_self.scroll.css("left",-_self.boxWidth+"px");
			}
			if(t == "next"){				
				_self.dataType == 'textarea' ? $(_self.dataArr[x]).appendTo(_self.scroll) : _self.dataArr.eq(x).clone().appendTo(_self.scroll);
				_self.boxCheck();
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
		navRun : function(num){
			var _self = this;
		    if(_self.prevNav){
				_self.prevNav.removeClass(_self.active);
		    }
			_self.nav.eq(num).addClass(_self.active);
			_self.prevNav = _self.nav.eq(num);
			_self.center = num;	
			if(typeof _self.index != 'undefined'){
				_self.index.html(num+1);
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
			_self.center <= 0 ? _self.center = _self.dataArr.length -1 : --_self.center;
			_self.navRun(_self.center);
			_self.addbox("prev",_self.center);
			_self.prevScroll(1);
		},
		nextPlay : function(){
			var _self = this;
			_self.center >= _self.dataArr.length-1 ? _self.center = 0 : ++_self.center;
			_self.navRun(_self.center);
			_self.addbox("next",_self.center);
			_self.nextScroll(1);

		},
		reset : function(){
			var _self = this;
			if(_self.interval) clearInterval(_self.interval);
			_self.interval = setInterval(function(){
				_self.nextPlay();
			},_self.ms);
		},
		bindEvent : function(){
			var _self = this;
			_self.nav.on(_self.event, function() {				
				var $this = $(this);
				var m = _self.center;
				if(!_self.flagPlay){
					return false;
				}
				_self.flagPlay = false;
				_self.navRun(_self.nav.index($this));
				if(m < _self.center){
					_self.addbox("next",_self.center);
					_self.nextScroll(1);
				}
				else if(m > _self.center){
					_self.addbox("prev",_self.center);
					_self.prevScroll(1);
				}else{
					_self.flagPlay = true;
					_self.flagNext = true;
				}
		    });
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
			$(_self.nav).hover(function(){
			    	if(_self.interval) clearInterval(_self.interval);
			    },function(){
			    	_self.reset();
			    }
			);
			$(_self.box).hover(function(){
			    	if(_self.interval) clearInterval(_self.interval);
			    },function(){
			    	_self.reset();
			    }
			);
			$(_self.prev).hover(function(){
			    	if(_self.interval) clearInterval(_self.interval);
			    },function(){
			    	_self.reset();
			    }
			);
			$(_self.next).hover(function(){
			    	if(_self.interval) clearInterval(_self.interval);
			    },function(){
			    	_self.reset();
			    }
			);
			$(_self.scroll).hover(function(){
			    	if(_self.interval) clearInterval(_self.interval);
			    },function(){
			    	_self.reset();
			    }
			);
		}
	}
	module.exports = Scroll;
})