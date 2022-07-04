---
autoGroup-1: 浏览器基础
sidebarDepth: 3
title: 03. 渲染引擎、声明HTML、渲染模式
---

## 浏览器与页面渲染
浏览器组成部分：
1. 用户界面：用户看到的浏览器的样子
2. 浏览器引擎：让浏览器运行的程序接口集合，主要是查询和操作渲染引擎；
3. 渲染引擎：解析HTML/CSS，将解析的结果渲染到页面的程序；
4. 网络：进行网络请求的程序；
5. UI后端：绘制组合选择框对话框等基本组件的程序；
6. JS解释器：解释执行JS代码的程序
7. 数据存储：浏览器存储相关的程序cookies/storage

<img :src="$withBase('/operationEnv/Browser/browser-component.png')" alt="browser-component"> 


## 渲染到底是什么
渲染：用一个特定的软件将模型（一个程序）转换为用户能看到的图像的过程。   
渲染引擎：内部具备一套绘制图像方法集合，渲染引擎可以让特定的方法执行把HTML/CSSdiamante解析成图像显示在浏览器窗口中。




