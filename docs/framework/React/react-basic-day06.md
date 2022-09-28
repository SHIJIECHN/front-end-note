---
autoGroup-1: React
sidebarDepth: 3
title: 事件处理函数绑定与事件对象
---

## 事件
React元素也是采用了类似于DOM0标准中的事件属性定义的方法
```javascript
// JSX 写法
// onClic小驼峰
<button  onClick={ this.doSth }>Click</button>
```
```javascript
// 直接创建React元素的方法
React.createElement(
  'button',
  {
    onClick: { this.doSth }
  },
  'click'
)
```
不能通过false阻止默认行为，需要使用preventDefault
```javascript
class App extends React.Component {
  doSth(e) {
    e.preventDefault();// 阻止默认行为
    console.log(e);
  }

  render() {
    return (
      <div>
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

为什么React要将事件处理直接在React元素上绑定？ 

React一直认为事件处理跟视图是有程序上的直接关系的，事件处理和视图写在一起可以更加直观的表述视图与逻辑的关系，更加好维护。

## this指向
- 默认处理函数的 this 为 undefined
- ES6 class模块默认是不对事件处理函数进行 this 的再绑定

解决方法：
1. 可以在构造器中 bind(this)
2. 可以在视图中 bind(this)
3. 利用回调加箭头函数 onClick = { () => this.doSth() }

```javascript
class App extends React.Component {
  constructor(props) {
    super(props);
    // 1. 在构造器中
    this.doSth = this.doSth.bind(this)
  }

  doSth() {
    console.log(this); // undefined
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

每次render函数执行时会创建新的回调，给子组件的属性进行传递函数的时候，每次都要创建一个回调，子组件每次都会接收一个新的函数，就会有可能触发子组件的render渲染

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
事件对象都是在最后一个参数
```javascript
// 回调
<button onClick={(e) => this.doSth(1, 2, 3, e)}>click1</button>

// 显示传入事件对象
doSth(p1, p2, p3, e){ }
```
```javascript
// bind 
<button onClick={this.doSth2.bind(this, 1, 2, 3)}>click1</button>

// 隐式传入事件对象
doSth2(p1, p2, p3, e) {}
```