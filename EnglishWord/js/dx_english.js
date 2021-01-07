$(function(){

  function dxFun (){
    this.minWord = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    this.mySwiper = null;
  }
  dxFun.prototype = {
    init:function(){
      this.initSwiper();
      this.ajaxRequest();
      this.domOperate();
    },
    initSwiper(){
      var _this = this;
      _this.mySwiper = new Swiper(".swiper-container",{
        onSlideChangeEnd:function(swiper){
          _this.supplyWord();
        }
      })
    },
    ajaxRequest(){
      var _this= this;
      $.ajax({
        type: "get",

        datatype: "json",
        url: "../json/word.json",
        success: function(data){
            var str = ""
            data.forEach((val,index)=>{
              str += '<div class="swiper-slide"><div class="yw">'+ val.yw +'</div><div class="dy" data-yw="'+ val.yw +'">'+ val.dy +'</div><div class="zw">'+ val.zw +'</div></div>';
            })
            $(".swiper-wrapper").append(str);
            _this.mySwiper.update();
            _this.supplyWord();
        }   
      });
    },
    supplyWord(){
      var _this = this;
      var ywArr = $(".swiper-slide-active .yw").html().split("");
      var newYwArr = []; 
      for(var i = 0; i < 5 - (ywArr.length % 5); i++){
        newYwArr.push(_this.minWord[parseInt(Math.random() * _this.minWord.length)]);
      }
      newYwArr = ywArr.concat(newYwArr);

      var ywArrIndex = _this.createRandom(newYwArr);

      var str = "", str1 = "";
      for(var b = 0; b < ywArrIndex.length; b++){
          str +='<li>'+ newYwArr[ywArrIndex[b]] +'</li>';
          if(b <= ywArr.length-1){
            str1 += '<li>_</li>';
          }
      }
      $(".px_word").html(str);
      $(".english_word").html(str1);
      $(".px_layer .zw").html($(".swiper-slide-active .zw").html());
      $(".px_layer .dy").html($(".swiper-slide-active .dy").html()).attr("data-yw", $(".swiper-slide-active .yw").html());
    },
    // 创建 随机数
    createRandom(newYwArr){
      var ywArrIndex = [];
      function generateRandom(count){
        var rand = parseInt(Math.random() * count);
        for(var a = 0; a < ywArrIndex.length; a++){
           if (ywArrIndex[a] == rand) return false;
        }
        ywArrIndex.push(rand);
      }

      for(var j = 0; ; j++){
        if(ywArrIndex.length < newYwArr.length){
         generateRandom(newYwArr.length)
        }else{
          break;
        }
      }
      return ywArrIndex;
    },
    domOperate(){
        var audioEle = document.getElementById("audio");
        document.getElementById("swiper-wrapper").onclick = function(ev){
          if(ev.target.className == "dy"){
            audioEle.setAttribute("src", "http://dict.youdao.com/dictvoice?audio="+ ev.target.getAttribute("data-yw") +"&type=1")
            audioEle.play();
          }
        }
        document.getElementById("px_layer_dy").onclick = function(){
            audioEle.setAttribute("src", "http://dict.youdao.com/dictvoice?audio="+ this.getAttribute("data-yw") +"&type=1")
            audioEle.play();
        }
          var clickIndex = 0, pxWord=[], eleLi = null;
      document.getElementById("show_px_layer").onclick = function(){
          if(this.className.indexOf("act") == -1){
             this.innerHTML = "×"
            this.className = "show_px_layer act";
            $(".px_layer").animate({top: 0,opacity:1}, "1s");
          } else {
            this.innerHTML = "拼写"
            this.className = "show_px_layer";
            $(".px_layer").animate({top: "100%",opacity:"0"}, "1s");
            clickIndex = 0;pxWord=[];
          }
      }
      document.querySelector(".px_word").onclick = function(ev){  
        if(ev.target.localName == "li"){

          eleLi = ev.target;
          if(eleLi.className == "act"){
            pxWord.splice(eleLi.getAttribute("data-index"), 1,"_");
            eleLi.className = "";
            eleLi.setAttribute("data-index","");
            clickIndex--;
          } else{
            if(pxWord.indexOf("_") == -1){
              pxWord.push(ev.target.innerHTML);
              eleLi.className = "act";
              eleLi.setAttribute("data-index",clickIndex)

            }else{
              eleLi.setAttribute("data-index",pxWord.indexOf("_"));
              pxWord.splice(pxWord.indexOf("_"), 1, ev.target.innerHTML);
              eleLi.className = "act";
            }
          }
          var ywStr = $(".swiper-slide-active .yw").html(),str = "";
          for(var i = 0; i < ywStr.length; i++){
            if(!pxWord[i]){
              str += "<li>_</li>"
            }else{
              str += "<li>"+ pxWord[i] +"</li>"
            }
          }

          $(".english_word").html(str);

          if(pxWord.length >= ywStr.length){


            if(pxWord.join("") === ywStr){
              console.log("拼写正确");
            }else{
              console.log(pxWord.join(""));
              console.log("拼写不正确");

            };


          }

        

        }
      }

    }
  }
  
  var dx = new dxFun();
  dx.init();
})
