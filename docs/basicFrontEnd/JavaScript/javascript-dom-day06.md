---
autoGroup-3: DOM
sidebarDepth: 3
title: day06
---

## 事件处理函数
绑定事件等同于绑定事件的处理函数。   
事件 + 事件的反馈 = 前端交互/交互体验。
```js
/**
 onclick = function(){ 
    // 事件反馈
}
*/
oDiv.onclick = function(){
    this.style.backgroundColor = 'orange';
}
```
事件源：`oDiv`  
句柄：`onclick`   
事件句柄：`onclick = function(){...}`  
这种形式就是事件句柄的绑定形式。

### 三种绑定事件处理函数方式
如何绑定事件处理函数？  
1. `elem.onclick = function(){..}`
```html
    <style>
        button {
            outline: none;
        }
        
        .loading {
            background-color: #ddd;
            color: #fff;
        }
    </style>

<body>
    <button>加载更多</button>
    <script>
        var oBtn = document.getElementsByTagName('button')[0];
        oBtn.onclick = function() {
            this.innerHTML = '加载中...';
            this.className = 'loading';

            var self = this;
            setTimeout(function() {
                self.innerHTML = '加载更多';
                self.className = '';
            }, 2000);
        }

        // 缺点：覆盖上面的事件处理函数。
        oBtn.onclick = function(){
            console.log('bb');
        }
    </script>
</body>
```

2. `elem.addEventListener(事件类型，事件处理函数，false)`
`IE9`以下不支持，`W3C`规范。
```html
    <style>
        button {
            outline: none;
        }
        
        .loading {
            background-color: #ddd;
            color: #fff;
        }
    </style>

<body>
    <button>加载更多</button>
    <script>
        var oBtn = document.getElementsByTagName('button')[0];
        oBtn.addEventListener('click', function() {
            this.innerHTML = '加载中...';
            this.className = 'loading';

            var self = this;
            setTimeout(function() {
                self.innerHTML = '加载更多';
                self.className = '';
            }, 2000)
        }, false);

        oBtn.addEventListener('click', function(){
            console.log('加载更多');
        }, false)
        
    </script>
</body>
```
通过`addEventLisener`可以给同一个元素的同一事件绑定多个处理函数。上面两个事件都会执行。

```js
oBtn.addEventLisener('click', test, false);
oBtn.addEventLisener('click', test, false);
function test(){
    console.log(111);
}    
```
只会输出一个。同一个元素(`oBtn`)的同一事件(`click`)绑定多个处理函数，但是他们都是`test`处理函数，`test`是同一个函数引用。如果是写两个匿名函数，他们是两个不同的函数引用。

3. `elem.attachEvent(事件类型，事件处理函数)`     
`IE8`及以下的绑定方法。
```js
oBtn.attachEvent('onclick', function(){
    // this -> window
    oBtn.innerHTML = '加载中...';
    oBtn.className = 'loading';

    setTimeout(function(){
        oBtn.innerHTML = '加载更多';
        oBtn.className = '';
    }, 2000);
})
```
`attachEvent`绑定几次，就执行几次。
```js
oBtn.attachEvent('onclick', test);
oBtn.attachEvent('onclick', test);
```
会执行两次。

笔试题：点击元素输出下标。
```html
<body>
    <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
    </ul>
    <script type="text/javascript">
        var oLi = document.getElementsByTagName('li'),
            len = oLi.length,
            item;

        for (var i = 0; i < len; i++) {
            (function(i) {
                item = oLi[i];
                item.addEventListener('click', function() {
                    console.log(i);
                }, false);
            })(i);
        }
    </script>
</body>
```

### 事件处理程序的运行环境（this）
```html
<body>
    <button>点击</button>
    <script type="text/javascript">
        var oBtn = document.getElementsByTagName('button')[0];

        oBtn.onclick = function(){
            console.log(this); // oBtn
        }

        oBtn.addEventListener('click', function(){
            console.log(this); // oBtn
        }, false);

        oBtn.attachEvent('onclick', function(){
            // this 默认指向 window
            // 修改this指向oBtn
            test.call(oBtn);
        })

        function test(){
            console.log(this); // oBtn
        }
    </script>
</body>
```
### 封装函数
封装事件处理函数
```js
/*
el: 元素
type：事件类型
fn：事件处理函数
*/
function addEvent(el, type, fn) {
    if (el.addEventListener) { // W3C指定的事件处理函数方法
        el.addEventListener(type, fn, false);
    } else if (el.attachEvent) {
        el.attachEvent('on' + type, function() {
            fn.call(el); // 改变this的指向，让fn中的this指向el
        });
    } else { // 版本太低，只能用onclick
        el['on' + type] = fn
    }
}
```
使用
```js
var oBtn = document.getElementsByTagName('button')[0];
    addEvent(oBtn, 'click', function(){
    console.log(1);
})
```

### 解除事件处理
1. `elem.onclick = null/ false`
2. `elem.removeEventLisener('click', test, false)`, 括号中的形式和`addEventLisener`一定要一模一样，否则清除不了。
3. `elem.detachEvent('onclick', test)`。
```html
    <style type="text/css">
        button {
            outline: none;
            border: none;
            width: 100px;
            height: 30px;
            background-color: brown;
            color: #fff;
        }
        
        .got {
            background-color: gray;
        }
    </style>

<body>
    <button>领取优惠券</button>
    <script type="text/javascript">
        var oBtn = document.getElementsByTagName('button')[0];
        oBtn.onclick = function() {
            this.className = 'got';
            this.innerHTML = '已领取';

            this.onclick = null;
        }

        // addEventListener 不写匿名函数
        oBtn.addEventListener('click', test, false)

        function test() {
            this.className = 'got';
            this.innerHTML = '已领取';

            this.removeEventListener('click', test, false);
        }

        // addEventListener 里面是匿名函数
        oBtn.addEventListener('click', function() {
            this.className = 'got';
            this.innerHTML = '已领取';

            this.removeEventListener('click', arguments.callee, false);
        }, false)
    </script>
</body>
```

## 冒泡捕获
标签`a`之间不能嵌套，即使嵌套，在`DOM`树中显示的还是两个标签。
```html
<a href="www.baidu.com">
    百度
    <a href="www.taobao.com">淘宝</a>
</a>

<!--DOM树展示-->
<a href="www.baidu.com">百度</a>
<a href="www.taobao.com">淘宝</a>
```
`addEventListener`最后一个参数作用：  
事件冒泡（`false`）：点击子元素的同时，事件执行并且向上传递冒泡，直到传到顶层的父元素才停止。
事件捕获（`true`）：点击子元素，从父级开始一直向子级传递。   
有一个元素同时绑定事件冒泡和事件捕获，哪一个先执行？  
先事件捕获，后冒泡。
```html
    <style type="text/css">
        .wrapper {
            width: 300px;
            height: 300px;
            background-color: green;
        }
        
        .wrapper .outer {
            width: 200px;
            height: 200px;
            margin-left: 300px;
            background-color: red;
        }
        
        .wrapper .outer .inner {
            width: 100px;
            height: 100px;
            margin-left: 200px;
            background-color: orange;
        }
    </style>

<body>
    <div class="wrapper">
        <div class="outer">
            <div class="inner"></div>
        </div>
    </div>
    <script type="text/javascript">
        var wrapper = document.getElementsByClassName('wrapper')[0],
            outer = wrapper.getElementsByClassName('outer')[0],
            inner = outer.getElementsByClassName('inner')[0];

        // 事件冒泡：点击inner时，打印inner、outer、wrapper
        wrapper.addEventListener('click', function() {
            console.log('bubbleWrapper')
        }, false);
        outer.addEventListener('click', function() {
            console.log('bubbleOuter')
        }, false);
        inner.addEventListener('click', function() {
            console.log('bubbleInner')
        }, false);

        // 事件捕获：点击inner时，打印wrapper、outer、inner
        wrapper.addEventListener('click', function() {
            console.log('wrapper')
        }, true);
        outer.addEventListener('click', function() {
            console.log('outer')
        }, true);
        inner.addEventListener('click', function() {
            console.log('inner')
        }, true);
    </script>
</body>
```

没有事件冒泡的事件：`focus`, `blur`, `change`, `submit`, `reset`, `select`。  
注意：`IE`没有事件捕获。

## 阻止冒泡默认事件
### 取消冒泡
两种方法：
1. `W3C`：`e.stopPropagation()` 方法在`Event.prototype`
2. `IE`: `e.cancelBubble = true` 属性在`PointerEvent`

兼容性写法封装：
```js
function cancelBubble(e) {
    var e = e || window.event;

    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
}
```
案例
```html
    <style type="text/css">
        .wrapper {
            position: relative;
            width: 300px;
            height: 300px;
            background-color: green;
        }
        
        .apply {
            position: absolute;
            bottom: 15px;
            right: 15px;
            width: 80px;
            height: 30px;
            background-color: red;
            color: #fff;
            line-height: 30px;
            text-align: center;
        }
    </style>

<body>
    <div class="wrapper">
        <div class="apply">立即申请</div>
    </div>
    <script type="text/javascript">
        var wrapper = document.getElementsByClassName('wrapper')[0],
            apply = document.getElementsByClassName('apply')[0];

        wrapper.addEventListener('click', function() {
            console.log('详情');
        }, false);

        apply.addEventListener('click', function(ev) {
            // IE8 的事件对象存在window.event
            var e = ev || window.event; // 非严格模式下可以下event，因为window.event就是event
            // e.stopPropagation(); // 第一种方法
            // e.cancelBubble = true; // 第二种方法
            cancelBubble(ev);
            console.log('已申请');
        }, false);

        // 取消冒泡兼容性写法
        function cancelBubble(e) {
            var e = e || window.event;

            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
        }
    </script>
</body>
```
### 取消默认事件
两种方式：  
1. 第一种方式：`return false`。
2. 第二种方式：
    - `W3C`：`e.preventDefault()`, `IE9`及以下不兼容
    - `IE9`及以下：`e.returnValue = false`   
        
只能在句柄的方式使用，不能在`addEventListener`使用。
```js
// 阻止默认右击下拉列表
document.oncontextmenu = function(e) {
    // return false;
    // e.preventDefault();
    e.returnValue = false;
}
```
阻止a标签默认行为
```html
<body>
    <!--void(0)等于return 0;-->
    <a href="javascript: void(0)">百度以下</a>
    <a href="javascript:;">百度以下</a>
    <a href="#">百度以下</a>
</body>
<!--*********************************************-->
<body>
    <a href="www.baidu.com">百度一下</a>
    <script type="text/javascript">
        var a = document.getElementsByTagName('a')[0];
        a.onclick = function(e) {
            e.preventDefault();
        }
    </script>
</body>
```
案例：点击"点击一下"显示"点击了"，而点击空白区域跳转。
```html
    <style type="text/css">
        .link {
            display: block;
            width: 100px;
            height: 100px;
            background-color: orange;
        }
    </style>

<body>
    <a href="http://www.baidu.com" class="link" target="_blank">
        <div class="inner">点击一下</div>
    </a>
    <script type="text/javascript">
        var inner = document.getElementsByClassName('inner')[0];
        inner.onclick = function(e) {
            var e = e || window.event;

            e.preventDefault();
            console.log('点击了');
        }
    </script>
</body>
```
案例：阻止表单提交默认跳转行为。
```html
<body>
    <form action="">
        <input type="text" name="content" />
        <input type="submit" id="submit" value="提交" />
    </form>
    <script type="text/javascript">
        var submit = document.getElementById('submit');
        submit.onclick = function(e) {
            var e = e || window.event;
            e.preventDefault();
            console.log('提交了');
        }
    </script>
</body>
```