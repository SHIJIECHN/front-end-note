---
autoGroup-3: 源码专题
sidebarDepth: 3
title: 2. 虚拟DOM（二）
---

## 定义
虚拟DOM是对真实DOM的抽象，以JavaScript对象（VNode节点）作为基础的树，用对象的属性来描述节点，最终可以通过一系列操作使这棵树映射到真实环境上。    
 
特点：
1. 在JS对象中，虚拟DOM表现为一个对象。
2. 至少包含标签名（tag）、属性（attrs）和子元素对象（children）三个属性。
3. 不同框架对着三个属性的命名可能会有差别。

## 为什么要虚拟DOM
直接操作DOM非常慢，频繁操作会出现页面卡顿，影响用户体验。   
1. 传统：需要更新10个节点，浏览器会执行10次DOM操作。
2. 虚拟DOM：不会立即操作DOM，而是将10次更新的diff内容保存到本地的一个js对象中，最终将这个js对象一次性attach到DOM树上。

虚拟DOM优势：
1. diff算法，减少JavaScript操作真实DOM带来的性能消耗。
2. 抽象了原本的渲染过程，实现跨平台的能力。不仅局限于浏览器DOM，可以是安卓和iOS的原生组件、小程序或各种GUI。
