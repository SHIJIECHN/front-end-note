---
autoGroup-2: Hook
sidebarDepth: 3
title: Hook 简介
---

## 动机
> 使用Hook的原因

1. 解决在组件之间复用状态逻辑很难的问题。Hook提供在无需修改组件结构的情况下复用状态逻辑。
2. 将组件中相互关联的部分拆分成更小的函数，解决复杂中难以理解的逻辑。
3. class组件中this指向的问题

> Hook是什么？

它是一个简单的函数，函数组件在执行的时候能够给函数组件添加一些特殊的功能

## setState()

```javascript
function App() {
  const [count, setCount] = useState(0);
  console.log(useState(1)); // [1, f] 一个数值1 和函数f


  return (
    <div className="App">
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>Click</button>
    </div>
  );
}
```

### 1。 声明State变量
```javascript
import {setState} from 'react'
// 声明count的state变量
const [count, setCount] = setState(0);
```

> useState需要哪些参数

唯一的参数就是初始state

> useState方法的返回值

返回值为数组，包括：当前state以及更新state的函数。需要成对的获取它们。
```javascript
console.log(useState(1)); // [1, f] 一个数值1 和函数f
```

### 2. 读取与更新State
```javascript
// 读取State
<p>{count}</p>

// 更新State
<button onClick={()=>setCount(count+1)}>Click</button>
```

## setEffect()


