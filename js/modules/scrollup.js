/**
*间歇向上滚动
**/
define(function(require, exports, module) {
        function moveUl(obj,part,topValue){
            setInterval(function(){
                // 网友评论中复制第一条记录并粘贴到ul的最后
                part.clone(true).appendTo('.forum-box ul');
                obj.animate({top:topValue},function(){
                    // 删除第一条记录
                    part.remove();
                    obj.css('top','0');
                });
            },5000);
        }

        module.exports = moveUl;
})
