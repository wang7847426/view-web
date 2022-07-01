/**
*固定高度，隐藏更多部分。
**/
define(function(require, exports, module) {
    function showMore(obj,height){
        obj.each(function(){
                if( $(this).height() <= height ){
                    $(this).css('height', height + 'px');
                    $(this).find('.watch-more').hide();
                }else{
                    $(this).css('height', height + 'px');
                }
            }).find('.watch-more').toggle(
        function(){
            $(this).html('收起');
            $(this).removeClass('watch-more');
            $(this).addClass('watch-hide');
            $(this).parent().css('height','auto');
        },function(){
            $(this).html('更多');
            $(this).removeClass('watch-hide');
            $(this).addClass('watch-more');
            $(this).parent().css('height','96px');
        })
    }
        module.exports = showMore;
})
