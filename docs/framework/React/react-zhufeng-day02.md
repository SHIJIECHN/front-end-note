---
autoGroup-4: React基础
sidebarDepth: 3
title: 组件的渲染
---

## 函数组件

- 函数组件其实是一个函数，接收一个props，返回一个React元素

```javascript
import React from './react';
import ReactDOM from './react-dom';

function FunctionWelcome(props) {
  return return <h1>hello, {props.name}</h1>
}
let element = React.createElement(FunctionWelcome, { name: 'zf' })
console.log(element)
ReactDOM.render(element, document.getElementById('root'));
```

函数组件返回的类型type是一个函数，通过判断type来单独处理函数组件。
```javascript
{ 
  "$$typeof" :  Symbol(react.element)
  "key": null,
  "ref": null,
  "props": {
      "name": "zf"
  },
  "type": ƒ FunctionWelcome(props)
}
```

react-dom.js

思路：
1. 通过判断type是否为function
2. 使用mountFunctionComponent处理函数组件
   - 执行函数组件返回React元素，这里使用React.createElement直接返回了虚拟DOM，因为JSX转虚拟DOM比较复杂
   - 在利用createDOM处理虚拟DOM，转成真实DOM

```javascript
function createDOM(vdom) {
  let { type, props } = vdom;
  let dom;// 1. 先获取到真实DOM元素
  if (type === REACT_TEXT) { // 如果是一个文本元素，就创建一个文本节点
    dom = document.createTextNode(props.content);
  } else if (typeof type === 'function') { // 说明是一个React函数组件的React元素
    return mountFunctionComponent(vdom); // 挂载函数组件   
  }
  else {
    dom = document.createElement(type); // 原生DOM类型
  }
  // other code... 
  return dom;
}

/**
 * 也要返回真实DOM。执行函数组件得到返回的React元素，在把React元素转成真实DOM返回
 * @param {*} props 
 */
function mountFunctionComponent(vdom) {
  let { type, props } = vdom;
  let renderVdom = type(props); // type就是组件。这里是执行函数组件，返回虚拟DOM，我们使用的是React.createElement
  return createDOM(renderVdom);
}
```

## 类组件

- 组件分为内置组件和自定义组件
  - 内置组件：p h1 span，type是字符串
  - 自定义组件：类型是一个函数。类组件的原型上有一个属性isReactComponent={}

```javascript
class ClassComponent extends React.Component {
  render() {
    return (
      // 这里不写React.createElement，项目在运行的时候，会自动调用React.createElement
      <h1 className='title' style={{ color: 'red' }}><span>hello</span>{this.props.name}</h1>
      // React.createElement(
      //   'h1',
      //   { className: 'title', style: { color: 'red' } },
      //   React.createElement('span', {}, 'hello'),
      //   this.props.name
      // )
    )
  }
}
```

由于类组件需要继承React.Component类，所以我们新建一个类Component
```javascript
export class Component {
  static isReactComponent = true; // 源码写法Component.prototype.isReactComponent = {}
  constructor(props) {
    this.props = props;
  }
}
```

在React对象中导出Component类。修改react.js

```javascript
import { Component } from './Component';

// other code

const React = {
  createElement,
  Component // 导出
}
```

渲染时对类组件进行处理，函数组件与类组件的type都是function，两者的区别可以通过isReactComponent来判断。类组件有isReactComponent属性，而函数组件上没有。

react-dom.js

```javascript
function createDOM(vdom) {
  let { type, props } = vdom;
  let dom;
  if (type === REACT_TEXT) { // 文本节点
    dom = document.createTextNode(props.content);
  } else if (typeof type === 'function') { // 组件
    if (type.isReactComponent) { // 类组件
      return mountClassComponent(vdom);
    } else { // 函数组件
      return mountFunctionComponent(vdom); // 挂载函数组件  
    }
  } else { // 元素节点
    dom = document.createElement(type); // 原生DOM类型
  }
  
  // other code
  return dom;
}

/** 类组件挂载 */
function mountClassComponent(vdom) {
  const { type, props } = vdom;
  const classInstance = new type(props); // 实例化组件
  let renderVdom = classInstance.render(); // 调用render方法，返回虚拟DOM
  return createDOM(renderVdom);
}
```

## 类组件的状态

- 类组件的数据来源有两个地方：父组件传过来的属性，自己内容的状态
- 属性和状态发生变化后组件都会更新，属性都会渲染
- 定义state的地方：一种在构造函数中定义组件的状态this.state={}，第二种在构造函数外面state={}
- 使用setState更新组件状态。setState可以修改状态，还可以让组件刷新

下面案例：
1. 组件挂载完成componentDidMount，就执行计时器，每秒执行一次。计时器调用this.tick执行，每秒更新一次state状态
2. 组件卸载时componentWillUnmount，将计时器清除

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    }; // 唯一可以给状态赋值的地方就是构造函数
  }
  // 组件挂载完成
  componentDidMount() {
    this.timer = setInterval(this.tick, 1000);
  }
  // 组件将要卸载
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  // 类的属性，这样写法函数里的this永远指向组件的实例
  tick = () => {
    // 修改状态
    this.setState({ date: new Date() })
  }
  render() {
    return (
      <div>
        <h1>Hello world</h1>
        <h2>现在时间是：{this.state.date.toLocaleString()}</h2>
      </div>
    )
  }
}

ReactDOM.render(<Clock />, document.getElementById('root'));
```

## 类组件状态的更新

* state的更新可能是异步的
* 出于性能考虑React可能会把多个setState合并成同一个调用
* 在事件处理函数中，setState的调用会批量执行，此时setState并不会修改this.state，等事件处理结束后再进行更新

1. setState异步修改状态：

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

class Counter extends React.Component {
  state = { number: 0 }

  handleClick = () => {
    // 异步批量执行
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number); // 0
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number); // 0
  }

  render() {
    return (
      <div>
        {/* 点击按钮，页面展示 1 */}
        <p>{this.state.number}</p> 
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}
ReactDOM.render(<Counter />, document.getElementById('root'));
```

2. setState还可以传入函数

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

class Counter extends React.Component {
  state = { number: 0 }

  handleClick = () => {
    // setState传入函数: state为老的状态。每次传入的state状态都是上一次修改过的状态
    this.setState((state) => ({ number: state.number + 1 }))
    console.log(this.state.number); // 0
    this.setState((state) => ({ number: state.number + 1 }));
    console.log(this.state.number); // 0
  }

  render() {
    return (
      <div>
        {/* 点击按钮，页面展示 2 */}
        <p>{this.state.number}</p> 
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}
ReactDOM.render(<Counter />, document.getElementById('root'));
```

模拟上面执行过程是这样的：用一个队列保存，遍历队列
```javascript
let queue = [];
queue.push((state) => ({ number: state.number + 1 }))
queue.push((state) => ({ number: state.number + 1 }))
let state = { number: 0 }
let result = queue.reduce((state, action) => {
  return action(state)
}, state);
console.log(result); // { number: 2 }
```

3. setTimeout里面执行，变成同步

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

class Counter extends React.Component {
  state = { number: 0 }

  handleClick = () => {
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number); // 0
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number); // 0
    setTimeout(() => {
      // 在其他React不能管控的地方，就是同步执行的
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number); // 2
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number); // 3
    })
  }

  render() {
    return (
      <div>
        {/* 点击按钮，页面展示 3 */}
        <p>{this.state.number}</p> 
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}
ReactDOM.render(<Counter />, document.getElementById('root'));
```

::: theorem 如何判断它是同步还是异步，或者是不是批量？
1. 凡是React能管控的地方，都是批量的，异步的。事件处理函数、声明周期函数
2. 不能管控的地方就是同步的，非批量的。setInterval setTimeout 元素DOM事件 
::: 

## 模拟setState执行原理

- 使用isBatchingUpdate控制是否批量处理
- 

```javascript
let isBatchingUpdate = false;

let queue = [];
let state = { number: 0 }
function setState(newState) {
  if (isBatchingUpdate) { // 是批量，异步更新
    queue.push(newState)
  } else { // 不是批量，同步更新
    state = { ...state, ...newState }
  }
}

function handleClick() {
  isBatchingUpdate = true; // 为true 变成批量的

  /** 这是我们自己的逻辑 开始 */
  setState({ number: state.number + 1 });
  console.log(state); // { number: 0 }
  setState({ number: state.number + 1 });
  console.log(state); // { number: 0 }
  /** 这是我们自己的逻辑 结束 */

  state = queue.reduce((newState, action) => { // 队列清空
    // return action(newState) // 非批量，当传入参数为函数时
    return { ...newState, ...action } // 批量
  }, state)
}

handleClick();
console.log(state); // { number: 1 }
```

## setState的实现组件的更新

### 1. 第一步：组件更新

首先我们忽略批量处理的情况，先一个一个的处理setState的结果。

- 调用setState后，会执行Component类型的setState方法
- Updater类是专门处理批量和非批量的逻辑的
- setState就执行addState，向pendingStates更新队列中push一个state，然后触发更新emitUpdate
- emitUpdate组件如何更新，后面会在这里判断是否批量更新。现在忽略，直接让组件更新updateComponent
- getState返回更新后的state，将更新后的状态传给shouldUpdate
- shouldUpdate中更新实例中state状态，并具体执行更新逻辑实例上的forceUpdate

```javascript
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance; // 组件的实例
    this.pendingStates = []; // 队列。保存将要更新的队列
    this.callbacks = [];//保存将要执行的回调函数
  }

  addState(partialState, callback) {
    this.pendingStates.push(partialState);
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
    }
    // 触发更新
    this.emitUpdate();
  }
  // 不管状态变化和属性变化都会让组件刷新，都调用此方法
  emitUpdate() {
    // 后面会在此行加判断，判断批量更新的变量，如果是异步就先不更新，如果是同步则直接更新
    this.updateComponent();// 让组件更新
  }
  updateComponent() {
    let { classInstance, pendingStates } = this;
    if (pendingStates.length > 0) { // 如果有等待更新
      shouldUpdate(classInstance, this.getState()); // 参数1 组件的实例，参数2 执行getState后返回更新后的state
    }
  }
  // 根据老状态和pendingStates这个更新队列，计算新状态
  getState() {
    let { classInstance, pendingStates } = this;
    let { state } = classInstance; // 获取原始的组件状态
    pendingStates.forEach(nextState => {
      if (typeof nextState === 'function') { // setState传入的是函数
        nextState = nextState(state); // 传入老的状态，执行后返回新的状态
      }
      state = { ...state, ...nextState }; // 合并状态
    })
    pendingStates.length = 0; // 清空队列
    this.callbacks.forEach(callback => callback()); // 执行callback
    this.callback.length = 0;
    return state; // 返回新状态
  }
}

/** 修改实例的状态并更新组件 */
function shouldUpdate(classInstance, nextState) {
  classInstance.state = nextState;// 真正修改实例的状态
  classInstance.forceUpdate();// 然后调用类组件实例的forceUpdate进行更新
}

export class Component {
  static isReactComponent = true; // 源码写法Component.prototype.isReactComponent = {}
  constructor(props) {
    this.props = props;
    this.state = {};
    // 每一个类组件的实例有一个updater更新器
    this.updater = new Updater(this);
  }

  setState(partialState, callback) {
    this.updater.addState(partialState, callback);
  }

  // 组件更新逻辑
  forceUpdate() {
    console.log('forceUpdate')
  }
}
```

### 3. forceUpdate

```javascript
/**
 * 组件更新逻辑。走DOM diff
 * 1. 获取老的虚拟DOM React元素
 * 2. 根据最新的属性和状态计算新的虚拟DOM
 * 然后进行比较，查找差异，然后把这些差异同步到真实DOM上
 */
forceUpdate() {
  let oldRenderVdom = this.oldRenderVdom; // 拿到老的虚拟DOM
  let oldDOM = findDOM(oldRenderVdom);// 根据老的虚拟DOM，查到老的真实DOM
  let newRenderVdom = this.render(); // 在shouldUpdate的时候，state状态已经是最新的，可以已经计算出新的虚拟DOM
  compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom);// 比较差异，把更新同步到真实的DOM上
  this.oldRenderVdom = newRenderVdom;// 把更新
}

// react-dom.js
/**
 * 根据Vdom返回真实DOM
 */
export function findDOM(vdom) {
  let { type } = vdom;
  let dom;
  if (typeof type === 'function') { // 虚拟DOM组件的类型的话
    // 找他的oldRenderVdom的真实DOM元素
    dom = findDOM(vdom.oldRenderVdom);
  } else {
    dom = vdom.dom;
  }
  return dom;
}

// 比较新旧的虚拟DOM，找出差异更新到真实DOM上
export function compareTwoVdom(parentDOM, oldVdom, newVdom) {
  let oldDOM = findDOM(oldVdom);// 找到oldVdom对应的真实DOM
  let newDOM = createDOM(newVdom); // 根据新的虚拟DOM变成新的DOM
  parentDOM.replaceChild(newDOM, oldDOM);// 将来的DOM换成新的DOM
}

function mountClassComponent(vdom) {
  // other code

  //TODO 5.类组件更新
  classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom;//将计算出来的虚拟DOM renderVdom挂载到类的实例上
  return createDOM(renderVdom);
}

function mountFunctionComponent(vdom) {
  // other code
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}
```


### 2. 第二步：合成事件以及批量更新



总结流程：
1. 执行ReactDOM.render方法，传入虚拟DOM和挂载的容器。这里的虚拟DOM type是类组件或函数组件，属于外层虚拟DOM。
2. 执行createDOM方法，并传入虚拟DOM作为参数，将虚拟DOM换成真实DOM
  - 文本节点：创建文本节点
  - 函数节点：类组件和函数组件，使用isReactComponent属性区分
    - 类组件：实例化类组件classInstance，执行类组件上的render方法，返回虚拟节点renderVdom，并将节点保存在classInstance.oldRenderVdom属性和vdom.oldRenderVdom属性上。vdom是外层虚拟DOM，renderVdom是内层虚拟DOM，两者是不一样的。
    - 函数组件：执行函数得到内层虚拟节点renderVdom，将renderVdom挂载到vdom.oldRenderVdom属性上。方便后续查找父级DOM使用。
  - 元素节点：创建元素节点
3. 通过参数虚拟DOM，解构出props，它是虚拟节点的属性。根据props属性为dom节点添加属性。
4. 添加属性，执行updateProps方法，传入真实dom节点，老的属性和新的属性
  - 遍历新的属性props，依次给dom设置属性值
  - 当属性为样式style，使用`dom.style[key]`赋值
  - 当属性是事件，则**合成事件**
5. 判断props.children的值，分别处理：
  - 对象：一个儿子节点，递归React.render函数
  - 数组：多个儿子节点，执行reconcileChildren，取出每个节点递归调用React.render函数
6. 得到最终的真实dom节点，让虚拟DOM的dom属性指向它的真实节点（后面DOM-DIFF会使用到），将真实节点挂载到容器中。现在页面可以呈现到浏览器中。
7. 合成事件：实现事件委托，把所有事件都绑定到document上
  - 执行addEvent，在原生DOM上自定义一个store属性，保存事件名与对应的事件处理函数
  - 将使用挂载在document上：`document[eventType] = dispatchEvent`
  - dispatchEvent是合成事件处理器，是在事件执行（被点击）的时候才会执行
8. 当点击页面按钮时，document的onclick事件就会触发，也就是执行dispatchEvent函数
  - 获得事件源target和事件类型click
  - 将updateQueue.isBatchingUpdate设置为批量更新模式，执行createSyntheticEvent合成事件
  - 模拟事件冒泡的过程，主要是执行**对应的事件处理函数**

9. 执行事件处理函数
  - 执行setState，就是执行Component中的setState方法，执行this.updater.addState，传入参数：state和callback回调函数
  - 使用pendingStates保存state，callbacks保存callback回调函数。触发emitUpdate。
  - emitUpdate：判断isBatchingUpdate是批量模式函数非批量模式。批量模式就使用updateQueue.updaters来保存实例，非批量模式调用updateComponent让组件更新
  - updateComponent：getState获取最新状态，执行shouldUpdate更新组件，并将最新状态作为参数传入。
  - shouldUpdate：将最新状态赋给类组件实例，调用forceUpdate更新组件
  - forceUpdate：拿到老的虚拟DOM，根据老的虚拟DOM查到老的真实DOM（findDOM）。执行组件的render，得到新的虚拟DOM，比较新旧虚拟DOM并更改真实DOM节点（compareTwoVdom）
10. 批量更新执行结束。
11. 将updateQueue.isBatchingUpdate重置为非批量更新，执行更新updateQueue.batchUpdate()，执行批量更新的内容。
12. 由于状态已经置成了非批量更新的内容，所有当执行setTimeout的时候，此时在emiteUpdate中updateQueue.isBatchingUpdate是false，应该直接执行updateComponent。
