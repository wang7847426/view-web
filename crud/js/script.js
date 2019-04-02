$(function(){
	var objOpr = {
		dataInfoObj:$(".data-info"),
		addBtn:$(".add-btn"),
		reviseLayer:$("#revise-layer"),
		queryBtn:$(".query-data") 
	}
	function Crud(option){
		this.option = option;
		this.reviseLayer = this.option.reviseLayer;
		this.dataInfoObj = this.option.dataInfoObj;
		this.queryData = this.option.queryBtn;
		this.operateBtn = this.option.dataInfoObj.find(".operate");
		this.delBtn = this.dataInfoObj.find(".del-btn");
		this.reviseBtn = this.dataInfoObj.find(".revise-btn");
		this.btnOper = this.operateBtn.find(".btn-operate");
		this.layerBox = this.operateBtn.siblings(".layer-box");
		this.addBtn = this.option.addBtn;
		this.dataObj = [];
		this.dataAjax = [];
	}
	Crud.prototype = {
		init:function(){
			this.clickSmXsOperate();
			this.addLiObj();
			this.delLiObj();
			this.reviseLiObj();
			this.jqueryAjax();
			this.queryDataInfo()
		},
		queryDataInfo:function(){
			var _this = this;
			this.queryData.find(".input-group-btn").on("click",function(){
				_this.dataInfoObj.find("li").not(".nav").css("display","none");
				var queryCon = $(this).siblings("input").val();
				var dataInfo = JSON.parse(window.localStorage.getItem("dataInfo"));
				for(var i = 0; i<=dataInfo.length-1; i++){
				if(dataInfo[i].name == queryCon){
					i = i + 1;
					_this.dataInfoObj.find("li:eq("+ i  +")").css("display","block");
				}
			}
			})
			this.queryData.find(".form-control").on("keyup",function(){
				if($(this).val() == ""){
					_this.dataInfoObj.find("li").not(".nav").css("display","block");
				}
			})
		},
		hasBtnClass:function(arrClass,strClass){
			for(var i = 0; i<=arrClass.length-1; i++){
				if(arrClass[i] == strClass){
					return true;
				}
			}
		},
		reviseLiObj:function(){
			var dataInfoIndex = 0;
			var _this = this;
			this.dataInfoObj.on("click",this.reviseBtn,function(e){
				var _e =  e.target || e.currentTarget;
				var hasCla = _this.hasBtnClass(_e.classList,"revise-btn");
				if(hasCla){
					var dataInfo = JSON.parse(window.localStorage.getItem("dataInfo"));
					for(var i = 0; i<= dataInfo.length-1; i++){
						if($(_e).parents("li").attr("data-index") == dataInfo[i].id){
							dataInfoIndex = i;
							var sex = dataInfo[i].sex == 1? "男" : "女";
							_this.reviseLayer.find("#recipient-name").val(dataInfo[i].name);
							_this.reviseLayer.find("#recipient-age").val(dataInfo[i].age);
							_this.reviseLayer.find("#recipient-sex").val(sex);
							_this.reviseLayer.find("#recipient-motto").val(dataInfo[i].motto);
						}
					}
				}
			})
			_this.reviseLayer.find(".btn-primary").on("click",function(){
				var dataInfo = JSON.parse(window.localStorage.getItem("dataInfo"));
				var formObj =  $(this).parent().siblings(".modal-body").find("form");
				dataInfo[dataInfoIndex].name =  formObj.find("#recipient-name").val();
				dataInfo[dataInfoIndex].age =  formObj.find("#recipient-age").val();
				dataInfo[dataInfoIndex].sex =  formObj.find("#recipient-sex").val();
				dataInfo[dataInfoIndex].motto =  formObj.find("#recipient-motto").val();
				liIndex = dataInfoIndex + 1;
				_this.dataInfoObj.find("li:eq("+ liIndex +") .name").text(dataInfo[dataInfoIndex].name );
				_this.dataInfoObj.find("li:eq("+ liIndex +") .age").text(dataInfo[dataInfoIndex].age );
				_this.dataInfoObj.find("li:eq("+ liIndex +") .sex").text(dataInfo[dataInfoIndex].sex );
				_this.dataInfoObj.find("li:eq("+ liIndex +") .motto").text(dataInfo[dataInfoIndex].motto);
				window.localStorage.setItem("dataInfo",JSON.stringify(dataInfo));
			})
		},
		delLiObj:function(){
			var _this = this;
			this.dataInfoObj.on("click",this.delBtn,function(e){
				var _e =  e.target || e.currentTarget;
				var hasCla = _this.hasBtnClass(_e.classList,"del-btn");
				 if(hasCla){
					if(!window.localStorage){
						alert("您的浏览器版本较低，请尝试更新浏览器！")
					}else{
						var dataInfo = JSON.parse(window.localStorage.getItem("dataInfo"));
						for(var i = 0; i<= dataInfo.length-1; i++){
							if($(_e).parents("li").attr("data-index") == dataInfo[i].id){
								$(_e).parents("li").remove();
								dataInfo.splice(i,1);
								window.localStorage.setItem("dataInfo",JSON.stringify(dataInfo));
							}
						}
					}
				 }
				
			})
		},
		addLiObj:function(){
			var _this = this;
			this.addBtn.on("click",function(){
				var obj ={}
				var formObj =  $(this).parent().siblings(".modal-body").find("form");
				obj.name = formObj.find("#recipient-name").val();
				obj.age = formObj.find("#recipient-age").val();
				obj.sex = formObj.find("#recipient-sex").val() == "男"? 1 : 2;
				obj.motto = formObj.find("#recipient-motto").val();
				if(!window.localStorage){
					alert("您的浏览器版本较低，请尝试更新浏览器！")
				}else{
					var dataInfo = JSON.parse(window.localStorage.getItem("dataInfo"));
					obj.id = dataInfo[dataInfo.length-1].id + 1 == 'undefined'? 1 : dataInfo[dataInfo.length-1].id  + 1;
					dataInfo.push(obj);
					window.localStorage.setItem("dataInfo",JSON.stringify(dataInfo));
				}
				_this.dataObj.push(obj);
				var html = _this.htmlTemplate(_this.dataObj);
				$(".data-info").append(html);
				_this.formInit();
			})
		},
		jqueryAjax:function(){
			var _this = this;
			$.ajax({
				url:'https://www.easy-mock.com/mock/5b9f0762604c113bd0ceb9dd/example/info#!method=POST&queryParameters=%5B%5D&body=&headers=%5B%5D',
				type:'post',
				data:"",
				typeData:"json",
				success:function(res){
					if(res.success == true){
						if(!window.localStorage){
							alert("您的浏览器版本较低，请尝试更新浏览器！")
						}else{
							if(window.localStorage.getItem("dataInfo") == null) {
								// var infoId = res.data.projects[res.data.projects.length-1].id;
								window.localStorage.setItem("dataInfo",JSON.stringify(res.data.projects));
								var html = _this.htmlTemplate(JSON.parse(window.localStorage.getItem("dataInfo")));
								$(".data-info").append(html);
							}else{
								var html = _this.htmlTemplate(JSON.parse(window.localStorage.getItem("dataInfo")));
								$(".data-info").append(html);
							}
						}
					}
				}
			})
		},
		formInit:function(){
			/*
				数据表单初始化
			*/
			this.dataObj = [];
			var formObj =  this.addBtn.parent().siblings(".modal-body").find("form");
			formObj.find("#recipient-name").val("");
			formObj.find("#recipient-age").val("");
			formObj.find("#recipient-sex").val("");
			formObj.find("#recipient-motto").val("");
		},
		htmlTemplate:function(data){
			var sex = "";
			var html = "";
			for(var i = 0; i<= data.length-1; i++){
				sex = data[i].sex == 1? "男" : "女" ;
				html += '<li class="row" data-index='+ data[i].id +'>'+
					'<div class="col-md-1 col-sm-1 col-xs-1 id">'+ data[i].id +'</div>'+
					'<div class="col-md-2 col-sm-2 col-xs-2  name">'+ data[i].name +'</div>'+
					'<div class="col-md-2 col-sm-2 col-xs-2  age">'+ data[i].age +'</div>'+
					'<div class="col-md-1 col-sm-1 col-xs-1  sex">'+ sex +'</div>'+
					'<div class="col-md-4 col-sm-4 col-xs-4  motto">'+ data[i].motto +'</div>'+
					'<div class="col-md-2 col-sm-2 col-xs-2 operate">'+
						'<div class="row hidden-xs hidden-sm">'+
							'<button type="button" class="col-md-4 col-sm-5 col-md-offset-1 btn btn-info revise-btn"  data-toggle="modal" data-target="#revise-layer">修改</button>'+
							'<button class="col-md-offset-2 col-sm-5 col-sm-offset-2  col-md-4 btn-danger del-btn btn">删除</button>'+
						'</div>'+
						'<div class="row hidden-md hidden-lg">'+
							'<button type="button" class="btn col-sm-6 col-sm-offset-3'+ 
							' col-xs-6 col-xs-offset-3 btn-default btn-operate">操作</button>'+

						'</div>'+
					'</div>'+
					'<div class="layer-box hidden-md hidden-lg row">'+
						'<button type="button" class="col-xs-4 col-xs-5 col-xs-offset-1 col-sm-4 col-sm-5 revise-btn col-sm-offset-1 btn  btn-info"  data-toggle="modal" data-target="#revise-layer">修改</button>'+
							'<button type="button" class="col-xs-offset-2 col-xs-5 col-xs-offset-2  col-xs-4 col-sm-offset-2 col-sm-5 col-sm-offset-2 del-btn col-sm-4  btn-danger btn">删除</button>'+
					'</div>'+
				'</li>'
			}
			return html;
		},
		clickSmXsOperate:function(){
			var _this = this;
			this.dataInfoObj.on("click", this.btnOper ,function(e){
				 var _e =  e.target || e.currentTarget;
				 if(_e.classList[6] == "btn-operate"){
					$(_e).parent().parent().siblings(".layer-box").css("display","block");
				 }
			})
			this.dataInfoObj.on("click",this.layerBox,function(e){
				var _e =  e.target || e.currentTarget;
				if(_e.classList[0] == "layer-box"){
					$(_e).css("display","none");
				}
			})
		}
	}

	var a = new Crud(objOpr);
	a.init();
})