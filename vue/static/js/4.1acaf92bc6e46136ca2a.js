webpackJsonp([4],{Rlm9:function(s,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=e("4YfN"),o=e.n(i),n=e("R4Sj"),a={data:function(){return{isShow:!1,key:""}},computed:o()({},Object(n.c)({isLogin:"isLogin",userInfo:"userInfo"})),mounted:function(){console.log(this.userInfo)},created:function(){this.axiosKey()},methods:o()({},Object(n.b)(["setUser","setInfo"]),{axiosKey:function(){var s=this;this.$axios.get("https://www.apiopen.top/createUserKey?appId=com.chat.peakchao&passwd=123456").then(function(t){s.key=t.data.data.appkey}).catch(function(s){console.log(s)})},quit:function(){this.setInfo([]),this.setUser(!1),this.$Cookies.set("login",0)}})},r={render:function(){var s=this,t=s.$createElement,e=s._self._c||t;return e("div",[e("div",{directives:[{name:"show",rawName:"v-show",value:!s.isLogin,expression:"!isLogin"}],staticClass:"login_bg"},[e("div",{staticClass:"login_head_box"},[e("router-link",{attrs:{to:{name:"login",params:{key:s.key}}}},[e("div",{staticClass:"login_head"},[e("i",{staticClass:"icon iconfont icon-31wode"})]),s._v(" "),e("p",[s._v("已有账号登录")])])],1),s._v(" "),e("div",{staticClass:"register"},[e("router-link",{attrs:{to:{name:"register",params:{key:this.key}}}},[e("p",[s._v("注册")])])],1)]),s._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:s.isLogin,expression:"isLogin"}],staticClass:"login_success login_bg"},[e("div",{staticClass:"login_head_box"},[e("router-link",{attrs:{to:"/login"}},[e("div",{staticClass:"login_head"},[e("img",{attrs:{src:s.userInfo.img,alt:""}})]),s._v(" "),e("p",[s._v(s._s(s.userInfo.name))])])],1),s._v(" "),e("div",{staticClass:"register"},[e("router-link",{attrs:{to:"/register"}},[e("p",[s._v(s._s(s.userInfo.text||"暂无"))])])],1)]),s._v(" "),e("mt-button",{directives:[{name:"show",rawName:"v-show",value:s.isLogin,expression:"isLogin"}],attrs:{type:"danger",size:"normal"},on:{click:s.quit}},[s._v("退出")])],1)},staticRenderFns:[]};var c=e("C7Lr")(a,r,!1,function(s){e("dVSS")},"data-v-388febbd",null);t.default=c.exports},dVSS:function(s,t){}});
//# sourceMappingURL=4.1acaf92bc6e46136ca2a.js.map