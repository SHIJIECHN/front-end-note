---
autoGroup-3: DOM
sidebarDepth: 3
title: day02
---

## DOM树结构
<img :src="$withBase('/basicFrontEnd/JavaScript/DOM.png')" alt="DOM"> 

## 节点属性 
1. `nodeName`：返回节点的`nodeName`大写，只读。   
2. `nodevalue`：可写，属性、注释、文本节点可用。  
3. `nodeType`：返回节点类型值。
4. `attributes`：返回属性集合。
5. `hasChildNodes`：是否有子节点。返回`true`或`false`。
```html
<body>
    <div class="box" id="box">
        我是文本节点
        <!--我是注释-->
        <h1>我是标题标签</h1>
        <a href="">我是超链接</a>
        <p>我是段落标签</p>
    </div>

    <script type="text/javascript">
        var div = document.getElementsByTagName('div')[0];
        console.log(div);
        /********nodeName********/
        console.log(div.nodeName.toLocaleLowerCase()); // div
        /********nodeValue********/
        console.log(div.childNodes[1].nodeValue); // 我是注释
        console.log(div.getAttributeNode('id').nodeValue); // box
        console.log(div.getAttributeNode('id').value); // box
        /************nodeType***********/
        console.log(div.nodeType);
        console.log(div.firstChild.nodeType);
        /************attributes***********/
        console.log(div.attributes); 
        /************hasChildNodes***********/
        console.log(div.hasChildNodes())
    </script>
</body>
```

6. `childNodes`返回元素节点，寻找子元素集合。
```js
var div = document.getElementsByTagName('div')[0];

function elemChildren(node) {
    var arr = [],
        children = node.childNodes;
    for (var i = 0; i < children.length; i++) {
        var childItem = children[i];
        if (childItem.nodeType === 1) {
            arr.push(childItem);
        }
    }
    return arr;
}

console.log(elemChildren(div));

```
采用类数组方法
```js
function elemChildren(node) {
    var temp = {
            'length': 0,
            'push': Array.prototype.push,
            'splice': Array.prototype.splice
        },

        len = node.childNodes.length;

    for (var i = 0; i < len; i++) {
        var childItem = node.childNodes[i];

        if (childItem.nodeType === 1) {
            // temp[temp['length']] = childItem;
            // temp['length']++;
            //采用push方法
            temp.push(childItem)
        }
    }
    return temp;
}

console.log(elemChildren(div));
```
`document` 构造函数是 `HTMLDocument`  
`HTMLDocument` 构造函数是 `Document`   
`HTMLDocument`构造出来的对象里面有`__proto__`：`Document.prototype`
```js
document.__proto__ = HTMLDocument.prototype;
HTMLDocument.__proto__ = Document.prototype;
```
案例一
```js
HTMLDocument.prototype.say = function() {
    console.log('我刚刚睡醒')
}
Document.prototype.eat = function() {
    console.log('我刚刚吃饭')
}
document.say(); // 我刚刚睡醒
document.eat(); // 我刚刚吃饭
```
`document`可以访问`Document.prototype`和`HTMLDocument.prototype`上的方法。

## `Element`
```html 
<body>
    <div>123</div>
    <p>234</p>
    <script type="text/javascript">
        var div = document.getElementsByTagName('div')[0];
        /****************Text、CharacterData****************************/
        Text.prototype.a = 'aaa';
        CharacterData.prototype.b = 'bbb';
        var text = div.childNodes[0];
        console.log(text.b); // bbb
        /******************Element、HTMLElement、HTMLDivElement*********/
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

## `DOM`操作深入
1. `getElementById()`
只有`Document.prototype`有这个方法，`Element.prototype`和`HTMLElement.prototype`没有这个方法.
```html
<body>
    <div>123</div>
    <p>234</p>
    <script type="text/javascript">
        var div = document.getElementsByTagName('div')[0];
        div.getElementById(); // Uncaught TypeError: div.getElementById is not a function
    </script>
</body>
```
`div`是由`HTMLElement`构造出来的。

2. `getElementsByName()`
`Document.prototype`有这个方法，`Element.prototype`没有
3. `getElementsByTagName()`、`getElementsByClassName()`、`querySelector()`、`querySelectorAll()`
`Document.prototype`和`Element.prototype`都有
```html
<body>
    <div>
        <p class="text">234</p>
    </div>
    <script type="text/javascript">
        var div = document.getElementsByTagName('div')[0];
        var p = document.getElementsByTagName('p')[0];
        console.log(p);

        var p = div.getElementsByClassName("text")[0];
        console.log(p);
    </script>
</body>
```

## 通配符
```html
<body>
    <div>
        <p class="text">234</p>
    </div>
    <script type="text/javascript">
        var all = document.getElementsByTagName('*');
        console.log(all); // [html, head, meta, meta, meta, title, body, div, p.text, script]
    </script>
</body>
```
`HTMLDocument`提供了两个便捷的方法`body`和`head`，分别可以获取文档的`head`和`body`。即在`HTMLDocument.prototype`中有两个属性`head`和`body`可以直接访问。   
`Document.prototype`提供了获取`html`文档的便捷方法：`documentElement`
```html
<body>
    <div>
        <p class="text">234</p>
    </div>
    <script type="text/javascript">
        // 获取body
        var body = document.body;
        // 获取head
        var head = document.head;
        console.log(document.title); // Document 直接获取到的是<title>标签上的文本，而不是元素。
        var title = document.getElementsByTagName('title')[0];
        console.log(title);
        // 获取html
        var html = document.documentElement;
    </script>
</body>
```

## 练习
1. 在原型上编程。遍历任意一个父元素，找到他的子元素节点。要求：有数字参数则返回某一个对应的子元素；没有数字参数则返回子元素节点的集合。思考：写在哪个原型上？参数怎么传？
```html
<body>
    <div>
        <ul>
            <li>
                <a href="">123</a>
            </li>
            <li>
                <a href="">234</a>
            </li>
            <li>
                <a href="">345</a>
            </li>
        </ul>
    </div>
    <script type="text/javascript">
        Element.prototype.getElemChidren = function() {
            var arg = arguments[0],
                elemChildrenNodes = elemChildren(this.childNodes);
            if (typeof(arg) === 'undefined') {
                return elemChildrenNodes;
            } else {
                return elemChildrenNodes[arg];
            }

            function elemChildren(node) {
                var temp = {
                    'length': 0,
                    'splice': Array.prototype.splice,
                    'push': Array.prototype.push
                };
                for (var i = 0; i < node.length; i++) {
                    if (node[i].nodeType === 1) {
                        temp.push(node[i]);
                        // temp[temp.length] = node[i];
                        // temp.length++;
                    }
                }
                return temp;
            }

        }

        var a = document.getElementsByTagName('li')[0];
        console.log(a.getElemChidren())
    </script>
</body>
```

2. 在原型上编程，找出一个元素的第N层父级元素
```html
<body>
    <div class="parent">
        <div class="son"></div>
    </div>
    <script type="text/javascript">
        var div = document.getElementsByClassName('son')[0];

        Element.prototype.getParentNode = function(n) {
            var node = this;
            for (var i = 0; i < n; i++) {
                node = node.parentNode;
            }
            return node;

        }
        console.log(div.getParentNode(4));
            // console.log(div.parentNode.parentNode.parentNode.parentNode)
    </script>
</body>
```





