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

//提交一级回复
function submitComment(t){
	if(!_ISLOGIN){
		return NotLogin("登录后您就可以评论了");
	}
	var parent_ = t.parents("dl.watch_comment");
	var wid = parent_.attr("data-id");
	var contents = parent_.find(".inputareabox textarea").val();
	lengthCheck(contents,8,140);
	if(t.attr("data-submit1") == 1){
		t.attr("data-submit1", 0);
		$.ajax({
			type: "GET",
			url: XBIAO_ROOT+"/comments/addreply/",
			dataType:'jsonp',
			jsonp:'callback',
			data: 'wid='+wid+'&comment='+contents+'&PHPSESSID=',
			success: function(data){
				t.attr("data-submit1", 1);
				if(data.status == -1){
					return NotLogin("登录后您就可以评论了");
				}
				else if (data.status == 0){
					alert(data.msg);
				}else{
					parent_.find("ul.replylist").prepend(data.html);
					parent_.find(".inputareabox textarea").val("");
					parent_.find("dd.more").show();
					parent_.find("dd.time_comment a.pl em").html(parseInt(parent_.find("dd.time_comment a.pl em").html()) + 1);
				}
			},
			error: function(){
				t.attr("data-submit1", 1);
			}
		});
	}
}
//创建回复框
function createReplyBox(t){
	if(!_ISLOGIN){
		return NotLogin("登陆后可继续您的操作");
	}
	t.parents(".replylist").find(".replytoo").remove();
	t.parents(".replysay").find(".box_hf").html('<dl class="mar_t15 replytoo"><dd class="toparrow_yel"><em>◆</em><b>◆</b></dd><dd class="replytoobox"><textarea class="f12">回复@'+ t.parents("li.clearfix").find(".replysay_cont a:first").text() +' ：</textarea></dd><dd class="replytoobox ta_r mar_t10"><a href="javascript:void(0)" class="btn_submitcomm" data-submit2="1">评论</a></dd></dl>');
	t.parents(".replysay").find(".box_hf textarea").focus();
}
//提交二级回复
function submitReply(t){
	var parent_ = t.parents("dl.watch_comment");
	if(t.attr("data-submit2") == 1){
		var comment = parent_.find(".replytoobox textarea").val();
		var content = comment.substring(comment.indexOf(":") + 1, comment.length);
		if(content.length > 0){
			lengthCheck(comment,8,140,1);
			t.attr("data-submit2", 0);
			var wid = parent_.attr("data-id");
			var cid = t.parents("li.clearfix").attr("data-rule");
			$.ajax({
				type: "GET",
				url:XBIAO_ROOT+ "/comments/addreply/",
				dataType:'jsonp',
				jsonp:'callback',
				data: "wid="+wid+"&comment="+comment+"&cid="+cid+"&PHPSESSID=",
				success: function(data){
					t.attr("data-submit2", 1);
					
					if(data.status == -1){
						return NotLogin("登录后您就可以评论了");
					}
					else if (data.status == 0){
						alert(data.msg);
					}else{
						parent_.find("ul.replylist").prepend(data.html);
						parent_.find(".replytoobox textarea").val("");
						parent_.find("dd.time_comment a.pl em").html(parseInt(parent_.find("dd.time_comment a.pl em").html()) + 1);
					}
					
				},
				error: function(){
					t.attr("data-submit2", 1);
				}
			});
		} 
		else{
			alert("评论内容不能为空");
		}
	}
}

$(document).ready(function(){
	//获取一级回复框焦点
	$(".inputarea_comm").live({
		focus : function(){
			if(!_ISLOGIN){
				return NotLogin("登录后您就可以评论了");
			}
		}
	});
	//认同计数
	$("dl.watch_comment dd.time_comment a.rt").live("click", function(){
		agree($(this));
	});
	//评论提交（一级回复）
	$("dl.watch_comment a.btn_submitcomm[data-submit1=1]").live("click", function(){
		submitComment($(this));
	});
	//二级回复框加载
	$("dl.watch_comment ul.replylist a.hf").live("click", function(){
		createReplyBox($(this));
	});
	//回复提交（二级回复）
	$("dl.watch_comment dd.replytoobox a").live("click", function(){
		submitReply($(this));
	});
	
	//评论主页特有
	if(typeof $("#commentBoxId")[0] != "undefined"){
		
		//初始化加载
		var contentid = $("#commentBoxId").attr("data-pid");
		var wb_type = $("#commentBoxId").attr("data-type");
		var str=XBIAO_ROOT+"/comments/wblist/type/"+wb_type+"/id/"+contentid;
		var getjnurl = str+"/d/"+Math.random()+'?callback=?';
		$.getJSON(getjnurl,
			function(data){
				$("#commentBoxId").html(data.html);
			}
		);
		//点击评论加载
		$("#commentBoxId dl.watch_comment dd.time_comment div.right a.pl").live("click", function(){
			var t = $(this), parent_ = t.parents("dl.watch_comment");
			if(t.attr("data-rule1") == 0){
				t.attr("data-rule1", 1);
				$.ajax({
					type: "GET",
					url:XBIAO_ROOT+ "/comments/clist/",
					dataType:'jsonp',
					jsonp:"callback",
					data: "id="+parent_.attr("data-id")+"&rdm="+parseInt(100*Math.random()),
					success: function(html){
						parent_.find(".box").html(html.html);
						if(parent_.find("ul.replylist li").size() <= 0){
							parent_.find("dd.more").hide();
						}
					}
				});
				return false;
			}
			if(t.attr("data-rule1") == 1){
				parent_.find(".box").hide();
				t.attr("data-rule1", 2);
				return false;
			}
			if(t.attr("data-rule1") == 2){
				t.attr("data-rule1", 1);
				$.ajax({
					type: "GET",
					url:XBIAO_ROOT+ "/comments/clist/",
					dataType:'jsonp',
					jsonp:"callback",
					data: "id="+parent_.attr("data-id")+"&rdm="+parseInt(100*Math.random()),
					success: function(html){
						parent_.find(".box").html(html.html);
						if(parent_.find("ul.replylist li").size() <= 0){
							parent_.find("dd.more").hide();
						}
					}
				});
				parent_.find(".box").show();
				return false;
			}
		});	
		//点评提交
		$("#butDianPing").live("click", function(){
			if(!_ISLOGIN){
				return NotLogin("登录后您就可以点评此款腕表了");
			}
			var t = $(this);
			var contents = t.parents(".xdp_cont").find("textarea").val();
			var recommend = $("#setInputValue").val();
			var from = t.attr("data-pid");
			if(t.attr("data-submit") == 1){
				lengthCheck(contents,8,140);
				if(contents.length > 8 && contents.length <= 140 ){
					if(recommend==0){
						alert("请选择您的态度");
						return;
					}
					t.attr("data-submit", 0);
					var wb_type = $("#commentBoxId").attr("data-type");
					$.ajax({
						type: "GET",
						dataType: 'jsonp',
						jsonp:'callback',
						url:XBIAO_ROOT+ "/comments/addweibo/",
						data:"type="+wb_type+"&contents="+contents+"&recommend="+recommend+"&from_id="+from+"&PHPSESSID=",
						success: function(data){
							if(data.status==-1){
								return NotLogin("登录后您就可以评论了");
							}else if(data.status==0){
								alert(data.msg);
							}else{
								if($("#commentBoxId .area_comment").length>0){
									$("#commentBoxId .area_comment").prepend(data.html);
								}else{
									$("#commentBoxId").prepend('<div class="main-module mt" id="watch_weibo"><h3>腕表点评</h3><div class="area_comment">'+data.html+'</div></div>');
								}
								t.attr("data-submit", 1);
								t.parents(".xdp_cont").find("textarea").val("");
							}
						}
					});
				}
			}else{
				alert("已经点评过了哦！");
			}
		});
	
		//评论框获取焦点
		$(".commentarea textarea").bind({
			focus : function(){
				$(this).addClass("focus");
			},
			blur : function(){
				$(this).removeClass("focus");
			}
		});
		
		//选择推荐
		$(".xdp_radio label").click(function(){
			if(!_ISLOGIN){
				return NotLogin("登录后您就可以点评此款腕表了");
			}
			for(var i=0; i<$(".xdp_radio label").length; i++ ){
				$(".xdp_radio label").eq(i).removeClass("active");
			}
			$(this).addClass("active");
			$("#setInputValue").val($(this).attr("data-val"));
		});
		
		//评论框获取焦点 new
		$(".xdp_textarea textarea").bind({
			focus : function(){
				if(!_ISLOGIN){
					return NotLogin("登录后您就可以点评此款腕表了");
				}
				if($.trim($(this).val()) == ""){
					$(this).parents(".xdp_textarea").addClass("xdp_textarea_focus");
					$(this).next("label").css("display","none");
				}
			},
			blur : function(){
				if($.trim($(this).val()) == ""){
					$(this).parents(".xdp_textarea").removeClass("xdp_textarea_focus");
					$(this).next("label").css("display","block");
				}
			}
		});
	
	}
});