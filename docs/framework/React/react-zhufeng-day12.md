---
autoGroup-5: Hook
sidebarDepth: 3
title: useContext
---

## useContext

React.useContext作用是获取到Provider组件的value属性。是Consumer的简化版。

hooks的本质是函数，所以可以在任何地方使用。

基本使用：

```javascript
import React from './react';
import ReactDOM from './react-dom';

let CounterContext = React.createContext();

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
  let {state,dispatch} = React.useContext(CounterContext);
  return (
    <div>
      <p>{state.number}</p>
      <button onClick={()=>dispatch({type:'ADD'})}>+</button>
      <button onClick={()=>dispatch({type:'MINUS'})}>-</button>
    </div>
  )
}

function App(){
  const [state, dispatch] = React.useReducer(reducer, {number:0});
  return (
    <CounterContext.Provider value={{state, dispatch}}>
      <Counter/>
    </CounterContext.Provider>
  )
}


ReactDOM.render(<App />, document.getElementById('root'));
```

## 实现

```javascript
/**
 * useContext方法
 * @param {*} context React.createContext()返回的对象
 * @returns 返回值就是Provider组件的value属性
 */
function useContext(context){
  return context._currentValue;
}
```