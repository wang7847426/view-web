$(function () {
    myBubble();//canvas冒泡
    ninePageClick();//page9点击事件
    doWx();//默认微信分享
    // loading
    // var arrImglist = [
    //     "http://www.xbiao.com/images/static/mido16/bg1.jpg",
    //     "http://www.xbiao.com/images/static/mido16/bg10.jpg",
    //     "http://www.xbiao.com/images/static/mido16/bg11.jpg",
    //     "http://www.xbiao.com/images/static/mido16/nine-watch1.png",
    //     "http://www.xbiao.com/images/static/mido16/nine-watch2.png",
    //     "http://www.xbiao.com/images/static/mido16/three-watch.png",
    //     "http://www.xbiao.com/images/static/mido16/one-center.png",
    //     "http://www.xbiao.com/images/static/mido16/eight-watch.png",
    //     "http://www.xbiao.com/images/static/mido16/seven-watch.png"
    // ];

    // function fnLoading(p) {
    //     document.getElementById('progressbar').innerHTML = parseInt(p * 100) + "%";
    //     $('.range2').css({'width': parseInt(p * 400) + 'px'});

    // };

    // var load = new Load(fnLoading, fnLoadcomplete, arrImglist, 20);
    // load.Start();

    // function fnLoadcomplete() {
    //     $('.loading').fadeOut(1000, function () {
    //         this.remove();
    //     })

    //     swiperAnimateCache(mySwiper);
    //     swiperAnimate(mySwiper);
    //     // 播放音乐
    //     // $('.music').show()
    //     // music();
    // }

    var player = new Plyr('#player', {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen']
    });


    $('.one-btn').on('click', function () {
        mySwiper.slideTo(1);
        $('.bg1').fadeOut();
    });


    //初始化整个大页面的swiper
    var mySwiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        paginationClickable: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        watchSlidesProgress: true,
        observer: true,
        //touchMoveStopPropagation : false,
        onTransitionStart: function (swiper) {

        },
        onTransitionEnd: function (swiper) {
            swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
        }
    })

    function deepNum(i) {
        var j = 0;
        var i = i - 2;
        var timer;
        timer = setInterval(function () {
            if (j == 9) {
                j = 0;
                i++;
                clearInterval(timer);
            }
            $('#deepNum').html(i * 100 + j++ * 10);
        }, 100)
    }

    //canvas 冒泡
    function myBubble() {
        var demo = new JumpBubble({
            elCanvas: document.getElementById("myCanvas")
        });
        clearInterval(setDemo1);
        var setDemo1 = setInterval(function () {
            var idName = "img" + Math.ceil(Math.random() * 22);
            demo.create({
                elImg: document.getElementById(idName)
            });
        }, 200);
    }


    var smallSwiper = new Swiper('.swiper-container-small', {
        direction: 'horizontal',
        prevButton: '.page9prev',
        nextButton: '.page9next',
        loop: 'true'
    })

    function ninePageClick() {
        $('.nine-plus').bind('click', function () {
            $(this).siblings(".param").show();
        })
        $('.nine-close').bind('click', function () {
            $(this).parent().hide();
        })
    }

    var GOLBAL = {
        wxOptions: {
            title: "123123",
            desc: "123123123132",
            imgUrl: "https://wang7847426.github.io/view-web/wedding/images/000.png"
        }
    };

    function doWx() {
        var timestamp, nonceStr, signature;
        $.ajax({
            url: "http://www.xbiao.com/weiXin/getSignPackage?callback=?",
            dataType: "jsonp",
            async: false,
            data: {url: encodeURIComponent(window.location.href.split('#')[0])},
            success: function (data) {
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
                    document.getElementById("video2").play();
                })
            }
        });
    };

})
