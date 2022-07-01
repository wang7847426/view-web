/**
*评论点赞公共模块
by:zmt@2016/2/2
**/
define(function(require, exports, module) {
	function Agree(option){
		option = option || {};
		this.obj = option.obj;
		this.dataType = option.dataType || 'json';
		this.agreeUrl = this.dataType == 'json' ? option.agreeUrl : option.agreeUrl +'?callback=?';
		this.init();
	}
	Agree.prototype = {
		init : function(){
			this.bindEvent();
		},
		bindEvent : function(){
			var self = this;
			$(document).on('click',self.obj,function(){
				var _this = $(this);
				if(!_ISLOGIN){
					return NotLogin("登录后您就可以赞TA了");
				}else{
					self.doAgreeAjax(_this);
				}
			})
		},
		doAgreeAjax : function(obj){
			var self = this;
			if(obj.attr("data-rule4") == 0){
				obj.attr("data-rule4", 1);
				var weibo_id = obj.attr("id");
				$.ajax({
					type: "GET",
					url: self.agreeUrl,
					data: "comment_id=" + weibo_id,
					dataType: self.dataType,
					success: function(data){
						if(data.status == 1){
							obj.find("em").html(parseInt(obj.find("em").html()) + 1);
						}else{
							alert(data.msg);
							obj.attr("data-rule4", 0);
						}
					},
					error: function(){
						alert(data.msg);
						obj.attr("data-rule4", 0);
					}
				});
			}
		}
	}
	module.exports = Agree;
})