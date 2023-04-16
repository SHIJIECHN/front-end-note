---
autoGroup-5: Hook
sidebarDepth: 3
title: useState
---

## useState

- useState是一个函数，接收一个初始值，返回一个数组，数组中有两个元素，第一个是状态值，第二个是修改状态值的函数。
- 与setState不同的是，useState不会自动合并状态，而是直接替换。

useState的实现：

- 定义两个全局变量hookStates和hookIndex
  - hookStates保存状态的数组，存放的是每个组件的状态
  - hookIndex当前的hook索引
- 执行useState的时候，会先判断hookState是否有值，如果有值，就直接返回，如果没有值，就将初始值赋值给hookStates。
- 执行setNumber1时，如何确定currentIndex的值呢？setState在创建的时候将currentIndex的值也进行了保存。
- 定义scheduleUpdate调度更新方法，执行scheduleUpdate方法时，将hookIndex重置为0，因为compareTwoVdom时将会执行Counter组件，会再次执行useState方法。

  
```javascript
let index = 0;
function state(){
    let currentIndex = index;
    function setstate(){
        console.log('currentIndex:', currentIndex);
    }
    index++;
    return setstate;
}

let fn1 = state()
let fn2 = state()
let fn3 = state()
fn1(); // currentIndex: 0
fn2(); // currentIndex: 1
fn3(); // currentIndex: 2
```

```javascript
let scheduleUpdate = null; // 调度更新的方法
let hookStates = []; // 保存状态的数组，存放的是每个组件的状态
let hookIndex = 0; // 当前的hook索引
/**
 * 把虚拟DOM转成真实DOM，插入到容器中
 * @param {*} vdom 虚拟DOM
 * @param {*} container 容器
 */
function render(vdom, container) {
  // 将组件的挂载和更新分开
  mount(vdom,container); // 1. 挂载
  scheduleUpdate = () => { // 2. 更新
    hookIndex = 0; // 每次更新都要把索引重置为0
    compareTwoVdom(container,vdom,vdom); // 比较新旧根元素虚拟DOM。深度对比
  }
}

/** 挂载 */
function mount(vdom,container){
  let newDOM = createDOM(vdom);
  container.appendChild(newDOM);
  if (newDOM.componentDidMount) newDOM.componentDidMount();
}

/**
 * useState的实现: 保存状态，返回状态和更新状态的方法。更新就调用scheduleUpdate
 * @param {*} initialState 
 * @returns 
 */
export function useState(initialState){
  hookStates[hookIndex] = hookStates[hookIndex] || initialState; // 如果没有值，就用初始值
  let currentIndex = hookIndex; // 保存当前的索引
  function setState(newState){ // 更新状态的方法
    hookStates[currentIndex] = newState; // 覆盖掉老的状态
    scheduleUpdate(); // 调度更新
  }
  return [hookStates[hookIndex++],setState]; // 返回状态和更新状态的方法
}
```

## useState使用

```javascript
import React from './react';
import ReactDOM from './react-dom';

ReactDOM.render(<Counter />, document.getElementById('root'));

function Counter(){
  let [number2, setNumber2] = React.useState('a');
  let [number1, setNumber1] = React.useState(0);
  let [number3, setNumber3] = React.useState('A');
  const handleClick = ()=>{
    setNumber1(number1 + 1);
  }
  return (
    <div>
      <p>{number1}</p>
      <p>{number2}</p>
      <p>{number3}</p>
      <button onClick={handleClick}>+</button>
    </div>
  )
}
```

