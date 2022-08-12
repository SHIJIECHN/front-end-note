---
autoGroup-3: DOM
sidebarDepth: 3
title: 1. document对象、元素、节点、遍历树
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
3. 宿主对象：`Host Object`。    执行`JS`脚本的环境提供的对象，又称浏览器对象。兼容性问题。  
   浏览器对象`window(BOM)`和`document(DOM)`

本地对象和内置对象都是`ES`的内部对象。

`DOM`目的：通过浏览器提供的这一套方法表示或者操作`HTML`和`XML`。

## document
document对象是HTMLDocument（继承自Document类型）的一个实例，表示整个HTML页面。  
元素设置`id`属性，`IE8以`下，`id`不分大小写，即`box`与`Box`一样的。而且如果给元素设置`name="box"`属性，通过`getElementById('box')`也可以匹配上。

### 1. 获取节点方法
- `getElementsByTagName`与`getElementsByClassName`
- `getElementsByName`：`IE8`以下原则上只能使用在有`name`属性的标签上，如`iframe`、`image`、`input`。但是如果在`div`标签上设置`name`属性，也可以取得该元素。
- `querySelector`和`querySelectorAll`：`HTML5`新引入的`web API`。`querySelector`最多只能选择一个元素，匹配第一个。与`css`选择器写法一样。类名(`.`)，`id(#)`.
```html
<body>
    <div class="box" id="box">123</div>
    <div class="box">456</div>
    <input type="text" name="username">

    <script type="text/javascript">
        // getElementsByTagName
        var boxes = document.getElementsByTagName('div'); // 全部支持，返回类数组
        console.log(boxes); 

        // getElementsByClassName
        var boxes1 = document.getElementsByClassName('box'); // IE8及以下没有该方法
        console.log(boxes1);

        // getElementsByName
        var input = document.getElementsByName('username');
        console.log(input);

        // querySelector
        var div1 = document.querySelector('div'); // 标签
        var div2 = document.querySelector('.box'); // 类名
        var div3 = document.querySelector('#box'); // id
        console.log(div1, div2, div3)


        var divs = document.querySelectorAll('div');
        var boxes = document.querySelectorAll('.box');
        console.log(divs, boxes)
    </script>
</body>
```

### 2. querySelector获取直系子元素
```js
var p1 = document.querySelector('div > p'); // div下的直系子元素
var p2 = document.querySelector('div p'); // div下面的p，有两个，但是只会打印第一个
var box = document.querySelector('#box');
```

### 2. querySelectorAll缺点  
`querySelector`和`querySelectorAll`缺点：性能差、不实时（临时缓存）。
```js
var divs = document.getElementsByTagName('div');
console.log(divs); // [div div div]
divs[0].remove();
console.log(divs); // [div div]

var divs1 = document.querySelectorAll('div');
console.log(divs1); // [div div div]
divs1[0].remove(); // 不起作用
console.log(divs1); // [div div]
```

## 遍历节点树
节点不等于元素，节点包含元素，元素节点就是DOM节点 
| 节点名称       | 值   |
| --------   | ------- |
|元素节点  |1|
|属性节点  |2|
|文本节点 `text` | 3|
|注释节点 `comment`|  8|
| `document` |9|
|`DocumentFragment` | 11|
   
### `document`属性：
节点元素：
- parentNode： 父节点
- childNodes：子节点集合。
- firstChild：第一个子节点
- lastChild：最后一个子节点
- nextSibling：下一个兄弟节点
- previousSibling：上一个兄弟节点

元素：
- parentElement：父元素，IE9及以下不支持
- children：子元素，IE7及以下不支持
- childrenElementCount = children.length, IE9及以下不支持
- firstElementChild：第一个子元素。IE9及以下不支持
- lastElementChild：最后一个子元素。IE9及以下不支持
- nextElementSibling：下一个兄弟元素。IE9及以下不支持
- previousElementSibling：上一个兄弟元素。IE9及以下不支持

1. `parentNode` 父节点
```js
var a = document.getElementsByTagName('a')[0];
console.log(a.parentNode.parentNode)
```
2. `childNodes` 子节点集合：元素节点、属性节点、文本节点、注释节点、`document`、`DocumentFragment`
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
