---
autoGroup-3: 源码专题
sidebarDepth: 3
title: Vue源码分析（珠峰）
---

## 数据驱动

### 1. Vue 与模板
使用步骤

1. 编写页面模板
   1. 直接在 HTML 标签中写标签
   2. 使用 template
   3. 使用单文件(`<template />`)
2. 创建 Vue 实例
   1. 在 Vue 的构造函数中提供：data，methods，computed， watcher，props, ...
3. 将 Vue 挂载到页面中（mount）

### 2. 数据驱动模型
Vue 的执行流程

1. 获得模板：模板中有 “坑”
2. 利用 Vue 构造函数中所提供的数据来 “填坑”，得到可以在页面中显示的“标签中”
3. 将标签替换页面中原来有坑的标签

Vue 利用我们提供的数据和页面中模板生成了一个新的 HTML标签（node元素），替换到了页面中放置模板的位置。
```javascript
// 引入Vue
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.7.14/vue.js"></script>

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

### 3. 手动实现

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
        // 将 {{ xxx }} 用这个 value 值替换
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

<img :src="$withBase('/framework/Vue/vue-source-code.png')" alt="" />

模板与数据结合，将模板中的“坑”填写需要的数据，得到已填写好数据的真正的DOM，再进行页面渲染。

### 4. 代码整合

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

### 5. 多层级属性
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
通常模板是不会变的，数据是常常在变化的。Vue 利用函数柯里化技巧，缓存模板。
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

### 6. 虚拟DOM
目标：

1. 怎么将真正的DOM转换为虚拟DOM
2. 怎么将虚拟DOM转换为真正的DOM

思路与深拷贝类似。

为什么要使用虚拟DOM？提供性能。因为页面不断的更新，操作DOM有可能带来页面的刷新和页面内存的控制，会很消耗内存。使用虚拟DOM，所有操作都在内存中完成，只要更新到页面上。
```js
// 有哪些标签节点类型
// 1. 空标签 <div /> => { tag: 'div'}
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

**真正DOM如何生成VNode？**

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

**虚拟VNode如何生成真正的DOM？**

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


## 函数柯里化

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

### 1. 判断元素

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

### 2. 虚拟DOM的render方法

思考：Vue 项目**模板转换为抽象语法树**需要执行几次？

- 页面一开始需要渲染
- 每一个属性（响应式）数据在发生变化的时候要渲染
- watch，computed等等

上面写的JGVue.prototype.compiler，每次需要渲染的时候，模板就会解析一次（注意，这里我们简化了解析方法）

render的作用是将虚拟DOM转换为真正的DOM加到页面中

- 虚拟DOM可以降级理解为抽象语法树（AST）
- 一个项目运行的时候模板是不会变的，就表示AST是不会变的

我们可以将代码进行优化，将虚拟DOM缓存起来，生成一个函数，函数只需要传入数据就可以得到真正的DOM。

#### 2.1 构造函数JGVue重写

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

/**
在真正的Vue中使用了二次提交的设计结构。
1. 页面HTML DOM与虚拟DOM是一一对应的关系
2. createRenderFn函数就是用来生成render函数的，同时缓存的AST
3. render函数调用的时候，利用AST和数据结合生成带有数据的VNode
4. update就是比较新数据VNode和旧VNode（diff），目的是更新旧VNode，从而更新HTML
 */

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

#### 2.2 辅助函数

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

#### 2.3 验证
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

## 响应式原理

- 我们在使用Vue时候，获得属性值都是直接使用的Vue实例
- 我们在设置属性值的时候，页面的数据更新
- 

```javascript
Object.defineProperty(对象，'设置什么属性名', {
  writable 
  configurable
  enumerable // 属性是否可枚举，是不是可以被for-in取出来
  set(){}  // 赋值触发
  get(){} // 取值触发
})
```

### 1. 响应式原理
```javascript
var o = {};

// 给o提供属性
o.name = 'zhangsan';

// 等价于
Object.defineProperty(o, 'age', {
  configurable: true,
  writable: true,
  enumerable: !!true, // 可枚举
  value: 19
})

// get 和 set 上
// 要响应式就表示在赋值和读取的收，附带的要做一些事请
let _gender;
Object.defineProperty(o, 'gender', {
  configurable: true,
  enumerable: true, // 可枚举
  get(){ // 如果使用 o.gender 来访问数据，就会调用 get 方法（getter，读取器）
    return _gender;
  },
  set(newVal){ // 如果 o.gender = 'xxx'，那么就会调用这个set方法，并设置的值会作为参数传入set
  console.log('赋值的新值为：', newVal); 
  _gender = newVal;
  }
})

// 如果同时使用 get 和 set 需要一个中间变量存储真正的数据

// 问题：这个_gender 被暴露在全局作用域。

// Vue中使用defineReative(target, key, value, enumerable)
```

### 2. 将对象转换成响应式
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

### 3. 对象响应式化

实际开发中对象一般是有多级的

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
let data = {
  name: '张三',
  age: 19,
  course: [
    {name: '语文'},
    {name: '数学'},
    {name: '英语'},
  ]
};

function defineReactive(target, key, value, enumerable){
  // 对象里面的成员进行响应式化
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


reactify(data);
// 问题：数组push后，新增的数据没有变成响应式的。

```

总结：
1. 首先要对对象的本身进行响应式化
2. 其次还需要对对象的各个成员进行响应式化

对于数组的情况，在reactify中递归，其他引用类型在defineReactive中递归。数组本身没有进行响应式化，而数组中项如果是对象的话，需要进行响应式化。

对于对象可以使用递归来响应式化，但是数组我们也需要处理

- push
- pop
- shift
- unshift
- splice
- reverse
- sort

要做什么事情呢？

1. 在改变数组的数据的时候，要发出通知（拦截数组的方法）
  - Vue2中的缺陷，数组发生变化，设置length没法通知（Vue3总使用Proxy语法解决了这个问题）
1. 加入的元素应该变成响应式的（处理数组响应式化的问题）

### 4. 扩展函数功能

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

### 5. 拦截数组的方法

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
    // 将数组进行响应式化   

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

### 6. 处理数组响应式化的问题

在数组拦截方法中调用reactify。

```javascript
let ARRAY_METHOD = [
  'push','pop','shift','unshift','reverse','sort','splice'
]
let array_methods = Object.create(Array.prototype);
ARRAY_METHOD.forEach(method=>{
  array_methods[method] = function(){
    // 将数据进行响应式化
    for(let i = 0; i < arguments.length; i++){
      reactify(arguments[i]);
    }

    // 调用原来的方法
    console.log('调用的是拦截的 '+ method + '方法')

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
      value.__proto__ = array_methods; // 通过以上7种方法改变数据成员，数组成员响应式化
      // 数组原本的数据进行响应式化
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

### 7. 对象属性赋值响应式化

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

// 问题：数组类型属性重新赋值，此时新值就不是响应式的.
// 这是Vue 2的缺陷。因此一般情况下，数组不会采用直接赋值的方式，而是采用拦截方法中的方法进行数组修改。
```

### 8. JGVue reactive

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

// 问题：修改数据的时候，模板要刷新？？

// Observer，Watcher，Dep...
```

总结：
1. 响应式原理Object.defineProperty
2. 对象响应式化
3. 数组方法的拦截与添加成员响应式处理
4. 直接给对象赋值，新值也是响应式的
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



## 发布订阅模式

- 代理方法(app.name, app._data.name)
- 事件模型(node: event 模块)
- 发布订阅模式：Vue中Observe 与 watcher、Dep

### 1. 代理方法

代理方法，就是要将app._data中的成员给映射到app上。如app._data.name -> app.name。

由于需要在更新数据时候，更新页面的内容，所以app._data访问的成员 与 app 访问的成员应该是同一个成员。

由于app._data已经是响应式对象了，所以只需要让app访问的成员去访问app._data的对应成员就可以了

例如：

```javascript
app.name 转换为 app._data.name
app.xxx 转化为 app._data.xxx
```

引入了一个函数 proxy(target, src, prop)。将target（app） 的操作映射到 src（app._data) 上。这里是因为当时没有Proxy语法（ES6语法）。

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
}
```
我们之前处理的reactify方法已经不行了，需要一个新的方法来处理。

提供一个Observe的方法，在这个方法中对属性进行处理。

也可以将这个方法封装到initData方法中
```js
function JGVue(options) {
  ...
  this.initData(); // 构造函数新增：将 data 进行响应式转换，进行代理
  this.mount(); // 挂载
}

JGVue.prototype.initData = function(){
  //做两件事情：
  // 1. 遍历this._data的成员，将属性转换为响应式，
  // 2. 将直接属性代理到实例上
  
  // 1. 遍历this._data的成员，将属性转换为响应式
  let keys = Object.keys(this._data);
  // 响应式化
  for(let i = 0; i < keys.length; i++){
    // 这里将对象 this._data[keys[i]] 变成响应式的
  }

  // 2. 代理
  for(let i = 0; i < keys.length; i++){
    // 将this._data[keys[i]] 映射到 this._data[keys[i]]
  }
}
```

实现
```javascript
JGVue.prototype.initData = function(){
  //做两件事情：
  // 1. 遍历this._data的成员，将属性转换为响应式，
  // 2. 将直接属性代理到实例上

  // 1. 遍历this._data的成员，将属性转换为响应式
  let keys = Object.keys(this._data);
  // 响应式化
  for(let i = 0; i < keys.length; i++){
    // 这里将对象 this._data[keys[i]] 变成响应式的
  }

  // 2. 代理
  for(let i = 0; i < keys.length; i++){
    // 将this._data[keys[i]] 映射到 this._data[keys[i]]
    // 就是要让this提供keys[i]这个属性
    // 在访问这个属性的时候相当于在访问this._data的这个属性
    Object.defineProperty(this, keys[i], {
      enumerable: true,
      configurable: true,
      get(){ 
        return this._data[keys[i]];
      },
      set(newVal){
        this._data[keys[i]] = newVal;
      }
    })
    // 好处：
    // 1. 访问的this.xxx上的成员实际上是访问this._data.xxx上的成员
    // 2. 维护的对象只有一个
  }
}

// 问题：安全问题。这里代理for循环中使用let，而vue源码中使用var。
```

优化
```js
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
    proxy(this, '_data', keys[i]);
  }
}

/* 将某一个对象的访问映射到对象的某一个属性成员上 */
// 把对象target访问key，映射到target对象prop属性的key
function proxy(target, prop, key) {
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: true,
    get() {
      return target[prop][key];
    },
    set(newVal) {
      target[prop][key] = newVal;
    }
  })
}
```

### 2. 解释 proxy

```javascript
// Vue 默认所有的属性都挂载到_data
app._data.name
// Vue 设计，不希望访问 _ 开头的数据
// Vue 中有一个潜规则：
//  _ 开头的数据是私有数据
//  $ 开头的是只读数据
app.name
// 将对 _data.xxx 的访问将给了实例

// 重点：访问app.xxx 就是在访问 app._data.xxx
```

假设：

```javascript
let o1 = { name: '张三'};
// 要有一个对象o2，在访问o2.name的时候想要访问的是o1.name
Object.defineProperty(o2, 'name', {
    get(){
        return o1.name;
    }
});
```

现在需要访问app.xxx 就是在访问 app._data.xxx

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

### 3. 事件模型

发布订阅模式目标：解耦，让各个模块之间没有紧密的联系。

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

#### 3.1 Event对象

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

#### 3.2 on的实现

```javascript
on: function (type, handler) {
  // 判断eventObjs[type]是否存在，如果存在就直接使用，如果不存在就赋值为空数组
  // 再把事件处理函数push进去
  (eventObjs[type] || (eventObjs[type] = [])).push(handler)
},
```

#### 3.3 off实现

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
    for (let i = _events.length - 1; i = _events.length; i--) {
      if (_events[i] === handler) { // 引用值比较
        _events.splice(i, 1);
      }
    }
  }
}
```


#### 3.4 emit实现

```javascript
/* 发射事件，触发事件。包装参数传递给事件处理函数**/
emit: function (type) {
  // 获得arguments从1开始后所有的参数，返回的是数组
  let args = Array.prototype.slice.call(arguments, 1);

  let _events = eventObjs[type];
  if(!_events) return;

  for(let i =0; i < _events.length; i++){
    // 如果要绑定上下文就需要使用call 或 apply
    _events[i].apply(null, args);
  }
}
```


#### 3.5 事件的移除问题

问题：引用类型比较

js 中基本类型是比较值，引用类型比较地址
引用类型与基本类型，是将引用类型转换为基本类型再比较，如果是 === 严格相等，则不转换比较

```javascript
var btn = document.querySelector('#btn');
// 注册
btn.addEventListener('click', function () {
  console.log('点击了')
})
// 移除
btn.removeEventListener('click', function(){
  console.log('点击了');
})

// 是不是移除了呢？并没有移除

// 如果想要可移除
function handler() {
  console.log('一个可移除的事件处理函数');
}
btn.addEventListener('click', handler);
btn.removeEventListener('click', handler);
// 必须保证移除的是同一个函数
```

#### 3.6 完整的事件模型

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
        for (let i = _events.length - 1; i = _events.length; i--) {
          if (_events[i] === handler) { // 引用类型比较
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

#### 3.7 Vue模型

发布订阅模式（形式不局限于函数，形式可以是对象）：

1. 中间的全局的容器（Vue中是Target），用来**存储**可以被触发(刷新页面)的东西（函数， Vue里面是对象Watcher）
2. 需要一个方法（Vue中是Dep），可以往容器中**传入**东西（函数， 对象）
3. 需要一个方法，可以将容器中的东西取出来**使用**（函数调用，对象的方法调用）


Vue 模型

<img :src="$withBase('/framework/Vue/vue-source-code-01.jpg')" alt="" />

更新了虚拟DOM就相当于更新了页面。如何触发DOM的更新呢？
1. 有一个全局的结构，用来存储Watcher，是一个数组结构
2. 虚拟DOM是以组件为单位，所以虚拟DOM中可以存在许多组件，但是只有一个根组件（相当于Vue实例），其他组件相当于页面中使用的组件。每个组件绑定一个data，每个组件需要更新意味着每个组件包含着类似于this.update(this.render())方法，每个组件对应一套watcher。watcher就是更新方法。watcher中有update方法，如果被触发就会更新data，也就相当于更新了组件。
3. data是响应式的，也就是在读取和设置data时，会进行一些额外的操作。
   1. 读取的时候，调用depend方法，将对应watcher（更新方法）存入全局watcher（什么时候会读取？）
      - 模板渲染的时候，虚拟DOM生成的时候会被读取
   2. 设置的时候，调用notify方法，将全局所有的watcher一一触发（什么时候触发？）
      - 数据变更的时候
4. 内存中可以有多个watcher，但是至少有一个watcher


为什么这么设计？ 

页面中的变更（diff）是以组件为单位的

- 如果页面中只有一个组件（Vue实例），不会有性能损失
- 但是如果页面中有多个组件（多watcher的一种情况），第一次会有多个组件的watcher存入到全局watcher中。
  - 如果修改了局部的数据（例如其中一个组件的数据）
  - 表示只会对该组件进行diff算法，也就是说只会重新生成该组件的抽象语法树
  - 只会访问该组件的watcher
  - 也就是表示再次往全局存储的只有该组件的watcher
  - 页面更新的时候也就只需要更新一部分

强调几个概念：
1. 读取时，将watcher存入全局容器时，被称为**依赖收集**
2. 修改时，将全局容器中的watcher取出执行被称为**派发更新**


#### 3.8 observe函数

缺陷：

- 无法处理数组。如 `reactify(arguments[i])` 需要传入实例
- 响应式无法在中间集成Watcher处理
- 我们实现的reactify需要和实例紧紧的绑定在一起，需要分离

没有对 reactify 中的 o 本身进行响应式处理，只对 o 的成员进行响应式处理。

observe作用将对象 obj 变成响应式的

```javascript
/** 将对象 obj 变成响应式的，vm 就是 Vue 实例，为了调用时处理上下文 */
function observe(obj, vm){
  // 之前没有对 obj 本身进行操作, 这一次就直接对 obj 进行判断
  if (Array.isArray(obj)) {
    // 对其每一个元素处理
    obj.__proto__ = array_methods;
    for (let i = 0; i < obj.length; i++) {
      observe(obj[i], vm); // 递归处理每一个数组元素
    }
  } else {
    // 对其成员进行处理
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      let prop = keys[i]; // 属性名
      defineReactive(vm, obj, prop, obj[prop], true);
    }
  }
}
```

observe没有返回值，所以需要修改defineReactive中 set 方法进行修改

```javascript
set(newVal){
  // 目的
  // 将重新赋值的数据变成响应式的, 因此如果传入的是对象类型, 那么就需要使用 observe 将其转换为响应式
  if (typeof newVal === 'object' && newVal != null) {
    observe(newVal);
  }

  value = newVal;
}
```

#### 3.9 引入Watcher
问题：
- this的问题

实现：数据发生变化的事情，通知页面刷新，也就是通知watcher；访问数据的时候，通知全局Watcher保存watcher。

分成两步：

1. 只考虑修改后刷新（响应式核心算法）
2. 再考虑依赖收集（优化）

在 Vue 中提供一个构造函数 Watcher，Watcher会有一些方法：

- get() 用来进行**计算**（watch或computed @watcher）和**执行**处理函数（render@watcher）
- update() 公共的外部方法，该方法会触发内部的run方法
- run() 用来判断内部是使用异步运行还是同步运行等，这个方法最终会调用内部的get方法
- clearupDep() 简单理解为清空队列

我们的页面渲染是上面哪一个方法执行的呢？ get方法

我们的Watcher实例有一个属性vm，表示的就是当前的 Vue 实例

Watcher类里做的事情，主要为：
1. 传入组件实例、观察者函数、回调函数、选项

```javascript
/** Watcher 观察者，用于发射更新的行为 */
class Watcher {
  /**
   * 
   * @param {Object} vm JGVue 实例
   * @param {String|Function} expOrfn 如果是渲染watcher，传入的就是渲染函数，如果是计算watcher传入的就是路径表达式，暂时只考虑expOrfn为函数的情况
   */
  constructor(vm, expOrfn) {
    this.vm = vm;
    this.getter = expOrfn;

    this.dep = []; // 依赖项
    this.depIds = {}; // 是一个Set类型，用于保证依赖项的唯一性（简化的代码暂时不识别这一块）

    // 一开始需要渲染：真实 vue 中：this.lazy ? undefined : this.get()
    this.get();
  }

  /** 计算，触发getter  */
  get() {
    this.getter.call(this.vm, this.vm); // 上下文的问题就解决了
  }

  /**
   * 执行，并判断是懒加载，还是同步执行，还是异步执行：
   * 我们现在只考虑异步执行（简化的是同步执行）
   */
  run() {
    this.get();
    // 在真正的 vue 中是调用queueWatcher，来触发nextTick进行异步的执行
  }

  /** 对外公开的函数，用于在属性发生变化时触发的接口 */
  update() { }

  /** 清空依赖队列 */
  clearupDep() { }
}
```



#### 3.10 引入Dep对象

该对象提供 依赖收集（depend）的功能 和 派发更新（notify）的功能

在notify中去调用watcher的update功能

```javascript
class Dep {
  constructor() {
    this.sub = []; // 存储的是玉 当前 Dep关联的 watcher
  }

  /** 添加一个watcher */
  addSub(sub) { }

  /** 移除 */
  removeSub(sub) { }

  /** 将当前Dep与当前的watcher（暂时渲染watcher）关联 */
  depend() { }

  /** 触发与之关联的watcher的update方法，起到更新的作用 */
  notify() {
    // 在真实的 Vue 中是依次触发 this.subs 中的watcher的update方法
    if (Dep.target) {
      Dep.target.update();
    }
  }
}

// 全局的容器存储渲染Watcher
// let globalWatcher
// 学 Vue 的实现
Dep.target = null; // 这就是全局的Watcher
```

#### 3.11 Watcher 与 Dep

之前将渲染 Watcher放在全局作用域上，这样处理是有问题的

- Vue 项目中包含很多的组件，各个组件是**自治**
  - 每个组件可能有多个watcher实例
    - 模板渲染watcher：this._watcher = new Watcher(this, render, this._update)
    - 计算属性watcher：new Watcher(this,function name(){...}, callback)
  - 每一个watcher用于描述一个渲染行为（render@watcher） 或 计算行为（computed@watcher，）
    - 子组件发生数据的更新，页面需要重新渲染（真正的Vue中是局部渲染）
    - 例如 vue 中推荐使用计算属性代替复杂的插值表达式。计算属性是会伴随其使用的属性的变化而变化的
      - `name: () => this.firstName + this.lastName` 
      - 计算属性依赖于firstName和lastName
      - 只要被依赖的属性发生变换，就会促使计算属性**重新计算**
- 依赖收集和派发更新是怎么运行起来的



我们在访问的时候就会进行收集，在修改的时候，收集什么就更新什么

所谓的依赖收集 实际上就是告诉当前的watcher什么属性被访问了

那么在这个watcher计算的时候或渲染页面的时候就会将这些收集到的属性进行更新

如何将属性与当前watcher关联起来？

- 在全局准备一个targetStack(watcher栈，简单的理解为watcher数组，把一个操作中需要使用的watcher都存储起来)
- 在watcher调用 get 方法的时候，将当前watcher方法放到全局，在 get 执行结束之后，将这个全局的watcher移除。提供：pushTarget，popTarget
- 每一个属性中都有一个Dep对象

我们在渲染访问对象属性的时候（就是在调用Watcher 的 get时候），此时渲染watcher就在全局中。将属性和watcher相关联，其实就是将当前渲染的watcher存储到属性相关的dep中，同时将dep也存储到当前全局的watcher中（互相引用的关系）

- 属性引用了当前的渲染watcher，属性知道谁渲染它
- 当前渲染watcher引用了(访问的)属性（Dep），当前的watcher知道渲染了什么属性

关联起来的好处：我们的dep还有一个方法notify()。其内部就是将dep中的subs取出来依次调用其update方法（subs里面存储的知道要渲染什么属性的watcher）


## Vue 源码解读

1. 各个文件夹的作用
2. Vue的初始化流程

### 1. 各个文件夹的作用

1. compiler 编译用的
   - vue使用**字符串**作为模板
   - 在编译文件夹中存放对模板字符串解析的算法，抽象语法树，优化等
2. core 核心，vue 构造函数，以及生命周期等方法部分
3. platforms 平台
   - 针对运行环境（设备），有不同的实现
   - 也是vue的入口
4. server 服务端，主要是将vue用在服务端的处理代码（略）
5. sfc 单文件组件（略）
6. shared 公共工具（方法）

### 2. Observer
文件夹中各个文件的作用：

- array.js 创建含有重写数组方法的数组，让所有的响应式数据继承自该数组
- dep.js Dep类
- index.js Observer类，observe的工厂函数
- schedule.js vue中任务调度的工具，watcher执行的核心
- traverse.js 递归遍历响应式数据，目的是触发依赖收集
- watcher.js Watcher类

面试题：对数组去重
```javascript
let arr = [1,1,1,1,2,2,2,3,3,3]; // [1,2,3]

let _set = {};
let _newArr = [];
arr.forEach(v => _set[v] || (_set[v] = true, _newArr.push(v))); // 减少赋值行为

// 问题：如何“判同”

```