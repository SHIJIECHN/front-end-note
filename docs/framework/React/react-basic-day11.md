---
autoGroup-1: React
sidebarDepth: 3
title: 代码分割
---

## 代码分割
在打包的过程中，会整体打包成一个bundle的一个JS文件。但是会有一些代码、模块是加载的时候不需要的，我们希望有一些模块在需要的时候再去加载，因此将这些模块分割出来，单独形成一个块（chunk）

好处：
1. 模块懒加载
2. 减少应用体积
3. 减少加载时的体积

## import
import导入模块：import是一个ES6的模块化关键字，不是一个函数，它分为静态的导入（static import）`import xxx from 'xxx'`和动态导入（dynamic import）`import('xxx')`。

import是可以被调用的，但是它和普通的函数时不一样的，import不是一个对象，它是一个关键字`import xxx/ import(xxx)`类似`typeof(xxx)/ typeof xxx`

区别：
- static import 是模块的静态导入，特点是导入并加载时，导入的模块会被编译，不是按需编译
- dynamic import 模块的动态导入，根据条件或按需的模块导入

dynamic import应用场景：
1. 模块太大，使用可能性很低的模块，这些模块不需要马上加载
2. 模块的导入占用了大量的系统内存
3. 模块需要异步获取
4. 导入模块时需要动态的构建路径（说明符） 
5. 动态说明符：import ('./' + a + b + '.js')
6. 静态说明符：static import只支持静态说明符。不支持import xxx from './'+ a + b + '.js
7. 模块中的代码需要程序触发了某些条件才能运行的

> 为什么不能滥用动态加载

因为静态导入是有利于初始化依赖的，静态的程序分析或tree shaking动态导入是难以工作的。

使用import的要求：
- 如果使用create react app的方式创建工程是直接可以使用动态导入import()
- 如果手动做webpack的配置时，查看webpack代码分割的指南
- 如果使用babel解析import()时，安装依赖@babel/plugin-syntax-dynamic-import 


## lazy
React.lazy方法 / Suspense是React内置组件，挂载到React

lazy是React

## 路由懒加载
