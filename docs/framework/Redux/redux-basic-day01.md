---
autoGroup-1: Redux
sidebarDepth: 3
title: 基础知识
---

## 初识Redux
Redux是一个独立专门用于做状态管理的JS库（不是react插件库），它可以用在react，angular，vue等项目中，但基本与react配合使用。

作用：集中式管理react应用中多个组件共享的状态。

## 工作流程

### 1. 三大核心概念
#### 1. Store对象    
保存数据的地方，你可以把它看成一个容器，整个应用只能是一个Store。Redux提供createStore这个函数，用来生成Store。

- createStore函数接收另一个函数reducer作为参数，返回一个新生成的Store对象
- store.dispatch()接收一个action对象作为参数，将它发送出去。

#### 2. Action
Action creators创建一个action对象。

描述当前发生的事情。改变state唯一的方法，就是使用action它会运送数据到store。其中type属性是必须的，表示Action名称（事情的名称），其他属性可以自有设置。

#### 3. Reducer函数
它是一个纯函数，也就是说，只要同样的输入，必定得到同样的输出。

Store收到action以后，必须给出一个新的State，这样View才会发生改变，这种State的计算过程就叫做Reducer。

store自动调用Reducer，并且传入连个参数：当前State和收到action，返回新的state.

## 安装
```javascript
npm i -S redux
```