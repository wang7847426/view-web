## 开发过程中遇到的问题
### Javascript
##### 1. 使用三元表达式拼接字符串的问题
[符号优先级](https://www.cnblogs.com/LIXI-/p/16400886.html)
```ruby
    问题描述：使用三元表达式拼接字符串，是不对的，（一直为false的值）；
    问题原因：'+'高的优先级大于'?'的优先级；
    问题解决：需要对三元表达式外围增加一对括号
```
##### 2. 为传递给函数的数组赋值
```javascript{.line-numbers}
    var arrList = [1,2,3];
    function init(arr){
        arr = []; // arr 会开辟新的空间，不会修改原始的数组
        console.log(arrList); // 原始数组未被修改 [1,2,3]
        // 解决
        // 1. arr[0] = 1;
        // 2. 使用数组的方法如 push、pop、unshift、shift
    }
    init(arrList)
```

### Vue
##### 1. 在同一组件下使用对 data 中的引用数据的问题；
```ruby
    问题描述：展示数据，在没有确定修改内容的情况下，会跟着弹框中修改的数据一起改变；
    问题原因：改变的是引用数据；公用的是同一个内存中的数据；
    问题解决：通过深拷贝将展示的数据和修改的数据进行分离；
```