## Js
### Js 基础
[JS基础](http://c.biancheng.net/view/5351.html)
##### 1. JS 获取 DOM ?
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
 
 ##### Array 对象;
 ```javascript{.line-numbers}
    push：向数组末尾添加一个或多个元素，并返回数组的长度；
    pop： 删除数组最后一个元素， 并返回删除元素；
    unshift：向数组开头添加一个或多个元素，并返回数组的长度；
    shift：删除数组第一元素，并返回删除元素；
    splice：从数组中添加或删除元素；
    slice：截取数组的一部分，并返回新的数组；
    reverse：反转数组中元素的顺序；
    sort： 对数组中的元素进行排序；即能改变数组又返回数组；
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
##### Array 对象之 sort 方法;
```javascript{.line-numbers}
   // 使用 sort 方式对数组中对象进行排序
   let arr = [ 
        {name: 'lisi', age: 22},
        {name: 'zhangsan', age: 10},
        {name: 'wangwu', age: 33}
   ];

   let fun = (age) => {
      return (a,b) => {
         let val1 = a[age];
         let vla2 = b[age];
         return val1 - val2;
      }
   }

   let newArr = arr.sort(fun('age'));
   
   console.log(newArr);
```
##### String 对象;
```javascript{.line-numbers}
   slice：截取字符串中两个指定的索引之间的字符；
   substr： 指定索引位置截取指定长度的字符串；
   substring： 截取字符串中两个指定的索引之间的字符；
   split： 根据指定字符分割字符串，并返回数组；
   indexOf： 从字符串开头开始查找，并返回下标；
   lastIndexOf：从字符串结尾开始查找，并返回下标；
   concat：拼接字符串
   toString：返回字符串
   valueOf: 返回字符串对象的原始值；
   toLocaleLowerCase：根据主机的当前语言环境，把字符转化成小写；
   toLocaleUpperCase：根据主机的当前语言环境，把字符转化成大写；
   toLowerCase：把字符转化成小写；
   toUpperCase：把字符转化成大写；
   replace：替换正则匹配的字符串；
   match：根据正则匹配字符串中的字符；
   search：获取与正则匹配的字符串首次出现的位置；
```
 
 ##### JS 继承
 ```javascript{.line-numbers}
   /* 
      1. 原型链继承
      优点：可以继承父类的属性和方法;
      缺点：
         1. 实例对象无法向父类传参
         2. 父类的引用类型的属性会被子类修改
   */
   function Parent(){
      this.name = "小明";
      this.say = function(){
         console.log('我是小明')
      }
   }
   Parent.prototype.eat = function(){
      console.log('我在吃饭')
   }
   function Child(age){
      this.age = age;
   }
   Child.prototype = new Parent()
   var obj = new Child();

   /* 
      2. 构造函数继承
      优点：可以向父类传参，父类的引用类型的属性不会被子类修改
      缺点：无法继承父类原型上的方法、属性；
   */
   function Parent(){
      this.name = "小明";
      this.say = function(){
         console.log('我是小明')
      }
   }
   Parent.prototype.eat = function(){
      console.log('我在吃饭')
   }
   function Child(age){
      Parent.call(this);
      this.age = age;
   }
   Child.prototype.run = function(){
      conosle.log('我在跑步')；
   }
   let obj = new Child();

   /* 
      3. 组合式继承
      优点：可以复用父类，并且可以访问父元素原型上的属性、方法
      缺点：会调用两次父类的构造函数，子类上会有两份相同的属性、方法
   */
   function Parent(){
      this.name = "小明";
      this.say = function(){
         console.log('我是小明')
      }
   }
   Parent.prototype.eat = function(){
      console.log('我在吃饭')
   }
   function Child(age){
      Parent.call(this);
      this.age = age;
   }
   Child.prototype = new Parent();
   Child.prototype.run = function(){
      conosle.log('我在跑步')；
   }
   let obj = new Child();

   /* 
      4. 寄生式继承
      优点：解决了上面的所有缺点
      缺点：实现比较复杂
   */
   function Parent(){
      this.name = "小明";
      this.say = function(){
         console.log('我是小明')
      }
   }
   function Fun(){}
   Fun.prototype = Parent.prototype;
   Parent.prototype.eat = function(){
      console.log('我在吃饭')
   }
   function Child(age){
      Parent.call(this);
      this.age = age;
   }
   Child.prototype = new Fun();
   Child.prototype.run = function(){
      conosle.log('我在跑步')；
   }
   let obj = new Child();

   /* 
      5. ES6 的 extends
      目前最优的继承
   */
   class Parent{
      constructor(){
         this.name = '小明';
         this.say = function(){
            console.log('我是小明')
         }
      }
      eat(){
         console.log('我在吃饭');
      }
   }
   class Child extends Parent {
      constructor(age){
         this.age = age;
      }
      run(){
         console.log('我在跑步')
      }
   } 
   let obj = new Child();
 ```

### ES6
##### 1. try、catch、finally
```javascript{.line-numbers}
   // 通过 try、catch 捕获异常，使 js 代码继续执行； 
   try{
       //尝试执行代码块 ，检查是否有错误的代码块
      console.log(11);
      throw new Error("！！错误！！")
      console.log(22); // 错误以下代码不会被执行；
   }catch(error){
      //捕获错误的代码块 ,如果 try 语句发生错误执行的代码块。
      //                 如果 try 语句没发生错误该代码不会执行。
      console.log(33);
      console.log(error.massage);
      console.log(44);
   }finally{
      // 不管是否有错误代码都会执行；
      console.log(55);
   }
   /*
      总结： 
      1. catch 用于捕获当前 try 中的抛出的异常，
         如果 catch 中的抛出的异常，则需要在外层才能捕获； 
      2. 不管 try 和 catch 的执行情况如何，finally 都会被执行
         即使其中包含 return 语句；
      3. try 或者 catch 中 return 的在进入 finally 之前会提前进行缓存，
         finally 中的执行语句不会改变 return 的值（分为 基本类型和复杂类型），复杂类型的值会被修改；
      4. 如果 finally 中有 return ，程序会提前退出，
         返回值不是 try 和 catch 中保存的值； 
   */
``` 


