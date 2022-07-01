/**
*滑动门，Tab切换
**/
define(function(require, exports, module) {
	function Door(options){
		this.option = options || {};
		this.nav = this.option.nav || $('.nav li');
		this.cont = this.option.cont || $('.cont li');
		this.event = this.option.event || 'click';
		this.active = this.option.active || 'act';
		this.index = this.option.index || 0;
		this.fade = this.option.fade || false;
		this.flag = true;
		this.center = null;
		this.prevFlag = null;
		this.prevImg = null;
		this.timer = null;
		this.init();
	}
	Door.prototype = {
		init:function(){
			this.bindEvent();
		},
		navRun:function(num){
		    _self = this;
		    if(_self.prevFlag) {
		    	_self.prevFlag.removeClass(_self.active);
		    }
			_self.nav.eq(num).addClass(_self.active);
			_self.prevFlag = _self.nav.eq(num);
			center = num;
		},
		contRun:function(num){
			_self = this;
			if(_self.prevImg) {
				_self.prevImg.hide();
			}
			if(_self.fade){
				_self.cont.eq(num).fadeIn("slow");
			}else{
				_self.cont.eq(num).show();
			}

			_self.prevImg = _self.cont.eq(num);
		},
		bindEvent:function(){
			var _self = this;
			this.nav.on(_self.event, function() {
				var $self = $(this);
				if(_self.timer) {clearTimeout(_self.timer)};
				_self.timer = setTimeout(function(){
					if(_self.flag){
						_self.navRun(_self.nav.index($self));
						_self.contRun(_self.nav.index($self));
						_self.flag = false;
					}
				}, 200);
			});
			this.nav.on('mouseout',function(){
				_self.flag = 1;
			})
			this.navRun(_self.index);
			this.contRun(_self.index);
		}
	}
	module.exports = Door;
})
