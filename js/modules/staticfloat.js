function createfloatpic(){
	var htmlLeft = null;
		htmlLeft = '<div class="wrapper"><div class="floatpic"><span><a href="http://geneva.xbiao.com/" target="_blank" title="2016巴塞尔钟表展"></a><i></i></span></div></div>';
	$('body').prepend(htmlLeft);
	floatpic();
	if($(document).width() < 1400){
		$(".floatpic span").css({'right':'0px'})
	}else{
		$(".floatpic span").css({'right':'auto'})
	}
	if($(".header .wrapper").width() == 1200){
		$(".floatpic span").parents(".wrapper").css({'width':'1200px'});
	}
};
function floatpic() {
	var objBox = $(".floatpic span");
	var laywidth = 1000;
	var _top = 220;
	if($('.container').length>0){
		_top = $('.container').offset().top;
	}
	objBox.css("top",_top+"px");
	$('.floatpic i').live('click',function(){
		$('.floatpic').remove();
	})
	var funBox = function() {
		if($(window).scrollTop() > _top - 80 ){
			objBox.css("position","fixed");
			objBox.css("top",80 + "px"); 
		}
		else{
			objBox.css("position","absolute");
			objBox.css("top",_top + "px");
		}
	};
	$(window).scroll(funBox);
	$(window).resize(funBox);
};
$(document).ready(function(){
	var url_float = window.location.href;
	var url_reg = (/http:\/\/www.xbiao.com\/$/).test(url_float);
	//首页不要悬浮推广
	if(!url_reg){
		createfloatpic();
	}
	
	// if((/www\.xbiao\.com\/[a-z]+\/\d+\/$/gi).test(url_float)){//表详情页
	// 	createfloatpic();
	// }
	// else if((/[0-9a-z]+\.xbiao\.com\/[0-9a-z]+\/\d+\.html$/gi).test(url_float)){ //文章页
	// 	createfloatpic();
	// }
	// else{
	// }
	$(window).resize(function(){
		if($(".header .wrapper").width() == 1200){
			if($(document).width() < 1580){
				$(".floatpic span").css({'right':'0px'})
			}else{
				$(".floatpic span").css({'right':'auto'})
			}
		}else{
			if($(document).width() < 1350){
				$(".floatpic span").css({'right':'0px'})
			}else{
				$(".floatpic span").css({'right':'auto'})
			}
		}
	});
	if($('.box_app .app_xbiao').find('i').size() == 0){
		$('.box_app a').prepend('<i></i>');
	}
});		