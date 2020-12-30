/**
*nav 公共头部导航
**/
define(function(require, exports, module) {
	function init(){
		var mainNav = jQuery('#mainNav li');
		var subNav = jQuery('#subNav > div');
		var navAct = jQuery('#mainNav li.act');
		var index = navAct.index();
		var subNavAct = jQuery('.sub-nav .act a.hover');
		var subNavIndex = subNavAct.index('.act a');
		var moveflag = true;
		var timer = null;
		mainNav.bind('mouseenter',function(){
			var _this = jQuery(this);
			if(!moveflag){
				return;
			}else{
				clearTimeout(timer);
				timer = setTimeout(function(){
					var _actindex = _this.index();
					moveflag = false;
					_this.addClass('act').siblings().removeClass('act');
					subNav.eq(_actindex).show().siblings().hide();
					moveflag = true;
				},500)
			}
			
		})
		
		jQuery('#nav').bind('mouseleave',function(){
			if(index != -1){
				mainNav.eq(index).addClass('act').siblings().removeClass('act');
				subNav.eq(index).show().siblings().hide();
			}else{
				mainNav.removeClass('act');
			}
		})
		subNavAct.parent().hover(function(){
			jQuery('.sub-nav a.hover').removeClass('hover');
		},function(){
			if(subNavIndex != -1){
				subNav.eq(index).find('a').eq(subNavIndex-1).addClass('hover');
			}
		})
	}
	
	module.exports = init;
})
