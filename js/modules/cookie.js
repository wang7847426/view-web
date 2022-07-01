define(function(require, exports, module){
	module.exports = {
		//设置cookies
		setCookie : function(name, value, domain){
	        var Days = 1;
	        var exp = new Date();
	        exp.setTime(exp.getTime() + Days*24*60*60*1000);
			document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() + ";path=/;domain=" + domain;
		},
		//读取cookies
		getCookie : function(name){
			var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	        if(arr=document.cookie.match(reg)){
	            return (arr[2]);
	        }
	        else{
	            return null;
	        }
		}
	}
})