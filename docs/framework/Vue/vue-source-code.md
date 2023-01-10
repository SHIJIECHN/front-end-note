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
  this.$el = this._templateDOM = document.querySelector(this._el);
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


总结：
1. 数据驱动：就是利用数据渲染页面，然页面呈现结果
2. 涉及模板、虚拟DOM




## 将虚拟应用于compiler中

