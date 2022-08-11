---
autoGroup-3: DOM
sidebarDepth: 3
title: 4. 浏览器滚动条、可视化页面操作
---
 
## 滚动距离/高度
常规滚动条的距离：
- window.pageXOffset
- window.pageYOffset

`IE9/IE8`及以下
- document.body.scrollLeft
- docunment.body.scrollTop 
- document.documentElement.scrollLeft
- document.documentElement.scrollTop 

不常见：
- window.scrollX
- window.scrollY


滚动条距离兼容性写法：利用document.documentElement和document.body合体
```js
function getScrollOffset() {
    if (window.pageXOffset) {
        return {
            left: window.pageXOffset,
            top: window.pageYOffset
        }
    } else {
        return {
            left: document.body.scrollLeft + document.documentElement.scrollLeft,
            top: document.body.scrollLeft + document.documentElement.scrollTop
        }
    }
}
```

## 浏览器的怪异模式和标准模式
- 标准模式：w3c标准
- 怪异模式：厂商自己的标准

判断模式：`document.compatMode`  
- 当文档最上方写\<`!DOCTYPE html`>时，返回`CSS1Compat` ->  标准模式。   
- 当文档最上方没有写\<`!DOCTYPE html`>时，返回`BackCompat` -> 怪异模式，这是浏览器默认的向后兼容的模式。

## 可视区域
浏览器可视区域的尺寸（窗口的宽高）。  
常规：
- `window.innerWidth`    
- `window.innerHeight`   
   
`IE9/IE8`及以下：
- 标准模式
  - `document.documentElement.clientWidth`
  - `document.documentElement.clientHeight`
- 怪异模式
  - `document.body.clientWidth`
  - `document.body.clientHeight`
  
浏览器可视区域的尺寸兼容性封装：
```js
// 原理：判断模式是否为怪异
function getViewportSize() {
    if (window.innerWidth) {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    } else {
        if (document.compatMode === 'BackCompat') {
            return {
                width: document.body.clientWidth,
                height: document.body.clientHeight
            }
        } else {
            return {
                widht: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            }
        }
    }
}
```

## 页面宽高
滚动距离 + 可视宽度/高度 = 滚动尺寸   

不管看不看得见，就是整个`HTML`文档的宽高
- `document.body.scrollHeight/scrollWidth ` 
- `document.documentElement.scrollHeight/scrollWidth`   
- `window.innerWidth` + `window.pageXOffset`

页面宽高兼容性写法：
```js
function getScrollSize(){
    if(document.body.scrollWidth){
        return {
            width: document.body.scrollWidth,
            height: document.body.scrollHeight,
        }
    }else{
        return {
            width: document.documentElement.scrollWidth,
            height: document.documentElement.scrollHeight
        }
    }
}
```

## getBoundingClientRect
缺点：不实时。
```javascript
// getBoundingClientRect();
var box = document.getElementsByClassName('box')[0];
console.log(box.getBoundingClientRect());

/**
 * 缺点：不实时
 * DOMRect {x: 8, y: 8, width: 5002, height: 2, top: 8, …}
 *   bottom: 10
 *   height: 2
 *   left: 8
 *   right: 5010
 *   top: 8
 *   width: 5002
 *   x: 8
 *   y: 8
 */
```

### offsetLeft 和 offsetTop
```html
<style>
    .box {
        position: absolute;
        top: 50px;
        left: 50px;
        width: 100px;
        height: 100px;
        background-color: green;
    }
</style>

<div class="box"></div>
<script type="text/javascript">
    var box = document.getElementsByClassName('box')[0];
    var info = box.getBoundingClientRect();
    console.log(info);
    // 获取盒子到左侧浏览器边框的距离
    console.log(box.offsetLeft); // 50 
    console.log(box.offsetTop); // 50
</script>
```
`offsetLeft`和`offsetTop`：当父级元素有定位（`position`），则相对父级定位；如果父级没有定位，则相对于`body`。  

案例一：父级有定位，则返回相对于父级定位。
```html
    <style>
        body {
            margin: 0;
        }
        
        .parent {
            position: absolute;
            top: 100px;
            left: 100px;
            width: 300px;
            height: 300px;
            background-color: #999;
        }
        
        .son {
            width: 100px;
            height: 100px;
            margin: 50px;
            background-color: green;
        }
    </style>

<body>
    <div class="parent">
        <div class="son"></div>
    </div>
    <script type="text/javascript">
        var box = document.getElementsByClassName('son')[0];
        console.log(box.offsetLeft); // 50
        console.log(box.offsetTop); // 50
    </script>
</body>
```
案例二：父级没有定位，则返回相对于`body`的定位。
```html
    <style>
        body {
            margin: 0;
        }
        
        .parent {
            width: 300px;
            height: 300px;
            margin: 100px;
            overflow: hidden;
            background-color: #999;
        }
        
        .son {
            width: 100px;
            height: 100px;
            margin: 50px;
            background-color: green;
        }
    </style>

<body>
    <div class="parent">
        <div class="son"></div>
    </div>
    <script type="text/javascript">
        var box = document.getElementsByClassName('son')[0];
        console.log(box.offsetLeft); // 150
        console.log(box.offsetTop); // 150
    </script>
</body>
```

`offsetParent`：返回有定位的父级元素。   
如果parent盒子没有定位的情况打印body元素
```javascript
console.log(parent.offsetParent);
```

封装方法：查看盒子到页面边缘的距离
封装盒子相对于`HTML`文档的定位，不管父级有没有定位。
```html
    <style>
        body {
            margin: 0;
        }
        
        .grandPa {
            position: absolute;
            top: 100px;
            left: 100px;
            width: 360px;
            height: 360px;
            background-color: #ccc;
        }
        
        .parent {
            position: absolute;
            left: 30px;
            top: 30px;
            width: 300px;
            height: 300px;
            background-color: #999;
            overflow: hidden;
        }
        
        .son {
            position: absolute;
            top: 100px;
            left: 100px;
            width: 100px;
            height: 100px;
            background-color: green;
        }
    </style>

<body>
    <div class="grandPa">
        <div class="parent">
            <div class="son"></div>
        </div>
    </div>

    <script type="text/javascript">
        var son = document.getElementsByClassName('son')[0];

        /**
         * 封装合并子盒子与父盒子到左侧/上侧 到 页面左侧/上侧的 距离
         */
        function getElemDocPosition(el) {
            // 找到有定位的父级盒子
            var parent = el.offsetParent, // 有定位的父级
                //找到当前盒子左侧/上侧到页面左侧/上侧的距离
                offsetLeft = el.offsetLeft,
                offsetTop = el.offsetTop;

            // parent存在，说明本次循环出来的肯定是元素
            while (parent) {
                // 循环出来的parent是定位元素
                offsetLeft += parent.offsetLeft;
                offsetTop += parent.offsetTop;
                // 重新赋值parent，找到外层盒子继续加
                parent = parent.offsetParent;
            }
            return {
                left: offsetLeft,
                top: offsetTop
            }
        }

        console.log(getElemDocPosition(son)); // 150
    </script>
</body>
```

## 操作滚动条

滚动到多少：跳至目标位置，返回undefined
- `window.scroll(x, y)`
- `window.scrollTo(x, y)`

每次滚动多少（累加）：应用（小说阅读自动滚动功能）
- `window.scrollBy(x, y)`