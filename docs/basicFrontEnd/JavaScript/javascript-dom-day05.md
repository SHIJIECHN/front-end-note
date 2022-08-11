---
autoGroup-3: DOM
sidebarDepth: 3
title: 5. 样式操作
---
## 样式属性
### 1. 操作样式
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
        // 如果行间样式/内联样式没有填写属性的情况访问不了
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

        // 浮动cssFloat
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

### 2. 获取元素属性  
- window.getComputedStyle(elem, null)：获得元素的所有样式。也可获取元素的相应属性。
- elem.currentStyle。IE8及以下。

```javascript
//查看计算样式
//IE8及以下不支持 用 elem.currentStyle
//没设置的样式默认值并被getComputedStyle函数查询到
//此方法获取属性值比较准确
window.getComputedStyle(div, null);
window.getComputedStyle(elem, null)[prop];
```
```html
<body>
    <div style="width: 100px; height: 200px;background-color: green;"></div>
    <script type="text/javascript">
        var oDiv = document.getElementsByTagName('div')[0];

        /**
         * 获取元素属性
         * 避免使用offsetWidth&offsetHeight
         * @elem 元素
         * @prop 属性
         */
        function getStyles(elem, prop) {
            //检测getComputedStyle是否存在
            if (window.getComputedStyle) {
                if (prop) {
                    //存在，打印具体属性值
                    return parseInt(window.getComputedStyle(elem, null)[prop]);
                } else {
                    //不存在，打印集合
                    return window.getComputedStyle(elem, null)
                }
            } else {
                if (prop) {
                    return parseInt(elem.currentStyle[prop]);
                } else {
                    return elem.currentStyle;
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

## 元素运动
```javascript
//JS运动相关
var box = document.getElementsByClassName('box')[0];

box.onclick = function () {
  //这里offsetWidth会存在margin，有Bug
  // var width = this.offsetWidth;
  //解决方法(企业级写法)：用封装的getStyles拿宽高 
  //返回带单位的字符串 如 '100px' 在用parseInt()截取一下
  var width = parseInt(getStyles(this, 'width'));

  this.style.width = width + 10 + 'px';
}
```