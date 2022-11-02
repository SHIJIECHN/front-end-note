---
autoGroup-2: Hook
sidebarDepth: 3
title: 自定义Hook
---

## 自定义Hook
想在两个函数之间共享逻辑时，会把它提取到第三个函数中。

自定义Hook是一个函数。函数内部可以调用其他的Hook。

> 自定义Hook必须以“use”开头吗？

必须如此。

> 两个组件中使用相同的Hook会共享state吗？

不会。自定义Hook是一种重用状态逻辑。每次使用它们之间的state和副作用都是完全隔离的。

> 自定义Hook如何获取独立的state？

每次调用Hook，都会获取独立的state。

## 案例
渲染一个嵌套的列表页面



