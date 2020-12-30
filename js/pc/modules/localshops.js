/**
* 当前城市名表专卖店ajax
**/
define(function(require, exports, module) {
	function init(url){
		//名表专卖店ajax
		$.getJSON(url,function(data){
			if(data.html !=''){
				$('.city-shop ul').html(data.html);
				$('.current-city em').html(data.city_name);
			}
		})
	}
	
	module.exports = init;
})
