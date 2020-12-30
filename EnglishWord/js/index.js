
$(document).ready(function (){
    // loading
    var arrImglist = [
        "../../images/static/iwc2020/banner-text-1.png",
        "../../images/static/iwc2020/part03-bg.jpg",
        "../../images/static/iwc2020/part04-bg.jpg",
        "../../images/static/iwc2020/part06-bg.jpg",
        "../../images/static/iwc2020/part05-bg.jpg",
        "../../images/static/iwc2020/part10-bg.jpg",
        "../../images/static/iwc2020/part07-bg.jpg",
        "../../images/static/iwc2020/part09-bg.jpg"
    ];
    var load = new Load(fnLoading,fnLoadcomplete,arrImglist,20);
    load.Start();
    function fnLoadcomplete(){
        $('.loading').remove();
        swiperAnimateCache(mySwiper);
        swiperAnimate(mySwiper);
    };

    var partContent = new Swiper ('.part10-content', {
        loop: true,
        prevButton: '.arr_left',
        nextButton: '.arr_right',
    });

    var onOff = true;
    //初始化整个大页面的swiper
    var mySwiper = new Swiper ('.container', {
        direction: 'vertical',
        paginationClickable: true,
        slidesPerView : 'auto',
        centeredSlides : true,
        watchSlidesProgress: true,
        observer:true,
        // touchMoveStopPropagation : false,
        onProgress: function(swiper){
            for (var i = 0; i < swiper.slides.length; i++){
                var slide = swiper.slides[i];
                var progress = slide.progress;
                scale = 1 - Math.min(Math.abs(progress * 0.2), 1);
                es = slide.style;
                es.opacity = 1 - Math.min(Math.abs(progress/5),1);
                es.zIndex = scale*100;
                //es.webkitTransformStyle = es.webkitTransformStyle = 'preserve-3d',
                es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'scale('+ scale +')';
                es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'translate(0,'+(-Math.abs(progress*250))+'px) scale('+ scale +')';
            }
        },
        onSetTransition: function(swiper, speed) {
            for (var i = 0; i < swiper.slides.length; i++) {
                es = swiper.slides[i].style;
                es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = speed + 'ms';
            }
        },
        onTransitionEnd: function(swiper){
            swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
        }

    })

    var player = new Plyr('#player', {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen']
    });

    $(".part01-video-bg").bind("click",function(){
        $(this).fadeOut(500);
        player.play();;
    })

    $(".part05-point").bind("click",function(){
        $(this).siblings(".part05-3").fadeIn(500)
    })
    $(".part11-btn").bind("click",function(){
        $(".part11-share").show().siblings(".part11-img-list").hide();
    })

    var GOLBAL = {wxOptions:{title:"“飞”凡精英 飞行员系列TOP GUN海军空战部队计时腕表“SFTI”特别版",desc:"“飞”凡精英 飞行员系列TOP GUN海军空战部队计时腕表“SFTI”特别版",imgUrl:""}};
    function doWx(){
        var timestamp,nonceStr,signature;
        $.ajax({ url: "http://www.xbiao.com/weiXin/getSignPackage?callback=?",dataType:"jsonp",async:false,data:{url:encodeURIComponent(window.location.href.split('#')[0])},success: function(data){
            timestamp = data.timestamp;
            nonceStr = data.nonceStr;
            signature = data.signature;
            wx.config({
                debug: false,
                appId: 'wx96ccb2373a02f51b',
                timestamp: timestamp,
                nonceStr: nonceStr,
                signature: signature,
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage'
                ]
            });
            wx.ready(function () {
                // music auto play start
                //document.getElementById("player").play();
                // music auto play end
                wx.checkJsApi({
                    jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage'
                    ]
                });
                //分享给朋友
                wx.onMenuShareAppMessage({
                    title: GOLBAL.wxOptions.title,
                    desc: GOLBAL.wxOptions.desc,
                    imgUrl: GOLBAL.wxOptions.imgUrl
                });
                //分享到朋友圈
                wx.onMenuShareTimeline({
                    title: GOLBAL.wxOptions.title,
                    imgUrl: GOLBAL.wxOptions.imgUrl
                });
            })
        }});
    };
    //默认微信分享
    doWx();

})
