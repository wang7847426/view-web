/**
*评论公共模块
by:zmt@2016/1/27 aaaa
**/
define(function(require, exports, module) {
	function Comment(option){
		var self = this;
		var option = option || {};
		this.dataType = option.dataType || 'json';
		this.loadCommentsUrl = this.dataType == 'json' ? option.loadCommentsUrl : option.loadCommentsUrl+'?callback=?';
		this.commentUrl = this.dataType == 'json' ? option.commentUrl : option.commentUrl+'?callback=?';
		this.replyUrl = this.dataType == 'json' ? option.replyUrl : option.replyUrl+'?callback=?';
		this.btnSubmit = option.btnSubmit || $('#comment_submit');//评论提交按钮
		this.replyBtn = option.replyBtn || '.time_comment a.pl';//回复按钮
		this.replySubmit = option.replySubmit || $('.btn_submitcomm');//回复提交按钮
		this.dataCommOpt = option.dataCommOpt || {};
		this.replyHtml = function(data){
			var _replyHtml = '<li class="clearfix" data-rule="'+data.id+'">\
			<div class="left"><a href="'+data.home+'"><img src="'+data.avatar+'" width="30" height="30"></a></div>\
			<div class="replysay">\
				<p class="replysay_cont"><a href="'+data.home+'">'+data.nickname+'</a>: '+data.content+'</p>\
				<p class="ta_r">\
					<span class="left gray">'+data.time+'</span>\
					<a class="hf" href="javascript:void(0)">\
						<img class="comment" src="http://www.xbiao.com/images/ico_0.gif">回复\
					</a>\
				</p>\
				<div class="box_hf"></div>\
			</div>\
			</li>';
			return _replyHtml;
		};
		this.commentHtml =  function(data){
			var _replyHtml = '';
			if(parseInt(data.reply_num) > 0){
				_replyHtml = '<dd class="dd"><dl class="mycomment"><dd class="toparrow_r"><em>◆</em><b>◆</b></dd><dd><ul class="replyList">';
				this.replyHtml(data.reply_list);
				$.each(data.reply_list,function(i,val){
					_replyHtml += self.replyHtml(val);
				});
				_replyHtml += '</ul></dd><dd class="inputareabox clearfix"><span class="rply">回复：</span><em class="pos_rel"><textarea class="inputarea_comm"></textarea><label class="inputarea_label">请控制在200汉字以内</label></em><p class="ta_r comm_ctrl"><em class="left commtotal"><span class="red commtotal_now">0</span>/200字</em>支持Ctrl+回车<a href="javascript:;" class="btn_reset">取消</a><a href="javascript:void(0)" class="btn_submitcomm" data-submit1="1">回复</a></p></dd></dl></dd>';
			}
			var _commentHtml = '<dl class="watch_comment" data-id="'+data.id+'"><dt class="left"><a href="'+data.home+'" target="_blank"><img src="'+data.avatar+'"></a></dt><dd class="dd comm_cont userName"><em class="left"><a href="'+data.home+'" target="_blank">'+data.nickname+'</a><span class="gray">['+data.ipaddress+'网友]</span></em></dd><dd class="dd comm_cont"><p class="f14">'+data.content+'</p></dd><dd class="dd time_comment clearfix"><span class="left time">'+data.inputtime+'</span><div class="right"><a class="f_12 rt" href="javascript:void(0)" data-rule4="0" id="'+data.id+'"><img class="toptop" src="http://www.xbiao.com/images/ico_0.gif"><em>'+data.agree+'</em></a><a class="f_12 pl" href="javascript:void(0)" data-rule1="'+(data.reply_num>0?1:0)+'"><img class="comment" src="http://www.xbiao.com/images/ico_0.gif"><em>'+data.reply_num+'</em></a></div></dd><span class="box"><dd class="clear"></dd>'+_replyHtml+'</span></dl>'
			return _commentHtml;
		};
		// 主评论回调私人定制，本来这一段没必要，php把加载和提交的字段没统一，所以只能多此一举 dss2017-12-28
		this.mainHtml =  function(data){
			var _replyHtml = '';
			if(data.status == 1){
				_replyHtml = '<dd class="dd"><dl class="mycomment"><dd class="toparrow_r"><em>◆</em><b>◆</b></dd><dd><ul class="replyList">';
				_replyHtml += '</ul></dd><dd class="inputareabox clearfix"><span class="rply">回复：</span><em class="pos_rel"><textarea class="inputarea_comm"></textarea><label class="inputarea_label">请控制在200汉字以内</label></em><p class="ta_r comm_ctrl"><em class="left commtotal"><span class="red commtotal_now">0</span>/200字</em>支持Ctrl+回车<a href="javascript:;" class="btn_reset">取消</a><a href="javascript:void(0)" class="btn_submitcomm" data-submit1="1">回复</a></p></dd></dl></dd>';
			}
			var _commentHtml = '<dl class="watch_comment" data-id="'+data.id+'"><dt class="left"><a href="'+data.href+'" target="_blank"><img src="'+data.avatarSrc+'">\
			</a></dt><dd class="dd comm_cont userName"><em class="left"><a href="'+data.href+'" target="_blank">'+data.userName+'</a>\
			<span class="gray">['+data.ipaddress+'网友]</span></em></dd><dd class="dd comm_cont"><p class="f14">'+data.commentCont+'</p></dd>\
			<dd class="dd time_comment clearfix"><span class="left time">'+data.commentTime+'</span>\
			<div class="right"><a class="f_12 rt" href="javascript:void(0)" data-rule4="0" id="'+data.id+'">\
			<img class="toptop" src="http://www.xbiao.com/images/ico_0.gif"><em>'+data.commentAgreeNum+'</em></a>\
			<a class="f_12 pl" href="javascript:void(0)" data-rule1="0">\
			<img class="comment" src="http://www.xbiao.com/images/ico_0.gif"><em>'+data.commentReplyNum+'</em></a></div></dd><span class="box"><dd class="clear">\
			</dd></span></dl>'
			return _commentHtml;
		};
		this.reply2Html = function(data){
			var _replyHtml = '<li class="clearfix" data-rule="'+data.cid+'">\
			<div class="left"><a href="'+data.home+'"><img src="'+data.avatar+'" width="30" height="30"></a></div>\
			<div class="replysay">\
				<p class="replysay_cont"><a href="'+data.home+'">'+data.nickname+'</a>: '+data.content+'</p>\
				<p class="ta_r">\
					<span class="left gray">'+data.time+'</span>\
					<a class="hf" href="javascript:void(0)">\
						<img class="comment" src="http://www.xbiao.com/images/ico_0.gif">回复\
					</a>\
				</p>\
				<div class="box_hf"></div>\
			</div>\
			</li>';
			return _replyHtml;
		};
		this.init();
	}
	Comment.prototype = {
		init : function(){
			this.loadFirstPage();
			this.bindEvent();
		},
		loadFirstPage : function(){
			var self = this;
			$.ajax({
				url: self.loadCommentsUrl,
				dataType: self.dataType,
				data: {'from_id':self.dataCommOpt.from_id,
						'type':self.dataCommOpt.type,
						'nolimit':1
				},
				success: function(data){
					// console.log(data)
					// return;
					if(data.list.length > 0){
						var commentHtml = '';
						$.each(data.list,function(i,val){
							commentHtml += self.commentHtml(val);
						});
					}
					$('#commList').html(commentHtml);
				}
			});
		},
		bindEvent : function(){
			this.commentFocus();//评论框focus
			this.totalcomment();//评论输入计数器
			this.submitComment();//提交评论

			this.createReply();//创建回复框
			this.replyFocus();//回复框获取焦点
			this.atReply();//回复的回复at
			this.submitReply();//提交回复
			this.ctrlEnter();//快捷键提交
		},
		//评论框focus
		commentFocus : function(){
			var self = this;
			$("#commAreaInput").focus(function(){
				if(!_ISLOGIN){
					NotLogin("登录后您就可以评论了");
					return;
				}
				$(this).next("label").hide();
			}).blur(function(){
				if($.trim($(this).val()) == ""){
					$(this).next("label").show();
				}
			});
		},
		//评论输入计数器
		totalcomment : function(){
			var self = this;
			$('#commAreaInput').live('keyup',function(){
				var _len = $.trim( $(this).val()).length;
				if(_len > 5){
					$('#comment_submit').addClass('commSubmiting');
				}else{
					$('#comment_submit').removeClass('commSubmiting');
				}
			});
		},
		//提交评论
		submitComment : function(){
			var self = this;
			self.btnSubmit.on('click',function(){
				if(!_ISLOGIN){
					NotLogin("登录后您就可以评论了");
					return;
				}else{
					if(self.btnSubmit.hasClass('commSubmiting')){
						self.dataCommOpt.contents = $("#commAreaInput").val();
						$.ajax({
							url: self.commentUrl,
							type: 'GET',
							dataType: self.dataType,
							data: self.dataCommOpt,
							success: function(data){
								if (data.status != 1){
									var msg = '';
									switch (data.status){
									case -1:
										msg = '您的账号已被禁止';
										break;
									case -2:
										msg = '您的IP地址已被禁止';
										break;
									case -3:
										msg = '您未登录';
										break;
									case -4:
										msg = '评论内容为空';
										break;
									default:
										msg = '评论失败';
									}
									alert(msg);
								}else{
									self.submitCommentCallback(data.conmmentdata);
								}
							}
						})
					}
				}
			})
		},
		//提交评论成功回调
		submitCommentCallback : function(data){
			var self = this;
			$("#commAreaInput").val("");
			$("#commList").prepend(self.mainHtml(data));
		},
		//提交回复
		submitReply : function(obj){
			var self = this;
			$(document).on('click','.btn_submitcomm[data-submit1=1]',function(){
				var obj = $(this);
				if(!_ISLOGIN){
					NotLogin("登录后您就可以评论了");
					return;
				}else{
					self.submitReplyAjax(obj);
				}
			});
			
		},
		//提交回复ajax
		submitReplyAjax : function(obj){
			var self = this;
			var _parent = obj.parents("dl.watch_comment");
			var wid = _parent.attr("data-id");
			var cid = _parent.find(".inputareabox textarea").attr('cid');
			var contents = _parent.find(".inputareabox textarea").val();
			var dataOpt = {
				'wid':wid,
				'content':$.trim(contents)
			};
			if(dataOpt.comment == ''){
				alert("请输入内容");
				return;
			}
			if(cid){
				dataOpt.q_cid = cid;
			};
			if(obj.attr("data-submit1") == 1){
				obj.attr("data-submit1", 0);
				$.ajax({
					type: "GET",
					url: self.replyUrl,
					dataType: self.dataType,
					data: dataOpt,
					success: function(data){
						obj.attr("data-submit1", 1);
						if (data.status == 1){
							_parent.find("ul.replyList").prepend(self.reply2Html(data.data));
							_parent.find(".inputareabox textarea").val("");
							_parent.find("dd.time_comment a.pl em").html(parseInt(_parent.find("dd.time_comment a.pl em").html()) + 1);
						}else{
							alert(data.msg);
						}
					},
					error: function(){
						obj.attr("data-submit1", 1);
					}
				});
			}
		},
		//创建回复框
		createReply : function(){
			var self = this;
			var _replyHtml = '<dd class="dd"><dl class="mycomment"><dd class="toparrow_r"><em>◆</em><b>◆</b></dd><dd><ul class="replyList"></ul></dd><dd class="inputareabox clearfix"><span class="rply">回复：</span><em class="pos_rel"><textarea class="inputarea_comm"></textarea><label class="inputarea_label">请控制在200汉字以内</label></em><p class="ta_r comm_ctrl"><em class="left commtotal"><span class="red commtotal_now">0</span>/200字</em>支持Ctrl+回车<a href="javascript:;" class="btn_reset">取消</a><a href="javascript:void(0)" class="btn_submitcomm" data-submit1="1">回复</a></p></dd></dl></dd>';
			$(document).on('click',self.replyBtn,function(){
				var _this = $(this),_parent = _this.parents('.watch_comment');
				var dataOpt = {
					'id' : _parent.attr('data-id')
				}
				if(_this.attr("data-rule1") == 0){
					_this.attr("data-rule1", 1);
					_parent.find('.box').append(_replyHtml);
				}else if(_this.attr("data-rule1") == 1){
					_parent.find(".box").hide();
						_this.attr("data-rule1", 2);
				}else{
					_parent.find(".box").show();
					_this.attr("data-rule1", 1);
				}
			})
		},
		atReply : function(){
			var self = this;
			$(document).on('click','.replysay a.hf',function(){
				if(!_ISLOGIN){
					return NotLogin("登陆后可继续您的操作");
				}
				var _this = $(this);
				var _textarea = _this.parents('.mycomment').find('.inputarea_comm');
				var _li = _this.parents("li");
				_textarea.focus();
				_textarea.attr('cid',function(){
					var cid = _li.attr("data-rule");
					return cid;
				})
				_textarea.val('回复@'+ _li.find(".replysay_cont a:first").text()+' ：')
			})
		},
		//回复输入计数器
		totalReply : function(){
			var self = this;
			$('.inputarea_comm').live('keyup',function(){
				var _len = $.trim( $(this).val()).length;
				$(this).parent().next().find('.commtotal_now').text(_len);
			});
		},
		//取消回复
		resetReply : function(){
			var self = this;
			$('.btn_reset').live('click',function(){
				var _textarea = $(this).parents('.mycomment').find('.inputarea_comm');
				_textarea.val('');
				_textarea.removeAttr('cid');
				$(this).parent().find('.commtotal_now').text(0);
				_textarea.blur();
				
			})
		},
		//ctrl+enter提交
		ctrlEnter : function(){
			var self = this;
			$('body').keyup(function(e){
				if ( e.ctrlKey && e.which == 13){
					var _this = $('.inputcomming').parent().next().find('.btn_submitcomm');
					self.submitReplyAjax(_this);
				}
			});
		},

		//回复框获得焦点
		replyFocus : function(){
			var self = this;
			$(document).on('click','.inputarea_label',function(){
				$(this).prev().focus();
			});
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
			self.totalReply();//输入计数
			self.resetReply();//取消
		}
	}
	module.exports = Comment;
})