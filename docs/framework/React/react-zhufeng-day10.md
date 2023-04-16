---
autoGroup-5: Hook
sidebarDepth: 3
title: useCallback与useMemo
---

## useCallback 与 useMemo

作用多次渲染时，避免函数或者值的重复创建。

父组件发生更新，子组件也会更新。我们希望子组件只有在父组件传递的属性发生改变的时候才更新。

只使用React.memo。memo作用：属性如果改变组件才更新，如果不改变就不更新。无效。因为每次执行App，都会创建一个新的data对象和handleClick函数，所以每次执行App，data和handleClick都是不一样的，所以每次执行App，都会重新渲染Child组件。

```js
import React from 'react';
import ReactDOM from 'react-dom';

function Child({data, handleClick}){
  console.log('Child render');
  return <button onClick={handleClick}>{data.number}</button>
}

let MemoChild = React.memo(Child); 

function App(){
  console.log('App render');
  const [name, setName] = React.useState('zhufeng');
  const [number, setNumber] = React.useState(0);

  const data = {number};
  const handleClick = ()=> setNumber(number+1);
  return(
    <div>
      <input type='text' value={name} onChange={event=> setName(event.target.value)}/>
      <MemoChild data={data} handleClick={handleClick}/>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
```

需要使用useCallback和useMemo。
- useCallback作用：返回一个记忆的函数，只有依赖项发生改变才会重新创建函数。useCallback(fn, deps) 相当于 useMemo(() => fn, deps)。
- useMemo作用：返回一个记忆的值，只有依赖项发生改变才会重新计算值。useMemo(() => computeExpensiveValue(a, b), [a, b]) 相当于 class 组件中的 this.setState({a, b})。

```js
import React from 'react';
import ReactDOM from 'react-dom';

function Child({data, handleClick}){
  console.log('Child render');
  return <button onClick={handleClick}>{data.number}</button>
}

let MemoChild = React.memo(Child); 

function App(){
  console.log('App render');
  const [name, setName] = React.useState('zhufeng');
  const [number, setNumber] = React.useState(0);

  const data = React.useMemo(()=>({number}), [number]); // 依赖number，只有number变化，data才会变化
  const handleClick = React.useCallback(()=>setNumber(number+1), [number]); // 依赖number，只有number变化，handleClick才会变化
  return(
    <div>
      <input type='text' value={name} onChange={event=> setName(event.target.value)}/>
      <MemoChild data={data} handleClick={handleClick}/>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
```

## 实现

- useCallback实现思路
  - 首先判断`hookStates[hookIndex]`是否存在，如果存在说明不是第一次执行，而是更新，如果不存在说明是第一次执行。
  - 第一次执行，直接将callback和deps保存到`hookStates[hookIndex]`中，然后返回callback。
  - 更新的时候，取出上一次的callback和deps，然后判断deps是否相同，如果相同，就返回上一次的callback，如果不相同，就返回新的callback。
- useMemo实现思路
  - 首先判断`hookStates[hookIndex]`是否存在，如果存在说明不是第一次执行，而是更新，如果不存在说明是第一次执行。
  - 第一次执行，需要执行factory函数，得到返回值，然后将返回值和deps保存到`hookStates[hookIndex]`中，然后返回返回值。
  - 更新的时候，取出上一次的返回值和deps，然后判断deps是否相同，如果相同，就返回上一次的返回值，如果不相同，就执行factory函数，得到新的返回值，然后将新的返回值和deps保存到`hookStates[hookIndex]`中，然后返回新的返回值。

```js
export function useMemo(factory, deps){
  if(hookStates[hookIndex]){ // 说明不是第一次，而是更新
    let [lastMemo,lastDeps] = hookStates[hookIndex]; // 取出上一次的值和依赖
    let everySame = deps.every((item,index)=>item === lastDeps[index]); // 判断依赖是否相同
    if(everySame){ // 如果依赖相同，就返回上一次的值
      hookIndex++;
      return lastMemo;
    }else{ // 如果依赖不相同，就重新执行函数，得到新的值
      let newMemo = factory();
      hookStates[hookIndex++] = [newMemo,deps]; // 保存新的值和依赖
      return newMemo;
    }
  }else{ // 第一次执行
    let newMemo = factory(); // 执行函数，得到函数返回值
    hookStates[hookIndex++] = [newMemo,deps]; // 保存新的值和依赖
    return newMemo;
  }
}

export function useCallback(callback, deps){
  if(hookStates[hookIndex]){ // 说明不是第一次，而是更新
    let [lastCallback,lastDeps] = hookStates[hookIndex]; // 取出上一次的值和依赖
    let everySame = deps.every((item,index)=>item === lastDeps[index]); // 判断依赖是否相同
    if(everySame){ // 如果依赖相同，就返回上一次的值
      hookIndex++;
      return lastCallback;
    }else{ // 如果依赖不相同，就重新执行函数，得到新的值
      hookStates[hookIndex++] = [callback,deps]; // 保存新的值和依赖
      return callback;
    }
  }else{ // 第一次执行
    hookStates[hookIndex++] = [callback,deps]; // 保存新的值和依赖
    return callback;
  }
}
```