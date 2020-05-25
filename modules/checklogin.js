/**
*登录检查，登录后消息获取
**/
define(function(require, exports, module){
  var cookie = require('modules/cookie');
  module.exports = {
    //检查登录状态
    init:function(){
      this.ajax();
      this.boxLoginCtrl();
    },
    req:function(){
      var _self = this;
      var time_n = new Date().getTime();
      if(time_n - cookie.getCookie('loginAjaxCallBack') > 60*1000){
        _self.getNewNumCallBack();
      }
      else {
        if(cookie.getCookie('loginAjaxCallBackData') != null && cookie.getCookie('loginAjaxCallBackData') != 'undefined' && cookie.getCookie('loginAjaxCallBackData') != '') {
          var data = unescape(cookie.getCookie('loginAjaxCallBackData')); 
          var d = eval("({"+ data +"})");
          _self.ajaxCallBackData(d);
        }else{
          _self.getNewNumCallBack();
        }
      } 
    },
    getNewNumCallBack:function(){
      var _self = this;
      jQuery.getJSON(HOME_URL+"/user/getNewNum?callback=?", function(data){
        _self.ajaxCallBackData(data);
        var cookieStr = "";
        for(var item in data){
          cookieStr += "'"+item+"':'"+data[item]+"',";
        }
        cookieStr=cookieStr.substring(0,cookieStr.length-1);
        var time__ = new Date().getTime();
        cookie.setCookie("loginAjaxCallBack", time__, XBIAO_DOMAIN);
        cookie.setCookie("loginAjaxCallBackData", cookieStr, XBIAO_DOMAIN);
      });
    },
    ajaxCallBackData:function(data){
      if(data.total > 0){
        jQuery('.top-msg-mark').show();
      }else{
        jQuery('.top-msg-mark').hide();
      }
      data.fans > 0 ? jQuery('#notice_fans a').html('查看粉丝<i>'+data.fans+'</i>') : jQuery('#notice_fans a').html('查看粉丝');
      data.good > 0 ? jQuery('#notice_good a').html('查看赞我的<i>'+data.good+'</i>') : jQuery('#notice_good a').html('查看赞我的');
      data.comment > 0 ? jQuery('#notice_comment a').html('查看评论<i>'+data.comment+'</i>') : jQuery('#notice_comment a').html('查看评论');
      data.letter > 0 ? jQuery('#notice_letter a').html('查看私信<i>'+data.letter+'</i>') : jQuery('#notice_letter a').html('查看私信');
      data.system > 0 ? jQuery('#notice_system a').html('查看提醒<i>'+data.system+'</i>') : jQuery('#notice_system a').html('查看提醒');
      data.thread > 0 ? jQuery('#notice_thread a').html('我的帖子<i>'+data.thread+'</i>') : jQuery('#notice_thread a').html('我的帖子');
      data.weibo > 0 ? jQuery('#notice_weibo a').html('我的点评<i>'+data.weibo+'</i>') : jQuery('#notice_weibo a').html('我的点评');
    },
    ajax:function(){
      var _self = this;
      jQuery.ajax({
        url: XBIAO_ROOT+"/user/islogin6?callback=?",
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function(data){
          jQuery(".top-loginbox").html(data.msg);
          if(jQuery("#userinfo").length>0){
            jQuery("#userinfo").html(data.userinfo);
            jQuery(".other-login").html(data.otherlogin);
          }
          //文章详细页改版所用
          if(data.notlogin !=''){
            jQuery(".cWriteBox").prepend(data.notlogin);
          }
          else{
            jQuery(".cWriteBox").prepend('<div class="cWriteboxIslogin">'+data.user+'</div>')
          }
          if(data.hasavatar !=1){
            jQuery(".cWriteBox").prepend(data.hasavatar);
          }
          else{
            jQuery('#avatar').attr('src',data.avatar);
          }
          if(data.autojs != ''){
            _ISLOGIN = 1;
            var time_n = new Date().getTime();
            cookie.setCookie("loginAjaxCallBack", time_n, XBIAO_DOMAIN);
            _self.req();
            setInterval(function(){_self.req();},60*1000);
          }
        }
      });
    },
    boxLoginCtrl:function(){
      jQuery(".top-user-msg li a").live('click',function(){
        cookie.setCookie("loginAjaxCallBackData",'', XBIAO_DOMAIN);
        jQuery(this).find('i').remove();
        jQuery('.top-loginbox i').hide();
      })
    }
  }
})