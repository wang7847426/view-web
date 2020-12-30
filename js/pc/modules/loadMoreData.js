/**
*点击加载更多数据（作业和回复列表）
by:zmt@2016/1/26
**/
define(function(require, exports, module) {
	function LoadMoreData(option){
		this.id = option.id || '#ajaxdata';
		this.more = option.more || this.id+'_more';
		this.total = option.total || this.id+"_total";
		this.number = option.number || this.id+'_number';
		this.url = option.url || '';
		this.endtxt = option.endtxt || '加载完毕';
		this.dataOpt = option.opt || {};
		this.page = this.dataOpt.page || 1;
		this.flag = true;
		this.init();
	}
	LoadMoreData.prototype = {
		init : function(){
			if(this.page == 1){
				this.getAjax();
			}
			this.bindEvent();
		},
		bindEvent : function(){
			var self = this;
			$(self.more).on('click',function(){
				if(!self.flag){
					return;
				}else{
					self.flag = false;
				}
				self.dataOpt.page = self.page;
				self.getAjax();
			})
		},
		getAjax : function(){
			var self = this;
			$.ajax({
				url: self.url,
				type: "GET",
				dataType: 'jsonp',
				jsonp: 'jsoncallback',
				data: self.dataOpt,
				success: function (data) {
					self.flag = true;
					self.page += 1;
					if(self.page == 2){
						$(self.id).html(data.html);
						$(self.total).html(data.total);
						
					}else{
						$(self.id).append(data.html);
					}
					$(self.number).html(data.number);
					if(data.number <= 0){
						$(self.id+ '_more').before('<span class="r-text left" >'+ self.endtxt +'</span>').remove();
					};
				}
			});
		}
	}
	module.exports = LoadMoreData;
})
