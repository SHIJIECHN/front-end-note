---
autoGroup-5: Hook
sidebarDepth: 3
title: useLayoutEffect 与 useRef
---

## useLayoutEffect 与 useRef

useLayoutEffect 与 useEffect 的区别是，useLayoutEffect 会在 DOM 更新之后同步调用 effect，而 useEffect 会在 DOM 更新之后异步调用 effect。

useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变。
useRef与createRef的区别是: useRef始终返回同一个对象，而createRef每次渲染都会返回一个新的对象。

useLayoutEffect 的使用场景是，当我们需要在 DOM 更新之后同步获取 DOM 信息时，可以使用 useLayoutEffect。

基本使用：

```javascript

import React from './react';
import ReactDOM from './react-dom';

const Animation = ()=>{
  const ref = React.useRef(); //{current: null}
  // 使用useEffect会有一个移动的过程，因为useEffect是在绘制之后执行的
  // React.useEffect(()=>{
  //   ref.current.style.WebkitTransform = 'translate(500px)'; // 给ref.current添加一个动画，位移500px
  //   ref.current.style.transition = 'all 500ms'; // 有个渐变动画 500ms完成
  // });
  // useLayoutEffect会在绘制之前执行，所以没有移动的过程
  React.useLayoutEffect(()=>{
    ref.current.style.WebkitTransform = 'translate(500px)'; // 给ref.current添加一个动画，位移500px
    ref.current.style.transition = 'all 500ms'; // 有个渐变动画 500ms完成
  });
  let style = {
    width: '100px',
    height: '100px',
    background: 'red'
  }
  return <div style={style} ref={ref}>内容</div>
}
ReactDOM.render(<Animation />, document.getElementById('root'));

```

## 实现

```javascript
/**
 * 
 * @param {*} callback 当前渲染完成之后下一个微任务的回调
 * @param {*} deps 依赖数组
 */
export function useLayoutEffect(callback, deps){
  if(hookStates[hookIndex]){
    let [destroy, lastDeps] = hookStates[hookIndex];
    let everySame = deps.every((item,index)=>item === lastDeps[index]); // 判断依赖是否相同
    if(everySame){ // 如果依赖相同，就不执行callback
      hookIndex++;
    }else{ // 如果依赖不相同，就执行callback
      destroy && destroy(); // 销毁上一次的副作用
      queueMicrotask(()=>{ // 开启一个微任务
        let desstroy = callback(); // 执行callback，返回一个销毁函数
        hookStates[hookIndex++] = [desstroy,deps]; // 保存销毁函数和依赖
      })
    }
  }else{
    queueMicrotask(()=>{ // 开启一个宏任务
      let desstroy = callback(); // 执行callback，返回一个销毁函数
      hookStates[hookIndex++] = [desstroy,deps]; // 保存销毁函数和依赖
    })
  }
}

/**
 * useRef的实现
 * @returns {current: null}
 */
export function useRef(){
  if(hookStates[hookIndex]){
    return hookStates[hookIndex++];
  }else{
    hookStates[hookIndex] = {current: null};
    return hookStates[hookIndex++];
  }

}
```