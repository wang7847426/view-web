define(function(require, exports, module) {
	function Column(options){
	    this.option = options || {};
	    this.ul = this.option.ul || $("#dawan-list ul");
	    this.li = this.option.li || $("#dawan-list ul li");
	    this.prev = this.option.prev || $("#prev");
	    this.next = this.option.next || $("#next");
	    this.active = this.option.active || "click";
	    this.width = this.li.eq(0).outerWidth() + parseInt(this.li.css("margin-right"));
	    this.i=0;
	    this.init();
	}

	Column.prototype = {
	    init : function(){
	        var _self = this;
	        _self.prev.bind(_self.active,function(){
	        	if(_self.i==0){
	        		_self.i=_self.li.length;
	        	}
	            _self.goBack(_self.i);

	        });
	        _self.next.bind(_self.active,function(){
	        	if(_self.i==_self.li.length){
	        		_self.i=0;
	        	}
	            _self.foward(_self.i);
	        });
	    },

	    foward : function(i){
	        var _self = this;
	        if(!_self.ul.is(":animated")){
	            _self.ul.animate({left:'-='+_self.width},function(){
	                _self.li.eq(_self.i-1).appendTo(_self.ul);
	                _self.ul.css("left",0);
	            });
	            _self.i++;
	        }
	    },

	    goBack : function(i){
	        var _self = this;
	        if(!_self.ul.is(":animated")){
	            _self.li.eq(_self.i-1).prependTo(_self.ul);
	            _self.ul.css("left",-(_self.width));
	            _self.ul.animate({left:'0'});
	            _self.i--;
	        }
	    }
	}
	module.exports = Column;
});