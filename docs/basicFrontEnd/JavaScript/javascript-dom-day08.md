---
autoGroup-3: DOM
sidebarDepth: 3
title: 8. 鼠标坐标
---

## 鼠标行为
坐标系。
- clientX/Y：鼠标位置相对于当前可视区域的坐标（不包括滚动条的距离）
- layerX/Y：同pageX/Y。IE11以下同clientX/Y
- screenX/Y：鼠标位置相对于屏幕的坐标
- x/y：同clientX/Y。火狐不支持。
- pageX/Y：鼠标位置相对于当前文档的坐标（包含滚动条的距离）。IE9以下不支持
- offsetX/Y：鼠标位置相对于块元素的坐标。（包含边框，Safari不包括边框）

分析：
```javascript
documment.click = function(e){
    var e = e | window.event;
    console.log(e.clientY, e.pageY);
    // 数字相同，但滚动条下，clientY数值小于pageY数值

    console.log(e.screenY, e.pageY);
    // 256 100 screenY = 屏幕坐标

    console.log(e.y, e.pageY);
    // 数字相同 但滚动条下，y数值小于pageY
    // 跟clientY数值一样

    console.console.log(e.layerY, e.pageY);
    // 数值相同 滚动条也相同

    console.log(e.offsetY, e.pageY);
    // offsetY鼠标位置对于块元素的坐标
    // 注意：包含边框
    
}
```

## 封装页面坐标函数
```js
/**
 * 封装页面坐标函数pagePos()
 * @e 元素
 * @返回值 页面内的x/y坐标
 */
function pagePos(e) {
    // 获取滚动条距离
    // 使用获取滚动条距离
    var sLeft = getScrollOffset().left,
        sTop = getScrollOffset().top,
        // 获取文档偏移
        // IE8为undefined，如果是undefined就取0，说明没有文档偏移
        cLeft = document.documentElement.clientLeft || 0, 
        cTop = document.documentElement.clientTop || 0;

    return {
        // 可视区域坐标 + 滚动条距离 - 偏移距离
        X: e.clientX + sLeft - cLeft,
        Y: e.clientY + sTop - cTop
    }
}
```

## 拖拽
- mousedown 鼠标按下
- mouseup 鼠标抬起
- mousemove 鼠标移动

鼠标按下并且移动写法：mousedown：mouseover + mouseup。   
鼠标的移动和抬起要在鼠标按下事件处理函数内部。
```html
    <style type="text/css">
        .box {
            position: absolute;
            top: 0;
            left: 0;
            width: 100px;
            height: 100px;
            background-color: orange;
        }
    </style>

<body>
    <div class="box"></div>
    <script src="js/utils.js"></script>
    <script type="text/javascript">
        var box = document.getElementsByClassName('box')[0];
        // Bug： 鼠标永远停留在块元素的左上

        box.onmousedown = function(e) {
            // 在box块元素上移动
            document.onmousemove = function(e) {
                var e = e || window.event,
                    page = pagePos(e);

                box.style.left = page.X + 'px';
                box.style.top = page.Y + 'px';
                // 注：以上代码鼠标移出目标元素块会使元素块停止不动
                // 原因：帧率跟不上
            }

            // 写onmouseup事件处理函数，解决上述停止不动的问题
            box.onmouseup = function() {
                //鼠标抬起取消事件处理函数
                document.onmousemove = null;
            }

        }
    </script>
</body>
```

事件拖拽方法
```html
    <style type="text/css">
        .box {
            position: absolute;
            top: 0;
            left: 0;
            width: 100px;
            height: 100px;
            background-color: orange;
        }
    </style>
</head>

<body>

    <div class="box"></div>
    <script src="js/utils.js"></script>
    <script type="text/javascript">
        var box = document.getElementsByClassName('box')[0],
            x,
            y;

        // 通过getStyles()拿到盒子x,y位置
        // 盒子边缘到盒子内部鼠标位置 = 页面坐标 - 盒子坐标
        box.onmousedown = function(e) {
            var e = e || window.event,
                x = pagePos(e).X - getStyles(box, 'left'),
                y = pagePos(e).Y - getStyles(box, 'top');

            document.onmousemove = function(e) {
                var e = e || window.event;

                // 盒子到页面边缘距离 = 页面坐标 - 盒子边缘到盒子内部鼠标位置
                box.style.left = pagePos(e).X - x + 'px';
                box.style.top = pagePos(e).Y - y + 'px';
            }

            document.onmouseup = function() {
                this.onmousemove = null;
                this.onmouseup = null;
            }
        }
    </script>
</body>
```
最终：
```js
function elemDrag(elem) {
    var x,
        y;

    addEvent(elem, 'mousedown', function(e) {
        var e = e || window.event,
            x = pagePos(e).X - getStyles(this, 'left'),
            y = pagePos(e).Y - getStyles(this, 'top');

        addEvent(document, 'mousemove', mouseMove);
        cancelBubble(e); // 取消冒泡
        preventDefaultEvent(e); // 取消默认事件
        addEvent(document, 'mouseup', mouseUp)
    })

    function mouseMove(e) {
        var e = e || window.event;
        elem.style.left = pagePos(e).X - x + 'px';
        elem.style.top = pagePos(e).Y - y + 'px';
    }

    function mouseUp(e) {
        var e = e || window.event;
        removeEvent(document, 'mousemove', mouseMove);
        removeEvent(document, 'mouseup', mouseUp);
    }
}
```
案例
```html
    <style type="text/css">
        .box {
            position: absolute;
            top: 0;
            left: 0;
            width: 100px;
            height: 100px;
            background-color: orange;
        }
    </style>
</head>

<body>

    <div class="box"></div>
    <script src="js/utils.js"></script>
    <script type="text/javascript">
        var box = document.getElementsByClassName('box')[0],
            x,
            y;

        elemDrag(box);

        function elemDrag(elem) {
            var x,
                y;

            addEvent(elem, 'mousedown', function(e) {
                var e = e || window.event
                x = pagePos(e).X - getStyles(this, 'left'),
                    y = pagePos(e).Y - getStyles(this, 'top');

                addEvent(document, 'mousemove', mouseMove);
                cancelBubble(e); // 取消冒泡
                preventDefaultEvent(e); // 取消默认事件
                addEvent(document, 'mouseup', mouseUp)
            })

            function mouseMove(e) {
                var e = e || window.event;
                elem.style.left = pagePos(e).X - x + 'px';
                elem.style.top = pagePos(e).Y - y + 'px';
            }

            function mouseUp(e) {
                var e = e || window.event;
                removeEvent(document, 'mousemove', mouseMove);
                removeEvent(document, 'mouseup', mouseUp);
            }
        }
    </script>
</body>
```
