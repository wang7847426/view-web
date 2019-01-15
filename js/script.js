$(function(){
	var objOpr = {
		operate:$(".operate"),
		addBtn:$(".add-btn"),
		
	}
	function Crud(option){
		this.option = option;
		this.operateBtn = this.option.operate;
		this.btnOper = this.operateBtn.find(".btn-default");
		this.layerBox = this.operateBtn.siblings(".layer-box");
		this.addBtn = this.option.addBtn;
		this.dataObj = {};
		this.dataAjax = []
	}
	Crud.prototype = {
		init:function(){
			this.clickSmXsOperate();
			this.openModalLayer();
			this.addData();
			this.jqueryAjax();
		},
		jqueryAjax:function(){
			$.ajax({
				url:'https://www.easy-mock.com/mock/5b9f0762604c113bd0ceb9dd/example/info#!method=POST&queryParameters=%5B%5D&body=&headers=%5B%5D',
				type:'post',
				data:"",
				typeData:"json",
				success:function(res){
					if(res.success == true){
						this.dataAjax = res.data.projects
						console.log(this.dataAjax);
					}
				}
			})
		},
		formInit:function(){
			/*
				数据表单初始化
			 */
			this.dataObj = {};
			console.log(1);
			var formObj =  this.addBtn.parent().siblings(".modal-body").find("form");
			formObj.find("#recipient-name").val("");
			formObj.find("#recipient-age").val("");
			formObj.find("#recipient-sex").val("");
			formObj.find("#recipient-motto").val("");
		},
		addData(){
			var _this = this;
			this.addBtn.on("click",function(){
				var formObj =  $(this).parent().siblings(".modal-body").find("form");
				_this.dataObj.name = formObj.find("#recipient-name").val();
				_this.dataObj.age = formObj.find("#recipient-age").val();
				_this.dataObj.sex = formObj.find("#recipient-sex").val();
				_this.dataObj.motto = formObj.find("#recipient-motto").val();
				var html = '<li class="row">'+
				'<div class="col-md-1 col-sm-1 col-xs-1 id">1</div>'+
				'<div class="col-md-2 col-sm-2 col-xs-2  name">'+ _this.dataObj.name +'</div>'+
				'<div class="col-md-2 col-sm-2 col-xs-2  age">'+ _this.dataObj.age +'</div>'+
				'<div class="col-md-1 col-sm-1 col-xs-1  sex">'+ _this.dataObj.sex +'</div>'+
				'<div class="col-md-4 col-sm-4 col-xs-4  motto">'+ _this.dataObj.motto +'</div>'+
				'<div class="col-md-2 col-sm-2 col-xs-2 operate">'+
					'<div class="row hidden-xs hidden-sm">'+
						'<button type="button" class="col-md-4 col-sm-5 col-md-offset-1 btn btn-info"  data-toggle="modal" data-target="#revise">修改</button>'+
						'<button class="col-md-offset-2 col-sm-5 col-sm-offset-2  col-md-4 btn-danger btn">删除</button>'+
					'</div>'+
					'<div class="row hidden-md hidden-lg">'+
						'<button type="button" class="btn col-sm-6 col-sm-offset-3'+ 
						' col-xs-6 col-xs-offset-3 btn-default">操作</button>'+

					'</div>'+
				'</div>'+
				'<div class="layer-box hidden-md hidden-lg row">'+
					'<button type="button" class="col-xs-4 col-xs-5 col-xs-offset-1 col-sm-4 col-sm-5 col-sm-offset-1 btn btn-info"  data-toggle="modal" data-target="#revise">修改</button>'+
						'<button type="button" class="col-xs-offset-2 col-xs-5 col-xs-offset-2  col-xs-4 col-sm-offset-2 col-sm-5 col-sm-offset-2  col-sm-4 btn-danger btn">删除</button>'+
				'</div>'+
			'</li>'

			$(".data-info").append(html);
			_this.formInit();	

			})
		},
		clickSmXsOperate:function(){
			var _this = this;
			$(".data-info").on("click", this.btnOper ,function(e){
				 var e =  e.target || e.currentTarget;
				$(e).parent().parent().siblings(".layer-box").css("display","block");
			})
			$(".data-info").on("click",this.layerBox,function(e){
				var _e =  e.target || e.currentTarget;
				if(e.target.classList[0] == "layer-box"){
					$(_e).css("display","none");
				}
				
			})
		},
		openModalLayer:function(){
			$('#exampleModal').on('show.bs.modal', function (event) {
			  var button = $(event.relatedTarget)
			  var recipient = button.data('whatever')
			  var modal = $(this)
			})
			$('#revise').on('show.bs.modal', function (event) {
			  var button = $(event.relatedTarget)
			  var recipient = button.data('whatever')
			  var modal = $(this)
			})
		}
	}

	var a = new Crud(objOpr);
	a.init();
})