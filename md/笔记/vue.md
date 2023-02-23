# Vue 基础用法
##### 1. slot
```javascript{.line-numbers}
    匿名插槽：
        父：<list>
                <span>需要在子组件中显示的内容</span>
            </list>
        子：<div class="child">
                <slot></slot>
            </div>
    具名插槽：
        父：<list>
                // 简写
                <template #header>
                    <span >需要在子组件中显示的内容111</span>
                </template>
                // 不简写
                <template v-slot:footer>
                    <span >需要在子组件中显示的内容222</span>
                </template>
            </list>
        子：<div class="child">
                <slot name="header"></slot>
                <slot name="footer"></slot>
            </div>
    作用域插槽：子向父传值
        父：<list>
                //必须要用template标签  必须要用slot-scope属性 来接收子组件插槽传递过来的数据
                //传递过来的数据都在result中 在template标签内可以使用接收的数据
                //        简写               完整    
                <template #header="{data}"  slot-scope="result">
                    使用 data 数据
                    <span>需要在子组件中显示的内容</span>
                </template>
            </list>
        子：
            <div class="child">
                <slot name="header" :data="{data}"></slot>
            </div>
```
##### 2. ☆ computed 是计算用法☆
```javascript{.line-numbers}
    computed:{
        newStr1(){ // 简化的写法 没有 get/set，不可以通过 this.newStr1 进行修改
            return this.str + "111";
        },
        newStr2:{ // 完整的写法，可以进行修改
            get(){return this.str + "111";},
            set( val ){this.str = val;}
        }
    }
```
##### 3. ☆ watch ☆
```javascript{.line-numbers}
    watch:{
        str(newVal, oldVal){console.log(newVal, oldVal)}, //简化的写法
        str:{
            handler(newVal, oldVal){console.log(newVal, oldVal)},
            immediate: true, // 首次加载页面执行函数
            deep:true  // 深度监听
        }
    }
```

# Vue 的原理：
## 1. diff算法
```javascript{.line-numbers}
    1. 旧前 和 新前
    2. 旧后 和 新后
    3. 旧前 和 新后
    4. 旧后 和 新前
    5. 以上都不满足条件 ==> 查找
    6. 创建或者删除
```
## 2. patch 函数 
```javascript{.line-numbers}
   使用场景： 
        1. 第一次将虚拟DOM更新到真实节点上的时候；
        2. 将新虚拟DOM更新到旧虚拟DOM上的时候；
    
```
## 3. patchVNode 函数 
```javascript{.line-numbers}
    
```
## 4. render 函数
```javascript{.line-numbers}
    
```
## 6. h 函数
```javascript{.line-numbers}
    
```