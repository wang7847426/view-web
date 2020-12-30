/**
*小系列分页
**/
define(function(require, exports, module) {
	$.extend({
		/*!
		 * 小系列分页
		 * n    tag对象
		 * cx   内容块对象
		 * m    事件处理方式
		 * s    当前选中tag的class名
		 * i    初始化显示索引
		 * tag  是否自动生成数字小标
		 * d    一屏显示几个
		 * prev 上一页
		 * next 下一页
		 */
		seriesPage: function(nx, cx, m, s, i, tag, d, prev, next){
			var bindTag, pageBox, item, center=0, prevFlag, pageNum, img, tagClass, prevArr, nextArr;
			pageBox = $(nx);  //获取页码容器
			item = $(cx);	  //获取列表项
			item.hide();
			img = $(cx + ' dt img:first-child');
			pageNum = (item.length%d === 0) ? (item.length/d) : (item.length - item.length%d)/d + 1;  //计算页码数
			tagClass = tag.split(".")[1];
			if(item.length > d){
				pageBox.parent(".page").show();
				for(var j=1;j<pageNum+1;j++){
					$("<a href=\"javascript:;\">"+ j +"</a>").appendTo(pageBox);
				}
			}else{
				pageBox.parent(".page").hide();
			}
			bindTag = pageBox.find("a");
			
			function simpleArray(container,tag){
				var arr = [];
				var a = container.find(tag),
					len = a.length;

				if(!len) return;
				
				a.each(function(){
					arr.push($(this)[0]);
				})

				return arr;
			}

			var tagArr = simpleArray($(nx), 'a');

			bindTag.bind(m, function(){
				autoFlag(tagArr.indexOf($(this)[0]));
			});

			function navShow(){
				if(center !== 0){
					$(prev).replaceWith("<a href=\"javascript:;\" class=\"ar prev2 left prev_1\"><span>上一页</span></em>");
				}else{
					$(prev).replaceWith("<em class=\"ar prev left prev_1\"><span>上一页</span></em>");
				}
				if(center === pageNum-1){
					$(next).replaceWith("<em class=\"ar next2 right next_1\"><span>下一页</span></em>");
				}else{
					$(next).replaceWith("<a class=\"ar next right next_1\" href=\"javascript:;\"><span>下一页</span></a>");
				}
				if(pageNum > 7){
					if(center > 3 && center <= pageNum - 5){
						removeDiv();
						bindTag.eq(0).after($("<span>...</span>"));
						bindTag.eq(pageNum-1).before($("<span>...</span>"));
						navCheck(center);
					}
					if(center > pageNum - 5){
						removeDiv();
						bindTag.eq(0).after($("<span>...</span>"));
						navCheck(pageNum-3);
					}
					if(center <= 3){
						removeDiv();
						bindTag.eq(pageNum-1).before($("<span>...</span>"));
						navCheck(2);
					}
				}
			}

			function removeDiv(){
				bindTag.hide();
				var sp = $(nx + ' ' + tagClass);
				sp.remove();
			}

			function navCheck(u){
				bindTag.eq(0).show();
				bindTag.eq(pageNum-1).show();
				bindTag.eq(u).show();
				bindTag.eq(u-1).show();
				bindTag.eq(u-2).show();
				bindTag.eq(u+1).show();
				bindTag.eq(u+2).show();
			}

			function hideT(o){
				for(var g=o;g<o+d;g++){
					item.eq(g).hide();
				}
			}

			function showT(o){
				for(var g=o;g<o+d;g++){
					item.eq(g).show();
				}
			}

			function autoFlag(numX){
				hideT(center*d);
				if(prevFlag){
					prevFlag.removeClass(s);
					prevFlag.bind(m, function(){autoFlag(tagArr.indexOf($(this)[0]));});	
				}
				bindTag.eq(numX).addClass(s);
				bindTag.eq(numX).unbind();
				prevFlag = bindTag.eq(numX);
				center = numX;
				showT(center*d);
				navShow();
				prevArr = $(prev);
				nextArr = $(next);

				prevArr.click(function(){
					hideT(center*d);
					if(center > 0) center--;
					autoFlag(center);
				});
				nextArr.click(function(){console.log(1)
					hideT(center*d);
					if(center < pageNum-1) center++;
					autoFlag(center);
				});
			}
			autoFlag(i);						
		},
		/*!
		 * 小系列分页 ajax请求
		 * n    tag对象
		 * cx   内容块对象
		 * m    事件处理方式
		 * s    当前选中tag的class名
		 * i    初始化显示索引
		 * tag  是否自动生成数字小标
		 * d    一屏显示几个
		 * prev 上一页
		 * next 下一页
		 * type 调用类型
		 */
		 seriesPageAjax: function(nx, cx, m, s, i, tag, d, prev, next,type){
			var bindTag, pageBox, item, center=0, prevFlag, pageNum, img, tagClass, prevArr, nextArr;
			pageBox = $(nx);  //获取页码容器
			item = $(cx);	  //获取列表项
			pageNum = (total%d === 0) ? (total/d) : (total - total%d)/d + 1;  //计算页码数
			tagClass = tag.split(".")[1];
			if(total > d){
				pageBox.parent(".page").show();
				for(var j=1;j<pageNum+1;j++){
					$("<a href=\"javascript:;\">"+ j +"</a>").appendTo(pageBox);
				}
			}else{
				pageBox.parent(".page").hide();
			}
			bindTag = pageBox.find("a");
			
			function simpleArray(container,tag){
				var arr = [];
				var a = container.find(tag),
					len = a.length;

				if(!len) return;
				
				a.each(function(){
					arr.push($(this)[0]);
				})

				return arr;
			}

			var tagArr = simpleArray($(nx), 'a');

			bindTag.bind(m, function(){
				autoFlag(tagArr.indexOf($(this)[0]));
			});

			function navShow(){
				if(center !== 0){
					$(prev).replaceWith("<a href=\"javascript:;\" class=\"ar prev2 left "+ prev.substring(1) +"\"><span>上一页</span></em>");
				}else{
					$(prev).replaceWith("<em class=\"ar prev left "+ prev.substring(1) +"\"><span>上一页</span></em>");
				}
				if(center === pageNum-1){
					$(next).replaceWith("<em class=\"ar next2 right "+ next.substring(1) +"\"><span>下一页</span></em>");
				}else{
					$(next).replaceWith("<a class=\"ar next right "+ next.substring(1) +"\" href=\"javascript:;\"><span>下一页</span></a>");
				}
				if(pageNum > 7){
					if(center > 3 && center <= pageNum - 5){
						removeDiv();
						bindTag.eq(0).after($("<span>...</span>"));
						bindTag.eq(pageNum-1).before($("<span>...</span>"));
						navCheck(center);
					}
					if(center > pageNum - 5){
						removeDiv();
						bindTag.eq(0).after($("<span>...</span>"));
						navCheck(pageNum-3);
					}
					if(center <= 3){
						removeDiv();
						bindTag.eq(pageNum-1).before($("<span>...</span>"));
						navCheck(2);
					}
				}
			}

			function removeDiv(){
				bindTag.hide();
				var sp = $(nx + ' ' + tagClass);
				sp.remove();
			}

			function navCheck(u){
				bindTag.eq(0).show();
				bindTag.eq(pageNum-1).show();
				bindTag.eq(u).show();
				bindTag.eq(u-1).show();
				bindTag.eq(u-2).show();
				bindTag.eq(u+1).show();
				bindTag.eq(u+2).show();
			}

			function autoFlag(numX){
				if(prevFlag){
					prevFlag.removeClass(s);
					prevFlag.bind(m, function(){autoFlag(tagArr.indexOf($(this)[0]));});	
				}
				bindTag.eq(numX).addClass(s);
				bindTag.eq(numX).unbind();
				prevFlag = bindTag.eq(numX);
				center = numX;
				navShow();
				$.getData(cx, type, center, d);

				prevArr = $(prev);
				nextArr = $(next);

				prevArr.click(function(){
					if(center > 0) center--;
					autoFlag(center);
				});
				nextArr.click(function(){console.log(1)
					if(center < pageNum-1) center++;
					autoFlag(center);
				});
			}
			autoFlag(i);						
		},
		// seriesPageAjax:function(nx,cx,m,s,i,tag,d,prev,next,type){
		// 	var n,c,nb,center=0,prevFlag,num,tag;
		// 	c = $(cx);
		// 	nb = $(nx);
		// 	num = (total%d==0)?total/d:(total-total%d)/d+1;
		// 	tag = tag.split(".");
		// 	if(total>d){
		// 	    for(var o = 1;o < num + 1;o++){
		// 		   $("<" + tag[0] + "/>").text(o).appendTo(nb);
		// 	    }
		// 	}
		// 	n = $(nx + " " + tag[0]);
		// 	n.bind(m, function() {
		// 		autoFlag(n.index(this));
		//     });
		// 	$(prev).bind(m, function(){
		// 		if(center>0) center--;
		// 		autoFlag(center);
		// 	});
		// 	$(next).bind(m, function(){
		// 		if(center<num-1) center++;
		// 		autoFlag(center);
		// 	});
		// 	var navShow = function(){
		// 		(center == 0)?$(prev).hide():$(prev).show();
		// 		(center == num-1)?$(next).hide():$(next).show();
		// 		if(num > 7){
		// 		    if(center > 3 && center <= num - 6){
		// 			    removeDiv();
		// 				n.eq(0).after($("<" + tag[1] + "/>").text("..."));
		// 				n.eq(num-1).before($("<" + tag[1] + "/>").text("..."));
		// 				navCheck(center);
		// 			}
		// 			if(center > num - 6){
		// 				removeDiv();
		// 				n.eq(0).after($("<" + tag[1] + "/>").text("..."));
		// 				navCheck(num-3);
		// 			}
		// 			if(center <= 3){
		// 			    removeDiv();
		// 				n.eq(num-1).before($("<" + tag[1] + "/>").text("..."));
		// 				navCheck(2);
		// 			}
		// 		}
		// 	};
		// 	var removeDiv = function(){
		// 	    n.hide();
		// 		var sp = $(nx + " " + tag[1]);
		// 		sp.remove();
		// 	};
		// 	var navCheck = function(u){
		// 	    n.eq(0).show();
		// 		n.eq(num-1).show();
		// 		n.eq(u).show();
		// 		n.eq(u-1).show();
		// 		n.eq(u-2).show();
		// 		n.eq(u+1).show();
		// 		n.eq(u+2).show();
		// 	};
		// 	var autoFlag = function(numX){
		// 		if(prevFlag) {
		// 			prevFlag.removeClass(s);
		// 			prevFlag.bind(m, function(){autoFlag(n.index(this));});
		// 		}
		// 		n.eq(numX).addClass(s);
		// 		n.eq(numX).unbind();
		// 		prevFlag = n.eq(numX);
		// 		center = numX;
		// 		navShow();
		// 		$.getData(cx,type,center,d);
		// 	};
		// 	autoFlag(i);
		// },
		/*!
		 * 小系列分页 抓取数据
		 * cy      内容块对象
		 * type    调用类型
		 * center  当前页面
		 * d       每页显示多少条
		 */
		getData:function(cy,type,center,d){
		    var c,html,str,img;
			c = $(cy);  //列表容器s
			html = "";
			str = ".smallList_1 dl[" + type + "=";
			for(var i = center*d;i<center*d+d;i++){
				if($(str + i + "]").html()){
					html += "<dl class='small_item' type2='"
					+ $(str + i + "]").attr("type2") + "' type3='"
					+ $(str + i + "]").attr("type3") + "' type4='"
					+ $(str + i + "]").attr("type4") + "' type5='"
					+ $(str + i + "]").attr("type5") + "'>"+$(str + i + "]").html()+"</dl>";
				}
			}
			if(c.html() != "")
			c.empty();
			c.append(html);
		}
	})
})
