---
autoGroup-3: DOM
sidebarDepth: 3
title: 7. 事件流、事件代理
---

## 事件流
描述从页面中接受事件的顺序，和冒泡、捕获相关。两种事件流：   
1. IE提出事件冒泡流（Event Bubbling）
2. 网景Netscape提出事件捕获流（Event Capturing）

### 1. 事件冒泡流  
事件流的三个阶段：
- 事件捕获阶段（不执行）
- 处于目标阶段
- 事件冒泡阶段    
处于目标阶段实际上就是事件源绑定的事件处理函数触发阶段。
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
            // target srcElement 事件源对象。两个完全一样，火狐只有target，IE只有srcElement。

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
                target = e.target || e.srcElement; // 找出事件源
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
### 1. 获取点击的事件源下标
1. 获取点击的事件源在整个DOM对象集合的下标。
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

2. 如何在事件代理的情况下获取下标
   1. 方法一：for循环
   ```js
    oList.onclick = function(e) {
        var e = e || window.event,
            target = e.target || e.srcElement;

        for (var i = 0; i < len; i++) {
            item = oLi[i];
            // 循环的当前项跟点击的事件源相等
            if (target === item) {
                console.log(i);
            }
        }
    }
   ```
   2. 方法二：利用Array.prototype.indexOf，然后call把this指向改成oLi，然后再把indexOf的参数传进去。
   ```js
    oList.onclick = function(e) {
        var e = e || window.event,
            target = e.target || e.srcElement;
        // oLi列表是类数组，不能使用数组方法。解决：继承Array.prototype
        // Array.prototype.indexOf.call(DOM对象集合，当前事件源);
        var index = Array.prototype.indexOf.call(oLi, target);
        console.log(index);
    }
   ```
   3. 方法三：利用target事件源对象的tagName属性筛选冒泡对象
    ```javascript
    var oList = document.getElementsByTagName('ul')[0],
    oLi = oList.getElementsByTagName('li'),
    oBtn = document.getElementsByTagName('button')[0],
    len = oLi.length,
    item;
    
    oList.onclick = function (e) {
        var e = e || window.event,
            tar = e.target || e.srcElement,
            tagName = tar.tagName.toLowerCase();
            
        if(tagName === 'li'){
            console.log(tar.innerText);
        }
    }
    ```

### 2. 面试问题
实现：给ul创建50个li 并且给li添加删除功能，考虑性能。 
- 点击增加li后，输入框清空
- 点击某一项编辑，内容会放到input输入框中，按钮内容变成编辑第几项，编辑好后点击内容就发生改变
- 删除一项，

#### 1. 写法一：createDocumentFragment
 
```html
<body>
    <script type="text/javascript">
        // 创建ul
        var oList = document.createElement('ul'),
            oFrag = document.createDocumentFragment(); // 文档碎片，不占空间

        // 创建li
        for (var i = 0; i < 50; i++) {
            var oLi = document.createElement('li');
            oLi.innerHTML = '这是第' + (i + 1) + '项<button>删除</button>';
            oFrag.appendChild(oLi);
        }
        oList.appendChild(oFrag);
        document.body.appendChild(oList)
    </script>
</body>
```
缺点：多创建oFrag，用document.createElement的方式没有必要，除非必须用appendChild方法，才需要document.createElement。   

#### 2. 方法二：直接使用字符串
```html
<body>
    <script type="text/javascript">
        // 创建ul
        var oList = document.createElement('ul'),
            list = '';
        // 创建li
        for (var i = 0; i < 50; i++) {
            list += '<li>这是第' + (i + 1) + '项<button>删除</button></li>';
        }
        oList.innerHTML = list;
        document.body.appendChild(oList)
    </script>
</body>
```
#### 3. 方法三：使用模板
```html
<body>
    <script type="text/html" id="tpl">
        <li>这是第{{num}}项<button>删除</button></li>
    </script>
    <script type="text/javascript">
        // 创建ul
        var oList = document.createElement('ul'),
            tpl = document.getElementById('tpl').innerHTML,
            list = '';
        // 创建li
        for (var i = 0; i < 50; i++) {
            list += tpl.replace(/{{.*?}}/, i + 1);
        }
        oList.innerHTML = list;
        document.body.appendChild(oList)
    </script>
</body>
```
## 总结
事件代理解决：多次绑定的事件处理函数。   
JS的事件有向上传递的特性，也就是说，内部的元素在点击的同时，这个事件的影响会向父级传递，并且触发父级的事件处理函数的执行，这种现象就是事件的冒泡行为。冒泡最多能到body。   
事件对象和事件源对象：事件代理的核心。
```html
<body>
    <script type="text/html" id="tpl">
        <li>这是第{{num}}项<button>删除</button></li>
    </script>

    <script type="text/javascript">
        // 创建ul
        var oList = document.createElement('ul'),
            tpl = document.getElementById('tpl').innerHTML,
            list = '';
        // 创建li
        for (var i = 0; i < 50; i++) {
            list += tpl.replace(/{{.*?}}/, i + 1);
        }
        oList.innerHTML = list;
        document.body.appendChild(oList)
            // 绑定事件处理函数
        oList.addEventListener('click', removeItem, false);

        function removeItem(e) {
            var e = e || window.event,
                tar = e.target || e.srcElement,
                tagName = tar.tagName.toLowerCase();

            if (tagName === 'button') {
                tar.parentNode.remove();
            }
        }
    </script>
</body>
```
不需要给每一个删除按钮都绑定事件处理函数，只需要给他们的父级元素ul绑定，通过事件源对象找到相应的具体点击的元素。
