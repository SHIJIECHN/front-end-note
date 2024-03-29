---
autoGroup-1: React
sidebarDepth: 3
title: 12. 错误边界
---

## 错误边界
`React16`增加的，是防止某个组件的`UI`渲染错误导致整个应用崩溃。子组件发生了`JS`的错误，有备用的渲染`UI`。

错误边界是一个组件，这个组件只能用class组件来写。

```javascript
/**
 * static getDerivedStateFromError(error) 是一个生命周期函数.获取捕获错误状态，修改错误状态
 * 参数：子组件抛出的错误
 * 返回值：新的state
 * 作用：渲染备用的UI
 * 调用时机：渲染阶段调用，不允许出现操作DOM，异步操作等副作用
 */

/**
 * componentDidCatch(error, info) 原型上的方法.边界错误组件捕获异常，并进行后续处理
 * 参数1：error 抛出的错误
 * 参数2：info 组件引发错误的相关信息，组件的栈
 * 作用：错误信息捕获，运行副作用
 * 调用时机：在组件抛出错误后调用
 */

class ErrorBoundary extends React.Component{
  constructor(props) {
    super(props);
    // componentDidCatch有冒泡机制，会冒泡到window上面。window.onerror 可以监听到error触发的。注意：生产环境下不可以
    window.onerror = function (err) {
      console.log(err);
    }
  }

  state = {
    hasError: false
  }
  
  // 渲染时
  static getDerivedStateFromError(error){
    //返回一个新的状态
    return { hasError: true }
  }
  
  // 生命周期函数中
  componentDidCatch(error, info) {
    // 处理副作用
    console.log(error, info)
  }
  
  render(){
    if(this.state.hasError){
      return (
        //返回新的备用的UI方案
        <h1>This is something wrong.</h1>
      );
    }else{
      //显示ErrorBoundary组件里包含的state状态
      return this.props.children;
    }
  }
}

// 内部由错误的组件
class Test extends Component {
  render() {
    return (
      <div>{data.title}</div>
    );
  }
}

// 没有错误的组件
class Sub extends Component {
  render() {
    return (
      <p>This is content</p>
    )
  }
}

// 使用
class App extends Component {
  render() {
    return (
      <div>
        <ErrorBoundary>
          {/* Sub组件正确展示，Test组件出现错误会展示错误边界组件中'This is something wrong.' */}
          <Sub />
          <Test />
        </ErrorBoundary>
      </div>
    )
  }
}
```

有一些无法捕获的场景：
1. 事件处理函数。没办法在渲染的时候直接捕获事件处理函数内部的错误，必须执行了才可以
2. 异步代码。`setTimeout`、`ajax`
3. 服务端渲染。
4. 错误边界组件内部有错误。**错误边界组件仅可以捕获其子组件的错误**，无法捕获其自身的错误。

错误边界组件捕获错误的时机有哪些
- 渲染时：`getDerivedStateFromError`
- 生命周期函数中：`componentDidCatch`
- 组件树的构造函数中：`window.onerror`

如果多个嵌套错误边界组件，则从最里层错误出发，向上**冒泡**触发捕获。

## 懒加载与错误边界的使用
```javascript
<ErrorBoundary>
  <React.Suspense fallback={<Loading />}>
      {/* TestComponent组件内部发生错误 */}
      <TestComponent />
  </React.Suspense>
</ErrorBoundary>
```

懒加载组件内部发生错误，错误边界组件会捕获到。

## 总结
1. 错误边界组件使用`static getDerivedStateFromError()`渲染备用`UI`，使用`componentDidCatch()`打印错误信息
2. 四种无法捕获错误的场景：事件处理函数、异步代码、服务端渲染、错误边界组件内部的错误
3. 捕获错误的时机：渲染时、生命周期函数中、组件树的构造函数中
4. 嵌套错误边界组件有冒泡的机制