/**
*文章详细页评论
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
		return true;
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
		if(!lengthCheck(contents,10,200,1)){
			return;
		};
		var option = 'wid='+wid+'&comment='+contents+'&PHPSESSID=&year=2014';
		if(cid){
			 option = 'wid='+wid+'&comment='+contents+'&cid='+cid+'&PHPSESSID=&year=2014';
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

	function cirle(){
		//环形条效果
		var percent = parseFloat($(".cirle_pic_percent").html());
		var realNum = percent/100;
		var leftcirle = $(".leftcirle");
		var rightcirle = $(".rightcirle");
		var rightangle,leftangle;

		if(percent >=50){
			rightangle = (1-realNum)*360 + 225;
		}else{
			leftangle = (0.5-realNum)*360 + 225;
			rightangle = 405;
		}		

		leftcirle.css({
			'transform': 'rotate(' + leftangle + 'deg)'
		})
		rightcirle.css({
			'transform': 'rotate(' + rightangle + 'deg)'
		});

	}

	function setHaoping(t,z,b,total){
		var _t = Math.round(t / total * 100); 
		var _z = Math.round(z / total * 100);
		var _b = Math.round(b / total * 100);
		// var _html = '<div class="commentitem_left left ta_c"><em><span>'+_t+'</span>%</em><p class="ta_c">推荐指数</p></div><div class="commentitem_cen left"><div class="commentitem_bai"><em class="commentitem_head"><span class="left">推荐</span><span class="right">('+_t+'%)</span></em><b class="commline"><i style="width:'+_t+'%"></i></b><span class="right">('+t+'人)</span></div><div class="commentitem_bai"><em class="commentitem_head"><span class="left">中立</span><span class="right">('+_z+'%)</span></em><b class="commline"><i style="width:'+_z+'%"></i></b><span class="right">('+z+'人)</span></div><div class="commentitem_bai"><em class="commentitem_head"><span class="left">不推荐</span><span class="right">('+_b+'%)</span></em><b class="commline"><i style="width:'+_b+'%"></i></b><span class="right">('+b+'人)</span></div></div><div class="commentitem_right left"><a href="#com" class="btn_gocomm">我来写点评</a><input type="hidden" value="'+t+'" id="mark_1" /><input type="hidden" value="'+z+'" id="mark_2" /><input type="hidden" value="'+b+'" id="mark_3" /></div>';
		// $('.commentitem').html(_html);
		// $('.comtotalnum').html(total);
		// $('.dptotalnum').html(_t+'%');
		var _html = `<div class="cirle_pic">
						<div class="cirle_pic_left_solid">
							<div class="leftcirle"></div>
						</div>
						<div class="cirle_pic_right_solid">
							<div class="rightcirle"></div>
						</div>
						<span class="cirle_pic_percent">`+ _t +`%</span>
						<span class="cirle_pic_info">推荐指数</span>
					</div>
					<div class="commentitem_cen left">
						<div class="commentitem_bai">
							<em class="commentitem_head">
								<span class="left">推荐</span>
								<span class="right">(`+ _t +`%)</span>
							</em>
							<b class="commline"><i style="width:`+ _t +`%"></i></b>
							<span class="right">(`+ t +`人)</span>
						</div>
						<div class="commentitem_bai">
							<em class="commentitem_head">
								<span class="left">中立</span>
								<span class="right">(`+ _z +`%)</span>
							</em>
							<b class="commline"><i style="width:`+ _z +`%"></i></b>
							<span class="right">(`+ z +`人)</span>
						</div>
						<div class="commentitem_bai">
							<em class="commentitem_head">
								<span class="left">不推荐</span>
								<span class="right">(`+ _b +`%)</span>
							</em>
							<b class="commline"><i style="width:`+ _b +`%"></i></b>
							<span class="right">(`+ b +`人)</span>
						</div>
					</div>`;
		$(".analysis_table").html(_html);
		$("#commentBoxId .h3_note").html('(' + total + '篇)');
		cirle();
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
			var str=XBIAO_ROOT+"/comments/wblist/type/"+wb_type+"/id/"+contentid+"/year/2014/reply_limit/5";
			var getjnurl = str+"/d/"+Math.random()+'?callback=?';
			$.getJSON(getjnurl,
				function(data){
					if(data.total > 0){
						setHaoping(data.t,data.z,data.b,data.total);
						$("#commentBoxId").find('h3, .commentitem, .tab_commlist').show();
						$(".area_comment").show();
						$(".watch_info_note").hide();
					}
					if(data.total > 10){
						$('#lookMoreComm a.r-text[data-type="2"]').show();
					}
					$("#commentBoxId").find('.area_comment').html(data.html);
					$('.tab_commlist li.act').click();

					if(data.total<8){
						$(".tab_commlist li.act").siblings().hide();
					}
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
						data: "id="+parent_.attr("data-id")+"&year=2014&rdm="+parseInt(100*Math.random()),
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
						data: "id="+parent_.attr("data-id")+"&year=2014&rdm="+parseInt(100*Math.random()),
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
				var contents = $('#xdp_textareacont').val();
				var recommend = $("#setInputValue").val();
				var from = t.attr("data-pid");
				if(t.attr("data-submit") == 1){
					lengthCheck(contents,10,200);
					if(contents.length >10 && contents.length <= 200 ){
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
							data:"type="+wb_type+"&contents="+contents+"&recommend="+recommend+"&from_id="+from+"&PHPSESSID=&year=2014",
							success: function(data){
								if(data.status==0){
									alert(data.msg);
								}else{
									if($("#commentBoxId .area_comment").length>0){
										$("#commentBoxId .area_comment").prepend(data.html);
									}else{
										$("#commentBoxId").find('.area_comment').html(data.html);
									}
									$('.wonderful_comment .tit_h3,.goodcomment,.tab_commlist,.area_comment,.comm_page').show();
									$(".watch_info_note").hide();
									var newNum = parseInt($(".commentitem_bai").eq(recommend-1).find("span:last").html().slice(1));
									$(".commentitem_bai").eq(recommend-1).find("span:last").html('(' + (newNum+1) + '人)');
									var data_t = parseInt($(".commentitem_bai").eq(0).find("span:last").html().slice(1));
									var data_z = parseInt($(".commentitem_bai").eq(1).find("span:last").html().slice(1));
									var data_b = parseInt($(".commentitem_bai").eq(2).find("span:last").html().slice(1));
									data_total = data_t+data_z+data_b;
									setHaoping(data_t,data_z,data_b,data_total);
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