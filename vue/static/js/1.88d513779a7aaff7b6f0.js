webpackJsonp([1],{FS0d:function(t,s){},u3Ke:function(t,s,i){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var a=i("3cXf"),o=i.n(a),e={data:function(){return{inputVal:"",novalList:[],showSearchLists:!1,historyList:[],showHistoryList:!0,historyData:[]}},created:function(){var t=window.localStorage;if(t){var s=t.getItem("historyList");"undefind"!=s&&(this.historyList=JSON.parse(s).reverse())}else alert("您的浏览器不支持本地储存！")},watch:{inputVal:function(t,s){var i=this;t==[]&&(this.showSearchLists=!1),this.$axios.get("https://www.apiopen.top/novelSearchApi?name="+this.inputVal).then(function(t){200==t.data.code&&(i.novalList=t.data.data,i.showSearchLists=!0)}).catch(function(t){console.log(t)})},historyList:function(t,s){0==t.length?this.showHistoryList=!1:this.showHistoryList=!0}},methods:{removeHistoryList:function(){this.historyList=[],window.localStorage.setItem("historyList",o()([]))},removeHistory:function(t){return this.historyList.splice(t,1),this.historyData=JSON.parse(window.localStorage.getItem("historyList")).reverse(),this.historyData.splice(t,1),window.localStorage.setItem("historyList",o()(this.historyData)),!1},addHistoryList:function(t){if(""!=t){this.historyData=JSON.parse(window.localStorage.getItem("historyList")),this.historyData.length>=10&&this.historyData.splice(0,1);for(var s=0;s<=this.historyData.length;s++)this.historyData[s]==t&&this.historyData.splice(s,1);this.historyData.push(t),window.localStorage.setItem("historyList",o()(this.historyData))}}}},r={render:function(){var t=this,s=t.$createElement,i=t._self._c||s;return i("div",{staticClass:"wrapper"},[i("div",{staticClass:"input_box"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.inputVal,expression:"inputVal"}],staticClass:"input",attrs:{type:"text",placeholder:"请输入您想搜索的书籍?"},domProps:{value:t.inputVal},on:{input:function(s){s.target.composing||(t.inputVal=s.target.value)}}}),t._v(" "),i("i",{staticClass:"icon iconfont icon-sousuo",on:{click:function(s){return t.addHistoryList(t.inputVal)}}},[i("router-link",{attrs:{to:{name:"novalDetails",params:{id:1,novalName:t.inputVal}}}})],1),t._v(" "),i("ul",{directives:[{name:"show",rawName:"v-show",value:t.showSearchLists,expression:"showSearchLists"}],staticClass:"searchLists"},t._l(t.novalList,function(s,a){return i("li",{key:a,on:{click:function(i){return t.addHistoryList(s)}}},[i("router-link",{attrs:{to:{name:"novalDetails",params:{id:a,novalName:s}}}},[t._v(t._s(s))])],1)}),0)]),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:t.showHistoryList,expression:"showHistoryList"}],staticClass:"history_List"},[i("div",{staticClass:"history_remove",on:{click:t.removeHistoryList}},[t._v("\n\t\t\t清除历史\n\t\t")]),t._v(" "),i("ul",t._l(t.historyList,function(s,a){return i("li",{key:a},[i("span",{staticClass:"addHistoryList",on:{click:function(i){return t.addHistoryList(s)}}},[i("router-link",{attrs:{to:{name:"novalDetails",params:{id:a,novalName:s}}}},[i("span",[t._v(t._s(s))])])],1),t._v(" "),i("i",{staticClass:"removeHistory",on:{click:function(s){return t.removeHistory(a)}}},[t._v("×")])])}),0)])])},staticRenderFns:[]};var n=i("C7Lr")(e,r,!1,function(t){i("FS0d")},"data-v-7a3311a8",null);s.default=n.exports}});
//# sourceMappingURL=1.88d513779a7aaff7b6f0.js.map