---
autoGroup-3: 源码专题
sidebarDepth: 3
title:  1. Diff算法（小野）
---

## DOM Diff是什么
对比两个虚拟节点，找出它们的差异，然后对应到真实的DOM上面去做打补丁的过程。目的就是找到这些差异，以最小的代价去操作DOM。因为DOM操作是消耗性能的，所以要以最小的性能消耗来操作DOM。就会引出虚拟节点的问题。

什么是虚拟节点？    
就是一个普通的对象，把真实的节点用对象模拟出来。虚拟节点的对比是为了新的虚拟节点和老的虚拟节点对比有差异的时候，找出这个差异，然后形成一个补丁，然后将补丁打到真实的DOM中。最终的一步还是操作DOM，但是是以差异化最小的代价。

<img :src="$withBase('/framework/Vue/diff10.jpg')" alt="diff" />

1. 创建虚拟节点(createElement)
2. 转换成真实DOM结构(render)

## 虚拟节点差异
<img :src="$withBase('/framework/Vue/diff11.jpg')" alt="diff" />

## 创建补丁