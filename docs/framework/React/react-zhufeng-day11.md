---
autoGroup-5: Hook
sidebarDepth: 3
title: useReducer
---

## useReducer

- useSate的替代方案，可以处理复杂的状态逻辑，比如状态依赖于之前的状态等。
- useReducer接收一个形如(state,action)=>newState的reducer，并返回当前的state以及与其配套的dispatch方法。
- reducer是一个纯函数，接收旧的state和action，返回新的state。
- state是当前的状态，action是一个对象，包含type和payload两个属性，type表示动作的类型，payload表示动作的数据。
- 适用场景：当状态逻辑复杂且包含多个子值时，或者下一个状态依赖于之前的状态时，使用useReducer比useState更适用。
  

基本用法：

```javascript
import React from './react';
import ReactDOM from './react-dom';
// state是一个对象，action是一个动作对象，必须有一个type属性，表示动作的类型
// reducer是一个纯函数，接收旧的state和action，返回新的state
function reducer(state, action){
  switch(action.type){
    case 'ADD':
      return {number:state.number+1};
    case 'MINUS':
      return {number:state.number-1}
    default:
      return state;
  }
}

function Counter(){
  // dispatch是一个函数，可以派发动作，动作对象里面必须有一个type属性
  const [state, dispatch] = React.useReducer(reducer,{number:0})
  return (
    <div>
      <p>{state.number}</p>
      <button onClick={()=>dispatch({type:'ADD'})}>+</button>
      <button onClick={()=>dispatch({type:'MINUS'})}>-</button>
    </div>
  )
}


ReactDOM.render(<Counter />, document.getElementById('root'));
```

## useReducer实现

实现思路： dispatch方法会触发更新，更新时会调用reducer方法，reducer方法会返回新的状态，然后更新视图。

```javascript
export function useReducer(reducer,initialState){
  hookStates[hookIndex] = hookStates[hookIndex] || initialState; // 如果没有值，就用初始值
  let currentIndex = hookIndex; // 保存当前的索引
  function dispatch(action){ // 更新状态的方法
    hookStates[currentIndex] = reducer(hookStates[currentIndex],action); // 覆盖掉老的状态
    scheduleUpdate(); // 调度更新
  }
  return [hookStates[hookIndex++],dispatch]; // 返回状态和更新状态的方法
}
```