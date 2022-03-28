---
autoGroup-3: DOM
sidebarDepth: 3
title: day07
---

## 事件流
描述从页面中接受事件的顺序，和冒泡、捕获相关。两种事件流：   
1. IE提出事件冒泡流（Event Bubbling）
2. Netscape提出事件捕获流（Event Capturing）

事件流的三个阶段：事件捕获阶段，处于目标阶段，事件冒泡阶段。处于目标阶段实际上就是事件源绑定的事件处理函数触发阶段。
```html
    <style type="text/css">
        .wrapper {
            width: 300px;
            height: 300px;
            background-color: orange;
        }
    </style>

<body>
    <div class="wrapper"></div>
    <script type="text/javascript">
        // Event对象 = new PointEvent()
        var wrapper = document.getElementsByClassName('wrapper')[0];
        wrapper.onclick = function(e) {
            // IE传到window.event，就是在window下面定义了一个event = {...}，把e中的所有属性都传给event
            // target srcElement 事件源对象。两针完全一样，火狐只有target，IE只有srcElement。

            // 事件兼容性写法
            var e = e || window.event;
            // 事件源兼容性
            var target  = e.target || e.srcElment;
            console.log(e);
        }
    </script>
</body>
```

## 事件委托
```html
<body>
    <button>增加li</button>
    <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <li>6</li>
        <li>7</li>
        <li>8</li>
        <li>9</li>
        <li>10</li>
    </ul>
    <script type="text/javascript">
        var oList = document.getElementsByTagName('ul')[0],
            oLi = document.getElementsByTagName('li'),
            oBtn = document.getElementsByTagName('button')[0],
            len = oLi.length,
            item;

        // 事件委托 事件代理
        oList.onclick = function(e) {
            var e = e || window.event,
                target = e.target || e.srcElement;
            console.log(target.innerText);
        }

        oBtn.onclick = function() {
            var li = document.createElement('li');
            li.innerText = oLi.length + 1;
            oList.appendChild(li);
        }
    </script>
</body>
```
获取点击的事件源在整个DOM对象集合的下标。   
1. 直接for循环
```js
for (var i = 0; i < len; i++) {
    (function(i) {
        item = oLi[i];
        item.onclick = function() {
            console.log(i);
        }
    })(i);
}
```
2. 获取事件代理的下标
   1. 方法一：for循环
   ```js
    oList.onclick = function(e) {
        var e = e || window.event,
            target = e.target || e.srcElement;

        for (var i = 0; i < len; i++) {
            item = oLi[i];

            if (target === item) {
                console.log(i);
            }
        }
    }
   ```
   2. 方法二：继承Array.prototype.indexOf，然后call把this指向改成oLi，然后再把indexOf的参数传进去。
   ```js
    oList.onclick = function(e) {
        var e = e || window.event,
            target = e.target || e.srcElement;
        // Array.prototype.indexOf.call(DOM对象集合，当前事件源);
        var index = Array.prototype.indexOf.call(oLi, target);
        console.log(index);
    }
   ```

## 练习
TODO List
- 点击增加li后，输入框清空
- 点击某一项编辑，内容会放到input输入框中，按钮内容变成编辑第几项，编辑好后点击内容就发生改变
- 删除一项，

