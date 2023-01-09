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
let generateNode = tmpNode.cloneNode(true); // 注意这里是DOM元素，可以这么用
console.log(tmpNode);
compiler(generateNode, data);
console.log(generateNode);

// 4. 将渲染好的 HTML 加到页面中
root.parentNode.replaceChild(generateNode, root);

// 上面的思路有很大的问题：
// 1. Vue 使用的虚拟DOM
// 2. 只考虑单属性（ {{name}} ），而Vue中大量的使用层级（ {{child.name.firstName}} ）
// 3. 代码没有整合（Vue 使用的是一个构造函数）
```