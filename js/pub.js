var _isie6 = window.XMLHttpRequest ? false : true;
var _ISLOGIN = 0;
jQuery.noConflict();
seajs.config({
  base: "./",
  map: [
    [ /^(.*\.(?:css|js))(.*)$/i, '$1?t=' + (+new Date())]
  ]
});
jQuery(document).ready(function($){
  seajs.use(['modules/checklogin'],function(checklogin){
    checklogin.init();//登录
  });
  seajs.use(['modules/nav'],function(nav){
    nav();//导航
  });
  seajs.use(['modules/focus'],function(Focus){
    // 小轮播
      var focus = new Focus({
          'next':jQuery('.onebox-next'),
          'prev':jQuery('.onebox-prev'),
          'scroll':jQuery('.onebox ul'),
          'box':jQuery('.onebox ul li'),
          'event':'click',
          'ms' : 3000
      });
  });
  seajs.use(['modules/slideImageAd'],function(slideImage){
    // 第一屏轮播
      new slideImage({
      box: '.boxSlide',
      itemName: '.item',
      data: '.dataSlide',
      time: 8000,
      count: 3, //展示几个
      settings: {
        index : 0
      }
    });
  });
  adchange();//首页广告位替换
});

//ajax请求，关注
function cardPlusGZ(_this){
  var _html,_type,_url,_alertTxt;
  if(!_ISLOGIN){
    createAlert('您需要登录后才可以操作');
    return;
  }
  if(parseInt(_this.attr("data-type")) > -1){
    var type = parseInt(_this.attr("data-type"));
    if(type==2){
      if(!confirm("确认解除好友吗？")){
        return false;
      }
      _url = HOME_URL+'/user/unfollow';
      _type = 0;
      _html = '加为好友';
      _alertTxt = '成功解除好友';
    }else{
      _url = HOME_URL+'/user/dofollow';
      _type = 2;
      _html = '解除好友';
      _alertTxt = '成功加为好友';
    }
    var dataid = _this.attr("data-id");
    _this.attr("data-type", -1);
    jQuery.ajax({
      dataType: 'jsonp',
      url: _url,
      jsonp:'callback',
      data: {'id':dataid},
      success: function(data){
        _this.html(_html);
        _this.attr("data-type",_type);
        _this.parents('.p_pop').hide();
        createAlert(_alertTxt);
      }
    });
    
  }
};
function createAlert(html){
  var _html = '<div id="createAlertNode" style="position:fixed;_position:absolute;top:0;left:0;min-width:80px;max-width:300px;text-align:center;border-radius:5px;background-color:#666;color:#fff;opacity:.9;_filter:alpha(opacity=90);padding:15px 20px;">'+html+'</div>'
  jQuery('body').append(_html);
  var _top = jQuery(window).height()/2+'px';
  var _left = (jQuery(window).width()-jQuery('#createAlertNode').outerWidth())/2 +'px';
  jQuery('#createAlertNode').css({'left':_left,'top':_top});
  setTimeout(function(){
    jQuery('#createAlertNode').remove();
  },2000)
}
//用户访问统计
function getClientInfor(domain,t,id,b,p){
  var w = screen.width;
  var h = screen.height;
  var bStr = '', pStr = '';
  if(!t && !id) return false;
  if(b != undefined){bStr = '/b/'+b};
  if(p != undefined){pStr = '/p/'+p};
  jQuery.getJSON(domain +'/user/trace/w/'+w+'/h/'+h+'/t/'+t+'/id/'+id+bStr+pStr+'?kuasmyua=?');
};
//最新精华右侧
jQuery('.con li:eq(0)').show();
jQuery('.nav li:eq(0)').bind('mouseover',function(){
    jQuery(this).addClass('active-one');
    jQuery('.nav li:eq(1)').removeClass('active-two')
    jQuery('.con li:eq(0)').show();
    jQuery('.con li:eq(1)').hide();
})
jQuery('.nav li:eq(1)').bind('mouseover',function(){
    jQuery(this).addClass('active-two');
    jQuery('.nav li:eq(0)').removeClass('active-one')
    jQuery('.con li:eq(0)').hide();
    jQuery('.con li:eq(1)').show();
})
//广告位替换
function adchange(){
  jQuery('.adchange').each(function(){
    var _this =  jQuery(this);
    if(_this.parent().find('.adarea').size() == 0){
      _this.parent().prepend(_this.val())
    }
  })
}
