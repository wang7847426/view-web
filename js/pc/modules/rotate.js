/*!
 * rotate Image JavaScript, 依赖jquery库
 * Copyright 2014, dazhi v2.0
 */
define(function(require, exports, module) {
	function rotateImage(options){
		this.opt = options || {};
		this.opt.box = this.opt.box || '.boxRotate';
		this.opt.nav = this.opt.nav || '.navRotate';
		this.opt.itemName = this.opt.itemName || '.item';
		this.opt.speed = this.opt.speed || 6000;
		this.opt.info = this.opt.info; // date:17-05-22  add by dss
		this.setCss = this.opt.setCss || [];
		
		this.iNow = 0;
		
		this.tabs = $(this.opt.nav).eq(0);
		this.tabItem = this.tabs.find(this.opt.itemName);
		this.container = $(this.opt.box).eq(0);
		this.items = this.container.find(this.opt.itemName);
		this.size = this.items.size();

		this.title = this.container.find('.title');
		this.prev = $(this.opt.box + 'left');
		this.next = $(this.opt.box + 'right');

		this.timer = null;
		this.aSort = [];

		this.init.apply(this, arguments);
		
	};

	rotateImage.prototype = {
		init: function(){
			this.bindEvent();
			this.one();
		},
		setInter: function(){
			this.iNow++;
			if(this.iNow > this.size-1) this.iNow = 0;
			this.tab();
		},
		tab: function(){
			if(typeof this.tabs[0] != 'undefined') {
				for(var i=0;i<this.size;i++) this.tabItem[i].className = 'item',this.startMove(this.tabItem[i], {opacity:40});
				this.tabItem[this.iNow].className = 'item hover';
				this.startMove(this.tabItem[this.iNow], {opacity:100});
			}
			// ---判断是否存在介绍信息info---
			if(this.opt.info){
				$(this.opt.info).hide();
				$(this.opt.info).eq(this.iNow).show();
			}
			var iSort = this.iNow;
			this.Sort();
			for(var i=0;i<iSort;i++){
				this.aSort.unshift(this.aSort.pop());
			}
			this.sMove();
		},
		Sort: function(){
			for(var i=0;i<this.size;i++){
				this.aSort[i] = this.setCss[i];
			}
		},
		sMove: function(){
			var self = this;
			for(var i=0;i<self.size;i++){
				var oDiv = self.items[i].getElementsByTagName('div')[0];
				self.startMove(oDiv, {opacity:75});
				self.startMove(self.items[i], self.aSort[i], function(){self.one();});
				self.items[i].className = 'item';
				oDiv.style.display = 'block';
				
				//
				self.startMove(self.title[i], {bottom:-parseInt(self.getStyle(self.title[i], 'height'))});
				//
				
			}
			self.items[self.iNow].className = 'item hover';
			self.items[self.iNow].getElementsByTagName('div')[0].style.display = 'none';
			
			//
			self.startMove(self.title[self.iNow], {bottom:0});
			//
			
			if (self.opt.success){
				self.opt.success.apply(self, [self.iNow, , self.items[i]]);
			}

			// console.log(self.iNow)
		},
		one: function(){
			for(var i=0;i<this.size;i++){
				if(this.items[i].style.width == this.setCss[0].width + 'px'){
					var oDiv = this.items[i].getElementsByTagName('div')[0];
					this.startMove(oDiv, {opacity:0});
					this.items[i].className = 'item hover';
					oDiv.style.display = 'none';
					
					//
					this.startMove(this.title[i], {bottom:0});
					//
					
					if (this.opt.success){
						this.opt.success.apply(this, [this.iNow, this.items[i]]);
					}
				}
			}
		},
		AddEvent: function(obj, sEvent, fn){
			if(obj.attachEvent){
				obj.attachEvent('on' + sEvent, function(){
					fn.call(obj);
				});
			}
			else{
				obj.addEventListener(sEvent, fn, false);
			}
		},
		startMove: function(obj, json, fnEnd){
			var self = this;
			if(obj.timer)clearInterval(obj.timer);
			obj.timer = setInterval(function (){
				self.doMove(obj, json, fnEnd);
			}, 30);
		},
		getStyle: function(obj, attr){
			return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
		},
		doMove: function(obj, json, fnEnd){
			var iCur = 0;
			var attr = '';
			var bStop = true;
			for(attr in json){
				attr == 'opacity' ? iCur = parseInt(100*parseFloat(this.getStyle(obj, 'opacity'))) : iCur = parseInt(this.getStyle(obj, attr));
				if(isNaN(iCur))iCur = 0;
				if(navigator.userAgent.indexOf("MSIE 8.0") > 0){
					var iSpeed = (json[attr]-iCur) / 3;
				}else{
					var iSpeed = (json[attr]-iCur) / 5;
				}
				iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
				if(parseInt(json[attr])!=iCur)bStop = false;
				if(attr=='opacity'){
					obj.style.filter = "alpha(opacity:"+(iCur+iSpeed)+")";
					obj.style.opacity = (iCur + iSpeed) / 100;
				}else{
					attr == 'zIndex' ? obj.style[attr] = iCur + iSpeed : obj.style[attr] = iCur + iSpeed +'px';
				}
			}
			if(bStop){
				clearInterval(obj.timer);
				obj.timer = null;		
				if(fnEnd)fnEnd();
			}
		},
		bindEvent: function(){
			var self = this;
			
			if(typeof self.tabs[0] != 'undefined') {
				for(var i=0;i<self.size;i++){
					self.tabItem[i].index = i;
					self.AddEvent(self.tabItem[i], 'mouseover', function(){
						self.startMove(this, {opacity:100});
					});
					self.AddEvent(self.tabItem[i], 'mouseout', function(){
						if(this.className != 'item hover') self.startMove(this, {opacity:40});
					});
					self.AddEvent(self.tabItem[i], 'click', function(){
						self.iNow = this.index;
						self.tab();
					});
				}
			}
			for(var i=0;i<self.size;i++){
				self.items[i].index = i;
				self.items[i].style.width = self.setCss[i].width +'px';
				self.items[i].style.height = self.setCss[i].height +'px';
				self.items[i].style.top = self.setCss[i].top +'px';
				self.items[i].style.left = self.setCss[i].left +'px';
				self.items[i].style.zIndex = self.setCss[i].zIndex;
				self.aSort[i] = self.setCss[i];
				self.AddEvent(self.items[i], 'mouseover', function(){
					var oDiv = this.getElementsByTagName('div')[0];
					self.startMove(oDiv, {opacity:0});
					if(this.style.width == self.setCss[0].width + 'px'){
						//self.startMove(self.title[this.index], {bottom:0});
					}
				});
				self.AddEvent(self.items[i], 'mouseout', function(){
					if(this.style.width == self.setCss[0].width + 'px'){
						//self.startMove(self.title[this.index], {bottom:-parseInt(self.getStyle(self.title[this.index], 'height'))});
					}
					else{
						var oDiv = this.getElementsByTagName('div')[0];
						self.startMove(oDiv, {opacity:75});
					}
				});
				self.AddEvent(self.items[i], 'click', function(){
					var iSort = this.index;
					self.iNow = this.index;
					self.Sort();
					for(var i=0;i<iSort;i++){
						self.aSort.unshift(self.aSort.pop());
					}
					self.sMove();
					self.tab();
				});
			}
			self.AddEvent(self.prev[0], 'click', function(){
				self.aSort.unshift(self.aSort.pop());
				self.sMove();
				self.setInter();
			});
			self.AddEvent(self.next[0], 'click', function(){
				self.aSort.push(self.aSort.shift());
				self.sMove();
				self.iNow--;
				if(self.iNow<0)self.iNow = self.size - 1;
				self.tab();
			});
			if(typeof self.tabs[0] != 'undefined') {
				self.tabs[0].onmouseover = function(){
					clearInterval(self.timer);
				};
				self.tabs[0].onmouseout = function(){
					clearInterval(self.timer);
					self.timer = setInterval(function(){
						self.setInter();
					}, self.opt.speed);
				};
			}
			
			self.prev[0].onmouseover = self.next[0].onmouseover = self.container[0].onmouseover = function(){
				clearInterval(self.timer);
			};
			self.prev[0].onmouseout = self.next[0].onmouseout = self.container[0].onmouseout = function(){
				clearInterval(self.timer);
				self.timer = setInterval(function(){
					self.setInter();
				}, self.opt.speed);
			};
			
			self.timer = setInterval(function(){
				self.setInter();
			}, self.opt.speed);
		
			self.one();	
		
		}

	};
	module.exports = rotateImage;
})