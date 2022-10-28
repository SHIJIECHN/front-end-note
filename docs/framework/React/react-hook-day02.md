---
autoGroup-2: Hook
sidebarDepth: 3
title: useEffect
---

## 副作用
> 什么是副作用？

在纯函数中，只要和外部存在交互时就不是纯函数

> 哪些操作会导致不是纯函数？

- 引用外部变量
- 执行外部函数

> 什么是纯函数？

相同的输出会引起相同的输出

> React中的副作用

只要不是在组件渲染时用到的变量，所有操作都为副作用。

> 副作用包括哪些呢？
- 跟外部有关的东西
- 依赖useState声明的变量和函数
- 依赖外部全局document/window变量（改变全局变量，计时器）
- 依赖AJAX（全局的new XMLHTTPRequest()返回的对象） 