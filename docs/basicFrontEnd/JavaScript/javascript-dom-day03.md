---
autoGroup-3: DOM
sidebarDepth: 3
title: day03
---

## 元素节点的方法-创建
### 创建元素
document.createElement
```html
<body>
    <script type="text/javascript">
        // 创建元素
        var div = document.createElement('div');
        div.innerHTML = 123;
        // 挂到body中
        document.body.appendChild(div);
    </script>
</body>
```

### 创建文本节点和注释
createTextNode('')和createComment('')
```html
<body>
    <script type="text/javascript">
        // 创建文本节点 createTextNode
        var text = document.createTextNode('123456');
        document.body.appendChild(text);
        // 创建注释 createComment
        var comment = document.createComment('我是注释');
        document.body.appendChild(comment);
    </script>
</body>
```
### appendChild
增加子节点。方法在Node.prototype中。body和head是在document中的，如果放在Document.prototype中，element无法使用。而放在Element.prototype中，Document无法使用。终上所述，放在Node.prototype中最合适。   
动态增加节点
```html
<body>
    <div></div>
    <script type="text/javascript">
        var div = document.getElementsByTagName('div')[0];
        var p = document.createElement('p');
        p.innerHTML = 'JavaScript';

        var text = document.createTextNode('ECMAScript');
        var comment = document.createComment('我是注释');

        div.appendChild(p);
        div.appendChild(text);
        div.appendChild(comment);
    </script>
</body>
```
动态剪切节点
```html
<body>
    <a href="">我是超链接</a>
    <script type="text/javascript">
        var a = document.getElementsByTagName('a')[0];
        var div = document.createElement('div');
        div.innerHTML = '<p>我是段落标签</p>';

        document.body.appendChild(div);
        div.appendChild(a); // 剪切功能 把原来的a剪切，并复制到div，成为div最后一个标签。
    </script>
</body>

```

### insertBefore
c.insertBefore(new, origin)：插入节点。在父级c节点下的子节点origin之前插入new节点。方法在Node.prototype中.
```html
<body>
    <div>
        <p>我是段落节点</p>
    </div>
    <script type="text/javascript">
        var div = document.getElementsByTagName('div')[0];
        var p = document.getElementsByTagName('p')[0]; // origin
        var a = document.createElement('a'); // new 
        a.href = '';
        div.insertBefore(a, p);
        var h1 = document.createElement('h1');
        h1.innerHTML = '我是标题标签';
        div.insertBefore(h1, a);
    </script>
</body>
```

## 元素节点的方法-删除

### removeChild
父节点.removeChild(子节点)。实际上只是剪切掉了，节点还在堆内存中。    
DOM对象就是元素节点。
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
        // 通常我们获取到的是div元素，但是在文档中的是div节点，因此appendChild需要经过元素变为节点的过程
        // 元素 -> 元素节点
        // 元素节点有属性和方法(nodeName, nodeValue, nodeType, attribute, hasChildNodes)
        // 元素(div) -> 构造函数实例化过程(new HTMLDivElement)，div DOM对象。存到内存中 -> div节点
        // removeChild(div)删除了div节点，内存中的对象仍然存在
    </script>
</body>
```
getElementsByTagName实际过程
```js
var p = document.getElementsByTagName('p')[0];
function getElementsByTagName(element){
    /**
        * 1. 从HTML中把p元素选择出来
        * 2. 实例化new HTMLParagraphElement() -> DOM节点、DOM元素。就具备了节点的属性和方法。
    */
}
```

### remove
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

## innerHTML, innerText
两者在HTMLElement.prototype中。innerHTML在Element.prototype中也有。
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

innerText：获取标签中的文本。老版火狐不支持，替代品textContent，但是IE老版本不支持textContent。
```html
<body>
    <div></div>
    <script type="text/javascript">
        var div = document.getElementsByTagName('div')[0];
        div.innerText = '<a>我是超链接</a>'; // <a>我是超链接</a>
    </script>
</body>
```
innerHTML会将'<, >, /'显示成字符实体，而innerText不能。

## 节点替换
parent.replaceChild(new, origin)
```html
<body>
    <div>
        <h1></h1>
    </div>
    <script type="text/javascript">
        var div = document.getElementsByTagName('div')[0];
        var h1 = document.getElementsByTagName('h1')[0];
        var h2 = document.createElement('h2');

        div.replaceChild(h2, h1);
    </script>
</body>
```

## setAttribute, getAttribute
setAttribute: 给元素设置属性。   
getAttribute: 获取元素属性值。
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
HTML5 给元素增加一个data-*属性
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
document.createDocumentFragment：创建文档片段（碎片）
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
回流：重新计算几何数据再渲染。每次循环都需要进行计算，回流会消耗渲染引擎的性能。那有没有办法只进行一次渲染就可以把列表渲染出来呢？也就是说帮我们不要每次都将节点追加上去，找一个不在节点树上的元素div，先把循环出来的li放到一个不在节点树上的元素div，最后循环结束，在再将这个元素div，追加到ul中。如何让一个元素不在节点树？新创建一个元素节点。   
这种方法就会多出一个节点。因此我不创建一个节点，就创建一个文档碎片。文档碎片有一个很好的属性，就是不在DOM树中。
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
在实际应用中，我们都需要createDocumentFragment保存列表的DOM结构，然后再交给外层的容器。

## 练习
1. 原型上编程，hasChildren判断父元素有没有子元素节点。
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
```html

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
