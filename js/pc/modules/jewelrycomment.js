/**
*珠宝详细页评论 dss 2017-03-30
**/
define(function(require, exports, module){
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
		var cid = parent_.find(".inputareabox textarea").attr('cid');
		var contents = parent_.find(".inputareabox textarea").val();
		lengthCheck(contents,8,200,1);
		// var option = 'wid='+wid+'&comment='+contents+'&PHPSESSID=&year=2014';
		var option = {
		 	'wid' : wid,
		 	'content' : contents,
			'PHPSESSID' : 1
		}
		if(cid){
			 // option = 'wid='+wid+'&comment='+contents+'&cid='+cid+'&PHPSESSID=&year=2014';
			 option = {
			 	'wid' : wid,
			 	'content' : contents,
			 	'q_cid' : cid,
				'PHPSESSID' : 1
			 }
		};
		if(t.attr("data-submit1") == 1){
			t.attr("data-submit1", 0);

			var _html='<dd class="clear"></dd><dd class="dd"><dl class="mycomment"><dd class="toparrow_r"><em>◆</em><b>◆</b></dd><dd class="inputareabox clearfix"><textarea class="left inputarea_comm"></textarea><p class="right"><a href="javascript:void(0);" class="f14 fyahei btn_submitcomm" data-submit1="1">评 论</a></p></dd><dd><ul class="replylist"></ul></dd></dl></dd>';
			parent_.find("ul.replylist").prepend(_html);
			parent_.find(".inputareabox textarea").val("");
			parent_.find("dd.more").show();
			parent_.find("dd.time_comment a.pl em").html(parseInt(parent_.find("dd.time_comment a.pl em").html()) + 1);
			t.attr("data-submit1", 1);
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

	function setHaoping(t,z,b,total){
		var _t = Math.round(t / total * 100);
		var _z = Math.round(z / total * 100);
		var _b = Math.round(b / total * 100);
		var _html = '<div class="commentitem_left left ta_c"><em><span>'+_t+'</span>%</em><p class="ta_c">推荐指数</p></div><div class="commentitem_cen left"><div class="commentitem_bai"><em class="commentitem_head"><span class="left">推荐</span><span class="right">('+_t+'%)</span></em><b class="commline"><i style="width:'+_t+'%"></i></b><span class="right">('+t+'人)</span></div><div class="commentitem_bai"><em class="commentitem_head"><span class="left">中立</span><span class="right">('+_z+'%)</span></em><b class="commline"><i style="width:'+_z+'%"></i></b><span class="right">('+z+'人)</span></div><div class="commentitem_bai"><em class="commentitem_head"><span class="left">不推荐</span><span class="right">('+_b+'%)</span></em><b class="commline"><i style="width:'+_b+'%"></i></b><span class="right">('+b+'人)</span></div></div><div class="commentitem_right left"><a href="#com" class="btn_gocomm">我来写点评</a><input type="hidden" value="'+t+'" id="mark_1" /><input type="hidden" value="'+z+'" id="mark_2" /><input type="hidden" value="'+b+'" id="mark_3" /></div>';
		$('.commentitem').html(_html);
		$('.comtotalnum').html(total);
		$('.dptotalnum').html(_t+'%');
	};
	function ctrlEnter(){
		$('body').keyup(function(e){
			if ( e.ctrlKey && e.which == 13){
				var _this = $('.inputcomming').parent().next().find('.btn_submitcomm');
				submitComment(_this);
			}
		});
	}
	function init(){
		//获取一级回复框焦点
		//$("#commentBoxId").find('h3, .commentitem, .tab_commlist').show();
		ctrlEnter();
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
			click: function(){
				$(this).prev().focus();
			}
		});
		//认同计数
		$("dl.watch_comment dd.time_comment a.rt").live("click", function(){
			agreeweibo($(this));
		});
		//评论提交（一级回复）
		$("dl.watch_comment a.btn_submitcomm[data-submit1=1]").live("click", function(){
			//submitComment($(this));
		});
		//二级回复框加载
		$("dl.watch_comment ul.replylist a.hf").live("click", function(){
			createReplyBox($(this));
			$('.inputcomming').keyup();
		});

		//评论主页特有
		if(typeof $("#commentBoxId")[0] != "undefined"){

			/* 初始化
			 * 组合评论列表
			 */
			function getHtmlStr(data){
				var html="";
				if(data.total>0){
					$.each(data.list,function(i,item){
						var html_reply='';
						if(item.reply_num>0){
							html_reply+='<dd class="clear"></dd><dd class="dd"><dl class="mycomment"><dd class="toparrow_r"><em>◆</em><b>◆</b></dd><dd><ul class="replylist">';
							$.each(item.reply_list,function(key,val){
								html_reply+='<li class="clearfix" data-rule="'+val.id+'"><div class="left"><a href="javascript:void(0);"><img src="'+val.avatar+'" width="30" height="30"></a></div><div class="replysay"><p class="replysay_cont"><a href="javascript:">'+val.nickname+'</a>: '+val.content+'</p><p class="ta_r"><span class="left gray">'+val.time+'</span><a href="javascript:void(0)" class="dellink" data-submit3="1" style="display:none">删除</a><a class="hf" href="javascript:void(0)"><img class="comment" src="http://www.xbiao.com/images/ico_0.gif">回复</a></p><div class="box_hf"></div></div></li>';
							});
							html_reply+='</ul></dd><dd class="inputareabox clearfix"><span class="rply">回复：</span><em class="pos_rel"><textarea class="inputarea_comm"></textarea><label class="inputarea_label">请控制在200汉字以内</label></em><p class="ta_r comm_ctrl"><em class="left commtotal"><span class="red commtotal_now">0</span>/200字</em>支持Ctrl+回车<a href="javascript:;" class="btn_reset">取消</a><a href="javascript:void(0)" class="btn_submitcomm" data-submit1="1">回复</a></p></dd></dl></dd>';
						}

						html+='<dl class="watch_comment" data-id="'+item.id+'" data-type="2"><dt class="left"><a href="'+item.home+'" target="_blank"><img src="'+item.avatar+'" width="50" height="50"></a></dt><dd class="dd comm_cont userName"><em class="left"><a href="'+item.home+'" target="_blank">'+item.nickname+'</a></em></dd><dd class="dd comm_cont"><p class="tag_2em"><span class="tag">【'+item.recommend+'】</span>'+item.content+'</p></dd><dd class="dd time_comment clearfix"><span class="left time f_11 gray">'+item.inputtime+'</span><div class="right nobg"><a class="f_12 rt" href="javascript:void(0)" data-rule4="0" id="'+item.id+'"><img class="toptop" src="http://www.xbiao.com/images/ico_0.gif">认同 <em>'+item.agree+'</em></a><a class="f_12 pl" href="javascript:void(0)" data-rule1="2"><img class="comment" src="http://www.xbiao.com/images/ico_0.gif">回复 <em>'+item.reply_num+'</em></a></div></dd><span class="box">'+html_reply+'</span></dl>';
					});
				}
				return html;
			}
			//评论组合html
			function calladdweibo(data){
				return '<dl class="watch_comment" data-id="'+data.wid+'" data-type="2"><dt class="left"><a href="'+data.home+'" target="_blank"><img src="'+data.avatar+'" width="50" height="50"></a></dt><dd class="dd comm_cont userName"><em class="left"><a href="'+data.home+'" target="_blank">'+data.username+'</a></em></dd><dd class="dd comm_cont"><p class="tag_2em"><span class="tag">【'+data.recommend+'】</span>'+data.contents+'</p></dd><dd class="dd time_comment clearfix"><span class="left time f_11 gray">'+data.time+'</span><div class="right nobg"><a class="f_12 rt" href="javascript:void(0)" data-rule4="0" id="'+data.wid+'"><img class="toptop" src="http://www.xbiao.com/images/ico_0.gif">认同 <em>0</em></a><a class="f_12 pl" href="javascript:void(0)" data-rule1="2"><img class="comment" src="http://www.xbiao.com/images/ico_0.gif">回复 <em>0</em></a></div></dd><span class="box"></span></dl>';
			}
			//回复组合html
			function calladdreply(val){
				return '<li class="clearfix" data-rule="'+val.cid+'"><div class="left"><a href="javascript:void(0);"><img src="'+val.avatar+'" width="30" height="30"></a></div><div class="replysay"><p class="replysay_cont"><a href="javascript:">'+val.nickname+'</a>: '+val.content+'</p><p class="ta_r"><span class="left gray">'+val.time+'</span><a href="javascript:void(0)" class="dellink" data-submit3="1" style="display:none">删除</a><a class="hf" href="javascript:void(0)"><img class="comment" src="http://www.xbiao.com/images/ico_0.gif">回复</a></p><div class="box_hf"></div></div></li>';
			}
			//赞同微博
			function agreeweibo(t){
				if(!_ISLOGIN){
					return NotLogin("登录后您就可以赞TA了");
				}
				if(t.attr("data-rule4") == 0){
					t.attr("data-rule4", 1);
					var weibo_id = t.attr("id");
					$.ajax({
						type: "GET",
						url: XBIAO_ROOT + "/jewelleryComments/agreeWeibo/",
						data: "wid=" + weibo_id,
						dataType: 'jsonp',
						jsonp: 'callback',
						success: function(html){
							if(html.status==1){
								t.find("em").html(parseInt(t.find("em").html()) + 1);
							}
							else{
								t.attr("data-rule4", 0);
							}
						},
						error: function(){
							t.attr("data-rule4", 0);
						}
					});
				}
			};

			/*
			 * 获取评论列表
			 */
			var page = 1;
			var pid  = $('#commentBoxId').attr('data-pid');
			function getwblist(){
				$.ajax({
					url:XBIAO_ROOT +'/jewelleryComments/wblist/',
					type:'GET',
					dataType:'jsonp',
					jsonp:'callback',
					data:{
						'type':1,
				        'from_id': pid,
				        'page':page,
				        // 'pagesize':10
					},
					success: function(res){
						var _html = getHtmlStr(res);
						// console.log(res);
						if(res.total==0){
							$('.comment-info span').html(res.total);
							return;
						}
						if(res.page==1){
							$('.comment-info span').html(res.total);
							$('.area_comment').html(_html);
							$('#lookMoreComm').show();
						}else{
							$('.area_comment').append(_html);
						}
						if(page<res.total_page){
							page++;
						}else{
							$('#lookMoreComm').hide();
						}
					}
				})
			}
			// 获取评论
			getwblist();
			$('#lookMoreComm').bind('click',getwblist);

			//回复提交
			$(".btn_submitcomm").live('click',function(){
				var _this=$(this).parents("dl.watch_comment");
				var wid=_this.attr('data-id');
				var content=_this.find(".inputarea_comm").val();
				var q_cid=_this.find(".inputarea_comm").attr('cid');
				if(content==''){
					window.alert('请输入内容');
					return false;
				}
				$.ajax({
					type: "GET",
					url:XBIAO_ROOT+ "/jewelleryComments/addreply/",
					dataType:'jsonp',
					jsonp:"callback",
					data: {wid:wid,content:content,'PHPSESSID':1,q_cid:q_cid},
					success: function(html){
						if(html.status==1){
							var _html=calladdreply(html.data);
							if(_this.find("ul.replylist li").size() <= 0){
								_html='<dd class="clear"></dd><dd class="dd"><dl class="mycomment"><dd class="toparrow_r"><em>◆</em><b>◆</b></dd><dd><ul class="replylist">'+_html+'</ul></dd><dd class="inputareabox clearfix"><span class="rply">回复：</span><em class="pos_rel"><textarea class="inputarea_comm"></textarea><label class="inputarea_label">请控制在200汉字以内</label></em><p class="ta_r comm_ctrl"><em class="left commtotal"><span class="red commtotal_now">0</span>/200字</em>支持Ctrl+回车<a href="javascript:;" class="btn_reset">取消</a><a href="javascript:void(0)" class="btn_submitcomm" data-submit1="1">回复</a></p></dd></dl></dd>';
								_this.find(".box").html(_html);
							}else{
								_this.find(".replylist").append(_html);

							}
							_this.find("dd.more").hide();
							_this.find(".inputarea_comm").val('');
						}else{
							window.alert(html.message);
						}
					}
				});
			});

			//点击评论加载
			 $("#commentBoxId dl.watch_comment dd.time_comment div.right a.pl").live("click", function(){
			 	var t = $(this), parent_ = t.parents("dl.watch_comment");
			 	if(t.attr("data-rule1") == 0){
			 		t.attr("data-rule1", 1);
			 		/*$.ajax({
			 			type: "POST",
			 			url:XBIAO_ROOT+ "/jewelleryComments/addreply/",
			 			dataType:'jsonp',
			 			jsonp:"callback",
			 			data: "id="+parent_.attr("data-id")+"&year=2014&rdm="+parseInt(100*Math.random()),
			 			success: function(html){
			 				parent_.find(".box").html(html.html);
			 				if(parent_.find("ul.replylist li").size() <= 0){
			 					parent_.find("dd.more").hide();
			 				}
			 			}
			 		});
			 		return false;*/
			 	}
			 	if(t.attr("data-rule1") == 1){
			 		parent_.find(".box").hide();
			 		t.attr("data-rule1", 2);
			 		return false;
			 	}
			 	if(t.attr("data-rule1") == 2){
			 		t.attr("data-rule1", 1);
					if(parent_.find(".inputarea_comm").length == 0){
						var _html='<dd class="clear"></dd><dd class="dd"><dl class="mycomment"><dd class="toparrow_r"><em>◆</em><b>◆</b></dd><dd class="inputareabox clearfix"><textarea class="left inputarea_comm"></textarea><p class="right"><a href="javascript:void(0);" class="f14 fyahei btn_submitcomm" data-submit1="1">评 论</a></p></dd><dd><ul class="replylist"></ul></dd></dl></dd>';
						parent_.find(".box").html(_html);
					}
					if(parent_.find("ul.replylist li").size() <= 0){
						parent_.find("dd.more").hide();
					}
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
				var contents = $('#xdp_textareacont').val();
				var recommend = $("#setInputValue").val();
				var from = t.attr("data-pid");
				if(t.attr("data-submit") == 1){
					lengthCheck(contents,8,200);
					if(contents.length > 8 && contents.length <= 200 ){
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
							url:XBIAO_ROOT+ "/jewelleryComments/addweibo/",
							data:{
								'type':wb_type,
								'from_id': pid,
						        'contents': contents,
						        'recommend':recommend,
								'PHPSESSID':1
							},
							success: function(data){
								if(data.status==0){
									alert(data.message);
								}else{
									var _html=calladdweibo(data.data);
									if($("#commentBoxId .area_comment").length>0){
										$("#commentBoxId .area_comment").prepend(_html);
									}else{
										$("#commentBoxId").find('.area_comment').html(_html);
									}
									$("#commentBoxId").find('h3, .commentitem, .tab_commlist').show();
									$('#mark_'+recommend).val(parseInt($('#mark_'+recommend).val())+1);
									/*var data_t = parseInt($('#mark_1').val());
									var data_z = parseInt($('#mark_2').val());
									var data_b = parseInt($('#mark_3').val());
									data_total = data_t+data_z+data_b;
									setHaoping(data_t,data_z,data_b,data_total);*/
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
			$("#xdp_textareacont").bind({
				focus : function(){
					if(!_ISLOGIN){
						return NotLogin("登录后您就可以点评了");
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
			//输入计数
			$('.inputarea_comm').live('keyup',function(){
				var _len = $.trim( $(this).val()).length;
				$(this).parent().next().find('.commtotal_now').text(_len);
			})
			//取消
			$('.btn_reset').live('click',function(){
				var _textarea = $(this).parents('.mycomment').find('.inputarea_comm');
				_textarea.val('');
				_textarea.removeAttr('cid');
				$(this).parent().find('.commtotal_now').text(0);
				_textarea.blur();

			})
		}
	}
	module.exports = init;
})
