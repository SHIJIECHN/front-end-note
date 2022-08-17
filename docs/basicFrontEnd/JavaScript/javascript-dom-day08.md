---
autoGroup-3: DOM
sidebarDepth: 3
title: 8. 鼠标坐标
---

## 鼠标行为
坐标系。
- clientX/Y：鼠标位置相对于当前可视区域的坐标（不包括滚动条的距离）
- layerX/Y：同pageX/Y。IE11以下同clientX/Y。（不直接使用）
- screenX/Y：鼠标位置相对于屏幕的坐标
- x/y：同clientX/Y。火狐不支持。（不直接使用）
- pageX/Y：鼠标位置相对于当前文档的坐标（包含滚动条的距离）。IE9以下不支持。（不直接使用）
- offsetX/Y：鼠标位置相对于块元素的坐标(自身的左上角)。（包含边框，Safari不包括边框）

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
```javascript
// 获取文档的偏移量(默认的margin值):
document.documentElement.clientLeft(IE8) / clientTop || 0 (IE8以上是undeifned)
```
封装坐标函数替代pageX 与 pageY。因为pageX和pageY有兼容性问题
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
        // 获取文档偏移(默认的margin值)
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
- mousedown 鼠标按下事件
- mouseup 鼠标抬起事件
- mousemove 鼠标移动事件

鼠标按下并且移动写法：mousedown：mouseover + mouseup。   
鼠标的移动和抬起要在鼠标按下事件处理函数内部。

### 1. 一些小问题
如果box是相对定位(relative), 此时onmouseup事件并不执行,因为相对定位保留原有的位置,并没有脱离文档流,鼠标在抬起的时候,并没有处于在box元素上,所以不会触发。    
```javascript
box.onmousedown = function(e) {
	console.log('鼠标点击');
	document.onmousemove = function(e) {
		var e = e || window.event;
		box.style.left = e.pageX + 'px';
		box.style.top = e.pageY + 'px';
		console.log('鼠标移动');
	}
	box.onmouseup = function() {
		console.log('鼠标抬起');
	}
}
```

解决方案:
1. 将box元素设置为绝对定位absolute。
2. 将鼠标坐标设置为元素的中心位置。
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
            // 在box块元素上移动
            document.onmousemove = function(e) {
                var e = e || window.event,
                    page = pagePos(e);

                box.style.left = page.X + 'px';
                box.style.top = page.Y + 'px';
                // 注：以上代码鼠标快速移出目标元素块，元素块停止不动
                // 原因：帧率跟不上。鼠标移动太快，赋值跟不上
            }

            box.onmouseup = function() {
                // 解决上述问题：document.onmousemove = null;
                //鼠标抬起取消事件处理函数
                document.onmousemove = null;
            }

        }
    </script>
</body>
```
### 2. 正常的拖拽
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
               // 获取当前点击源距离文档的坐标
                x = pagePos(e).X - getStyles(box, 'left'),
                y = pagePos(e).Y - getStyles(box, 'top');

            document.onmousemove = function(e) {
                var e = e || window.event;

                // 移动的值
                // 盒子到页面边缘距离 = 页面坐标 - 盒子边缘到盒子内部鼠标位置
                box.style.left = pagePos(e).X - x + 'px';
                box.style.top = pagePos(e).Y - y + 'px';
                // 不能直接使用getStyles(box, 'top')是因为，设置了left之后，这个才能获得值。
            }

            // onmouseup写在document上，不写在box上。
            document.onmouseup = function() {
                // this -> document
                this.onmousemove = null;
                this.onmouseup = null;
            }
        }
    </script>
</body>
```

### 3. 封装拖拽的函数
思路：
1. 给需要绑定的元素绑定鼠标落下的事件处理函数mousedown，并且记录当前鼠标落下的坐标，计算出点击源坐标距离元素的距离x，y（不会变化的值）
2. document绑定鼠标移动事件处理函数mousemove，获取当前元素的坐标pageX/pageY 减去x/y，计算出当前元素的坐标
3. document绑定鼠标抬起事件处理函数mouseup，解绑document的mousemove事件和document的mousedown事件
```js
function elemDrag(elem) {
    var x,
        y;

    addEvent(elem, 'mousedown', function(e) {
        var e = e || window.event,
            x = pagePos(e).X - getStyles(elem, 'left'),
            y = pagePos(e).Y - getStyles(elem, 'top');

        addEvent(document, 'mousemove', mouseMove);
        // (防止出现意外,取消冒泡事件,阻止默认行为)
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