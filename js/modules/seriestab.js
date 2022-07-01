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
		seriesPage:function(nx,cx,m,s,i,tag,d,prev,next){
			var n,c,nb,center=0,prevFlag,num,tag,img;
			nb = $(nx);
			c = $(cx);
			c.hide();
			img = $(cx + " .picbox img:first-child");
			num = (c.size()%d==0)?c.size()/d:(c.size()-c.size()%d)/d+1;
			tag = tag.split(".");
			if(c.size()>d){
			    for(var o = 1;o < num + 1;o++){
				   $("<" + tag[0] + "/>").text(o).appendTo(nb);
			    }
			}
			n = $(nx + " " + tag[0]);
			n.bind(m, function() {
				autoFlag(n.index(this));
		    });
			$(prev).bind(m, function(){
			    hideT(center*d);
				if(center>0) center--;
				autoFlag(center);
			});
			$(next).bind(m, function(){
			    hideT(center*d);
				if(center<num-1) center++;
				autoFlag(center);
			});
			var navShow = function(){
				(center == 0)?$(prev).hide():$(prev).show();
				(center == num-1)?$(next).hide():$(next).show();
				if(num > 7){
				    if(center > 3 && center <= num - 6){
					    removeDiv();
						n.eq(0).after($("<" + tag[1] + "/>").text("..."));
						n.eq(num-1).before($("<" + tag[1] + "/>").text("..."));
						navCheck(center);
					}
					if(center > num - 6){
						removeDiv();
						n.eq(0).after($("<" + tag[1] + "/>").text("..."));
						navCheck(num-3);
					}
					if(center <= 3){
					    removeDiv();
						n.eq(num-1).before($("<" + tag[1] + "/>").text("..."));
						navCheck(2);
					}
				}
			};
			var removeDiv = function(){
			    n.hide();
				var sp = $(nx + " " + tag[1]);
				sp.remove();
			};
			var navCheck = function(u){
			    n.eq(0).show();
				n.eq(num-1).show();
				n.eq(u).show();
				n.eq(u-1).show();
				n.eq(u-2).show();
				n.eq(u+1).show();
				n.eq(u+2).show();
			};
			var showT = function(o){
			    for(var g=o;g<o+d;g++){
				    c.eq(g).show();
					if(img.eq(g).attr("src_")){
						img.eq(g).attr("src",img.eq(g).attr("src_"));
						img.eq(g).removeAttr("src_");
					}
				}
			};
			var hideT = function(o){
			    for(var g=o;g<o+d;g++){
				    c.eq(g).hide();
				}
			};
			var autoFlag = function(numX){
			    hideT(center*d);
				if(prevFlag) {
					prevFlag.removeClass(s);
					prevFlag.bind(m, function(){autoFlag(n.index(this));});
				}
				n.eq(numX).addClass(s);
				n.eq(numX).unbind();
				prevFlag = n.eq(numX);
				center = numX;
				showT(center*d);
				navShow();
			};
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
		seriesPageAjax:function(nx,cx,m,s,i,tag,d,prev,next,type){
			var n,c,nb,center=0,prevFlag,num,tag;
			c = $(cx);
			nb = $(nx);
			num = (total%d==0)?total/d:(total-total%d)/d+1;
			tag = tag.split(".");
			if(total>d){
			    for(var o = 1;o < num + 1;o++){
				   $("<" + tag[0] + "/>").text(o).appendTo(nb);
			    }
			}
			n = $(nx + " " + tag[0]);
			n.bind(m, function() {
				autoFlag(n.index(this));
		    });
			$(prev).bind(m, function(){
				if(center>0) center--;
				autoFlag(center);
			});
			$(next).bind(m, function(){
				if(center<num-1) center++;
				autoFlag(center);
			});
			var navShow = function(){
				(center == 0)?$(prev).hide():$(prev).show();
				(center == num-1)?$(next).hide():$(next).show();
				if(num > 7){
				    if(center > 3 && center <= num - 6){
					    removeDiv();
						n.eq(0).after($("<" + tag[1] + "/>").text("..."));
						n.eq(num-1).before($("<" + tag[1] + "/>").text("..."));
						navCheck(center);
					}
					if(center > num - 6){
						removeDiv();
						n.eq(0).after($("<" + tag[1] + "/>").text("..."));
						navCheck(num-3);
					}
					if(center <= 3){
					    removeDiv();
						n.eq(num-1).before($("<" + tag[1] + "/>").text("..."));
						navCheck(2);
					}
				}
			};
			var removeDiv = function(){
			    n.hide();
				var sp = $(nx + " " + tag[1]);
				sp.remove();
			};
			var navCheck = function(u){
			    n.eq(0).show();
				n.eq(num-1).show();
				n.eq(u).show();
				n.eq(u-1).show();
				n.eq(u-2).show();
				n.eq(u+1).show();
				n.eq(u+2).show();
			};
			var autoFlag = function(numX){
				if(prevFlag) {
					prevFlag.removeClass(s);
					prevFlag.bind(m, function(){autoFlag(n.index(this));});
				}
				n.eq(numX).addClass(s);
				n.eq(numX).unbind();
				prevFlag = n.eq(numX);
				center = numX;
				navShow();
				$.getData(cx,type,center,d);
			};
			autoFlag(i);
		},
		/*!
		 * 小系列分页 抓取数据
		 * cy      内容块对象
		 * type    调用类型
		 * center  当前页面
		 * d       每页显示多少条
		 */
		getData:function(cy,type,center,d){
		    var c,html,str,img;
			c = $(cy);
			html = "";
			str = "#seriesContent1 li.clearfix[" + type + "=";
			for(var i = center*d;i<center*d+d;i++){
			    img = $(str + i + "] .picbox img:first-child");
				if(img.attr("src_")){
					img.attr("src",img.attr("src_"));
					img.removeAttr("src_");
				}
				if($(str + i + "]").html()){
					html += "<li class='clearfix' type2='"
					+ $(str + i + "]").attr("type2") + "' type3='"
					+ $(str + i + "]").attr("type3") + "' type4='"
					+ $(str + i + "]").attr("type4") + "' type5='"
					+ $(str + i + "]").attr("type5") + "'>"+$(str + i + "]").html()+"</li>";
				}
			}
			if(c.html() != "")
			c.empty();
			c.append(html);
		}
	})
})
