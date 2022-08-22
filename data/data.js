const Mock = require("mockjs");

const Random = Mock.Random;


// 定义数据类型
const { 
    goodData,
    article,
    login,
    userInfo,
    indexBanner
} = Mock.mock({
    // 20条数据
    "goodData|20": [{
        // 商品种类
        "goodsClass": "女装",
        // 商品Id
        "goodsId|+1": 1,
        //商品名称
        "goodsName": "@ctitle(10)",
        //商品地址
        "goodsAddress": "@county(true)",
        //商品等级评价★
        "goodsStar|1-5": "★",
        //商品图片
        "goodsImg": "@Image('100x100','@color','小甜甜')",
        //商品售价
        "goodsSale|30-500": 30
    }],
    "article|20": [{
        "id|+1": 1,
        "image|3": [Random.image('200x100', '#50B347', '#FFF')],
        "content": "@cparagraph(1,3)",
        "name": "@cname",
        "time": "@datetime()",
        "isShow":"@boolean",
        "username|1-5": [
            {
                "name|+1": [
                    "李四",
                    "王五",
                    "赵六"
                ]
            }
        ]
    }],
    "login":{
        "code": 1,
        "massage": "登录成功",
        "token": "@guid"
    },
    "userInfo":{
        "name":"@name",
        "age|1-100":1,
        "sex|0-1":1,
    },
    "indexBanner|3-7":[
        {
            "title": "@ctitle(5,25)",
            "image": Random.image('735x480'),
        }
    ]
});

module.exports = () => {
    return {
        goodData,
        article,
        login,
        userInfo,
        indexBanner
    };
}