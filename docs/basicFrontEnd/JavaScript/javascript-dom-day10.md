---
autoGroup-3: DOM
sidebarDepth: 3
title: day10
---

## 输入及状态改变事件
输入框发生变化。
```js
content.oninput = function(){
    console.log(this.value);
}
// IE9及以下版本
content.onpropertychange = function(){
    console.log(this.value);
}
```

oninput vs onchange:   
oninput输入是发生变化触发。  
onchange是输入框失去焦点，并且聚焦时的值和失去焦点时值不同。同时满足以上两种情况才会触发。

onblur onfocus
value模拟placeholder
```html
    <style text="text/css">
        .search-input {
            color: #999;
        }
        
        .search-input.has-value {
            color: #000;
        }
    </style>

<body>
    <input 
        type="text" 
        id="content" 
        class="search-input" 
        value="请输入关键字" 
        onfocus="if(this.value == '请输入关键字'){this.value = '';this.className = 'search-input has-value'}" 
        onblur="if (this.value == '') {this.value = '请输入关键字';this.className = 'search-input';}" 
    />
</body>
```

## 练习 
京东搜索框

## 鼠标
鼠标的滑入滑出
1. mouseover与mouseout。  
mouseover和mouseout改变元素背景颜色的效果与hover相似，通常较复杂的DOM结构使用mouseover与mouseout来实现。   
```html
    <style type="text/css">
        .box {
            width: 200px;
            height: 200px;
            background-color: orange;
        }
        
        .box .box1 {
            width: 100px;
            height: 100px;
            background-color: #000;
        }
    </style>

<body>
    <div class="box">
        <div class="box1"></div>
    </div>

    <script type="text/javascript" src="js/utils.js"></script>
    <script type="text/javascript">
        var oBox = document.getElementsByClassName('box')[0],
            oBox1 = document.getElementsByClassName('box1')[0];

        oBox.onmouseover = function() {
            this.style.backgroundColor = 'green';
        }

        oBox.onmouseout = function() {
            this.style.backgroundColor = 'orange';
        }

        oBox1.onmouseover = function() {
            this.style.backgroundColor = 'white';
        }

        oBox1.onmouseout = function() {
            this.style.backgroundColor = 'black'
        }
    </script>
</body>
```
当鼠标放到子元素上，父元素也会发生改变。也就是存在冒泡行为。
```js
oBox1.onmouseover = function(e) {
    this.style.backgroundColor = 'white';
    cancelBubble(e); // 取消冒泡
}

oBox1.onmouseout = function() {
    this.style.backgroundColor = 'black';
    cancelBubble(e); // 取消冒泡
}
```
在子元素上，取消冒泡。  
mouseover与mouseout：对绑定的元素里面的所有子元素都是生效的，有多少子元素，划过都算是一次。
```js
var oBox = document.getElementsByClassName('box')[0],
    oBox1 = document.getElementsByClassName('box1')[0],
    overCount = 0,
    outCount = 0;

oBox.onmouseover = function() {
    overCount++;
    console.log('overCount: ' + overCount);
}

oBox.onmouseout = function() {
    outCount++;
    console.log('outCount: ' + outCount);
}
```

2. mouseenter与mouseleave
只对自己绑定的这个元素生效。
```js
var oBox = document.getElementsByClassName('box')[0],
    oBox1 = document.getElementsByClassName('box1')[0],
    overCount = 0,
    outCount = 0;

oBox.onmouseenter = function() {
    overCount++;
    console.log('overCount: ' + overCount);
}

oBox.onmouseleave = function() {
    outCount++;
    console.log('outCount: ' + outCount);
}
```
冒泡行为与mouseover, mouseout一样。
```html
    <style type="text/css">
        .box {
            width: 200px;
            height: 200px;
            background-color: orange;
        }
        
        .box .box1 {
            width: 100px;
            height: 100px;
            background-color: #000;
        }
    </style>

<body>
    <div class="box">
        <div class="box1"></div>
    </div>

    <script type="text/javascript" src="js/utils.js"></script>
    <script type="text/javascript">
        var oBox = document.getElementsByClassName('box')[0],
            oBox1 = document.getElementsByClassName('box1')[0],
            overCount = 0,
            outCount = 0;

        oBox.onmouseenter = function() {
            this.style.backgroundColor = 'green';
        }

        oBox.onmouseleave = function() {
            this.style.backgroundColor = 'orange';
        }

        oBox1.onmouseenter = function() {
            this.style.backgroundColor = 'white';
        }

        oBox1.onmouseleave = function() {
            this.style.backgroundColor = 'black'
        }
    </script>
</body>
```
取消冒泡无效。因为此现象不是冒泡行为造成的，而是我们单独给两个元素分别绑定了mouseenter与mouseleave。
```js
oBox1.onmouseenter = function(e) {
    cancelBubble(e);
    this.style.backgroundColor = 'white';
}

oBox1.onmouseleave = function(e) {
    cancelBubble(e);
    this.style.backgroundColor = 'black'
}
```





