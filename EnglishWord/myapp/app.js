const express = require('express');
const path = require('path');
let app = express();
let router = require("./router/index.js")

var bodyParser = require('body-parser')
// 配置模板引擎和 body-parser 一定要在 app.use(router) 挂载路由之前
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// 告诉express框架，使用什么模板引擎渲染HTML模板
app.engine('html',require('express-art-template'));
// 设置render渲染模板的后缀为html
app.set('view engine','html');
// render渲染模板,模板默认路径
app.set('views',path.join(__dirname,'/views'))//views 目录需要自己创建

app.use(router);


app.listen(3000,()=>{
    console.log('3000开始监听... ')
})