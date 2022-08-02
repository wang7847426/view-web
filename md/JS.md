## Js
### Js 基础
[JS基础](http://c.biancheng.net/view/5351.html)
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



 #### Array 对象;
 ```javascript{.line-numbers}
    push：向数组末尾添加一个或多个元素，并返回数组的长度；
    pop： 删除数组最后一个元素， 并返回删除元素；
    unshift：向数组开头添加一个或多个元素，并返回数组的长度；
    shift：删除数组第一元素，并返回删除元素；
    splice：从数组中添加或删除元素；
    slice：截取数组的一部分，并返回新的数组；
    reverse：反转数组中元素的顺序；
    sort： 对数组中的元素进行排序；
    concat：拼接两个或多个数组，并返回结果；
    join： 将数组拼接成一个字符串；
    isArray： 判断对象是否为数组；
    includes：判断数组中是否包含一个指定的元素；
    indexOf：搜索数组中元素，有这个元素返回下标， 没有返回-1；
    valueOf：返回数组对象原始值；
    keys：返回数组的可迭代对象，包含原始数组的键（key）；、
    entries：返回数组可迭代对象
    forEach：遍历数组，没有返回值
    map：遍历数组，有返回值
    filter：过滤数组中元素，返回值为数组
    every：数组中所有元素都符合条件， 返回 true， 否则反之；
    some：数组中有一个元素符合条件，返回 true，否则反之；
    reduce：数组的归并方法;
    find： 函数用来查找目标元素，找到就返回该元素，找不到返回undefined
    findIndex：函数也是查找目标元素，找到就返回元素的位置，找不到就返回-1
 ```

 