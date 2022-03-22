---
autoGroup-3: DOM
sidebarDepth: 3
title: day01
---

## DOM
`DOM`(`Document Object Model`)文档对象模型，`DOM`对象也是宿主对象。   
`Javascript`的`3`种对象：
1. 本地对象：`Native Object`
   `Object`, `Function`, `Array`, `String`, `Number`, `Boolean`, `Error`, `EvalError`, `SyntaxError`, `RangeError`, `ReferenceError`, `TypeError`, `URLError`, `Date`, `RegExp`
2. 内置对象：`Built-in Object`
   `Gloabal`, `Math` 
   `ECMA`: `isNaN()`, `parseInt()`, `Number`, `decodeURI`, `encodeURI`   
   `Infinity`, `NaN`, `undefined`
3. 宿主对象：`Host Object`。执行`JS`脚本的环境提供的对象，又称浏览器对象。兼容性问题。  
   浏览器对象`window(BOM)`和`document(DOM)`

本地对象和内置对象都是`ES`的内部对象。

`DOM`目的：通过浏览器提供的这一套方法表示或者操作`HTML`和`XML`。

## document
元素设置`id`属性，`IE8以`下，`id`不分大小写，即`box`与`Box`一样的。而且如果给元素设置`name="box"`属性，通过`getElementById('box')`也可以匹配上。

获取节点方法：
- `getElementsByTagName`与`getElementsByClassName`
```html
<body>
    <div class="box">123</div>
    <div class="box">456</div>

    <script type="text/javascript">
        var boxes = document.getElementsByTagName('div'); // 全部支持
        console.log(boxes);

        var boxes1 = document.getElementsByClassName('box'); // IE8及以下没有该方法
        console.log(boxes1);
    </script>
</body>
```
- `getElementsByName`
`IE8`以下原则上只能使用在有`name`属性的标签上，如`iframe`、`image`、`input`。但是如果在`div`标签上设置`name`属性，也可以取得该元素。
```html
<body>
    <input type="text" name="username">

    <script type="text/javascript">
        var input = document.getElementsByName('username');
        console.log(input)
    </script>
</body>
```
- `querySelector`和`querySelectorAll`
`HTML5`新引入的`web API`。   
`querySelector`最多只能选择一个元素，匹配第一个。与`css`选择器写法一样。类名(`.`)，`id(#)`
```html
<body>
    <div class="text">123</div>
    <div>234</div>

    <script type="text/javascript">
        var div1 = document.querySelector('div'); // 标签
        var div2 = document.querySelector('.text'); // 类名
        console.log(div1, div2)
    </script>
</body>
```
获取直系子元素
```html
<body>
    <div id="box">
        <h1>
            <p>123</p>
        </h1>
    </div>
    <div>
        <p>234</p>
    </div>

    <script type="text/javascript">
        var p1 = document.querySelector('div > p'); // div下的直系子元素
        var p2 = document.querySelector('div p'); // div下面的p，有两个，但是只会打印第一个
        var box = document.querySelector('#box');
        console.log(p1, p2, box);
    </script>
</body>
```
`querySelectorAll`选择标签与类名
```html
<body>
    <div class="box">123</div>
    <div class="box">456</div>
    <div class="box">789</div>

    <script type="text/javascript">
        var divs = document.querySelectorAll('div');
        var boxes = document.querySelectorAll('.box');
        console.log(divs, boxes)
    </script>
</body>
```
`querySelectorAll`选择`id`
```html
<body>
    <div class="box" id="box">123</div>

    <script type="text/javascript">
        var divs = document.querySelectorAll('#box');
        console.log(divs)
    </script>
</body>
```
用`id`选择器也是选中的一组。   
`querySelector`和`querySelectorAll`缺点：性能差、不实用。
```html
<body>
    <div class="box" id="box">123</div>
    <div class="box" id="box">234</div>
    <div class="box" id="box">345</div>

    <script type="text/javascript">
        var divs = document.getElementsByTagName('div');
        console.log(divs);
        divs[0].remove();
        console.log(divs);

        var divs1 = document.querySelectorAll('div');
        console.log(divs1);
        divs1[0].remove(); // 不起作用
        console.log(divs1);
    </script>
</body>
```

## 遍历节点数
节点不等于元素，节点包含元素，元素节点就是DOM节点 
| 节点名称       | 值   |
| --------   | ------- |
| 元素节点  |1|
|属性节点  |2|
|文本节点 `text` | 3|
|注释节点 `comment`|  8|
| `document` |9|
|`DocumentFragment` | 11|
   
`document`属性：
1. `parentNode` 父节点
```html
<body>
    <ul>
        <li>
            <h2>我是标题</h2>
            <a href="">我是链接</a>
            <p>我是段落标签</p>
        </li>
    </ul>

    <script type="text/javascript">
        var a = document.getElementsByTagName('a')[0];
        console.log(a.parentNode.parentNode)
    </script>
</body>
```
2. `childNodes` 子节点集合
```html
<body>
    <ul>
        <li>
            <h2>我是标题</h2>
            <a href="">我是链接</a>
            <p>我是段落标签</p>
        </li>
    </ul>

    <script type="text/javascript">
        var li = document.getElementsByTagName('li')[0];
        console.log(li.childNodes.length); // 7
    </script>
</body>
```
3. 第一个子节点`firstChild`, 最后一个子节点`lastChild`
4. 下一个兄弟节点`nextSibling`, 前一个兄弟节点`previousSibling` 

## 遍历元素节点   
1. `parentElement`:  `IE9`及以下不支持   
2. `children`:   `IE7`及以下不支持
3. `childElementCount=children.length`:  `IE9`及以下不支持    
4. `firstElementChild`和 `lastElementChild`：`IE9`及以下不支持  
5. `nextElementSibling`和`previousElementSibling`: `IE9`及以下不支持
```html
<body>
    <ul>
        <li>
            <h2>我是标题</h2>
            <a href="">我是链接</a>
            <p>我是段落标签</p>
        </li>
    </ul>

    <script type="text/javascript">
        var p = document.getElementsByTagName('p')[0];
        console.log(p.parentElement);
    </script>
</body>
```
