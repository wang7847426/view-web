/**
*焦点图，自动轮播，方向绑定，焦点绑定
**/
define(function(require, exports, module) {
	function Focus(options){
		this.option = options || {};
		this.next = this.option.next || jQuery("#focus-next");
		this.prev = this.option.prev || jQuery("#focus-prev");
		this.scroll = this.option.scroll || jQuery("#focus-box");
		this.box = this.option.box || jQuery("#focus-box .focus-item");
		this.text = this.option.text || jQuery('#focus-box .text li');
		this.navBox = this.option.navBox || jQuery("#focus-nav");
		this.active = this.option.active || "act";
		this.tag = this.option.tag || "b";
		this.event = this.option.event || "click";
		this.ms = this.option.ms || 3000;
		this.center = 0;
		this.interval = null;
		this.prevNav = null;
		this.prevBox = this.box.eq(0);
		this.flagPlay = true;
		this.flagNext = true;
		this.flagPrev = true;
		this.init();
	}
	Focus.prototype = {
		init : function(){
			var _self = this;
			_self.createNav();
			if(_self.box.size() > 1){
				_self.navRun(0);
				_self.box.eq(0).show();
			}else{
				_self.box.eq(0).show();
				_self.text.eq(0).show();
				_self.prev.hide();
				_self.next.hide();
				return;
			}
			if(_self.interval){
				clearInterval(_self.interval);
			}
			_self.interval = setInterval(function(){
				_self.navRun(_self.center >= _self.box.size() - 1 ? 0 : ++_self.center);
				_self.scrollRun(_self.center, "right");
			},_self.ms);
			_self.bindEvent();
		},
		createNav : function(){
			var _self = this;
			for(var i = 1, len = _self.box.size() + 1; i < len; i++){
				jQuery("<" + _self.tag + "/>").text(i).appendTo(_self.navBox);
			}

			// 判断图片数量和标题数量是否相等（焦点图有可能有广告）
			// dss 2018-10-11
			if(_self.box.size()-_self.text.size()>0){
				var diff = picLen-titLen;
				for (var i = 1; i < diff; i++) {
					jQuery("<" + _self.tag + "/>").prependTo(_self.navBox);
				}
			}

			_self.nav = _self.navBox.find(this.tag);
			_self.prevNav = _self.nav.eq(0);
		},
		textRun : function(num){
			this.text.eq(num).show().siblings().hide();
		},
		navRun : function(num){
			var _self = this;
		    if(_self.prevNav){
				_self.prevNav.removeClass(_self.active);
		    }
		    if(_self.text){
		    	_self.textRun(num);
		    }

			_self.nav.eq(num).addClass(_self.active);
			_self.prevNav = _self.nav.eq(num);
			_self.center = num;
		},
		scrollRun : function(num,x){
			var _self = this;
			if(x == "right"){
				_self.scroll.css({"width": _self.box.outerWidth()*2});
				_self.box.eq(num).show();
				_self.prevBox.css({"position":"absolute", "left":0, "top":0});
				_self.box.eq(num).css({"position":"absolute", "left":_self.box.outerWidth(), "top":0});
				_self.scroll.animate({left: -_self.box.outerWidth() + "px"}, "fast", function(){
					_self.box.eq(num).css({"position":"static", "left":0, "top":0});
					_self.prevBox.css({"position":"static", "left":0, "top":0});
					_self.scroll.css({"width": _self.box.outerWidth(), "left": 0});
					_self.prevBox.hide();
					_self.prevBox = _self.box.eq(num);
					_self.flagPlay = true;
					_self.flagNext = true;
				});
			}
			else if(x == "left"){
				_self.scroll.css({"width": _self.box.outerWidth()*2, "left": -_self.box.outerWidth()});
				_self.box.eq(num).show();
				_self.prevBox.css({"position":"absolute", "left":_self.box.outerWidth(), "top":0});
				_self.box.eq(num).css({"position":"absolute", "left":0, "top":0});
				_self.scroll.animate({left: 0}, "fast", function(){
					_self.box.eq(num).css({"position":"static", "left":0, "top":0});
					_self.prevBox.css({"position":"static", "left":0, "top":0});
					_self.scroll.css({"width": _self.box.outerWidth(), "left": 0});
					_self.prevBox.hide();
					_self.prevBox = _self.box.eq(num);
					_self.flagPlay = true;
					_self.flagPrev = true;
				});
			}
		},
		prevPlay : function(){
			var _self = this;
			_self.center <= 0 ? _self.center = _self.box.size() -1 : --_self.center;
			_self.navRun(_self.center);
			_self.scrollRun(_self.center, "left");
		},
		nextPlay : function(){
			var _self = this;
			_self.center >= _self.box.size()-1 ? _self.center = 0 : ++_self.center;
			_self.navRun(_self.center);
			_self.scrollRun(_self.center, "right");
		},
		reset : function(){
			var _self = this;
			if(_self.interval) clearInterval(_self.interval);
			_self.interval = setInterval(function(){
				_self.navRun(_self.center >= _self.box.size() - 1 ? 0 : ++_self.center);
				_self.scrollRun(_self.center, "right");
			},_self.ms);
		},
		bindEvent : function(){
			var _self = this;
			_self.nav.on(_self.event, function() {
				var jQuerythis = jQuery(this);
				var m = _self.center;
				if(!_self.flagPlay){
					return false;
				}
				_self.flagPlay = false;
				_self.navRun(_self.nav.index(jQuerythis));
				if(m < _self.center){
					_self.scrollRun(_self.nav.index(jQuerythis), "right");
				}
				else if(m > _self.center){
					_self.scrollRun(_self.nav.index(jQuerythis), "left");
				}else{
					_self.flagPlay = true;
					_self.flagNext = true;
				}
		    });
		    _self.prev.click(function(){
				if(!_self.flagPrev){
					return false;
				}
				_self.flagPrev = false;
				_self.prevPlay();
			});
			_self.next.click(function(){
				if(!_self.flagNext){
					return false;
				}
				_self.flagNext = false;
				_self.nextPlay();
			});
			jQuery(_self.nav).hover(function(){
			    	if(_self.interval) clearInterval(_self.interval);
			    },function(){
			    	_self.reset();
			    }
			);
			jQuery(_self.box).hover(function(){
			    	if(_self.interval) clearInterval(_self.interval);
			    },function(){
			    	_self.reset();
			    }
			);
			jQuery(_self.prev).hover(function(){
			    	if(_self.interval) clearInterval(_self.interval);
			    },function(){
			    	_self.reset();
			    }
			);
			jQuery(_self.next).hover(function(){
			    	if(_self.interval) clearInterval(_self.interval);
			    },function(){
			    	_self.reset();
			    }
			);
		}
	}
	module.exports = Focus;
})
