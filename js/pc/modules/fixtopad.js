/**
*侧栏吸顶
**/
define(function(require, exports, module) {
	function fixtop(small,big,obj){
		var oHeight = obj.height();
		//减去自身高度
		 big = big - oHeight;
		$(window).scroll(function(){
			if( $(window).scrollTop() > small && $(window).scrollTop() < big ) {
				obj.css({
					'float'		  : '',
					'position'    : 'fixed',
					'top' 	      : '100px',
					'top'         : '0',
					'z-index'     : '1',
					'left'	      : '50%',
					'margin-left' : '250px'
				});
			}else if( $(window).scrollTop() > big){
				obj.css({
					'float'		  : '',
					'position'    : 'absolute',
					'top' 	      :  big + 'px',
					'z-index'     : '1',
					'left'	      : '50%',
					'margin-left' : '250px'
				});
			}else if( $(window).scrollTop() < small){
				obj.css({
					'float'		  : 'right',
					'position'    : '',
					'top' 	      : '',
					'top'         : '',
					'z-index'     : '',
					'left'	      : '',
					'margin-left' : ''
				});
			}
		})
	}
	module.exports = fixtop;
})
