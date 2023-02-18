---
autoGroup-1: React
sidebarDepth: 3
title: 6. 事件处理函数绑定与事件对象
---

## 事件的认识

`DOM`事件处理采用`addEventListener`或`onclick=function(){...}`。
```javascript
<button onclick="this.doSth"></button> // onclick 纯小写
```

`React`元素也是采用了类似于`DOM0`标准中的事件属性定义的方法。

```javascript
// JSX 写法. onClick小驼峰
<button  onClick={ this.doSth }>Click</button>
```

直接创建React元素的方法

```javascript
React.createElement(
  'button',
  {
    onClick: { this.doSth }
  },
  'click'
)
```

不能通过`false`阻止默认行为，需要使用`preventDefault`

```javascript
class App extends React.Component {
  doSth(e) {
    e.preventDefault();// 阻止默认行为
    console.log(e);
  }

  render() {
    return (
      <div>
        {/* 通常情况下，a标签我们希望阻止它的默认行为 */} 
        {/* 不可以使用 */}
        <a href="javascript:void(0)" onClick={this.doSth.bind(this)}>click</a>
        {/* 使用 */}
        <a href="#" onClick={this.doSth.bind(this)}>click</a>
      </div>
    )
  }
}
```

## React事件对象

```js
console.log(e);
/**
 * SyntheticBaseEvent{...}
 * 合成基础事件对象是React重新定义的
 * 这个对象遵守W3C事件对象的规范，不存在任何的浏览器兼容性问题
 */
```

`SyntheticEvent`是浏览器的原生事件的跨浏览器包装器，可解决所有浏览器兼容问题，还拥有浏览器原生事件相同的接口。

> 为什么`React`要将事件处理直接在`React`元素上绑定？ 

`React`一直认为事件处理跟视图是有程序上的直接关系的，事件处理和视图写在一起可以更加直观的表述视图与逻辑的关系，更加好维护。

## this指向

- 默认处理函数的 `this` 为 `undefined`
- `ES6 class`模块默认是不对事件处理函数进行 `this` 的再绑定

解决方法：

1. 可以在构造器中 `bind(this)`
2. 可以在视图中 `bind(this)`
3. 利用 回调 + 箭头函数 `onClick = { () => this.doSth() }`
4. `class field`

```javascript
class App extends React.Component {
  constructor(props) {
    super(props);
    // 1. 在构造器中。bind为从新返回一个函数，再重新赋值给this.doSth，所以在视图可以直接使用 onClick="this.doSth"
    this.doSth = this.doSth.bind(this)
  }

  doSth() {
    console.log(this); // 默认为 undefined
  }

  // 4. class field。视图部分直接使用 onClick="this.doSth"
  doSth = () => {
    //...
  }

  render() {
    return (
      <div>
        {/* 2. 在视图中 */}
        <button onClick={this.doSth.bind(this)}>Click</button>
        {/* 3. 回调加箭头函数 */}
        <button onClick={() => this.doSth()}>Click</button>
      </div>
    )
  }
}
```

回调加箭头函数改变指向的缺点：

每次`render`函数执行时会创建新的回调，给子组件的属性进行传递函数的时候，每次都要创建一个回调，子组件每次都会接收一个新的函数，就会有可能触发子组件的`render`渲染。

```javascript
// 实验性写法 class field（推荐写法）
// 修改doSth函数的写法
doSth = () =>{
  console.log(this)
}

// 视图
<button onClick={this.doSth}>Click</button>
```

## 事件对象传参
1. 事件对象都是在最后一个参数
```javascript
// 回调：事件对象在最后
<button onClick={(e) => this.doSth(1, 2, 3, e)}>click1</button>

// 显示传入事件对象
doSth(p1, p2, p3, e){ }
```

2. 事件对象隐式传入
```javascript
// bind 
<button onClick={this.doSth2.bind(this, 1, 2, 3)}>click1</button>

// 隐式传入事件对象
doSth2(p1, p2, p3, e) {}
```

## React事件机制
React自身实现了一套自己的事件机制，包括事件注册、事件的合成、事件冒泡、事件派发等。


### 1. 合成事件

### 2. 事件注册机制


### 3. 事件执行机制
