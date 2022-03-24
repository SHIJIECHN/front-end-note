---
autoGroup-3: DOM
sidebarDepth: 3
title: day05
---
## 读写样式属性
DOM间接操作CSS。通过标签中的style属性，操作样式。
```html
    <style type="text/css">
        div {
            width: 100px;
            height: 100px;
            background-color: green;
        }
    </style>
<body>
    <div></div>
    <script type="text/javascript">
        var oDiv = document.getElementsByTagName('div')[0];
        console.log(oDiv.style.width); // ''  拿不到样式表的数值
        oDiv.style.width = '200px'; // 修改的是element.style，而不是样式表
        oDiv.style.height = '200px';
        oDiv.style.backgroundColor = 'green';
        // oDiv.style.border = '1px solid #000'; 拆解写
        oDiv.style.borderWidth = '1px';
        oDiv.style.borderStyle = 'solid';
        oDiv.style.borderColor = '#000';

        oDiv.style.position = 'absolute';
        oDiv.style.left = '200px';
        oDiv.style.top = '200px';

        oDiv.style.cssFloat = 'left';
    </script>
</body>
```
elem.style.xxx：
- 可读可写
- 小驼峰写法
- 值是字符串
- 复合值一定拆解赋值。oDiv.style.border拆解写
- 保留字前面加css。oDiv.style.cssFloat。目前只有float。

查看css属性方法：oDiv.style

查看计算样式：  
window.getComputedStyle(elem, null)：获得元素的所有样式。也可获取元素的相应属性。IE8及以下不支持，替换elem.currentStyle。
```html
<body>
    <div style="width: 100px; height: 200px;background-color: green;"></div>
    <script type="text/javascript">
        var oDiv = document.getElementsByTagName('div')[0];

        function getStyles(elem, prop) {
            if (window.getComputedStyle) {
                if (prop) {
                    return window.getComputedStyle(elem, null)[prop];
                } else {
                    return window.getComputedStyle(elem, null)
                }
            } else {
                if (prop) {
                    return elem.currentStyle[prop];
                } else {
                    elem.currentStyle;
                }
            }
        }

        console.log(getStyles(oDiv, 'height'));
    </script>
</body>
```
访问样式表的宽高：oDiv.offsetWidth和oDiv.offsetHeight。但是不常用。如果在动态设置宽高时，会把padding计算进去。
getComputedStyle第二个参数是为了获取伪元素属性预留的。只读。
```html
    <style type="text/css">
        div {
            width: 100px;
            height: 100px;
            background-color: green;
        }
        div::after{
            content: "";
            display: block;
            width: 50px;
            height: 50px;
            background-color: yellow;
        }
    </style>

<body>
    <div></div>
    <script type="text/javascript">
        var oDiv = document.getElementsByTagName('div')[0];
        console.log(window.getComputedStyle(div, 'after').height); // 获取伪元素的高 
    </script>
</body>
```

## 操作伪元素
点击外面大盒子，里面的盒子颜色改变。
```html
   <style type="text/css">
        .box {
            width: 100px;
            height: 100px;
            padding: 10px;
            background-color: green;
        }
        
        .box::after {
            content: "";
            display: block;
            width: 50px;
            height: 50px;
            background-color: yellow;
        }
        
        .box.active::after {
            background-color: black;
        }
    </style>

<body>
    <div class="box"></div>
    <script type="text/javascript">
        var div = document.getElementsByTagName('div')[0];
        div.onclick = function() {
            this.className += ' active';
        }
    </script>
</body>
```