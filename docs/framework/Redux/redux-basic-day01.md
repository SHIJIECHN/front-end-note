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

使用步骤：
1. 引入redux，创建一个store对象
2. 自定义一个action对象
3. 使用store.dispatch(action)方法把action对象传到reducer函数的参数里
4. 定义reducer函数，根据参数action的类型判断条件返回新的state函数
5. 使用store.getState()方法获取最新的state数据
6. 定义store.subscribe方法监听当state发生更改时重新加载组件从而更新视图


## Store

> 如何创建一个Store对象？

```javascript
import { createStore } from 'redux';

//Redux提供的createStore函数,接收另一个函数reducer作为参数，返回一个新生成的Store对象
const store = createStore(reducer);

/**
 * 打印store对象
 * console.log(store);
 * {
 *   //dispatch接受action对象作为参数
 *   dispatch: ƒ, 
 *   //监听state状态发生更改时，调用方法渲染更新视图
 *   subscribe: ƒ, 
 *   //获取当前状态state的值
 *   getState: ƒ, 
 *   replaceReducer: ƒ, 
 *   @@observable: ƒ
 * }
 */
```

store.dispatch()：
```javascript
//发送一个action对象
const action = {type: 'INCREMENT', data: 1};

//它接收一个action对象作为参数，将它发送出去
store.dispatch(action);
```
## Action

> Action是什么？

它描述当前发生的事情，改变state的唯一方法，就是使用action，它会运送数据到store

> 如何创建一个action对象

```javascript
//自定义一个
const action = {type: 'INCREMENT', data: 1};

//或者利用actionCreators()方法来创建一个action对象
```

::: tip
type属性是必须的，它表示Action名称（事件的名称），其他属性可以自由设置
:::

reducer函数：它是一个纯函数，只要同样的输入，必定得到同样的输出。

Store收到action以后，必须给出一个新的State，这样视图才会发生变化，这种State计算过程叫做reducer

```javascript
// store自动调用Reducer,并传入两个参数，当前的State和收到的action，
// 并返回新的State
const store = createStore(counter);

//reducer函数接收dispacth发送过来的action对象
function counter(state, action){
  console.log(state);
  //undefined
  
  consolo.log(action);
  //没有定义action对象时打印
  //{type: '@@redux/INITe.p.e.u.7.h'}
  //当定义好action对象时打印定义好的action对象
  //{type: 'INCREMENT', data: 1}
  
  //判断action的类型返回对应的新的state数据
  switch (action.type) {
    case 'INCREMENT':
      return action.data;
    default:
      //否则返回原来的state数据
      return state;
  }
}
```

```javascript
//reducer函数会返回一个新的state数据
//可以通过store对象里面的getState方法进行获取
const state = store.getState();
console.log(state);
//拿到action类型判断之后的state数据
//1
```

store.subscribe方法：监听state状态发生更改时，调用方法渲染更细视图

```javascript
//当参数为函数的函数执行完毕后会调用subscribe
store.subscribe(render);

function render() {
  //将store对象传入app组件这样app组件可以用store的方法
  ReactDOM.render(<App store={store} />, document.getElementById('root'));
}
```

## 案例
点击按钮修改页面显示的数量数据


## Redux组件分类
Redux将所有组件分成两大类：UI组件和容器组件

UI组件：
- 只负责UI的呈现，不带任何业务逻辑
- 不适用this.state这个变量
- 所有数据都有参数this.props提供
- 不适用任何redux的API

> 如果组件既有UI又有业务逻辑，如何处理？

将它拆分为外面是一个容器组件，里面包含一个UI组件，前者负责外部通信，将数据传给后者，后者负责渲染视图。

> 数据如何传给UI组件？

connect：连接React组件与redux store

connect方法接收两个参数：
- mapStateToProps是一个函数，建立一个state对象到props对象的映射关系（redux store里面的state可以通过UI组件的props获取）
- mapDispatchToProps建立一个store.dispatch方法到props对象的方法（redux里面action creators创建函数是我们想要通过props获取）

```javascript
//对APP组件进行处理，由处理之后的容器组件接收外界的数据(store)
import { connect } from 'react-redux';
//给app组件定义props属性的值
export default connect(
  state => ({
    //接收返回回来的state的值
    count: state
  }, {
    //专门处理dispatch函数
    increment, 
    decrement
  })
)(App);
```