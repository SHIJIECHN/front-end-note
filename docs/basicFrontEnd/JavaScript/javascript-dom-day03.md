---
autoGroup-3: DOM
sidebarDepth: 3
title: 3. DOM树、节点操作
---

## DOM树结构
<img :src="$withBase('/basicFrontEnd/JavaScript/DOM.png')" alt="DOM"> 

Node 
- Document 
  - HTMLDocument
- CharacterData(字符数据) 
  - Text
  - Comment
- Element
  - HTMLElement 
    - HTMLHead Element
    - HTMLBody Element  
- Attributes

```html 
<body>
    <div>123</div>
    <p>234</p>
    <script type="text/javascript">
        var div = document.getElementsByTagName('div')[0];

        // Text、CharacterData。文件节点构造函数Text
        Text.prototype.a = 'aaa';
        CharacterData.prototype.b = 'bbb';
        var text = div.childNodes[0];
        console.log(text.b); // bbb

        // HTMLDivElement -> HTMLElement -> Element
        Element.prototype.a = 'aaa';
        HTMLElement.prototype.b = 'bbb';
        HTMLDivElement.prototype.c = 'ccc';
        var p = document.getElementsByTagName('p')[0]; // HTMLParagraphElement
        
        console.log(div.c); // ccc
        console.log(div.b); // bbb
        console.log(div.a); // aaa

        console.log(p.a); // aaa  
        console.log(p.b); // bbb
        console.log(p.c); // undefined

        console.log(Object.prototype.toString.call(div)); // [object HTMLDivElement]
    </script>
</body>
```

## 节点创建
- document.createElement()：创建元素节点
- document.createTextNode()：创建文本节点
- document.createComment()：创建注释节点

```javascript
//创建元素节点
// 创建元素
var div = document.createElement('div');
div.innerHTML = 123;
// 挂到body中
document.body.appendChild(div);

//创建文本节点
var text = document.createTextNode('woaini');
document.body.appendChild(text);

//创建注释节点
var comment = document.createComment('woshizhushijun');
document.body.appendChild(comment);
```

## 节点增加
- node.appendChild(node)：增减子节点（在Node.prototype）
- node.insertBefore()：指定位置插入子节点

### 1. appendChilde的作用：
- 追加节点
- 剪切节点

```javascript
// 追加节点
var div = document.getElementsByTagName('div')[0];
var p = document.createElement('p');
p.innerHTML = 'JavaScript';
div.appendChild(p);

// 剪切节点
var a = document.getElementsByTagName('a')[0]; // 页面中原本存在的元素节点
var div = document.createElement('div');
div.innerHTML = '<p>我是段落标签</p>';
document.body.appendChild(div);
div.appendChild(a); 
// 剪切功能：把原来的a剪切，并复制到div，成为div最后一个标签。
```

### 2. insertBefore
`c.insertBefore(new, origin)`：插入节点。在父级`c`节点下的子节点`origin`之前插入`new`节点。方法在`Node.prototype`中。
```js
var div = document.getElementsByTagName('div')[0];
var p = document.getElementsByTagName('p')[0]; // origin
var a = document.createElement('a'); // new 
a.href = '';
div.insertBefore(a, p);
```

## 节点删除
- node.removeChild(子节点)：移除子节点。实际上只是剪切掉了，节点还在堆内存中
- node.remove()：消回节点，释放内存


### 1. `removeChild`
```html
<body>
    <div>
        <h1>标题标签</h1>
        <a href="">我是超链接标签</a>
        <p>我是段落节点</p>
    </div>
    <script type="text/javascript">
        var div = document.getElementsByTagName('div')[0]; // 元素
        var p = document.getElementsByTagName('p')[0];
        div.removeChild(p);
        // 我们获取到的是div元素，但是在文档中的是div节点，因此appendChild需要经过元素变为节点的过程
        // 元素 -> 元素节点
        // 元素节点有属性和方法(nodeName, nodeValue, nodeType, attribute, hasChildNodes)
        // 元素(div) -> 构造函数实例化过程(new HTMLDivElement)，div DOM对象。存到内存中 -> div节点
        // removeChild(div)删除了div节点，内存中的对象仍然存在
    </script>
</body>
```
`getElementsByTagName`实际过程
```js
var p = document.getElementsByTagName('p')[0];
function getElementsByTagName(element){
    /**
        * 1. 从HTML中把p元素选择出来
        * 2. 实例化new HTMLParagraphElement() -> DOM节点、DOM元素。
        * 就具备了节点的属性和方法。
    */
}
```

### `remove`
完全销毁。
```html
<body>
    <div>
        <h1>标题标签</h1>
        <a href="">我是超链接标签</a>
        <p>我是段落节点</p>
    </div>
    <script type="text/javascript">
        var div = document.getElementsByTagName('div')[0]; // 元素
        var p = document.getElementsByTagName('p')[0];
        p.remove();
    </script>
</body>
```

## 文本节点 
- HTMLElement.innerHTML：设置和获取元素的HTML
- HTMLElement.innerText

注意点：
- 父节点HTML不要写错
- 在inner HTML里的HTML字符串不要写
- document写法1：document.body.innerHTML
- document写法2：document.documentElement.innerHTML
- 元素内部的所有内容都会被删除掉

```html
<body>
    <div>
        <h1>标题标签</h1>
        <a href="">我是超链接标签</a>
        <p>我是段落节点</p>
    </div>
    <script type="text/javascript">
        var div = document.getElementsByTagName('div')[0];
        // 取值
        console.log(div.innerHTML);
        // 赋值
        div.innerHTML = 123;
        // 追加
        div.innerHTML += '456';
        // html字符串
        div.innerHTML = '<a href="" style="color: red;">我是超链接</a>'
    </script>
</body>
```
`innerText`：获取标签中的文本。老版火狐不支持，替代品`textContent`，但是`IE`老版本不支持`textContent`。
```html
<body>
    <div></div>
    <script type="text/javascript">
        var div = document.getElementsByTagName('div')[0];
        div.innerText = '<a>我是超链接</a>'; // <a>我是超链接</a>
    </script>
</body>
```
`innerHTML`会将`<`, `>`, `/`显示成字符实体，而`innerText`不能。

```md
设置inner HTML到底发生了什么？
1. innerHTML = '\<h1>123</h1>'
2. 用DocumentFragment将这个HTML文档结构变成DOM节点
3. 原本父节点上的所有内容都会被替换成这个DOM节点
```

## 节点替换
`parent.replaceChild(new, origin)`
```js
var div = document.getElementsByTagName('div')[0];
var h1 = document.getElementsByTagName('h1')[0];
var h2 = document.createElement('h2');

div.replaceChild(h2, h1); // 将h1节点替换成h2节点
```

## 文档碎片 
- document.createDocumentFragment()
  
```javascript
var oUl = document.getElementById('list');
var oDiv = document.createElement('div'); 
for (var i = 0; i < 10000; i++) {
    var oLi = document.createElement('li');
    oLi.innerHTML = i + '、这是第' + i + '个项目';
    oLi.className = 'list-item';
    oDiv.appendChild(oLi);
}

oUl.appendChild(oDiv);
```

## setAttribute和getAttribute
`setAttribute`: 给元素设置属性。   
`getAttribute`: 获取元素属性值。
```html
<body>
    <div class="box1"></div>
    <script type="text/javascript">
        var div = document.getElementsByTagName('div')[0];
        div.setAttribute('id', 'box');
        var attr = div.getAttribute('class');
        console.log(attr); // box1
    </script>
</body>
```

## data-*属性
`HTML5` 给元素增加一个`data-*`属性
```html
<body>
    <p data-name="zhangsan" data-age="18">我叫张三</p>
    <script type="text/javascript">
        // HTML5 给元素增加一个data-*属性
        var p = document.getElementsByTagName('p')[0];
        console.log(p.dataset);
        // 访问
        console.log(p.dataset.name);
        // 使用getAttribute访问
        console.log(p.getAttribute('data-name'));
        // 修改值
        p.setAttribute('data-age', 20);
    </script>
</body>
```

## createDocumentFragment
`document.createDocumentFragment()`：创建文档片段（碎片）
```html
<body>
    <ul id="list"></ul>
    <script type="text/javascript">
        var oUl = document.getElementById('list');
        var oDiv = document.createElement('div'); 
        for (var i = 0; i < 10000; i++) {
            var oLi = document.createElement('li');
            oLi.innerHTML = i + '、这是第' + i + '个项目';
            oLi.className = 'list-item';
            oDiv.appendChild(oLi);
        }

        oUl.appendChild(oDiv);
    </script>
</body>
```
回流：重新计算几何数据再渲染。每次循环都需要进行计算，回流会消耗渲染引擎的性能。那有没有办法只进行一次渲染就可以把列表渲染出来呢？也就是说我们不要每次都将节点追加上去，找一个不在节点树上的元素div，先把循环出来的li放到一个不在节点树上的元素div，最后循环结束，在再将这个元素div，追加到ul中。如何让一个元素不在节点树？新创建一个元素节点。这种方法就会多出一个节点。我们可以不创建一个节点，就创建一个文档碎片。文档碎片有一个很好的特性，就是不在DOM树中。
```html
<body>
    <ul id="list"></ul>
    <script type="text/javascript">
        var oUl = document.getElementById('list');
        var oFrag = document.createDocumentFragment(); // 文档片段
        for (var i = 0; i < 10000; i++) {
            var oLi = document.createElement('li');
            oLi.innerHTML = i + '、这是第' + i + '个项目';
            oLi.className = 'list-item';
            oFrag.appendChild(oLi);
        }

        oUl.appendChild(oFrag);
    </script>
</body>
```
在实际应用中，我们都需要`createDocumentFragment`保存列表的`DOM`结构，然后再交给外层的容器。

## 练习
1. 原型上编程，`hasChildren`判断父元素有没有子元素节点。
```js
Element.prototype.hasChildren = function() {
    var isElementNode = false;
    if (this.hasChildNodes) {
        var nodeList = this.childNodes;
        for (var i = 0; i < nodeList.length; i++) {
            if (nodeList[i].nodeType === 1) {
                isElementNode = true;
                break;
            }
        }
    }
    return isElementNode;
}
```
2. 在原型上编程，寻找兄弟元素节点。参数N为正，找之后的第N个，参数N为负，找之前的第N个，参数N为0，找到自己。
```js
Element.prototype.searchElement = function(n) {
    var node = this;
    if (n == 0) {
        return node;
    }
    for (var i = 0; i < Math.abs(n); i++) {
        if (n < 0) {
            node = node.previousElementSibling;
        } else {
            node = node.nextElementSibling;
        }
    }
    return node;
}
```
3. JS创建如下DOM树结构
```html
<body>
    <div id="box">
        <ul class="list">
            <li class="list-item"></li>
            <li class="list-item"></li>
            <li class="list-item"></li>
            <li class="list-item"></li>
            <li class="list-item"></li>
        </ul>
    </div>
</body>
```
解答：
```html
<body>
    <script type="text/javascript">
        var div = document.createElement('div');
        div.setAttribute('id', 'box');

        var oUl = document.createElement('ul');
        oUl.setAttribute('class', 'list');

        var oFrag = document.createDocumentFragment();
        for (var i = 0; i < 5; i++) {
            var oLi = document.createElement('li');
            oLi.setAttribute('class', 'list-item');
            oFrag.appendChild(oLi);
        }
        oUl.appendChild(oFrag);
        div.appendChild(oUl);
        document.body.appendChild(div);
    </script>
</body>
```
4. 遍历一个父级元素下面所有的子元素节点.
```html
<body>
    <div id="box">
        <ul>
            <li>
                <h1></h1>
                <p></p>
                <a href=""></a>
            </li>
            <li>
                <div></div>
            </li>
        </ul>
        <div>
            <h1>
                <span></span>
                <a href=""></a>
            </h1>
        </div>
    </div>
</body>
```
解答：
```js
function searchChild(node) {
    var temp = {
        "length": 0,
        "splice": Array.prototype.splice,
        "push": Array.prototype.push
    };
    var children = node.childNodes;
    for (var i = 0; i < children.length; i++) {
        if (children[i].nodeType === 1) {
            if (children[i].hasChildNodes) {
                searchChild(children[i]);
            } else {
                temp.push(children[i]);
            }
        }
    }
    return temp;
}
```
5. 原型上封装inertAfter方法。
```html
<body>
    <div>
        <p></p>
        <h1></h1>
        <a href=""></a>
    </div>
    <script type="text/javascript">
        var div = document.getElementsByTagName('div')[0];
        var h1 = document.getElementsByTagName('h1')[0];
        var oStrong = document.createElement('strong');
        var a = document.getElementsByTagName('a')[0];

        Element.prototype.insertAfter = function(target, afterNode) {
            var nextElem = afterNode.nextElementSibling;

            if (nextElem) {
                this.insertBefore(target, nextElem);
            } else {
                this.appendChild(target);
            }
        }
        div.insertAfter(oStrong, h1);
    </script>
</body>
```
6. 子元素逆序
```html
<body>
    <div>
        <p>123</p>
        <h1>234</h1>
        <a href="">345</a>
    </div>
</body>
```
输出：
```html
<body>
    <div>
        <a href="">345</a>
        <h1>234</h1>
        <p>123</p>
    </div>
</body>
```
