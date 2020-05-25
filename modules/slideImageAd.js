/**
*公共头部联想搜索
**/
define(function(require, exports, module) {
  function slideImage(options){
    this.opt = options || {};
    this.opt.box = this.opt.box || '.boxSlide';
    this.opt.itemName = this.opt.itemName || '.item';
    this.opt.data = this.opt.data || '.dataSlide';
    this.opt.count = this.opt.count || 3;
    this.opt.time = this.opt.time || 6000;
    this.opt.settings = this.opt.settings || {};
    
    this.index = this.opt.settings.index;
    this.size = 0;
    this.width = 0;
    
    this.flag = true;
    this.flagNum = true;
    
    this.autoPlay = null;
    
    this.init();
  };

  slideImage.prototype = {
    init: function(){
      this.size = jQuery(this.opt.box + ' ' + this.opt.itemName).size();
      this.width = jQuery(this.opt.box + ' ' + this.opt.itemName).eq(0).outerWidth();
      this.createBar();
      this.bindEvent();
      jQuery(this.opt.box + 'Inner').css('width',this.width * (this.size+2))
      jQuery(this.opt.box + ' ' +this.opt.itemName).last().clone().prependTo(jQuery(this.opt.box + 'Inner'));
      
      var _firstNodeImg = jQuery(this.opt.box + ' ' +this.opt.itemName).eq(1).find('img:eq(0)').clone();
      var _firstNode = jQuery('<div class="item"></div>').append(_firstNodeImg);
      _firstNode.appendTo(jQuery(this.opt.box + 'Inner'));
      jQuery(this.opt.box + 'Inner').css('left',-640);
      jQuery(this.opt.box + ' ' + this.opt.itemName).eq(1).addClass('act');
      jQuery('.boxSlideNum em').html(this.size);
    },
    leftSlide: function(i){
      if(typeof i == 'undefined'){
        this.slideShow(this.index-1, 'left');
      }else{
        this.slideShow(i, 'left');
      }
      this.index <= 0 ? this.index = this.size -1 : --this.index;
    },
    rightSlide: function(i){
      if(typeof i == 'undefined'){
        this.slideShow(this.index+1, 'right');
      }else{
        this.slideShow(i, 'right');
      }
      this.index >= this.size-1 ? this.index = 0 : ++this.index;
    },
    slideShow: function(index){
      var self = this;    
      if(!self.flag){return};
      self.flag = false;
      jQuery(self.opt.box + ' ' + self.opt.itemName).removeClass('act');
      jQuery(self.opt.box + 'Inner')
      .animate({left:'-=' + self.width*(index-this.index)}, 'slow', function(){
        if(index < 0){
          jQuery(this).css('left',-self.width*(self.size)+120);
          jQuery('.boxSlideNum i').html(self.size);
          jQuery(self.opt.box + ' ' + self.opt.itemName).eq(self.size).addClass('act');
        }else if(index > self.size-1){
          jQuery(this).css('left',-640);
          jQuery('.boxSlideNum i').html(1);
          jQuery(self.opt.box + ' ' + self.opt.itemName).eq(1).addClass('act');
        }else{
          jQuery('.boxSlideNum i').html(index+1);
          jQuery(self.opt.box + ' ' + self.opt.itemName).eq(index+1).addClass('act');
        }
        if(index > self.size-1){
          self.cssBar(0);
        }else{
          self.cssBar(index);
        }
        self.flag = true;
        self.flagNum = true;
      });

    },
    slideShowNum:function(i){
      var self = this;    
      if(!self.flagNum) return false;
      self.flagNum = false;
      
      if(i < self.index){
        self.leftSlide(i);
        self.index = i;
      }
      else if(i > self.index){
        self.rightSlide(i);
        self.index = i;
      }else{
        self.flag = true;
        self.flagNum = true;
      }

    },
    createBar: function(){
      if(this.size <= 0) return false;
      for(var i = 0;i < this.size;i++){
        if(i == this.index) {
          jQuery("<b/>").appendTo(jQuery(this.opt.box + 'Bar')).addClass('hover');
        }
        else {
          jQuery("<b/>").appendTo(jQuery(this.opt.box + 'Bar'));
        }
      }
    },
    cssBar: function(i){
      jQuery(this.opt.box + 'Bar b').removeClass('hover').eq(i).addClass('hover');
    },
    autoSlide: function(t){
      var self = this;
      self.autoPlay = setInterval(function(){
        self.rightSlide();
      }, t);
    },
    clearAuto: function(pos){
      var self = this;
      jQuery(self.opt.box + pos).mouseenter(function(){
        if(self.autoPlay) clearInterval(self.autoPlay);
      });
      jQuery(self.opt.box + pos).mouseleave(function(){
        if(self.autoPlay) clearInterval(self.autoPlay);
        self.autoSlide(self.opt.time);
      });
    },
    bindEvent: function(){
      var self = this;
      jQuery(self.opt.box + 'left').click(function(){
        if(!self.flag){return};
        self.leftSlide();
      });
      jQuery(self.opt.box + 'right').click(function(){
        if(!self.flag){return};
        self.rightSlide();
      });
      jQuery(self.opt.box + 'Bar b').live('click', function(){
        self.slideShowNum(jQuery(self.opt.box + 'Bar b').index(this));
      });

      self.autoSlide(self.opt.time);
      self.clearAuto('left');
      self.clearAuto('right');
      self.clearAuto('Bar');
    }
  };
  module.exports = slideImage;
})
