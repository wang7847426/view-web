/**
*文章详细页评论
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
		var contentid = $("#commentBoxId").attr("data-pid");
		var wb_type = $("#commentBoxId").attr("data-type");
		$.ajax({
			url: XBIAO_ROOT+"/comments/addweibo",
			type: 'GET',
			dataType: 'jsonp',
			jsonp: 'callback',
			data: {contents:comment,type:wb_type,from_id:contentid,PHPSESSID:0,year:2016},
			error: function (){
				alert("对不起，评论失败，请稍后再试。");
			},
			success: function(data){
				if (data.status != 1){
					alert(data.msg);
				}
				else if(data.status == 1){
					$("#commAreaInput").val("");
					$("#commList").prepend(data.html);
				}
			}
		});
	}
	//提交一级回复
	function submitComment(t){
		if(!_ISLOGIN){
			return NotLogin("登录后您就可以评论了");
		}
		var parent_ = t.parents("dl.watch_comment");
		var wid = parent_.attr("data-id");
		var cid = parent_.find(".inputareabox textarea").attr('cid');
		var contents = parent_.find(".inputareabox textarea").val();
		//lengthCheck(contents,8,200,1);
		var option = 'wid='+wid+'&comment='+contents+'&PHPSESSID=&year=2016';
		if(cid){
			 option = 'wid='+wid+'&comment='+contents+'&cid='+cid+'&PHPSESSID=&year=2016';
		};
		if(t.attr("data-submit1") == 1){
			t.attr("data-submit1", 0);
			$.ajax({
				type: "GET",
				url: XBIAO_ROOT+"/comments/addreply/",
				dataType:'jsonp',
				jsonp:'callback',
				data: option,
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

		var _textarea = t.parents('.mycomment').find('.inputarea_comm');
		_textarea.focus();
		_textarea.attr('cid',function(){
			var cid = t.parents("li.clearfix").attr("data-rule");
			return cid;
		})
		_textarea.val('回复@'+ t.parents("li.clearfix").find(".replysay_cont a:first").text()+' ：')
	}

	function ctrlEnter(){
		$('body').keyup(function(e){
			if ( e.ctrlKey && e.which == 13){
				var _this = $('.inputcomming').parent().next().find('.btn_submitcomm');
				submitComment(_this);
			}
		});
	}
	function init(){
		
			//提交评论
			$("#comment_submit").click(function(){
				submitCommentmain($(this));
			});
			ctrlEnter();
			//一级回复框展开
			$(".inputarea_comm").live({
				focus : function(){
					if(!_ISLOGIN){
						return NotLogin("登录后您就可以评论了");
					}else{
						$(this).parents('.inputareabox ').addClass('inputareabox_act');
						$(this).addClass('inputcomming');
					}
				},
				blur : function(){
					if($(this).val() == ''){
						$(this).parents('.inputareabox ').removeClass('inputareabox_act');
					}
					$(this).removeClass('inputcomming');
				}
			});
			$(".inputarea_label").live({
				'click': function(){
					$(this).prev().focus();
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
				$('.inputcomming').keyup();
			});

			//评论主页特有
			if(typeof $("#commentBoxId")[0] != "undefined"){
				
				//初始化加载
				var contentid = $("#commentBoxId").attr("data-pid");
				var wb_type = $("#commentBoxId").attr("data-type");
				var str=XBIAO_ROOT+"/comments/wblist/type/"+wb_type+"/id/"+contentid+"/year/2016/limit/20/reply_limit/5";
				var getjnurl = str+"/d/"+Math.random()+'?callback=?';
				var page = 1;
				var pageflag = true;
				$.getJSON(getjnurl,
					function(data){
						//window.alert(data.html);
						$("#commentBoxId").show();
						$("#commentBoxId").html(data.html);
						if(data.total>20){
							$('.morecommwrap').show();//显示更多按钮
						}
					}
				);
				//点击加载评论分页
				$('a.morecommbtn').on('click',function(){
					if(!pageflag){return};
					pageflag = false;
					$(this).hide();
					$('span.morecommbtn').show();
					page++;
					$.getJSON(str+"/page/"+page+"/d/"+Math.random()+'?callback=?',
						function(data){
							$("#commentBoxId").show();
							$("#commentBoxId").append(data.html);
							if(page*20>data.total){
								$(".morecommwrap").hide();
								return;
							}
							$('a.morecommbtn').show();
							$('span.morecommbtn').hide();
							pageflag = true;
						}
					);
				})
				//点击评论回复
				$("#commentBoxId dl.watch_comment dd.time_comment div.right a.pl").live("click", function(){
					var t = $(this), parent_ = t.parents("dl.watch_comment");
					if(t.attr("data-rule1") == 0){
						t.attr("data-rule1", 1);
						$.ajax({
							type: "GET",
							url:XBIAO_ROOT+ "/comments/clist/",
							dataType:'jsonp',
							jsonp:"callback",
							data: "id="+parent_.attr("data-id")+"&year=2016&limit=100&rdm="+parseInt(100*Math.random()),
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
							data: "id="+parent_.attr("data-id")+"&year=2016&limit=100&rdm="+parseInt(100*Math.random()),
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
				//输入计数
				$('.inputarea_comm').live('keyup',function(){
					var _len = $.trim( $(this).val()).length;
					$(this).parent().next().find('.commtotal_now').text(_len);
				});
				//输入计数-评论框
				$('#commAreaInput').live('keyup',function(){
					var _len = $.trim( $(this).val()).length;
					if(_len > 5){
						$('#comment_submit').addClass('commSubmiting');
					}else{
						$('#comment_submit').removeClass('commSubmiting');
					}
				});
				//取消
				$('.btn_reset').live('click',function(){
					var _textarea = $(this).parents('.mycomment').find('.inputarea_comm');
					_textarea.val('');
					_textarea.removeAttr('cid');
					$(this).parent().find('.commtotal_now').text(0);
					_textarea.blur();
					
				})
				//写评论
				$("#commAreaInput").live('focus',function(){
					if(!_ISLOGIN){
						return NotLogin("登录后您就可以评论了");
					}
				})
				$("#comment_submit").click(function(){
					submitComment($(this));
				});
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
			}
	}
	
	module.exports = init;
})