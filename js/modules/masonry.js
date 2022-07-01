/**
*瀑布流
**/
define(function(require, exports, module) {
	require("jquery-masonry");
	function Masonry(options){
		var wrap = options.wrap;
		$(wrap).masonry(options.opt);
	}
	module.exports = Masonry;
})
