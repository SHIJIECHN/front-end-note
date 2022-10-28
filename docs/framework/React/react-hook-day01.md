---
autoGroup-2: Hook
sidebarDepth: 3
title: Hook动机与useState
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

唯一的参数就是初始默认值

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

### 3. 使用多个state
```javascript
function App() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);

  console.log('render')
  return (
    <div className="App">
      <h1>You Clicked {count1} times.</h1>
      <h1>You Clicked {count2} times.</h1>
      <h1>You Clicked {count3} times.</h1>
      <button onClick={() => setCount1(count1 + 1)}>Click1</button>
      <button onClick={() => setCount2(count2 + 1)}>Click2</button>
      <button onClick={() => setCount3(count3 + 1)}>Click3</button>
    </div>
  );
}

/**
 * 打印结果说明：加载
 * 1. 每次点击任意按钮都会打印一次render，说明每次执行setCount函数时，都会重新加载app组件
 * 2. useState钩子函数一直被复用，但返回的都是不同的结果
 * 3. 返回的结果并不影响其他的结果，互不干扰
 */
```

> 当使用多个useState hook的时候，如何将运行的钩子useState与视图对应起来？如点击Click1，怎么知道对应哪个useState中的数值？

根据useState出现的顺序来确定的。

在每一次渲染app组件的时候，都会有一个记忆单元格（状态数组）
```javascript
[
  ()=>({count1, setCount1}),
  ()=>({count2, setCount2}),
  ()=>({count3, setCount3})
]
```
当调用useState函数时，会将初始值、状态、修改状态的函数存放到一个单元格，然后将指针往下移动，再次调用useState函数时，再次保存一个单元格，指针往下移动，以此类推。

> Hook 有什么规则

1. 只在最顶层使用Hook
2. 不在循环、条件或嵌套函数中使用
3. 只在React函数中调用Hook

### 4. 惰性初始state
initialState参数只会在组件的初始渲染中起作用，后续渲染时会被忽略
```javascript
//初始值是函数
//一般情况下,数据更改时组件内部程序是会反复执行，想要只运行一次时可以使用惰性初始化state
  const [counter, setCounter] = useState(() => {
    const initalState = someExpensiveComputation(props);
    return initialState;
  });
```

### 5. 注意点
使用useState注意事项：
1. 使用useState返回的数组中的第二个元素是修改状态的函数，也是唯一的函数（引用是一致的）
2. 在函数组件中，当setCount()的参数是原始值且没有发生改变时，app组件不会重新加载，但是参数是引用值且没有发生更改时，app组件会重新加载，以上基于Object.is算法
3. 在类组件中，不管是原始值还是引用值，app组件也是会重新加载
4. 函数组件更新同时保存上一次的state和最新的state的返回值
5. 多次使用setCount函数会合并只会加载一次app组件
6. 类组件state合并，函数组件中state不会合并对象


代码分析：
1. 使用useState返回的数组中的第二个元素是修改状态的函数，也是唯一的函数（引用是一致的）
```javascript
// 定义全局变量arr
window.arr = []
function App() {
  const [count, setCount] = useState(0);
  console.log('render');
  window.arr.push(setCount)
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Click</button>
    </div>
  )
}

```
控制台中打印arr数组，包含一个f函数，点击Click，再打印arr，arr= \[f,f]，其中arr\[0]=== arr\[1]为true。说明setCount是唯一的引用。

2. 在函数组件中，当setCount()的参数是原始值且没有发生改变时，app组件不会重新加载，但是参数是引用值且没有发生更改时，app组件会重新加载，以上基于Object.is算法
```js

function App() {
  const [count, setCount] = useState(0);
  const [obj, setObj] = useState({});
  console.log('render')
  return (
    <div>
      <button onClick={() => setCount(count)}>Btn1</button>
      <button onClick={() => setObj({})}>Btn2</button>
    </div>
  )
}
```
点击Btn1，页面不会重新加载；点击Btn2，页面每次都会重新加载。

4. 函数组件更新同时保存上一次的state和最新的state的返回值

如果新的count需要通过使用先前的count计算得出，那么可以将函数传递给setCount。该函数将接收先前的count，并返回一个更新后的值。
```javascript
const handleClick = () => {
  setCount(count => count + 1);
  setCount(count => {
    // count是上一个setCount执行后的count结果，即更新后的count
    console.log('setCount : ' + count)
    return count + 1;
  });
  console.log('handleClick: ' + count);
}
/**
 * handleClick : 0
 * setCount: 1
 * render
 * 2
 */
```
5. 多次使用setCount函数会合并只会加载一次app组件
```javascript
function App() {
  const [count, setCount] = useState(0);
  console.log('render');

  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);
    console.log('handleClick: ' + count);
  }

  console.log(count);
  return (
    <div>
      <button onClick={handleClick}>Btn1</button>
    </div>
  )
}
/**
 * 点击后，输出
 * handleClick: 0  
 * render 
 * 1
 * setCount函数更新变量是以闭包的形式
 * 说明此时传入setCount的count参数是由handleClick外部函数提供的
 */
```

6. 类组件state合并，函数组件中state不会合并对象
```javascript
// 函数组件
function App() {
  const [counter, setCounter] = useState({ count: 1 });
  console.log('render');

  console.log(counter);
  return (
    <div>
      {/* 点击一次按钮，新增count1属性，counter.count没有了 */}
      <button onClick={() => setCounter({ count1: 2 })}>Btn1</button>
    </div>
  )
}

// 类组件
class App extends Component {
  state = {
    count: 1
  }
  render() {
    return (
      // 点击按钮state对象会新增一个属性count1，state= {count: 1, count1: 2}
      <button onClick={() => this.setState({ count1: 2 })}>Click</button>
    )
  }
}
```

## 总结
1. 储存的原理
2. 更新是通过Object.is来比较的
3. 多次渲染有合并的过程，存在两个state