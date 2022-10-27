---
autoGroup-1: React
sidebarDepth: 3
title: 生命周期
---

## 生命周期

> 为什么需要知道组件的生命周期？

有助于理解组件的运行方式，完成更复杂的组件功能，分析组件错误等原因，组件在被创建到挂载到页面中运行，再到组件不用时卸载的过程。

> 什么是钩子函数？

生命周期的每个阶段总是伴随着一些方法调用，这些方法就是生命周期的钩子函数。

> 钩子函数有什么作用？

它为开发者在不同阶段操作组件提供了时机

::: tip
只有类组件才有声明周期
:::

### 1. 单个组件生命周期
```javascript
class App extends React.Component {
  constructor(props) {
    console.log('父 constructor')
    super(props);
  }

  state = {
    count: 0
  }

  handleClick() {
    console.log('父 handleClick');
    this.setState({
      count: this.state.count + 1
    })
  }

  componentDidMount() {
    console.log('父 componentDidMount')
  }

  componentDidUpdate() {
    console.log('父 componentDidUpdate')
  }

  componentWillUnmount() {
    console.log('父 componentWillUnmount');
  }

  render() {
    console.log('父 render')
    return (
      <div>
        <h1>{this.state.count}</h1>
        <button onClick={this.handleClick.bind(this)}>Click</button>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)


setTimeout(() => {
  ReactDOM.unmountComponentAtNode(
    document.getElementById('app')
  )
}, 10000);
```
```text
// 组件初始化
父 constructor
父 render
父 componentDidMount

// 点击更新
父 handleClick
父 render
父 componentDidUpdate

// 组件卸载
父 componentWillUnmount
```

### 2. 父子组件生命周期
```javascript
class Child extends React.Component {
  constructor(props) {
    console.log('子 constructor')
    super(props)
  }
  componentDidMount() {
    console.log('子 componentDidMount');
  }

  componentDidUpdate() {
    console.log('子 componentDidUpdate');
  }

  componentWillUnmount() {
    console.log('子 componentWillUnmount');
  }

  render() {
    console.log('子 render')
    return (
      <div>
        <h1>子组件</h1>
      </div>
    )
  }
}

export default Child;
```
```text
// 初始化
父 constructor
父 render
子 constructor
子 render
子 componentDidMount
父 componentDidMount

// 更新
父 handleClick
父 render
子 render
子 componentDidUpdate
父 componentDidUpdate

// 卸载
父 componentWillUnmount
子 componentWillUnmount
```

组件生命周期图
<img :src="$withBase('/framework/React/lifecycle.jpg')" alt="lifecycle" />

总结：
1. 组件生命周期初始化是constructor, render,componentDidMount。初始更新是render，componentDidUpdate。卸载是componentWillUnmount。
2. 当是父子组件时，执行到render遇到子组件，会先对子组件进行挂载，所以子组件会先进行componentDidMount。更新时会重新render，子组件更新结束到父组件。卸载的时候如果是父组件卸载则先执行父组件的钩子函数componentWillUnmount。



## 生命周期的三个阶段
1. 创建时（挂载阶段）
   1. 执行时机：组件创建时（页面加载时）
   2. 执行顺序：
      1. constructor()
      2. render()
      3. componentDidMount
2. 更新时（更新阶段）
   1. 执行时机
      1. setState()
      2. forceUpdate()
      3. 组件接收到新的props
   2. 以上三种任意一种变化，组件就会重新渲染
   3. 执行顺序：
      1. render()
      2. componentDidUpdate()
3. 卸载时（卸载阶段）
   1. 执行时机：组件从页面消失
      1. componentWillUnmount

::: tip
 注意：不要在render中调用setState()方法
:::

| <div style="width: 100px;">钩子函数</div> | <div style="width: 100px;">触发时机</div> |   <div style="width: 100px;">作用</div>   |
| :---------------------------------------: | :---------------------------------------: | :---------------------------------------: |
|                constructor                |           创建组件时，最先执行            | 1. 初始化state; 2. 为事件处理程序绑定this |
|                  render                   |           每次组件渲染都会触发            |                  渲染UI                   |
|             componentDidMount             |         组件挂载（完成DOM渲染）后         |        1. 发送网络请求 2. DOM操作         |


三种导致组件更新的方式：
1. 子组件接收新的props属性渲染render
2. 执行setState()方法渲染render
3. 执行forceUpdate()方法渲染render

::: tip
在componentDidUpdate生命周期里if条件执行setState()方法，否则导致递归更新，栈溢出的报错
:::

```javascript
//在componentDidUpdate里执行setState()的正确写法：
//做法：比较更新前后的props是否相同，来决定是否重新渲染组件
componentDidUpdate(prevProps){
  if(prevProps.count !== this.props.count){
    this.setState();
  }
}
```
| <div style="width: 100px;">钩子函数</div> | <div style="width: 100px;">触发时机</div> | <div style="width: 100px;">作用</div> |
| :---------------------------------------: | :---------------------------------------: | :-----------------------------------: |
|                  render                   |           每次组件渲染都会触发            |   渲染UI（挂载阶段是同一个render）    |
|            componentDidUpdate             |         组件更新后（完成DOM渲染）         |     1. 发送网络请求； 2. DOM操作      |


| <div style="width: 100px;">钩子函数</div> | <div style="width: 100px;">触发时机</div> | <div style="width: 100px;">作用</div> |
| :---------------------------------------: | :---------------------------------------: | :-----------------------------------: |
|           componentWillUnmount            |          组件卸载（从页面消失）           |     执行清理工作（清除定时器等）      |


## 生命周期钩子函数
1. render()
2. constructor()
3. componentDidMount()
4. componentDidUpdate()
5. componentWillUnmount()
6. shouldComponentUpdate()
7. static getDerivedStateFromProps()
8. getSnapshotBeforeUpdate()
9. static getDerivedStateFromError()
10. componentDidCatch()