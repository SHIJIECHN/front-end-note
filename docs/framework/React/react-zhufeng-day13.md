---
autoGroup-5: Hook
sidebarDepth: 3
title: useEffect
---

## useEffect

- 在函数主体内（这里指在React渲染阶段）改变DOM、添加订阅、设置计时器、记录日志以及执行其他包含副作用的操作都是不被允许的，因为这会产生不可预料的后果。
- 渲染阶段就是指在React执行render函数时，将虚拟DOM转换成真实DOM，然后插入到页面中的过程。
- 使用useEffect完成副作用操作。赋值给useEffect的函数会在组件渲染到屏幕之后执行，可以在这个函数中执行副作用操作。
- useEffect就是给函数组件增加了操作副作用的能力。它跟class组件中的componentDidMount、componentDidUpdate、componentWillUnmount三个声明周期作用相同，只不过被合并成了一个API。
- useEffect是一个函数，接收两个参数，第一个参数是回调函数，第二个参数是依赖项数组。
- useEffect执行的时机是DOM更新之后，也就是说在浏览器完成布局和绘制之后，会执行useEffect中的回调函数。

当页面挂载时，执行useEffect的回调函数，当页面更新时，也会执行useEffect的回调函数。执行useEffect的时候开启一个定时器，每个一秒更新一次数据，当页面更新时，又会执行useEffect的回调函数，这样就会开启多个定时器，导致页面更新速度加快。如何保证只开启一个定时器呢？
- 第一种方式设置依赖数组为空，说明不依赖任何变量，useEffect只会执行一次。此时发现页面中显示始终为1，因为闭包的原因，setInterval中的number变量始终是第一次渲染时的值0。修改setNumber，传入函数，函数的参数是上一次的状态，这样就可以保证每次更新都是最新的状态。

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

function Counter(){
  const [number, setNumber] = React.useState(0);
  // React.useEffect接收一个函数，这个函数会在组件挂载或者更新后执行
  React.useEffect(()=>{
    console.log('开启一个新的定时器');
    const timer = setInterval(()=>{
      console.log('执行定时器');
      setNumber(number=>number+1);
      }, 1000)
  },[])
  return (
    <p>{number}</p>
  )
}

ReactDOM.render(<Counter />, document.getElementById('root'));
```

- 第二种方式每次开启新的定时器之前，都要清除上一次的定时器。在useEffect的回调函数中返回一个函数。

```javascript

import React from 'react';
import ReactDOM from 'react-dom';

function Counter(){
  const [number, setNumber] = React.useState(0);
  // React.useEffect接收一个函数，这个函数会在组件挂载或者更新后执行
  React.useEffect(()=>{
    console.log('开启一个新的定时器');
    const timer = setInterval(()=>{
      console.log('执行定时器');
      setNumber(number=>number+1);
      }, 1000)
    return()=>{
      console.log('清空定时器', number);
      clearInterval(timer);
    }
  },[number])
  return (
    <p>{number}</p>
  )
}

ReactDOM.render(<Counter />, document.getElementById('root'));
```

## 实现

useEffect实现思路：
1. 在useEffect中开启一个宏任务，将callback放到宏任务中执行。
2. 下一次执行useffect时，先判断依赖项是否相同，如果不同，就执行销毁函数，然后开启一个新的宏任务，将callback放到宏任务中执行。

```javascript
/**
 * 
 * @param {*} callback 当前渲染完成之后下一个宏任务的回调
 * @param {*} deps 依赖数组
 */
export function useEffect(callback, deps){
  if(hookStates[hookIndex]){
    let [destroy, lastDeps] = hookStates[hookIndex];
    let everySame = deps.every((item,index)=>item === lastDeps[index]); // 判断依赖是否相同
    if(everySame){ // 如果依赖相同，就不执行callback
      hookIndex++;
    }else{ // 如果依赖不相同，就执行callback
      destroy && destroy(); // 销毁上一次的副作用
      setTimeout(()=>{ // 开启一个宏任务
        let desstroy = callback(); // 执行callback，返回一个销毁函数
        hookStates[hookIndex++] = [desstroy,deps]; // 保存销毁函数和依赖
      })
    }
  }else{
    // 初次渲染的时候，开启一个宏任务，在宏任务中执行callback，保存销毁函数和依赖数组
    setTimeout(()=>{ // 开启一个宏任务
      let desstroy = callback(); // 执行callback，返回一个销毁函数
      hookStates[hookIndex++] = [desstroy,deps]; // 保存销毁函数和依赖
    })
  }
}
```

