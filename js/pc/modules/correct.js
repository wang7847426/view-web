/**
*表详情页纠错
by:zmt@2016/1/25
**/
define(function(require, exports, module) {
	function Correct(option){
		this.clickEle = $('.param-edit a');
		this.closeWinEle = $(".close,.close_font");
		this.crsfUrl = "/correct/csrf";
		this.ajaxUrl = "/correct/param";
		this.checkCodeUrl = "/correct/captcha/refresh/1";
		this.blackLayer = $("#overlay");
		this.init();
	}
	Correct.prototype = {
		init:function(){
			this.bindEvent();
		},
		//事件绑定
		bindEvent:function(){
			var self = this;
			self.clickEle.on('click',function(){
				if(!_ISLOGIN){
					return NotLogin("我们会显示纠错贡献者的ID，所以请先登录");
				}
				self.csrf();//csrf校验码
				self.refreshCode($('img.checkcode'));//刷新验证码
				self.showCorrectWin($(this));//弹窗
			})
			self.closeWinEle.on('click',function(){
				$(this).parents(".xbiao-window").css("display","none");
       			$("#overlay").css("display","none");
			})
			self.iptFocus();
			self.btnBind();
			self.refreshCodeOnce();
		},
		//TOKEN ? 我也不知道干吗使~
		csrf:function(){
			$.get(this.crsfUrl, function(result){
			   	$(":input[name='YII_CSRF_TOKEN']").val(result);
			});
		},
		//刷新验证码
		refreshCode:function(obj){
			var self = this;
			$.ajax({
				url: self.checkCodeUrl,
				dataType: 'json',
				cache: false,
				success: function(data) {
					obj.attr('src', data['url']);
					$('body').data('/correct/captcha.hash', [data['hash1'], data['hash2']]);
				}
			});
		},
		//点击刷新验证码
		refreshCodeOnce:function(){
			var self = this;
			$('img.checkcode').on('click',function(){
				var _this = $(this);
				self.refreshCode(_this);
			})
		},
		//表单输入框获取焦点事件
		iptFocus:function(){
			$(".base-edit-box li input,.xbiao-window textarea").on({"focusin":function(){
				if($(this).attr("name")!="verifyCode")
				$(this).prev('label').hide();
			},"focusout":function(){
				if($.trim($(this).val()).length<1){
					$(this).val("");
					$(this).prev('label').show();
				}
			}
		});
			$(".xbiao-window").on("click","#info_layer",function(){
				$(this).hide();
				$(this).next("input").focus();
			});
		   	$(".xbiao-window").on("click","#info_layer_textarea",function(){
				$(this).hide();
				$(this).next("textarea").focus();
			});
			$(".base-edit-box li input[type!='hidden'],.xbiao-window textarea").each(function(i){
				   if($(this).val().length>0);
				   $(this).val("");
			});
			$("#div_function").on("click",".func-edit-box label",function(){
				if($(this).prev("input").attr("checked")){
					$(this).prev("input").attr("checked",false);
				}else{
					$(this).prev("input").attr("checked",true);
				}
			});
		},
		//提交按钮绑定事件
		btnBind:function(){
			var self = this;
			$(".xbiao-window").on('click','.subbtn',function(){
				// 信息弹出框的确定按钮事件
				if($(this).parents(".xbiao-window").attr("id")=="div_message"){
				   	$(this).parents(".xbiao-window").css("display","none");
				   	if($(this).parents(".xbiao-window").data("from")=="close"){
						$("div_message").hide();
						$("#overlay").css("display","none");
				   	}else{
				        data = $(this).parents(".xbiao-window").data("from");
				        $(data).show();
				   	}
				}else{
					var _id = $(this).parents(".xbiao-window").attr("id").substring('4');
					self.formSubmit(_id);
				}
			})
			
		},
		formSubmit:function(_id){
			var self = this;
			var params = $("#div_"+_id).find("input,textarea").serializeArray();
		    var num = 0;
		    $("#div_"+_id).find("input[type!='hidden'][name!='verifyCode'][type!='submit']").each(function(){
		    	if($(this).val())
		    	num++;
		    });
		    $("#div_"+_id).find("textarea").each(function(){
		        if($(this).val())
		            num++;
		    });
		    if(!num){
		    	$("#div_"+_id).css("display","none");
		        $("#div_message").find(".win-hd").text("纠错失败");
		        $("#div_message").find(".param-edit-pop p").html("请您填写至少一项信息再提交！");
		        $("#div_message").css("display","block");
		        $("#div_message").data("from","#div_"+_id);
		        return false;
		    }
		    $.ajax({
		          type: 'post',
		          url: self.ajaxUrl,
		          data: params ,
		          success: function(data){
		        	self.refreshCode($('img.checkcode'));//刷新验证码
		            if(data == 'success'){
		                $("#div_"+_id).css("display","none");
		                $("#div_message").find(".win-hd").text("纠错成功");
		                $("#div_message").find(".param-edit-pop p").html("您提供的纠错信息已成功提交，工作人员审核后会更新该页面<br/>腕表之家再次感谢您为我们的支持!");
		                $("#div_message").css("display","block");
		                $("#div_message").data("from","close");
		                $(".base-edit-box").find("input[type!='hidden'][type!='submit'],textarea").each(function(){
					    	$(this).val("");
					    	$(this).prev().show();
					    });
		            }else{
		            	$("#div_"+_id).css("display","none");
		                $("#div_message").find(".win-hd").text("验证码错误");
		                $("#div_message").find(".param-edit-pop p").html(data);
		                $("#div_message").css("display","block");
		                $("#div_message").data("from","#div_"+_id);
		            }
		          }
		    });
		},
		//弹窗
		showCorrectWin:function(obj){
			this.blackLayer.css("display","block");
			var _id = obj.attr("id").substring('5');
			if($('#div_'+_id).css('position') == 'absolute'){
				var scrollTop = $(document).scrollTop();
				var top = scrollTop + 100;
				$('#div_'+_id).css("top",top+"px");
			}
			$('#div_'+_id).css({'display':'block'});
		}
	}
	module.exports = Correct;
})
