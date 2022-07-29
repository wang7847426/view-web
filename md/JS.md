## Js
### Js 基础
#### 1. JS 获取 DOM ?
```javascript{.line-numbers}
    1. document.documentElement // 获取 HTML 节点
    2. document.body // 获取 body 节点

    // <div class="wrapper" id="app" name="name">
    3. document.getElementById('app') // 通过 Id 获取 DOM
    4. document.getElementsByTagName('div') //  通过 标签 获取 DOM ，返回 数组
    5. document.getElementsByName('name') //  通过 name属性 获取 DOM ，返回 数组
    6. document.getElementsByClassName('.wrapper') // 通过 class属性 获取 DOM ，返回 数组
    7. document.querySelector("div") // 通过选择器获取一个元素
    8. document.querySelectorAll("div") // 通过选择器获取一组元素
 ```
 