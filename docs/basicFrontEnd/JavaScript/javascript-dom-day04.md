---
autoGroup-3: DOM
sidebarDepth: 3
title: day04
---

## 滚动距离与高度
查看滚动条的距离。浏览器滚动条滚动后，页面与窗口的距离。left是页面左侧到窗口左侧的距离，top是页面顶部到窗口顶部的距离。   
- 常规：`window.pageXOffset/pageYOffset`。`IE9/IE8`及以下不支持。   
- `IE9/IE8`及以下：`document.body.scrollLeft/scrollTop`或者`document.documentElement.scrollLeft/scrollTop`。不会同时可用。  
- 不常见：`window.scrollX/scrollY `。
  
滚动条距离兼容性写法：
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
判断模式：`document.compatMode`  
- 当文档最上方写\<`!DOCTYPE html`>时，返回`CSS1Compat`，这是兼容`W3C`规范的标准模式。   
- 当文档最上方没有写\<`!DOCTYPE html`>时，返回`BackCompat`，这是浏览器默认的向后兼容的模式，就是怪异模式。

## 可视区域
浏览器可视区域的尺寸（窗口的宽高）。  
- 常规：`window.innerWidth/innerHeight`    
- `IE9/IE8`及以下：`document.documentElement.clientWidth/clientHeight`（标准模式），`document.body.clientWidth/clientHeight`（怪异模式）
```js
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

## 整个页面宽高
不管看不看得见，就是整个`HTML`文档的宽高
- `document.body.scrollHeight/scrollWidth ` 
- `document.documentElement.scrollHeight/scrollWidth`   
- `window.innerWidth` + `window.pageXOffset`
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

        function getElemDocPosition(el) {
            var parent = el.offsetParent, // 有定位的父级
                offsetLeft = el.offsetLeft,
                offsetTop = el.offsetTop;
            // parent存在，说明本次循环出来的肯定是元素
            while (parent) {
                offsetLeft += parent.offsetLeft;
                offsetTop += parent.offsetTop;
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
`window.scroll(x, y)`与`window.scrollTo(x, y)`相同
`window.scrollBy(x, y)`
