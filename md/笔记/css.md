## CSS
### CSS 高级
##### 1. 页面文字是否有选中状态
```javascript{.line-numbers} 
    .text{
        user-select: all; // 所有内容作为一个整体时可以被选择
        user-select: auto; //文本将根据浏览器的默认属性进行选择
        user-select: none;// 元素和子元素的文本将无法被选中
        user-select: text; // 文本可以被选中
    }
```
##### 2. 文字省略号
```javascript{.line-numbers}
    <style>
         .text-box{
            // 一行省略号
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .text-box{
            // 多行省略号
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
        }
    </style>   
```
##### 3. var
```javascript{.line-numbers}
<style>
    .container{ // 只在 container 元素内部生效， 可以改为 html 根节点
        --main-color: #c0000; // 使用 --变量名: 值； 的方式声明；
    }
    .box1{
        background-color: var(--main-color);// 通过 var() 使用变量;
    }
    .box2{
        color: var(--main-color, #eee); // 如果 --main-color 变量不存在， 就会显示为第二个值
    }
</style>
```
##### 4. vw，vh
```ruby
    
```
##### 5. calc
```ruby
    
```
##### 6. ☆ Flex 布局 ☆
```ruby
    父元素：
        1. flex-direction：主轴的排列方式；
            1. row：水平方向，左起
            2. row-reverse：水平方向，右起；
            3. column：垂直方向，上沿；
            4. column-reverse：垂直方向，下沿；

        2. flex-wrap：换行方式；
            1. nowrap：(默认值) 不换行；
            2. wrap： 换行， 
            3. wrap-reverse：换行，行进行翻转

        3. flex-flow： 主轴的排列方式 | 换行方式;

        4.justify-content：主轴的对齐方式；
            1. flex-start：左对齐；
            2. flex-end：右对齐；
            3. center：居中对象；
            4. space-between：两端对齐，元素之间间距相同；
            5. space-around：元素两侧的间距相同；

        5. align-items： 交叉轴的对齐方式；
            1. flex-start：交叉轴起点对齐；
            2. flex-end: 交叉轴终点对齐；
            3. center: 交叉轴居中对齐；
            4. baseline：文字的基线对齐；
            5. stretch：（默认值）如果项目未设置高度或设为auto，将占满整个容器的高度

        6. align-content： 多条轴线的对齐方式；
            1. flex-start：与交叉轴起点对齐；
            2. flex-end：与交叉轴终点对象；
            3. center: 与交叉轴中点对象
            4. space-between: 与交叉轴两端对象，轴线之间的间隔平局分布；
            5. space-around: 每根轴线两侧的间隔都相等。
            6. stretch:（默认值）轴线占满整个交叉轴

    子元素：
        1. order：元素的排列顺序，越小越靠前；

        2. flex-grow：元素的放大比例；

        3. flex-shrink：元素的缩小比例；

        4. flex-basis：元素本身大小； auto | 数值；

        5. flex： 放大比例 | 缩小比例 | 大小；

        6. align-self：元素本身在交叉轴的对齐方式
            1. flex-start：交叉轴起点对齐；
            2. flex-end：交叉轴终点对齐；
            3. center：交叉轴居中对齐；
            4. baseline：文字的基线对齐
            5. stretch：如果项目未设置高度或设为auto，将占满整个容器的高度
            6. auto：（默认值） 
```
##### 7. 多行文字居中显示
```javascript{.line-numbers}
    第一种：
    .父元素{
        display: table;
    }
    .子元素{
        display: table-cell;
        vertical-align: middle;
    }
    第二种： flex 布局；
```
##### 8. css3 渐变
```javascript{.line-numbers}
    1. 线性渐变：
        background-image: linear-gradient(方向, 颜色, 颜色,'...');
        方向：可填写 to left， to left bottom， 30deg， -30deg;
        颜色: 可填写 red， #fff;

    2. 径向渐变：需要添加前缀；
        background-image: radial-gradient(形状 大小 at 起点, 颜色, 颜色,'...');
        起点：可填写 center， 百分比 50% 50%
        形状：可填写 ellipse表示椭圆形，circle表示圆形
        大小：可填写 closest-side：最近边；farthest-side：最远边；closest-corner：最近角；farthest-corner：最远角。

    3. 重复性渐变：
        background-image: repeating-radial-gradient(形状 大小 at 起点, 颜色 10%, 颜色 15%,'...');
        同 2 相同
```
##### 9. filter
```javascript{.line-numbers}
    
```
