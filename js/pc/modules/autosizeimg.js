/**
*图片裁切
**/
define(function(require, exports, module) {
	function AutoResizeImage(maxWidth,maxHeight,objImg){
		var img = new Image();
		var hRatio,wRatio,Ratio = 1;
		img.src = objImg.attr('src')+'?'+(new Date()).getTime();
		img.onload = img.onreadystatechange = function(){
			var w = img.width;
			var h = img.height;
			wRatio = maxWidth / w;
			hRatio = maxHeight / h;
			if (maxWidth ==0 && maxHeight==0){
				Ratio = 1;
			}else if (maxWidth==0){
				if (hRatio<1) Ratio = hRatio;
			}else if (maxHeight==0){
				if (wRatio<1) Ratio = wRatio;
			}else if (wRatio<1 || hRatio<1){
				Ratio = (wRatio<=hRatio?hRatio:wRatio);
			}
			else if(wRatio>1 || hRatio>1　){
				Ratio = (wRatio<=hRatio?hRatio:wRatio);
			}
			if (Ratio<1){
				w = w * Ratio;
				h = h * Ratio;
			}
			if(Ratio>1){
				w = w * Ratio;
				h = h * Ratio;
			}
			objImg.height(h);
			objImg.width(w);
			objImg.show();
			if(objImg.width() > maxWidth || objImg.height() >maxHeight){
				var mL = -parseInt((objImg.width()-maxWidth)/2)+"px";
				var mH = -parseInt((objImg.height()-maxHeight)/2)+"px";
				objImg.css('margin-left',mL);
				objImg.css('margin-top',mH);
			}
		}
		
	};
	module.exports = AutoResizeImage;
})
