---
autoGroup-3: DOM
sidebarDepth: 3
title: day08
---

## 鼠标行为
坐标系。
- clientX/Y：鼠标位置相对于当前可视区域的坐标（不包括滚动条的距离）
- layerX/Y：同pageX/Y。IE11以下同clientX/Y
- screenX/Y：鼠标位置相对于屏幕的坐标
- x/y：通clientX/Y。火狐不支持。
- pageX/Y：鼠标位置相对于当前文档的坐标（包含滚动条的距离）。IE9以下不支持
- offsetX/Y：鼠标位置相对于块元素的坐标。（包含边框，Safari不包括边框）

## pageX/Y封装
```js
function pagePos(e) {
    var sLeft = getScrollOffset().left,
        sTop = getScrollOffset().top,
        // 获取文档偏移
        cLeft = document.documentElement.clientLeft || 0, // IE8为undefined，如果是undefined就取0，说明没有文档偏移
        cTop = document.documentElement.clientTop || 0;

    return {
        X: e.clientX + sLeft - cLeft,
        Y: e.clientY + sTop - cTop
    }
}
```

## 拖拽
mousedown 鼠标按下
mouseup 鼠标抬起
mousemove 鼠标移动

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

        box.onmousedown = function(e) {

            document.onmousemove = function(e) {
                var e = e || window.event,
                    page = pagePos(e);
                console.log(222);
                box.style.left = page.X + 'px';
                box.style.top = page.Y + 'px';
            }

            box.onmouseup = function() {
                document.onmousemove = null;
            }

        }
    </script>
</body>
```
优化
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

        box.onmousedown = function(e) {
            var e = e || window.event,
                x = pagePos(e).X - getStyles(box, 'left'),
                y = pagePos(e).Y - getStyles(box, 'top');

            document.onmousemove = function(e) {
                var e = e || window.event;

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
