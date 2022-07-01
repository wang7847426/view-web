/**
*巴塞尔评论
**/
define(function(require, exports, module) {
	function reply(){
		if(_ISLOGIN){
			$('.inputarea_comm').focus();
		}
		else{
			$('#loginTitle').html("登陆后可继续您的操作");
			$("#open_f").click();
		}
	}
	function trim(str){ //删除左右两端的空格
		return str.replace(/(^\s*)|(\s*$)/g, "");
	}
	function lengthCheck(obj,minLen,maxLen,type){
		var txt = '';
		txt = (typeof type == 'undefined') ? '评论' : '回复';
		if(obj.length < minLen){
			alert(txt + '内容不能小于'+ minLen +'个字');
			return false;
		}
		if(obj.length > maxLen){
			alert(txt + '内容不能超过'+ maxLen +'个字');
			return false;
		}
	}
	//提交评论
	function submitCommentmain(t){
		if(!_ISLOGIN){
			return NotLogin("登录后您就可以评论了");
		}
		if(t.attr('class')=="commSubmit"){
			return false;
		}
		var comment = $("#commAreaInput").val();
		var contentid = '2017baselhuaxu';
		// var wb_type = $("#commentBoxId").attr("data-type");
		$.ajax({
			url: XBIAO_ROOT+"/comments/ztAddWeibo",
			type: 'GET',
			dataType: 'jsonp',
			jsonp: 'callback',
			data: {contents:comment,from_site:1,contentid:contentid,PHPSESSID:0},
			error: function (){
				alert("对不起，评论失败，请稍后再试。");
			},
			success: function(data){
				if (data.status != 1){
					alert(data.msg);
				}
				else if(data.status == 1){
					$("#commAreaInput").val("");
					var _avatar=$("#avatar").attr('src');
					var _name=$(".orange a").html();
					var _home=$(".orange a").attr('href'); 
					var _html='<dl class="watch_comment"><dt class="left"><a href="'+ _home +'" target="_blank"><img src="'+ _avatar +'"></a></dt><dd class="dd comm_cont userName"><em class="left"><a href="'+ _home +'" target="_blank">'+ _name +'</a></em></dd><dd class="dd comm_cont"><p class="f14"> '+ comment +'</p></dd><dd class="dd time_comment clearfix"><span class="left time">'+ '刚刚'+'</span></dd><span class="box"><dd class="clear"></dd></span></dl>';
					$("#commList").prepend(_html);
				}
			}
		});
	}
	function init(){
		
			//提交评论
			$("#comment_submit").click(function(){
				submitCommentmain($(this));
			});
			//写评论
			$("#commAreaInput").live('focus',function(){
				if(!_ISLOGIN){
					return NotLogin("登录后您就可以评论了");
				}
			})
			//评论输入框提示文字
			$("#commAreaInput").focus(function(){
				$(this).next("label").hide();
			}).blur(function(){
				if($.trim($(this).val()) == ""){
					$(this).next("label").show();
				}
			});
			setTimeout(function(){
				if(!_ISLOGIN){
					$('.comment_area_center label').html('点击登录后，发表精彩评论');
				}
			},500)

			//输入计数-评论框
			$('#commAreaInput').live('keyup',function(){
				var _len = $.trim( $(this).val()).length;
				if(_len > 5){
					$('#comment_submit').addClass('commSubmiting');
				}else{
					$('#comment_submit').removeClass('commSubmiting');
				}
			});

	}
	
	module.exports = init;
})