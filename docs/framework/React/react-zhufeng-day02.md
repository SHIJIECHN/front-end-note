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
  return React.createElement('h1', {}, 'hello,', props.name)
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
      // <h1 className='title' style={{ color: 'red' }}><span>hello</span>{this.props.name}</h1>
      React.createElement(
        'h1',
        { className: 'title', style: { color: 'red' } },
        React.createElement('span', {}, 'hello'),
        this.props.name
      )
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

## setState的实现
