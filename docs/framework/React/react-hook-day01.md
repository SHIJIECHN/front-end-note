---
autoGroup-2: Hook
sidebarDepth: 3
title: 1. Hook动机与useState
---

## 动机

::: theorem 类组件的缺点

1. 组件数据状态逻辑不能重用、组件之间传值过程复杂。
   1. “组件数据状态逻辑不能重用”：由于类组件中的组件数据状态state必须卸载该组件构造函数的内部，无法将state抽离出组件，因此别的组件有类似state逻辑，也必须自己实现一次。
   2. “组件之间传值过程复杂”：React本身为单向数据流，即父组件可以传值给子组件，但子组件不允许直接修改父组件中的数据状态。子组件为了达到修改父组件中的数据状态，通常采用“高阶组件（HOC）”或“父组件暴露修改函数给子组件（render props）”这两种方式。这两种方式都会让组件变得复杂。
2. 复杂场景下代码难以组织在一起。
   1. 数据获取与事件订阅分散在不同的生命周期函数中。
   2. 内部state数据只能是整体，无法被拆分更细致。
3. 复杂且不容易理解的this。例如事件处理函数都需要bind(this)才可以正确执行，想获取某些自定义属性都需要使用this.state.xxx或this.props.xxx.
:::

::: theorem Hook如何解决上述问题
1. 通过自定义`Hook`，可以将数据状态逻辑从组件中抽离出去，这样同一个`Hook`可以被多个组件使用
2. 通过`React`内置的`useEffect`函数，将不同数据分别从`this.state`中独立拆分出去
3. 函数组件和普通`JS`函数非常类似，在普通函数中定义的变量、方法都可以不使用`this`，而直接使用该变量或函数。因此可以不用去关心`this`。
:::

::: theorem Hook 是什么？
它是一个简单的函数，函数组件在执行的时候能够给函数组件添加一些特殊的功能
:::

## setState()

```javascript
// 声明一个叫 count 的 state变量。
  // 第一个元素是定义的变量名，第二个元素为修改该变量对应的函数名称
const [count, setCount] = useState(0); // 返回一个数组
console.log(useState(1)); // [1, f] 一个数值1和函数f

setCount(newValue);// 修改count的值
```

setCount采用“异步直接赋值”的形式，并不会像类组件中的setState()那样做“异步对比累加赋值”。

“直接赋值”：

1. 对于简单的数据类型，比如number、string类型，可以直接通过setCount(newValue)直接进行赋值。
2. 对于复杂类型数据，如array、object类型，若想修改其中某一个属性值而不影响其他属性，则需要先复制出一份，修改某属性后再整体赋值。

### 1. 声明State变量
```javascript
import {setState} from 'react'
// 声明count的state变量
const [count, setCount] = setState(0);
```

::: theorem useState需要哪些参数
唯一的参数就是初始默认值
:::

::: theorem useState方法的返回值
返回值为数组，包括：当前`state`以及更新`state`的函数。需要成对的获取它们。
:::

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
 * 打印结果说明：
 * 1. 每次点击任意按钮都会打印一次render，说明每次执行setCount函数时，都会重新加载app组件
 * 2. useState钩子函数一直被复用，但返回的都是不同的结果
 * 3. 返回的结果并不影响其他的结果，互不干扰
 */
```

> 当使用多个`useState hook`的时候，如何将运行的钩子`useState`与视图对应起来？如点击`Click1`，怎么知道对应哪个`useState`中的数值？

根据`useState`出现的顺序来确定的。

在每一次渲染`app`组件的时候，都会有一个记忆单元格（状态数组）
```javascript
[
  ()=>({count1, setCount1}),
  ()=>({count2, setCount2}),
  ()=>({count3, setCount3})
]
```
当调用`useState`函数时，会将初始值、状态、修改状态的函数存放到一个单元格，然后将指针往下移动，再次调用`useState`函数时，再次保存一个单元格，指针往下移动，以此类推。

::: theorem Hook 有什么规则
1. 只在最顶层使用`Hook`
2. 不在循环、条件或嵌套函数中使用
3. 只在`React`函数中调用`Hook`
:::

### 4. 惰性初始state
`initialState`参数只会在组件的初始渲染中起作用，后续渲染时会被忽略
```javascript
// 初始值是函数
// 一般情况下,数据更改时组件内部程序是会反复执行，想要只运行一次时可以使用惰性初始化state
  const [counter, setCounter] = useState(() => {
    const initalState = someExpensiveComputation(props);
    return initialState;
  });
```

### 5. 注意点

::: theorem 使用`useState`注意事项：
1. 使用`useState`返回的数组中的第二个元素是修改状态的函数，也是唯一的函数（引用是一致的）
2. 在函数组件中，`setCount()`的参数：
   1. 是原始值且没有发生改变时，组件不会重新加载，
   2. 是引用值且没有发生更改时，组件会重新加载，以上基于`Object.is`算法
3. 在类组件中，不管是原始值还是引用值，组件都重新加载
4. 函数组件更新，会保存上一次的`state`和最新的`state`的返回值
5. 多次使用`setCount`函数会合并只会加载一次组件
6. 类组件`state`合并，函数组件中`state`不会合并对象
:::


代码分析：

1. 使用`useState`返回的数组中的第二个元素是修改状态的函数，也是唯一的函数（引用是一致的）
```javascript
// 定义全局变量arr
window.arr = []
function App() {
  const [count, setCount] = useState(0);
  console.log('render');
  window.arr.push(setCount); // 每次push的setCount都是同一个函数引用
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Click</button>
    </div>
  )
}

```
控制台中打印`arr`数组，包含一个f函数，点击`Click`，再打印`arr`，`arr= [f,f]`，其中`arr[0]=== arr[1]`为`true`。说明`setCount`是唯一的引用。

2. 在函数组件中，`setCount()`的参数：
   1. 是原始值且没有发生改变时，组件不会重新加载，
   2. 是引用值且没有发生更改时，组件会重新加载，以上基于`Object.is`算法
   
```js

function App() {
  const [count, setCount] = useState(0);
  const [obj, setObj] = useState({});
  console.log('render')
  return (
    <div>
      {/* 点击button，修改count或obj的值 */}
      <button onClick={() => setCount(count)}>Btn1</button>
      <button onClick={() => setObj({})}>Btn2</button>
    </div>
  )
}
```
点击`Btn1`，页面不会重新加载；点击`Btn2`，页面每次都会重新加载。

4. 函数组件更新同时保存上一次的`state`和最新的`state`的返回值

如果新的`count`需要通过使用先前的`count`计算得出，那么可以将函数传递给`setCount`。该函数将接收先前的`count`，并返回一个更新后的值。
```javascript
console.log('render')
const handleClick = () => {
  setCount(count => count + 1);
  setCount(count => {
    // count是上一个setCount执行后的count结果，即更新后的count
    console.log('setCount : ' + count); // 1
    return count + 1;
  });
  console.log('handleClick: ' + count); // 0 setCount是异步修改的，此时count还是原来的值
}
console.log(count); // 2
/**
 * handleClick : 0
 * setCount: 1
 * render
 * 2
 */
```

5. 多次使用`setCount`函数会合并只会加载一次`app`组件
```javascript
function App() {
  const [count, setCount] = useState(0);
  console.log('render');

  const handleClick = () => {
    // 两次setCount会合并执行，就相当于 setCount(count + 1)
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

6. 类组件`state`合并，函数组件中`state`不会合并对象

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
/**
  首次渲染输出：
  render
  {count: 1}
  
  点击后渲染：
  render
  {count1: 2}
 */

// 类组件
class App extends Component {
  state = {
    count: 1
  }
  render() {
    console.log(this.state);
    return (
      // 点击按钮state对象会新增一个属性count1，state= {count: 1, count1: 2}
      <button onClick={() => this.setState({ count1: 2 })}>Click</button>
    )
  }
}
/**
首次渲染输出：{count: 1}
点击后渲染：{count: 1, count1: 2}
 */
```

## 总结
1. 储存的原理
2. 更新是通过Object.is来比较的
3. 多次渲染有合并的过程，存在两个state