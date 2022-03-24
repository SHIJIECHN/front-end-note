---
autoGroup-3: DOM
sidebarDepth: 3
title: day06
---

## 事件处理函数
绑定事件 = 绑定事件的处理函数。 事件 + 事件的反馈 = 前端交互/交互体验。
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
事件源：oDiv   
句柄：onclick   
事件句柄：onclick = function(){...}   
这种形式就是事件句柄的绑定形式。

如何绑定事件处理函数？  
1. elem.onclick = function(){..}
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

2. elem.addEventListener(事件类型，事件处理函数，false)
IE9以下不支持，W3C规范。
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
通过addEventLisener可以给同一个元素的同一事件绑定多个处理函数。上面两个事件都会执行。

```js
oBtn.addEventLisener('click', test, false);
oBtn.addEventLisener('click', test, false);
function test(){
    console.log(111);
}    
```
只会输出一个。同一个元素(oBtn)的同一事件(click)绑定多个处理函数，但是他们都是test处理函数，test是同一个函数引用。如果是写两个匿名函数，他们是两个不同的函数引用。

3. elem.attachEvent(事件类型，事件处理函数)     
IE8及以下的绑定方法。
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
attachEvent绑定几次，就打印几次。
```js
oBtn.attachEvent('onclick', test);
oBtn.attachEvent('onclick', test);
```
会打印两次。

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
1. elem.onclick = null/ false
2. elem.removeEventLisener('click', test, false); 括号中的形式和addEventLisener一定要一模一样，否则清除不了。
3. elem.detachEvent('onclick', test);
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
标签a之间不能嵌套，即使嵌套，在DOM树中显示的还是两个标签。
```html
<a href="www.baidu.com">
    百度
    <a href="www.taobao.com">淘宝</a>
</a>

<!--DOM树展示-->
<a href="www.baidu.com">百度</a>
<a href="www.taobao.com">淘宝</a>
```

事件冒泡（false）：点击子元素的同时，事件执行并且向上传递冒泡，直到传到顶层的父元素才停止。
事件捕获（true）：点击子元素，从父级开始一直向子级传递。   
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

没有事件冒泡的事件：focus, blur, change, submit, reset, select。  
注意：IE没有事件捕获。

## 阻止冒泡默认事件
