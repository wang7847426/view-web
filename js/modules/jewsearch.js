/**
*公共头部联想搜索
**/
define(function(require, exports, module) {
	/* 搜索调用 begin*/
	function Search(butSearch,listSearch,boxSearch,conSearch,boxText){
		this.flag = true;
		this.val = false;
		this.flagFocus = true;
		this.inputValue = '';
		this.butSearch = $(butSearch);
		this.listSearch = $(listSearch);
		this.boxSearch = $(boxSearch);
		this.conSearch = $(conSearch);
		this.boxText = $(boxText);
		this.init();
	}
	Search.prototype.init = function(){
		var _self = this;
		if(_self.boxSearch && _self.boxSearch.val() && _self.boxSearch.val().length>0){
			_self.boxText.hide();
		}
		this.initEvent();
	}
	Search.prototype.initEvent = function(){
		var _self = this;
		_self.butSearch.bind('click',function(){
			_self.doSearch();
		});
		_self.conSearch.hover(function(){
			$(this).addClass("box_search_h");
		},function(){
			if(_self.flagFocus) $(this).removeClass("box_search_h");
		});
		_self.boxSearch.bind("focus",function(){
			_self.boxText.hide();
			_self.flagFocus = false;
		    _self.conSearch.addClass("box_search_h");
		}).bind("blur",function(){
			if($.trim($(this).val()) == "") {
				_self.boxText.show();
			}
			_self.flagFocus = true;
			_self.conSearch.removeClass("box_search_h");
		}).bind("mousedown",function(){
			_self.flag = false;
		}).bind("mouseout",function(){
			_self.flag = true;
		}).bind('keydown',function(e){
			_self.inputValue = $.trim($(this).val());
		}).bind("keyup",function(e){
			if(e.keyCode == 13 && $.trim($(this).val()) == _self.inputValue) {
				_self.doSearch();
				_self.listSearch.hide();
				_self.listSearch.empty();
				_self.val = false;
			}
			else if(e.keyCode != 38 && e.keyCode != 40) {
				if($.trim($(this).val()) == _self.inputValue){ 
					return;
				}
				if($.trim($(this).val()).length > 0) {
					$.getJSON(XBIAO_ROOT + '/jSearch/suggestion/?callback=?',
							{wd:$(this).val()},
							function(data){
					    		if(data.status==1){
					    			var html='';
						    		for (s in data.data){
						    		  html += '<li  type="'+data.data[s].type+'">'+data.data[s].keywords+'</li>';
						    		}
						    		_self.addData(html);
					    		}
							}
						);
				}
				else {_self.listSearch.hide(); _self.listSearch.empty(); _self.val = false;}
			}
		});
		$(document).mousedown(function(e){
			if(_self.flag) {_self.listSearch.hide(); _self.listSearch.empty(); _self.val = false;}
		});
		_self.boxText.bind("click",function(){
			_self.boxSearch.focus();
		});
	}
	Search.prototype.doSearch = function(){
		var _self = this;
		if($.trim(_self.boxSearch.val()).length > 0){
			var text = $.trim(_self.boxSearch.val());
			if(typeof WATCH_CONTROLLER_ID == 'string' && WATCH_CONTROLLER_ID=='search'){
				window.location.href=encodeURI(XBIAO_ROOT+'/jSearch/index?wd='+text);
			}else{
				window.open(encodeURI(XBIAO_ROOT+'/jSearch/index?wd='+text));
			}
		}
	}
	Search.prototype.autoValue = function(str,type){
		var _self = this;
		str=str.toString().replace('<strong>','').replace('</strong>','').replace('<STRONG>','').replace('</STRONG>','');
		_self.boxSearch.val(str);
		$("#searchType").val(type);
	}
	Search.prototype.addData = function(data){
		var _self = this;
		if(data != "" && data != undefined){
			_self.listSearch.empty();
			$(data).appendTo(_self.listSearch);
			$("<span>搜索智能提示<i></i></span>").appendTo(_self.listSearch);
			_self.listSearch.slideDown("fast");
			_self.val = true;
			_self.slideBox();
		}
	}
	Search.prototype.slideBox = function(){
		var _self = this;
		var n,prevFlag,center = -1;
		n = _self.listSearch.find('li');
		var autoFlag = function(num){
			if(prevFlag) prevFlag.removeClass("hover");
			n.eq(num).addClass("hover");
			prevFlag = n.eq(num);
			center = num;	
		};
		n.mouseover(function(){
			autoFlag(n.index(this));
			_self.flag = false;
		});
		n.mouseout(function(){
			_self.flag = true;
		});
		n.click(function(){
			_self.autoValue($(this).html(),$(this).attr('type'));
			_self.flag = true;
			if(_self.flag) {_self.listSearch.hide(); _self.listSearch.empty(); _self.val = false;}
			_self.doSearch();
		});
		_self.boxSearch.bind("keydown",function(e){
			if(_self.val){
				if(e.keyCode == 38) {
					(center <= 0) ? center = n.size()-1 : center--;
					autoFlag(center);
					_self.autoValue(n.eq(center).html(),n.eq(center).attr('type'));
				}
				else if(e.keyCode == 40) {
					(center >= n.size()-1) ? center = 0 : center++;
					autoFlag(center);
					_self.autoValue(n.eq(center).html(),n.eq(center).attr('type'));
				}	
			}
		});
		//autoFlag(0);
	}
	module.exports = Search;
})
