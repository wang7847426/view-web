/**
*大爱喜欢表款
by:zmt@2016/1/27
**/
define(function(require, exports, module) {
	function DoLoveWatch(option){
		self = this;
		this.obj = $(option.ele);
		this.favorUrl = option.favorUrl;
		this.loveUrl = option.loveUrl;
		this.unloveUrl = option.unloveUrl;
		this.dataOpt = option.dataOpt || {};
		this.favorCallback = option.favorCallback;
		this.loveCallback = option.loveCallback;
		this.unloveCallback = option.unloveCallback;
		this.flag = true;
		this.init();
	} 
	DoLoveWatch.prototype = {
		init : function(){
			this.bindEvent();
			self.obj.each(function(i){
				self.initStausAjax($(this));
			})
		},
		initStausAjax : function(_this){
			$.ajax({
				url: self.favorUrl,
				type: "GET",
				dataType: 'jsonp',
				jsonp: 'jsoncallback',
				data: {
					'id':_this.attr('data-id'),
					'type':_this.attr('data-type')
				},
				success: function (data) {
					if(data.status == 1) {
						self.favorCallback(_this,data);
					}
				}
			});
		},
		bindEvent : function(){
			self.obj.on('click',function(){
				var _this = $(this);
				if(!_ISLOGIN){
					return NotLogin('登录后您就可以喜欢了');
				}
				if(!self.flag){
					return;
				}else{
					self.flag = false;
				}
				if(_this.attr('data-rule') == '1'){
					self.doLoveAjax(_this);
				}else{
					self.doUnLoveAjax(_this);
				}
			})
		},
		doLoveAjax : function(_this){
			$.ajax({
				url: self.loveUrl,
				type: "GET",
				dataType: 'jsonp',
				jsonp: 'jsoncallback',
				data: {
					'id':_this.attr('data-id'),
					'type':_this.attr('data-type')
				},
				success: function (data) {
					if(data.status == 1) {
						self.loveCallback(_this,data);
					}
					setTimeout(function(){self.flag = true;},1000);
				}
			});
		},
		doUnLoveAjax : function(_this){
			$.ajax({
				url: self.unloveUrl,
				type: "GET",
				dataType: 'jsonp',
				jsonp: 'jsoncallback',
				data: {
					'id':_this.attr('data-id'),
					'type':_this.attr('data-type')
				},
				success: function (data) {
					if(data.status == 1) {
						self.unloveCallback(_this,data);
					}
					setTimeout(function(){self.flag = true;},1000);
				}
			});
		}
	}
	module.exports = DoLoveWatch;
})
