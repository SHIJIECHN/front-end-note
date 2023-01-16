---
autoGroup-3: 源码专题
sidebarDepth: 3
title: 源码
---

# 数据驱动

## Vue 与模板
使用步骤

1. 编写页面模板
   1. 直接在 HTML 标签中写标签
   2. 使用 template
   3. 使用单文件(`<template />`)
2. 创建 Vue 实例
   1. 在 Vue 的构造函数中提供：data，methods，computed， watcher，props, ...
3. 将 Vue 挂载到页面中（mount）

## 数据驱动模型
Vue 的执行流程

1. 获得模板：模板中有 “坑”
2. 利用 Vue 构造函数中所提供的数据来 “填坑”，得到可以在页面中显示的“标签中”
3. 将标签替换页面中原来有坑的标签

Vue 利用我们提供的数据和页面中模板生成了一个新的 HTML标签（node元素），替换到了页面中放置模板的位置。
```javascript
// 引入Vue
<script src="https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js"></script>

// 第一步：写模板
<div id="root">
  <p>{{name}}</p>
  <p>{{message}}</p>
</div>

// 第二步：创建实例
let app = new Vue({
  el: '#root',
  data: {
    name: 'demo',
    message: 'message'
  }
})

// 第三步 挂载：这种用法的挂载在 vue.js 中帮我们实现了
```

我们怎么实现？
```javascript
// 第一步写模板
<div id="root">
  <div>
    <p>{{name}}-{{message}}</p>
  </div>
  <p>{{name}}</p>
  <p>{{message}}</p>
</div>

// 步骤拆解
// 1. 拿到模板
// 2. 拿到数据（data）
// 3. 将数据与模板结合，得到的是HTML元素（DOM元素）
// 4. 放到页面中

let rkuohao = /\{\{(.+?)\}\}/g; // 匹配{{}}的正则
// 1. 拿到模板
let tmpNode = document.querySelector('#root'); // 元素拿到了 模板就是他
// 2. 拿到数据data
let data = {
  name: '一个新name',
  message: '一个消息'
}
// 3. 将数据放到模板中
// 一般都是使用递归。还可以使用特殊的算法
// 在现在这个案例中，template是DOM元素。
// 在真正的Vue源码中是 DOM -> 字符串模板 -> VNode -> 真正的DOM
function compiler(template, data) {
  // 案例中template是DOM元素
  let childNodes = template.childNodes; // 取出子元素
  for (let i = 0; i < childNodes.length; i++) {
    let type = childNodes[i].nodeType; // 1 元素，3 文本节点
    if (type === 3) {
      // 文本节点，可以判断里面是否有{{}}插值
      let txt = childNodes[i].nodeValue; // 该属性只有节点才有意义
      // 有没有双花括号
      // replace 只要匹配到文本，后面的function就会执行一次。函数的返回值就是用来替换参数n匹配到的内容。
      // 参数0：匹配到的内容。如{{name}}，{{message}}。
      // 参数n：表示正则中的第n组。也就是正则中小括号里面的内容，如name，message
      txt = txt.replace(rkuohao, function (_, g) {
        let key = g.trim(); // 写在双花括号里面的东西
        let value = data[key];
        // 将 {{ xxx }} 用这个值替换
        return value
      });
      // 注意：txt现在和DOM元素是没有关系
      childNodes[i].nodeValue = txt;
    } else if (type === 1) {
      // 元素，考虑她有没有子元素，是否需要将其子元素进行判断是否要插值
      compiler(childNodes[i], data)
    }
  }
}

// 注意一个细节：利用模板生成一个HTML标签。但是现在并没有生成。
// console.log(tmpNode);
// compiler(tmpNode, data);
// console.log(tmpNode);

// 我们此时没有生成新的template，所以这里看到的是直接在页面中就更新的数据。因为DOM是引用类型
// 这样做模板tmpNode就没有了，显示的是最后更新后的数据

// 利用模板生成一个需要被渲染的 HTML标签（准真正在页面中显示的标签）
let generateNode = tmpNode.cloneNode(true); // 注意这里 tmpNode 是 DOM 元素，可以这么用
console.log(tmpNode);
compiler(generateNode, data); // 将“坑”替换掉
console.log(generateNode); // generateNode 只在内存中，还没有渲染到页面中去

// 4. 将渲染好的 HTML 加到页面中
root.parentNode.replaceChild(generateNode, root);

// 上面的思路有很大的问题：
// 1. Vue 使用的虚拟DOM
// 2. 只考虑单属性（ {{name}} ），而Vue中大量的使用层级（ {{child.name.firstName}} ）
// 3. 代码没有整合（ Vue 使用的是一个构造函数 ）
```

### 1. 代码整合
抽取JGVue构造函数
```javascript
// 写模板
//-----------------------------------------------------------------
<div id="root">
  <div>
    <p>{{name}}-{{message}}</p>
  </div>
  <p>{{name}}</p>
  <p>{{message}}</p>
</div>

// 封装JGVue构造函数
//-------------------------------------------------------------------
function JGVue(options) {
  // 习惯：内部的数据使用下划线开头，只读数据使用$开头
  this._data = options.data;
  this._el = options.el;

  // 准备工作（准备模板）
  this._templateDOM = document.querySelector(this._el);
  this._parent = this._templateDOM.parentNode; // 父元素。用于update中替换

  // 渲染工作
  this.render();
}

/** render渲染工作分成几步：
 * 1. 将数据和模板结合生成真正的HTML标签（编译compiler）
 * 2. 将真正的HTML标签渲染到页面中（update）
*/

/** 将模板 即数据，得到 HTML 加载到页面中 */
JGVue.prototype.render = function () {
  this.compiler();
}

/** 编译 将模板与数据结合得到真正的DOM元素*/
JGVue.prototype.compiler = function () {
  let realHTMLDOM = this._templateDOM.cloneNode(true); // 用模板拷贝得到一个准DOM
  compiler(realHTMLDOM, this._data);
  this.update(realHTMLDOM);
}

/** 将DOM 的元素放到页面中 */
JGVue.prototype.update = function (real) {
  this._parent.replaceChild(real, document.querySelector('#root'))
}

let rkuohao = /\{\{(.+?)\}\}/g; // 匹配{{}}的正则
function compiler(template, data) {
  // 案例中template是DOM元素
  let childNodes = template.childNodes; // 取出子元素
  for (let i = 0; i < childNodes.length; i++) {
    let type = childNodes[i].nodeType; // 1 元素，3 文本节点
    if (type === 3) {
      // 文本节点，可以判断里面是否有{{}}插值
      let txt = childNodes[i].nodeValue; // 该属性只有文本节点才有意义
      // 有没有双花括号
      // replace 只要匹配到文本，后面的function就会执行一次。函数的返回值就是用来替换参数n匹配到的内容。
      // 参数0：匹配到的内容。如{{name}}，{{message}}。
      // 参数n：表示正则中的第n组。也就是正则中小括号里面的内容，如name，message
      txt = txt.replace(rkuohao, function (_, g) {
        let key = g.trim(); // 写在双花括号里面的东西
        let value = data[key];
        // 将 {{ xxx }} 用这个值替换
        return value
      });
      // 注意：txt现在和DOM元素是没有关系
      childNodes[i].nodeValue = txt;
    } else if (type === 1) {
      // 元素，考虑她有没有子元素，是否需要将其子元素进行判断是否要插值
      compiler(childNodes[i], data)
    }
  }
}

// 想想怎么用？
//---------------------------------------------------------------------
let app = new JGVue({
  el: '#root',
  data: {
    name: 'jim',
    message: 'info'
  }
})
```

### 2. 多层级属性
我们要解决一个问题，使用 'xxx.yyy.zzz'可以访问某一个属性。就是用字符串路径来访问对象的成员。
```js
/**
obj = { xxx: { yyy: {zzz: {} }}}
path = xxx.yyy.zzz
*/
function getValueByPath(obj, path) {
  let paths = path.split('.'); // [xxx, yyy, zzz]
  // 先取得obj.xxx, 再取得结果中的yyy，再取得结果中的 zzz
  /**
  let res = null;
  res = obj[paths[0]]; // paths[0] = xxx, res = obj[xxx]
  res = res[paths[1]]; // res = obj[xxx][yyy]
  res = res[paths[2]]; // res = obj[xxx][yyy][zzz]
  */
  let res = obj;
  let prop;
  // paths.shift() 就是把它的最前面一项取出来
  while (prop = paths.shift()) {
    res = res[prop];
  }
  return res;
}
```
验证算法
```javascript
const o = {
  a: {
    b: {
      c: {
        d: {
          e: '正确了'
        }
      }
    }
  }
}

let res = getValueByPath(o, 'a.b.c.d.e'); // 正确了
res = getValueByPath(o, 'a.b.c') // d: { e: '正确了'}
```
通常模板是不会变的，数据是常常在变化的。Vue 利用函数柯里化技巧。
```javascript
// 这个函数是在 Vue 编译模板的时候就生成了
function createGetValueByPath(path) {
  let paths = path.split('.'); // [xxx, yyy, zzz]

  return function getValueByPath(obj) {
    let res = obj;
    let prop;
    while (prop = paths.shift()) {
      res = res[prop];
    }
    return res;
  }
}

let getValueByPath = createGetValueByPath('a.b.c.d');

const o = {
  a: {
    b: {
      c: {
        d: {
          e: '正确了'
        }
      }
    }
  }
}

let res = getValueByPath(o);
console.log(res); // e: '正确了'
```
在compiler中使用
```javascript
function compiler(){
  //....
  txt = txt.replace(rkuohao, function (_, g) {
    let path = g.trim(); // 写在双花括号里面的东西
    let value = getValueByPath(data, path);
    // 将 {{ xxx }} 用这个值替换
    return value
  });
}

// 此时可以访问到name.firstName
let app = new JGVue({
  el: '#root',
  data: {
    name: {
      firstName: '张',
      lastName: '三'
    },
    message: 'info'
  }
})
```

### 3. 虚拟DOM
目标：

1. 怎么将真正的DOM转换为虚拟DOM
2. 怎么将虚拟DOM转换为真正的DOM

思路与深拷贝类似。

为什么要使用虚拟DOM？提供性能。因为页面不断的更新，操作DOM有可能带来页面的刷新和页面内存的控制，会很消耗内存。使用虚拟DOM，所有操作都在内存中完成，只要更新到页面上。
```js
// 有哪些标签节点类型
// 1. <div /> => { tag: 'div'}
// 2. 文本节点 => { tag: undefined, value: '文本节点'}
// 3. 有属性<div title="1" class="c" /> => {tag: 'div', data: { title: '1', class: 'c'}}
// 4. 有子节点<div><div /></div> => {tag: 'div', children: [ {tag: 'div'}]}

// VNode类
class VNode {
  constructor(tag, data, value, type) {
    this.tag = tag && tag.toLowerCase();
    this.data = data;
    this.value = value;
    this.type = type;
    this.children = [];
  }

  // 追加子元素
  appendChild(vnode) {
    this.children.push(vnode);
  }
}
```
真正DOM如何生成VNode？
```javascript
/**
 * 使用递归来遍历DOM元素，生成虚拟DOM
 * 
 * Vue 中的源码使用的栈结构，使用栈存储父元素来实现递归生成
 */
function getVNode(node) {
  let nodeType = node.nodeType; // 文本节点是value有值，元素节点是tag有值。nodeType主要用于区分这两种情况
  let _vnode = null;
  if (nodeType === 1) {
    // 元素
    let nodeName = node.nodeName; // tag 
    let attrs = node.attributes; // 返回所有属性构成的伪数组
    // 将伪数组转换成对象
    let _attrObj = {};
    for (let i = 0; i < attrs.length; i++) { // attrs[i] 属性节点（nodeType == 2)，有nodeName和nodeValue
      _attrObj[attrs[i].nodeName] = attrs[i].nodeValue;
    }

    // 创建节点
    _vnode = new VNode(nodeName, _attrObj, undefined, nodeType);

    // 考虑 node（真正的DOM元素）的子元素
    let childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      _vnode.appendChild(getVNode(childNodes[i])); // 递归
    }

  } else if (nodeType === 3) {
    // 文本节点
    _vnode = new VNode(undefined, undefined, node.nodeValue, nodeType)
  }
  // 没有直接使用else是因为实际情况下，还有可能是注释节点

  return _vnode;

}

// 真正 DOM
<div id="root">
  <div class="c1">
    <div title="t1" id="id">hello1</div>
    <div title="t2">hello2</div>
    <div title="t3">hello3</div>
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
    </ul>
  </div>
</div>

let root = document.querySelector('#root');
let vroot = getVNode(root);
console.log(vroot)
```

虚拟VNode如何生成真正的DOM？
```javascript
// 将VNode转换为真正的DOM
function parseVNode(vnode) {
  // 创建真实的 DOM
  let type = vnode.type;
  let _node = null;

  if (type === 3) {
    // 文本节点
    return document.createTextNode(vnode.value); // 创建文本节点
  } else if (type === 1) {
    // 元素
    _node = document.createElement(vnode.tag);

    // 属性
    let data = vnode.data; // 现在这个data是键值对
    Object.keys(data).forEach((key) => {
      let attrName = key;
      let attrValue = data[key];
      _node.setAttribute(attrName, attrValue);
    })

    // 子元素
    let children = vnode.children;
    children.forEach(subvnode => { // subNode是虚拟DOM类型
      _node.appendChild(parseVNode(subvnode)); // 递归转换子元素（虚拟DOM）
    })

    return _node;
  }
}

// 在真正的Vue中也是使用 递归 + 栈数据 类型
let dom = parseVNode(vroot);

// 要验证，只要将转换后的DOM打印出来看看与原来的DOM是不是一样
console.log(dom);
```


总结：
1. 数据驱动：就是利用数据渲染页面，然页面呈现结果
2. 涉及模板、虚拟DOM


# 函数柯里化

参考资料
- [函数式编程](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/)

概念：

1. 柯里化：一个函数原本有多个参数，之前传入**一个**参数，生成一个新函数，有新函数接收剩下的参数来运行得到结果。
2. 偏函数：一个函数原本有多个参数，之前传入**一部分**参数，生成一个新函数，有新函数接收剩下的参数来运行得到结果。
3. 高阶函数：一个函数参数是一个函数，该函数对参数这个函数进行加工，得到一个函数，这个加工用的函数就是高阶函数。

为什么要使用柯里化？为了提升性能，使用柯里化可以缓存一部分能力。

使用两个案例来说明：

1. 判断元素
2. 虚拟DOM的render方法

## 1. 判断元素

Vue 本质上是使用HTML的字符串作为模板的，将字符串的模板转换为AST，再转换为 VNode。
- 模板 -> AST
- AST -> VNode
- VNode -> DOM

哪个阶段最消耗性能？

最消耗性能的是字符串解析（ 模板 -> AST ）

例子： "1 + 2 * (3 + 4 * (5 + 6))"。写一个程序，解析这个表达式，得到结果（一般化）。

我们一般会将这个表达式转换为“波兰式”表达式，然后使用栈结构来运算。

在 Vue 中每一个标签可以是真正的HTML标签，也可以是自定义的组件，问怎么区分？

在 Vue 源码中其实将所有可用的HTML标签已经存起来了，

假设这里只考虑几个标签：
```js
let tags = 'div,p,a,img,ul,li'.split(',');
```
需要一个函数，判断一个标签名是否为内置的标签
```javascript
function isHTMLTag(tagName) {
  tagName = tagName.toLowerCase();
  // for (let i = 0; i < ... ) {
  //   if (tagName === tags[i]) return true;
  // }
  if(tags.indexOf(tagName) > -1) return true;
  return false;
}
```

模板是任意编写的，可以写的很简单，也可以写的很复杂，indexOf内部也是要循环的。

如果有6个内置标签，而模板中有10个标签需要判断，那么就需要执行60次循环。

使用柯里化。
```javascript
let tags = 'div,p,a,img,ul,li'.split(',');

function makeMap(keys) {
  let set = {}; // 集合，键值对 {div: true, p: true, a: true}
  keys.forEach(key => set[key] = true);

  return function (tagName) {
    return !!set[tagName.toLowerCase()]; // !! 转换为boolean值
  }
}

let isHTMLTag = makeMap(tags); // 返回的函数

// 10 个标签需要判断，那么还有没有循环存在
```
makeMap(['div', 'p'])需要遍历这个数据生成键值对
```javascript
let set = {
  'div': true,
  'p': true
}

set['div']; // true
set['Navigator']; // undefined -> false
```

## 2. 虚拟DOM的render方法

思考：Vue 项目**模板转换为抽象语法树**需要执行几次？

- 页面一开始需要渲染
- 每一个属性（响应式）数据在发生变化的时候要渲染
- watch，computed等等

上面写的JGVue.prototype.compiler，每次需要渲染的时候，模板就会解析一次（注意，这里我们简化了解析方法）

render的作用是将虚拟DOM转换为真正的DOM加到页面中

- 虚拟DOM可以降级理解为抽象语法树（AST）
- 一个项目运行的时候模板是不会变的，就表示AST是不会变的

我们可以将代码进行优化，将虚拟DOM缓存起来，生成一个函数，函数只需要传入数据就可以得到真正的DOM。

### 2.1 构造函数JGVue重写

<img :src="$withBase('/framework/Vue/vue-source-code-01.png')" alt="" />

说明：在真正的Vue中使用了二次提交的设计结构。

1. 页面HTML DOM与虚拟DOM是一一对应的关系
2. createRenderFn函数就是用来生成render函数的，同时缓存的AST
3. render函数调用的时候，利用AST和数据结合生成带有数据的VNode
4. update就是比较新数据VNode和旧VNode（diff），目的是更新旧VNode，从而更新HTML

为什么不用新的VNode直接替换旧的VNode？

因为页面的DOM与虚拟DOM是一一对应的关系，如果将新的VNode直接替换，则对应关系需要重新去处理，涉及到递归遍历的访问，非常消耗性能。虚拟DOM在diff的时候进行了一些优化，目的是减少比较、减少操作。

```javascript
function JGVue(options) {
  this._data = options.data;
  let elm = document.querySelector(options.el); // vue 中是字符串，案例是DOM元素
  this._template = elm;
  this._parent = elm.parentNode; // 父元素

  this.mount(); // 挂载
}

/** 挂载 */
JGVue.prototype.mount = function () {
  // 需要提供一个render方法：生成虚拟DOM。render方法就是有缓存功能的
  this.render = this.createRenderFn(); // 为什么采用这种方式？因为需要缓存虚拟DOM。只要调用render就意味着拿到虚拟DOM
  // 将虚拟DOM转为真实DOM，并挂载到页面
  this.mountComponent();
}

/** 挂载到页面*/
JGVue.prototype.mountComponent = function () {
  // 执行mountComponent()函数
  let mount = () => { // 这里是一个函数，函数的this默认是全局对象，需要修改为JGVue
    this.update(this.render()); // 渲染到页面上。this.render()执行后就会生成带有数据的虚拟DOM
  }
  mount.call(this); // 本质应该交给watcher来调用，但是还没有讲到这里

  // 为什么不直接如下代码写法，而使用mount函数呢？
  // this.update(this.render())
  // 因为使用发布订阅模式，渲染和计算的行为应该交给watcher来完成
}

// 这里是生成render函数，目的是缓存抽象语法树（我们使用虚拟DOM来模拟）
JGVue.prototype.createRenderFn = function () {
  // 缓存 AST
  let ast = getVNode(this._template); // VNode
  // Vue：将AST+ data => VNode
  // 案例：带有坑的VNode + data => 含有数据的VNode
  return function render() {
    // 将带坑的VNode转换为带数据的VNode
    let _tmp = combine(ast, this._data);
    return _tmp;
  }
}

// 将虚拟DOM渲染到页面中：diff算法就在这里
JGVue.prototype.update = function (vnode) {
  // 简化，直接生成HTML DOM replaceChild 到页面中
  // 父元素.replaceChild(新元素，旧元素);

  // 新元素：虚拟DOM生成真正的DOM
  let realDOM = parseVNode(vnode);
  this._parent.replaceChild(realDOM, document.querySelector('#root'));
  // 这个算法是不负责任的：
  // 每次会将页面中的DOM全部替换
}
```
为什么render方法没有写在原型上，而是写在mount中？

因为创建vue实例的时候可以传入render函数，此时就会使用传入的render。它用于用户自定义生成虚拟DOM

### 2.2 辅助函数

1. VNode类用于构造虚拟DOM
2. getVNode：从真正DOM -> VNode(带有坑)
3. getValueByPath：访问对象任意层级的属性
4. combine：带有坑的VNode + data => 有真正数据的VNode

```javascript
/** 虚拟DOM构造函数*/
class VNode {
  constructor(tag, data, value, type) {
    this.tag = tag && tag.toLowerCase();
    this.data = data;
    this.value = value;
    this.type = type;
    this.children = [];
  }

  // 追加子元素
  appendChild(vnode) {
    this.children.push(vnode);
  }
}

/** 由HTML DOM -> VNode: 将这个函数当作compiler函数，也就是编译成 AST 的函数 */
function getVNode(node) {
  let nodeType = node.nodeType; // 文本节点是value有值，元素节点是tag有值。nodeType主要用于区分这两种情况
  let _vnode = null;
  if (nodeType === 1) {
    // 元素
    let nodeName = node.nodeName; // tag 
    let attrs = node.attributes; // 返回所有属性构成的伪数组
    // 将伪数组转换成对象
    let _attrObj = {};
    for (let i = 0; i < attrs.length; i++) { // attrs[i] 属性节点（nodeType == 2)，有nodeName和nodeValue
      _attrObj[attrs[i].nodeName] = attrs[i].nodeValue;
    }

    // 创建节点
    _vnode = new VNode(nodeName, _attrObj, undefined, nodeType);

    // 考虑 node（真正的DOM元素）的子元素
    let childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      _vnode.appendChild(getVNode(childNodes[i])); // 递归
    }

  } else if (nodeType === 3) {
    // 文本节点
    _vnode = new VNode(undefined, undefined, node.nodeValue, nodeType)
  }
  // 没有直接使用else是因为实际情况下，还有可能是注释节点

  return _vnode;

}

/** 根据路径访问对象成员 */
function getValueByPath(obj, path) {
  let paths = path.split('.'); // [xxx, yyy, zzz]
  // 先取得obj.xxx, 再取得结果中的yyy，再取得结果中的 zzz
  let res = obj;
  let prop;
  // paths.shift() 就是把它的最前面一项取出来
  while (prop = paths.shift()) {
    res = res[prop];
  }
  return res;
}
/** 将带有坑的vnode与数据data结合，得到填充数据的VNOde： 模拟 AST -> VNode*/
let rkuohao = /\{\{(.+?)\}\}/g;
function combine(vnode, data) {
  let _type = vnode.type,
    _data = vnode.data,
    _value = vnode.value,
    _tag = vnode.tag,
    _children = vnode.children;

  let _vnode = null;

  if (_type === 3) { // 文本节点
    // 对文本处理
    _value = _value.replace(rkuohao, (_, g) => {
      return getValueByPath(data, g.trim());
    })

    _vnode = new VNode(_tag, _data, _value, _type);

  } else if (_type === 1) { // 元素节点
    _vnode = new VNode(_tag, _data, _value, _type);
    _children.forEach(_subvnode => _vnode.appendChild(combine(_subvnode, data)))
  }
  return _vnode;
}
// 将VNode转换为真正的DOM
function parseVNode(vnode) {
  // 创建真实的 DOM
  let type = vnode.type;
  let _node = null;

  if (type === 3) {
    // 文本节点
    return document.createTextNode(vnode.value); // 创建文本节点
  } else if (type === 1) {
    // 元素
    _node = document.createElement(vnode.tag);

    // 属性
    let data = vnode.data; // 现在这个data是键值对
    Object.keys(data).forEach((key) => {
      let attrName = key;
      let attrValue = data[key];
      _node.setAttribute(attrName, attrValue);
    })

    // 子元素
    let children = vnode.children;
    children.forEach(subvnode => { // subNode是虚拟DOM类型
      _node.appendChild(parseVNode(subvnode)); // 递归转换子元素（虚拟DOM）
    })

    return _node;
  }
}
```

### 2.3 验证
```js
// 模板
<div id="root">
  <div class="c1">
    <div title="t1" id="id">{{name}}</div>
    <div title="t2">{{age}}</div>
    <div title="t3">{{gender}}</div>
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
    </ul>
  </div>
</div>

// 创建应用
let app = new JGVue({
  el: '#root',
  data: {
    name: 'zhangsan',
    age: 19,
    gender: 'male'
  }
})
```

# 响应式原理

- 我们在使用Vue时候，赋值属性获得属性都是直接使用的Vue实例
- 我们在设置属性值的时候，页面的数据更新

```javascript
Object.defineProperty(对象，'设置什么属性名', {
  writable: 
  configurable
  enumerable // 属性是否可枚举，是不是可以被for-in取出来
  set(){}  // 赋值触发
  get(){} // 取值触发
})
```

```js
// 简化后的版本
// 中间变量就是value，将变量作为函数的参数传入，那么这个参数就相当于是函数作用域中的局部变量
// 函数相当于闭包的作用，在函数的内部形成了局部作用域
function defineReactive(target, key, value, enumerable) {
  // 函数内部就是一个局部作用域，这个value就只在函数内使用的变量（闭包）
  // 即解决了属性访问安全的问题，又解决多个属性
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: !!enumerable,

    get() {
      console.log(`读取o的${key}属性`); // 额外的操作
      return value;
    },
    set(newVal) {
      console.log(`设置o的${key}属性为：${newVal}`); // 额外的操作
      value = newVal;
    }
  })
}

// 使用
let o = {
  name: 'Jim',
  age: 19,
  gender: '男'
};

// 将对象转换为响应式的
let keys = Object.keys(o);
for (let i = 0; i < keys.length; i++) {
  defineReactive(o, keys[i], o[keys[i]], true);
}
```

只有一层循环，实际开发中对象一般是有多级的

```javascript
let o = {
    list: [
        { }
    ],
    ads: [],
    user: {},
}
```

怎么处理呢？递归。还可以使用队列（深度优先转换为广度优先）

```javascript
function defineReactive(target, key, value, enumerable){
  if(typeof value === 'object' && value !== null && !Array.isArray(value)){
    // 非数组的引用类型
    reactify(value);
  }

  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: !!enumerable,
    get(){
      console.log(`读取 ${key} 属性`); // 额外
      return value
    },
    set(newVal){
      console.log(`设置 ${key} 属性为：${newVal}`); // 额外
      value = newVal;
    }
  })
}

// 将对象 o 响应式化
function reactify(o){
  let keys = Object.keys(o);
  for(let i = 0; i < keys.length; i++){
    let key = keys[i]; // 属性名
    let value = o[key];
    // 判断这个属性值是不是引用类型，判断是不是数组类型
    // 如果是数组，就需要循环数组，将数组里面的元素循环进行响应式化
    // 如果是引用类型就需要递归，如果不是就不用递归(递归写在哪里？写在defineReactive)
      // 如果不是引用类型，需要使用defineReactive将其变成响应式的
      // 如果是引用类型，还是需要调用defineReactive
    if(Array.isArray(value)){
      // 数组
      for(let j = 0; j < value.length; j++){
        reactify(value[j]);
      }
    }else{
      // 对象或值类型
      defineReactive(o, key, value, true);
    }
  }
}

// 验证
let data = {
  name: '张三',
  age: 19,
  course: [
    {name: '语文'},
    {name: '数学'},
    {name: '英语'},
  ]
};

reactify(data);
// 缺陷：数组push后，新增的数据没有变成响应式的。
```

对于对象可以使用递归来响应式化，但是数组我们也需要处理

- push
- pop
- shift
- unshift
- splice
- reverse
- sort

要做什么事情呢？

1. 在改变数组的数据的时候，要发出通知
  - Vue2中的缺陷，数组发生变化，设置length没法通知（Vue3总使用Proxy语法解决了这个问题）
2. 加入的元素应该变成响应式的

**1. 在改变数组的数据的时候，要发出通知**
修改原型。

技巧：如果一个函数已经定义了，但是我们需要拓展其功能，我们一般的处理方法

1. 使用一个临时的函数名存储函数
2. 重新定义原来的函数
3. 定义扩展的功能
4. 调用临时的那个函数

```javascript
function func(){
  console.log('原始功能');
}

// 1. 使用一个临时的函数名存储函数
let _tmpFn = func;

// 2. 重新定义原来的函数
func = function (){
  // 4. 调用临时的那个函数
  _tmpFn();
  
  // 3. 定义扩展的功能
  console.log('新的扩展功能');
}

func(); // 功能：1. 打印出 原始的功能； 2. 打印出 新的扩展功能
```

扩展数组的push和pop怎么处理？

- 直接修改prototype（**不行**。所有的数组方法都会修改）
- 修改要进行响应式化数组的原型(`__proto__`)

思路：原型式继承：修改原型链的结构

原来的继承关系: arr -> Array.prototype -> Object.prototype

新的继承关系: arr -> 改写的方法 -> Array.prototype -> Object.prototype

```javascript
let ARRAY_METHOD = [
  'push','pop','shift','unshift','reverse','sort','splice'
]
// 思路：原型式继承：修改原型链的结构
let arr = [];
// 继承关系: arr -> Array.prototype -> Object.prototype
// 继承关系: arr -> 改写的方法 -> Array.prototype -> Object.prototype

let array_methods = Object.create(Array.prototype);

ARRAY_METHOD.forEach(method=>{
  array_methods[method] = function(){
    // 调用原来的方法
    console.log('调用的是拦截的 '+ method + '方法')
    let res = Array.prototype[method].apply(this, arguments); // 为什么用apply呢？因为需要改变实例的this指向，并且需要带参数
    return res;
  }
})

arr.__proto__ = array_methods;

// Vue 的源码中也做了判断
// 如果浏览器支持__proto__那么它就这么做
// 如果不支持，Vue使用的是混入法
```

**2. 加入的元素应该变成响应式的**

在数组拦截方法中调用reactify

```javascript
let ARRAY_METHOD = [
  'push','pop','shift','unshift','reverse','sort','splice'
]
let array_methods = Object.create(Array.prototype);
ARRAY_METHOD.forEach(method=>{
  array_methods[method] = function(){
    console.log('调用的是拦截的 '+ method + '方法')

    // 将数据进行响应式化
    for(let i = 0; i < arguments.length; i++){
      reactify(arguments[i]);
    }

    let res = Array.prototype[method].apply(this, arguments); 
    return res;
  }
})

function defineReactive(target, key, value, enumerable){
  if(typeof value === 'object' && value !== null && !Array.isArray(value)){
    reactify(value);
  }

  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: !!enumerable,
    get(){
      console.log(`读取 ${key} 属性`); // 额外
      return value
    },
    set(newVal){
      console.log(`设置 ${key} 属性为：${newVal}`); // 额外
      value = newVal;
    }
  })
}

// 将对象 o 响应式化
function reactify(o){
  let keys = Object.keys(o);
  for(let i = 0; i < keys.length; i++){
    let key = keys[i]; // 属性名
    let value = o[key];
    if(Array.isArray(value)){
      // 数组
      value.__proto__ = array_methods; // 数组响应式了
      for(let j = 0; j < value.length; j++){
        reactify(value[j]);
      }
    }else{
      // 对象或值类型
      defineReactive(o, key, value, true);
    }
  }
}
```
已经将对象改成响应式的了，但是如果直接给对象赋值，赋值另一个对象，那么就不是响应式的了，那么怎么办？

问题：
```javascript
data.course = {name: '计算机'}; // 在Vue中也是响应式的
```

在set操作后更新模板

```javascript
function defineReactive(target, key, value, enumerable){
  // 折中处理以后this就会Vue实例
  let that = this;

  if(typeof value === 'object' && value !== null && !Array.isArray(value)){
    reactify(value);
  }

  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: !!enumerable,
    get(){
      console.log(`读取 ${key} 属性`); // 额外
      return value
    },
    set(newVal){
      console.log(`设置 ${key} 属性为：${newVal}`); // 额外
      value = newVal;
      // 模板刷新（这现在是假的，只是演示）
      // vue实例怎么获取。watcher就不会有这个问题
      that.mountComponent();
    }
  })
}
```

目前完整代码

```javascript
let ARRAY_METHOD = [
  'push','pop','shift','unshift','reverse','sort','splice'
];
let array_methods = Object.create(Array.prototype);
ARRAY_METHOD.forEach(method=>{
  array_methods[method] = function(){
    // 调用原来的方法
    console.log('调用的是拦截的 '+ method + '方法')
    // 将数据进行响应式化
    for(let i = 0; i < arguments.length; i++){
      reactify(arguments[i]);
    }
    let res = Array.prototype[method].apply(this, arguments); // 为什么用apply呢？因为需要改变实例的this指向，并且需要带参数
    return res;
  }
})

function defineReactive(target, key, value, enumerable){
  // 折中处理以后this就会Vue实例
  let that = this;
  if(typeof value === 'object' && value !== null && !Array.isArray(value)){
    // 非数组的引用类型
    reactify(value);
  }

  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: !!enumerable,
    get(){
      console.log(`读取 ${key} 属性`); // 额外
      return value
    },
    set(newVal){
      console.log(`设置 ${key} 属性为：${newVal}`); // 额外
      value = newVal;
      // 模板刷新（这现在是假的，只是演示）
      // vue实例怎么获取。watcher就不会有这个问题
      that.mountComponent();
    }
  })
}

// 将对象 o 响应式化
function reactify(o, vm){
  let keys = Object.keys(o);
  for(let i = 0; i < keys.length; i++){
    let key = keys[i]; // 属性名
    let value = o[key];
    if(Array.isArray(value)){
      // 数组
      value.__proto__ = array_methods; // 数组响应式了
      for(let j = 0; j < value.length; j++){
        reactify(value[j], vm);
      }
    }else{
      // 对象或值类型
      defineReactive.call(vm,o, key, value, true);
    }
  }
}

/*************************************************************************/

class VNode {
  constructor(tag, data, value, type) {
    this.tag = tag && tag.toLowerCase();
    this.data = data;
    this.value = value;
    this.type = type;
    this.children = [];
  }

// 追加子元素
appendChild(vnode) {
    this.children.push(vnode);
  }
}

/** 由HTML DOM -> VNode: 将这个函数当作compiler函数，也就是编译成 AST 的函数 */
function getVNode(node) {
  let nodeType = node.nodeType; // 文本节点是value有值，元素节点是tag有值。nodeType主要用于区分这两种情况
  let _vnode = null;
  if (nodeType === 1) {
    // 元素
    let nodeName = node.nodeName; // tag 
    let attrs = node.attributes; // 返回所有属性构成的伪数组
    // 将伪数组转换成对象
    let _attrObj = {};
    for (let i = 0; i < attrs.length; i++) { // attrs[i] 属性节点（nodeType == 2)，有nodeName和nodeValue
      _attrObj[attrs[i].nodeName] = attrs[i].nodeValue;
    }
    // 创建节点
    _vnode = new VNode(nodeName, _attrObj, undefined, nodeType);
    // 考虑 node（真正的DOM元素）的子元素
    let childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      _vnode.appendChild(getVNode(childNodes[i])); // 递归
    }
  } else if (nodeType === 3) {
    // 文本节点
    _vnode = new VNode(undefined, undefined, node.nodeValue, nodeType)
  }
  // 没有直接使用else是因为实际情况下，还有可能是注释节点
  return _vnode;
}

/** 根据路径访问对象成员 */
function getValueByPath(obj, path) {
  let paths = path.split('.'); // [xxx, yyy, zzz]
  // 先取得obj.xxx, 再取得结果中的yyy，再取得结果中的 zzz
  let res = obj;
  let prop;
  // paths.shift() 就是把它的最前面一项取出来
  while (prop = paths.shift()) {
    res = res[prop];
  }
  return res;
}
/** 将带有坑的vnode与数据data结合，得到填充数据的VNOde： 模拟 AST -> VNode*/
let rkuohao = /\{\{(.+?)\}\}/g;
function combine(vnode, data) {
  let _type = vnode.type,
    _data = vnode.data,
    _value = vnode.value,
    _tag = vnode.tag,
    _children = vnode.children;

  let _vnode = null;
  if (_type === 3) { // 文本节点
    // 对文本处理
    _value = _value.replace(rkuohao, (_, g) => {
      return getValueByPath(data, g.trim()); // 触发了 get 读取器
    })
    _vnode = new VNode(_tag, _data, _value, _type);
  } else if (_type === 1) { // 元素节点
    _vnode = new VNode(_tag, _data, _value, _type);
    _children.forEach(_subvnode => _vnode.appendChild(combine(_subvnode, data)))
  }
  return _vnode;
}
// 将VNode转换为真正的DOM
function parseVNode(vnode) {
  // 创建真实的 DOM
  let type = vnode.type;
  let _node = null;
  if (type === 3) {
    // 文本节点
    return document.createTextNode(vnode.value); // 创建文本节点
  } else if (type === 1) {
    // 元素
    _node = document.createElement(vnode.tag);
    // 属性
    let data = vnode.data; // 现在这个data是键值对
    Object.keys(data).forEach((key) => {
      let attrName = key;
      let attrValue = data[key];
      _node.setAttribute(attrName, attrValue);
    })
    // 子元素
    let children = vnode.children;
    children.forEach(subvnode => { // subNode是虚拟DOM类型
      _node.appendChild(parseVNode(subvnode)); // 递归转换子元素（虚拟DOM）
    })

    return _node;
  }
}

/**********************************************************************/
function JGVue(options) {
  this._data = options.data;
  let elm = document.querySelector(options.el); // vue 中是字符串，案例是DOM元素
  this._template = elm;
  this._parent = elm.parentNode; // 父元素
  reactify(this._data, this /*将Vue实例传入，折中的处理*/);
  this.mount(); // 挂载
}

/** 挂载 */
JGVue.prototype.mount = function () {
  // 需要提供一个render方法：生成虚拟DOM。render方法就是有缓存功能的
  this.render = this.createRenderFn(); // 为什么采用这种方式？因为需要缓存虚拟DOM。只要调用render就意味着拿到虚拟DOM
  // 将虚拟DOM转为真实DOM，并挂载到页面
  this.mountComponent();
}

/** 挂载到页面*/
JGVue.prototype.mountComponent = function () {
  // 执行mountComponent()函数
  let mount = () => { // 这里是一个函数，函数的this默认是全局对象，需要修改为JGVue
    this.update(this.render()); // 渲染到页面上。this.render()执行后就会生成带有数据的虚拟DOM
  }
  mount.call(this); // 本质应该交给watcher来调用，但是还没有讲到这里
}

// 这里是生成render函数，目的是缓存抽象语法树（我们使用虚拟DOM来模拟）
JGVue.prototype.createRenderFn = function () {
  // 缓存 AST
  let ast = getVNode(this._template); // VNode
  // Vue：将AST+ data => VNode
  // 案例：带有坑的VNode + data => 含有数据的VNode
  return function render() {
    // 将带坑的VNode转换为带数据的VNode
    let _tmp = combine(ast, this._data);
    return _tmp;
  }
}

// 将虚拟DOM渲染到页面中：diff算法就在这里
JGVue.prototype.update = function (vnode) {
  let realDOM = parseVNode(vnode);
  this._parent.replaceChild(realDOM, document.querySelector('#root'));
}

let app = new JGVue({
  el: '#root',
  data: {
    name: '张三',
    age: 19,
    gender: 'male',
    datas:[
      {info: '好难'},
      {info: '太难了'},
      {info: '真的难吗'},
    ]
  }
})
```

总结：
1. 响应式原理Object.defineProperty
2. 方法的扩展
3. 数组方法响应式处理
4. 数组添加新成员，新成员也变成响应式
```javascript
function defineReactive(target, key, value, enumerable) {
  let that = this;
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    reactify(value);
  }

  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: !!enumerable,
    get() {
      console.log(`读取 ${key} 属性`); 
      return value
    },
    set(newVal) {
      console.log(`设置 ${key} 属性为：${newVal}`); 
      // 将新增加的属性成员变成响应式
      value = reactify(newVal);
      that.mountComponent();
    }
  })
}
```

问题：数组类型属性重新赋值，此时新值就不是响应式的.

Vue 2的缺陷。


# 发布订阅模式

- 代理方法(app.name, app._data.name)
- 事件模型(node: event 模块)
- 发布订阅模式：Vue中Observe 与 watcher、Dep


代理方法，就是要将app._data中的成员给映射到app上。

由于需要在更新数据时候，更新页面的内容，所以app._data访问的成员 与 app 访问的成员应该是同一个成员。

由于app._data已经是响应式对象了，所以只需要让app访问的成员去访问app._data的对应成员就可以了

例如：

```javascript
// app.name 转换为 app._data.name
// app.xxx 转化为 app._data.xxx
```

引入了一个函数 proxy(target, src, prop)。将target（app） 的操作映射到 src（app._data) 上。这里是因为当时没有Proxy语法（ES6语法）。

我们之前处理的reactify方法已经不行了，需要一个新的方法来处理。
```javascript
function reactify(o, vm) {
  let keys = Object.keys(o);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]; 
    let value = o[key];
    if (Array.isArray(value)) {
      value.__proto__ = array_methods;
      for (let j = 0; j < value.length; j++) {
        reactify(value[j], vm);
      }
    } else {
      defineReactive.call(vm, o, key, value, true);
    }
    // 只需要在这里添加代理即可（问题：在这里写的代码是会递归的）
    // 如果在这里将属性映射到Vue实例上，那么就表示Vue实例可以使用属性key
    // 如果是这种结构 { data: { name: 'jack', children: { name: 'jim'}}} 两个name都会映射到Vue实例上
    // 所以后面name: 'jim'会覆盖name: 'jack'。
  }
```
提供一个Observe的方法，在这个方法中对属性进行处理

也可以将这个方法封装到initData方法中
```js
function JGVue(options) {
  ...
  this.initData(); // 构造函数新增：将 data 进行响应式转换，进行代理
  this.mount(); // 挂载
}

GVue.prototype.initData = function () {
  // 遍历 this._data 的成员，将属性转换为响应式的，将直接属性（非递归属性）代理到实例上
  let keys = Object.keys(this._data);

  // 响应式花
  for (let i = 0; i < keys.length; i++) {
    // 这里将对象this._data[keys[i]]变成响应式的
    reactify(this._data, this);
  }

  // 代理
  for (let i = 0; i < keys.length; i++) {
    // 将this._data[keys[i]]映射到this[keys[i]]上
    // 就是要让this提供keys[i]这个属性
    // 在访问这个属性的时候，相当于在访问this._data的这个属性
    // Object.defineProperty(this, keys[i], {
    //   configurable: true,
    //   enumerable: true,
    //   get() {
    //     return this._data[keys[i]];
    //   },
    //   set(newVal) {
    //     this._data[keys[i]] = newVal;
    //   }
    // })
    proxy(this, '_data', keys[i]);
  }

}

/*将某一个对象的访问映射到对象的某一个属性成员上*/
// 把对象target访问key，映射到target对象prop属性的key
function proxy(target, prop, key) {
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: true,
    get() {
      return target[prop][keys[i]];
    },
    set(newVal) {
      target[prop][keys[i]] = newVal;
    }
  })
}
```

## 解释 proxy

```javascript
// Vue 默认所有的属性都挂载到_data
app._data.name
// Vue 设计，不希望访问 _ 开头的数据
// Vue 中有一个潜规则：
//  _ 开头的数据是私有数据
//  $ 开头的是只读数据
app.name
// 将对 _data.xxx 的访问将给了实例

// 重点：访问app 的 xxx 就是在访问 app._data.xxx
```

假设：

```javascript
let o1 = { name: '张三'};
// 要有一个对象o2，在访问o2.name的时候想要访问的是o1.name
Object.defineProperty(o, 'name', {
    get(){
        return o1.name;
    }
});
```

问app 的 xxx 就是在访问 app._data.xxx

```javascript
Object.defineProperty(app, 'name', {
    get(){
        return app._data.name
    },
    set(newVal){
        app._data.name = newVal
    }
})
```

为了一般化，将属性的操作转换为 参数

```javascript
function proxy(app, key){
    Object.defineProperty(app,  key, {
        get(){
            return app._data[key]
        },
        set(newVal){
            app._data[key] = newVal
        }
    })
}
```

问题：

在Vue中不仅仅是有 data 属性，还可能有properties,methods,...等等，都会挂载到Vue实例上

```javascript
function proxy(app, prop, key){
    Object.defineProperty(app,  key, {
        get(){
            return app[prop][key]
        },
        set(newVal){
            app.[prop][key] = newVal
        }
    })
}

// 如果将data的成员映射到实例上
proxy(实例, '_data', 属性名);

// 如果要将_properties的成员映射到实例上
proxy(实例, '_properties', 属性名)
```

# 发布订阅模式

目标：解耦，让各个模块之间没有紧密的联系。

现在的处理办法是属性在更新的时候，调用mountComponent方法。

问题：mountComponent 更新的是什么？（现在）全部的页面 -> 当前虚拟DOM对应的页面DOM

在Vue中，整个的更新是按照组件为单位进行**判断**，以节点为单位进行更新。

- 如果代码中没有自定义组件，那么在比较算法的时候，我们会将全部的模板对应的虚拟DOM进行比较
- 如果代码中含有自定义组件，那么在比较算法的时候，就会判断更新的是哪一些组件中的属性，只会判断更新数据的组件，其他组件不会更新。

复杂的页面是有很多组件构成的。每一个属性要更新的时候都要调用更新的方法？

**目标，如果修改了什么属性，就尽可能只更新这些属性对应的页面 DOM**

这样就一定不能将更新的代码写死。

例子：预售可能一个东西没有现货，告诉老板，如果东西到了就告诉我。

老板就是发布者，订阅什么东西作为中间媒介，我就是订阅者。

使用代码的结构来描述：

1. 老板提供一个账簿（数组）
2. 我可以根据需求订阅我要的商品（老板要记录下，谁定了什么东西，在数组中存储某些东西）
3. 等待，可以做其他的事情
4. 当货品来到的时候，老板就查看账簿，挨个的打电话（遍历数组，取出数组里面的元素来使用）

实际上就是事件模型：

1. 有一个event对象，
2. on，off，emit方法

实现事件模型，思考怎么用？

1. event是一个全局对象
2. event.on('事件名', 处理函数), 订阅事件
   1. 事件可以连续订阅
   2. 可以移除：event.off
      1. 移除所有
      2. 移除某一个类型的事件
      3. 移除某一个类型的某一个处理函数
3. 写别的代码
4. event.emit('事件名', 参数)，先前注册的这个事件处理函数就会依次调用

原因：

1. 用来描述发布订阅模式
2. 后面会使用到事件

```javascript
// 全局event对象，提供on，off，emit方法
// 为什么使用闭包？就是event里面存储事件的具体内容eventObjs
var event = (function () {
  var eventObjs = {};

  return {
    /* 注册事件，可以连续注册，可以注册多个事件*/
    on: function (type, handler) { },

    /* 移除事件：
      1. 如果没有参数，移除所有事件，如果只带有事件名，就移除这个名下的所有参数
      2. 如果有两个参数，那么就表示移除某一事件的具体函数          
    */
    off: function (type, handler) { },

    /* 发射事件，触发事件。包装参数传递给事件处理函数**/
    emit: function (type) { }
  }
}());
```

on的实现

```javascript
on: function (type, handler) {
  // 判断eventObjs[type]是否存在，如果存在就直接使用，如果不存在就赋值为空数组
  // 再把事件处理函数push进去
  (eventObjs[type] || (eventObjs[type] = [])).push(handler)
},
```

off实现

```javascript
/* 移除事件：
  1. 如果没有参数，移除所有事件，如果只带有事件名，就移除这个名下的所有参数
  2. 如果有两个参数，那么就表示移除某一事件的具体函数          
*/
off: function (type, handler) {
  if (arguments.length === 0) { // 没有参数移除所有的事件
    eventObjs = {}
  } else if (arguments.length === 1) { // 只有事件的类型，移除该事件的所有处理函数
    eventObjs[type] = [];
  } else if (arguments.length === 2) { // 移除type事件的handler处理函数
    // 使用循环移除所有的该函数的type事件
    let _events = eventObjs[type];
    if (!_events) { // _event不存在
      return;
    }

    // 倒着循环 数组的序号不会受到影响
    for (let i = 0; i = _events.length; i--) {
      if (_events[i] === handler) {
        _events.splice(i, 1);
      }
    }
  }
}
```

emit实现

```javascript
/* 发射事件，触发事件。包装参数传递给事件处理函数**/
emit: function (type) {
  // 获得arguments从1开始后所有的参数，返回的是数组
  let args = Array.prototype.slice.call(arguments, 1);

  let _events = eventObjs[type];
  if(!_events) return;

  for(let i =0; i < _events.length; i++){
    // 如果要绑定上下文就需要使用call, apply
    _events[i].apply(null, args);
  }
}
```

完整的事件模型

```javascript
var event = (function () {
  eventObjs = {};

  return {
    /* 注册事件，可以连续注册，可以注册多个事件*/
    on: function (type, handler) {
      // 判断eventObjs[type]是否存在，如果存在就直接使用，如果不存在就赋值为空数组
      // 再把事件处理函数push进去
      (eventObjs[type] || (eventObjs[type] = [])).push(handler)
    },

    /* 移除事件：
      1. 如果没有参数，移除所有事件，如果只带有事件名，就移除这个名下的所有参数
      2. 如果有两个参数，那么就表示移除某一事件的具体函数          
    */
    off: function (type, handler) {
      if (arguments.length === 0) { // 没有参数移除所有的事件
        eventObjs = {}
      } else if (arguments.length === 1) { // 只有事件的类型，移除该事件的所有处理函数
        eventObjs[type] = [];
      } else if (arguments.length === 2) { // 移除type事件的handler处理函数
        // 使用循环移除所有的该函数的type事件
        let _events = eventObjs[type];
        if (!_events) { // _event不存在
          return;
        }

        // 倒着循环数组的序号不会受到影响
        for (let i = 0; i = _events.length; i--) {
          if (_events[i] === handler) {
            _events.splice(i, 1);
          }
        }
      }
    },

    /* 发射事件，触发事件。包装参数传递给事件处理函数**/
    emit: function (type) {
      // 获得arguments从1开始后所有的参数，返回的是数组
      let args = Array.prototype.slice.call(arguments, 1);

      let _events = eventObjs[type];
      if (!_events) return;

      for (let i = 0; i < _events.length; i++) {
        // 如果要绑定上下文就需要使用call, apply
        _events[i].apply(null, args);
      }
    }
  }
}());
```