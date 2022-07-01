	var compareClass="float-compare-bar";
	var closeClass="barclose";
	var removeButton='liclose';
	var compareListClass="float-compare-list";
	var compareButton='compare-btn-submit';
	var root=XBIAO_ROOT;
	//var domain='xbiao.com';
	var domain=XBIAO_DOMAIN;

	var appName = navigator.appName.toLowerCase();
	var isapp = false;
	if(appName=='netscape')
	{
	    isapp = true;
	}

	function getDomain(url)
	{
		url = url.replace('http://','');
		arr = url.split('.');
		if(arr.length == 2) return url;
		return arr[1]+"."+arr[2];
	}

	function addToCompareTable(pid,pname,pimg,obj){
		 pid="product_"+pid+"_product";
		 pname=decodeURIComponent(pname);
		 pimg=pimg.replace('120_180','87_130');

		//如果是checkbox,没有选中的时候从对比栏中移除
		 if($(obj).attr('type')=='checkbox'&&$(obj).attr('checked')==false){
			$('.compare_value[value="'+pid+'"]').prev('.liclose').click();
			return;
		 }

		 var CompareProducts = BasketGetCookie("CompareProducts");
		 if ((CompareProducts != "") && (CompareProducts != null))
		 {
			var arrCookies = CompareProducts.split("；");
			var lgh=arrCookies.length ;
			if(isapp)
			{
			   lgh--;
			}
			if (lgh < 4)
			{
				if (CompareProducts.indexOf(pid) != -1)
				{
				    alert("该款已经存在于对比栏！");
				    return;
				}
				else
				{
					BasketCheckSetCookieValue("CompareProducts",pid + "|" + pname + "|" + pimg,24);
				}
			}
			else
			{
				alert("您最多可以选择四款表");
				$(obj).attr('checked',false);
				return;
			}
		}
		else
		{
			BasketCheckSetCookieValue("CompareProducts",pid + "|" + pname + "|" + pimg,24);
		}

		 genRaw();
		 showCompareTable();
	}


	function deleteFromCompareTable(obj){
		var pid=$(obj).next('.compare_value').val();

		var nameCookieValue = BasketGetCookie("CompareProducts");
		if ((nameCookieValue != null) && (nameCookieValue != "")) {

		    var arrCookies = nameCookieValue.split("；");
		    var ValueNum = arrCookies.length;

		    if (nameCookieValue.indexOf(pid) > -1) {
		        nameCookieValue = "";
		        for (i = 0; i < ValueNum; i++) {
		            if (arrCookies[i].indexOf(pid) == -1) {
		                nameCookieValue += arrCookies[i] + "；";
		            }
		        }
		        nameCookieValue = nameCookieValue.substring(0, nameCookieValue.lastIndexOf("；"));
		        BasketSetCookie("CompareProducts", nameCookieValue, 24);
		    }
		   genRaw();

		   pid=pid.replace('_product','');
		   $('#'+pid).attr('checked',false);
		}
	}

	function showCompareTable(){
		 $('.'+compareClass).show();
	}

	function removeCompareTable(){
		$('.'+compareClass).hide();
		Empty();
	}

	function productBlock(pid,pname,pimg){
		var html="";
		html+='	<li title="'+pname+'">\
					<div class="compare-pic">\
						<img src="'+pimg+'" alt="" width="87" height="130">\
					</div>\
					<p style="word-wrap:break-word;width:110px;">'+pname+'</p>\
					<a href="javascript:" class="'+removeButton+'" rel="nofollow" title="关闭">关闭</a>\
					<input type="hidden" class="compare_value" value="'+pid+'" />\
				</li>';
		return html;
	}


	function Empty()
	{
		BasketSetCookie("CompareProducts","",24);
	}

	function genRaw(){
		var CompareProducts = BasketGetCookie("CompareProducts");

		if (CompareProducts == null)
		{
			CompareProducts = "";
		}
		var arrCookies = CompareProducts.split("；");
		arrCookies.reverse();
		var html="";
		for (i = 0; i < arrCookies.length; i++)
		{
	  		var ProductInfo = arrCookies[i].split("|");
			if ((arrCookies[i] != "") && (arrCookies[i] != null))
			{
				var pid=ProductInfo[0];
				var pname=ProductInfo[1];
				var pimg=ProductInfo[2];
				if(pid==null){
					pid='';
				}
				if(pname==null){
					pname='';
				}
				if(pimg==null){
					pimg='';
				}
				if((pid!='') && (pname!='') && (pimg!='')){
					html += productBlock(pid,pname,pimg);
				}
			}
		}
		$('.'+compareListClass).html(html);
		if($.trim($('.'+compareListClass).html())!=''){
			showCompareTable();
		}else{
			removeCompareTable();
		}
	}


	function compareHtml(){
		var html ='	<div class="'+compareClass+'" style="display:none">\
					  	<div class="barhd"><strong>表款对比</strong> <a href="javascript:" rel="nofollow" class="barclose" title="关闭">关闭</a></div>\
					  	<ul class="float-compare-list">';


			html+='		</ul>\
					  	<div class="float-compare-btn '+compareButton+'"><span>表款对比</span></div>\
					 </div>';

			$('body').append(html);
	}

	compareHtml();
	genRaw();

	$(function(){
		$('.'+closeClass).live('click',removeCompareTable);
		$('.'+removeButton).live('click',function(){
			deleteFromCompareTable(this);
		});
		$('.float-compare-list li').live('mouseover',function(){
			$(this).addClass('hover');
		});
		$('.float-compare-list li').live('mouseout',function(){
			$(this).removeClass('hover');
		});

		$('.'+compareButton).live('click',function(){
			var size=$('.'+compareListClass+' li').size();
			if(size<2){
				alert("请至少选择两款进行对比");
				return;
			}
			var products=new Array();
			var productsString='';
			$('.compare_value').each(function(i,n){
				var p=n.value
				p=p.replace('product_','');
				p=p.replace('_product','');
				products[i]=p;
			});
			var len=products.length;
			if(len<2){
				alert("请至少选择两款表");
				return;
			}else if(len>4){
				alert("您最多可以选择四款表");
				return;
			}
			productsString=encodeURIComponent(products.join(','));
			window.open(root+'/compare/index/products/'+productsString);
		});
	});


	//unicode 编码程序
	function BasketEncodeCookie(InputString)
	{
		var strRtn="";
		for (var i=InputString.length-1;i>=0;i--)
		{
			strRtn+=InputString.charCodeAt(i);
			if (i) strRtn+="a"; // 用 a 作分隔符
		}
		return strRtn;
	}

	// unicode 解码程序
	function BasketDecodeCookie(InputString)
	{
		var strArr;
		var strRtn="";

		strArr=InputString.split("a");

		for (var i=strArr.length-1;i>=0;i--)
			strRtn+=String.fromCharCode(eval(strArr[i]));

		return strRtn;
	}

	//读 Cookie
	function BasketGetCookie(name)
	{
		var strArg=name+"=";
		var nArgLen=strArg.length;
		var nCookieLen=document.cookie.length;
		var nEnd;
		var i=0;
		var j;

		while (i<nCookieLen)
		{
			j=i+nArgLen;
			if (document.cookie.substring(i,j)==strArg)
			{
				nEnd=document.cookie.indexOf (";",j);
				if (nEnd==-1) nEnd=document.cookie.length;
				return BasketDecodeCookie(unescape(document.cookie.substring(j,nEnd)));
			}
			i=document.cookie.indexOf(" ",i)+1;
			if (i==0) break;
		}
		return null;
	}

	//写 Cookie
	function BasketSetCookie(name,value,expires)
	{
		var exp = new Date();
		exp.setTime(exp.getTime()+expires*60*60*1000);
		document.cookie=name+"="+escape(BasketEncodeCookie(value))+";expires="+exp.toGMTString()+";path=/"+";domain="+domain;
	}

	//判断 Cookie 是否存在并写车型对比 Cookie
	function BasketCheckSetCookieValue(name,value,expires)
	{
		var nameCookieValue = BasketGetCookie(name);
		if ((nameCookieValue == "") || (nameCookieValue == null))
		{
			var exp = new Date();
			exp.setTime(exp.getTime()+expires*60*60*1000);
			document.cookie=name+"="+escape(BasketEncodeCookie(value))+";expires="+exp.toGMTString()+";path=/"+";domain="+domain;
		}
		else
		{
			if (nameCookieValue.indexOf(value) == -1)
			{
				var arrCookies = nameCookieValue.split("；");
				var ValueNum = arrCookies.length;
				if (ValueNum > 4)
				{
					nameCookieValue = "";
					for (loop=0; loop < 4; loop++)
					{
						nameCookieValue += arrCookies[loop] + "；";
		            }
					nameCookieValue = nameCookieValue.substring(0, nameCookieValue.lastIndexOf("；"));
	            }
				var exp = new Date();
				exp.setTime(exp.getTime()+expires*60*60*1000);
				document.cookie=name+"="+escape(BasketEncodeCookie(value+"；"+nameCookieValue))+";expires="+exp.toGMTString()+";path=/"+";domain="+domain;
			}
		}
	}


	//切换列表显示方式
	function changeShowMode(type){
		if(type=='pic'){
			$('#list-text,.watch-list').hide();
			$('#list-pic,.watch-tile').show();
			$('.type-pic').addClass('type-pic-cur');
			$('.type-text').removeClass('type-text-cur');
			$('.sort-tile').addClass('hover');
			$('.sort-list').removeClass('hover');
		}else{
			$('#list-pic,.watch-tile').hide();
			$('#list-text,.watch-list').show();
			$('.type-text').addClass('type-text-cur');
			$('.type-pic').removeClass('type-pic-cur');
			$('.sort-list').addClass('hover');
			$('.sort-tile').removeClass('hover');
		}
		BasketSetCookie('show_type',type,24);
	}



	//从cookie中获取产品列表显示模式
	var showType=BasketGetCookie('show_type');
	//初始化产品列表显示模式
	if(showType=='' || showType==null){
		showType='pic';
	}
	//alert(document.cookie);
	//$('#list-'+showType).show();
	//$('.type-'+showType).addClass('type-'+showType+'-cur');
	changeShowMode(showType);
