---
autoGroup-1: Redux
sidebarDepth: 3
title: Redux(珠峰)
---

## 1. Redux应用场景

- 随着Javascript单页应用开发日趋复杂，管理不断变化的state非常困难
- Redux的出现就是为了解决state李的数据问题
- 在Redux中，数据在组件中式单向流动的
- 数据从一个方向父组件流向子组件（通过props），由于这个特征，两个非父子关系的组件（或者称为兄弟组件）之间的通信就比较麻烦

基本实现：

1. state就是状态
2. getState()获取状态
3. dispatch(action)派发动作，动作是一个对象，必须有一个type属性，表示动作的类型
4. subscribe(listener)订阅状态变化事件
5. dispatch({type: 'INCREMENT'})初始化状态


```javascript
/**
 * 创建仓库的工厂方法，返回一个仓库，仓库就是一个JS对象，包含了应用的状态和一些方法
 * @param {*} reducer 根据老状态和动作计算下一个新状态
 */

export const createStore = (reducer)=>{
    let state; // 可以存放任意的内容
    let listeners = [];
    function getState(){
        return state;
    }
    function dispatch(action){
        state = reducer(state, action);
        listeners.forEach(listener=>listener());
    }
    function subscribe(listener){
        listeners.push(listener);
    }
    dispatch({type: '@@REDUX/INIT'})
    return {
        getState,
        dispatch,
        subscribe
    }
}
```

## 2. Redux的基本使用

目录结构：

```javascript
├── package-lock.json
├── package.json
├── public
│   └── index.html
└── src
    ├── components
    │   └── Counter1.js
    ├── index.js
    ├── redux
    │   └── index.js
    └── store
        └── index.js
```

:::: tabs
::: tab index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import Counter1 from './components/Counter1';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Counter1/>
  </React.StrictMode>
);
```
:::
::: tab store/index.js
```javascript
import {createStore} from '../redux';
/**
 * 处理器函数
 * @param {*} state 老状态
 * @param {*} action 动作对象，也是一个普通的JS对象，必须有一个type属性，用来标识你要做什么
 */
let initialState = { number:0}
function reducer(state=initialState, action){
  switch(action.type){
    case 'ADD':
      return {number: state.number+1};
    case 'MINUS':
      return {number: state.number-1};
    default:
      return state;
  }
}

let store = createStore(reducer);

export default store;
```
:::   
::: tab components/Counter1.js
```javascript
import React from 'react'
import store from '../store'

class Counter1 extends React.Component{
    state = {
        number: 0
    }
    componentDidMount(){
        this.unsubscribe = store.subscribe(()=>{
            this.setState({
                number: store.getState().number
            })
        })
    }
    componentWillUnmount(){
        this.unsubscribe();
    }
    render(){
        return (
            <div>
                <p>{this.state.number}</p>
                <button onClick={()=> store.dispatch({type: 'ADD'})}>+</button>
                <button onClick={()=> store.dispatch({type: 'MINUS'})}>-</button>
            </div>
        )
    }
}

export default Counter1;
```
:::   
::: tab redux/index.js
```javascript

/**
 * 创建仓库的工厂方法，返回一个仓库，仓库就是一个JS对象，包含了应用的状态和一些方法
 * @param {*} reducer 根据老状态和动作计算下一个新状态
 */

export const createStore = (reducer)=>{
    let state; // 可以存放任意的内容
    let listeners = [];
    function getState(){
        return state;
    }
    function dispatch(action){
        state = reducer(state, action);
        listeners.forEach(listener=>listener());
    }
    function subscribe(listener){
        listeners.push(listener);
        return ()=>{
            // listeners = listeners.filter(item=>item!==listener); // 取消订阅listener
            let index = listeners.indexOf(listener);
            listeners.splice(index, 1);
        }
    }
    dispatch({type: '@@REDUX/INIT'})
    return {
        getState,
        dispatch,
        subscribe
    }
}
```
:::   
::::

