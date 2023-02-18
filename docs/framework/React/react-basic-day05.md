---
autoGroup-1: React
sidebarDepth: 3
title: 5. state与setState、单向数据流
---

## state

`state`是`React`的核心，是一个组件私有的状态数据池。

```javascript
/**
Board
    Title 标题组件
    DateTime 时钟组件
*/
class Title extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <h1>{this.props.title}</h1>
        )
    }
}

// 封装时钟
class DateTime extends React.Component {
    constructor(props) {
        super(props)
    }
    // 数据池：管理组件内部数据状态。
    state = {
        dateTime: new Date().toString() // 组件内部可以自己更新，所以不需要外界传入
    }

    // 组件已经被渲染到DOM中，以后运行
    // 组件已经被挂载到了真实DOM中后，运行的函数
    componentDidMount() {
        // 每一秒钟重新设置一次 dateTime。组件内部可以修改state数据池
        this.t = setInterval(() => {
            this.setState({
                dateTime: new Date().toString()
            })
        }, 1000)
    }

    // 组件即将被卸载时运行。组件如何卸载？React提供了卸载组件的方法
    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.t);
        this.t = null;
        console.log('Over')
    }

    // 视图
    render() {
        return (
            <h2 id="dateTime">It's NOW {this.state.dateTime}</h2>
        )
    }
}

class Board extends React.Component {
    render() {
        return (
            <div>
                <Title title="Welcom to my Board." />
                <DateTime />
            </div>
        )
    }
}

ReactDOM.render(
    <Board />,
    document.getElementById('app')
)

// 5秒后卸载组件
setTimeout(() => {
    // 卸载组件
    ReactDOM.unmountComponentAtNode(
        document.getElementById('app')
    )
}, 5000)
```

总结：

1. 如果想使用组件的时候，传入数据`props`组件配置
2. 如果是组件使用的数据，使用私有数据状态`state`

:::tip
state的使用注意事项：

1. 必须使用`setState`方法来修改`state`。
2. 多个`setState`是会合并调用。
3. `props`和`state`更新数据需谨慎，避免直接依赖它们，它们俩很可能是在异步程序中更新的。
   
   ```javascript
   // 不可以使用。因为result和content有可能是异步更新的
   this.setState({
        result: this.state.result + this.props.content
   })

   // 解决方案：使用回调函数
   this.setState((state, props) => {
        // state是上一个state，更新之前的state
        // props是此次更新时被使用的props，当前的props
        result: state.result + props.content
    })
   ```
4. `setState`操作合并的原理是浅合并
   ```javascript
    this.state = {
        obj: {},
        arr: []
    }

    $.ajax().then(()=>{
        this.setState({
            obj: res.obj
        })
    })

    $.ajax().then(()=>{
        this.setState({
            arr: res.arr // 完全替换arr，保证obj是原来的引用
        })
    })

    
   ```
:::

组件无论如何都是不知道其他组件是否有状态的，组件也并不关系其他组件是函数组件还是类组件。

关于组件中的`state`：

1. `state`是组件特有的数据封装
2. 其他组件是**无法读写修改**该组件的`state`
3. 组件可以通过其他组件调用的时候传入属性来传递`state`的值
   ```javascript
    // app.js
    this.state = {
        title: 'This is a title.'
    }
   <Title title={this.state.title} /> 

    // Title
    <h1>{this.props.title}</h1>
   ```
4. `props`虽然是响应式的，但是在组件内部是只读的，所以仍然无法修改其他组件的`state`
5. 安全影响范围：`state`只能传递给自己的子组件，说明`state`只能影响当前组件的`UI`的内部的`UI`
6. 组件可以没有状态，是否有状态，组件间都不受嵌套影响，有无状态是可切换的

## 单向数据流（One-Way Data Flow）

这种数据（状态）从父组件到子组件，由上而下的传递流动的数据状态，叫单向数据流。

## state和props区别

相同点：
1. `props`和`state`都是普通的`JS`对象，都是用来保存信息的
2. props和state改变都会引起组件重新渲染

不同点：
1. `props`是传递给组件的（类似于函数的形参）
2. `state`是在组件内被组件自己管理的（类似于在一个函数内声明的变量）

## setState
`setState()`是异步更新数据的，可以多次调用，但只会触发一次渲染。当state改变了，该组件就会重新渲染。

关于`setState`方法，状态是可变的，它的作用在于：
1. 修改`state`状态
2. 更新`UI`

> 如何更新那些依赖于当前state的state呢？

给setState传递一个函数，而不是一个对象，可以确保每次的调用都是使用最新版的state。

关于`setState`方法的推荐调用方法：
```javascript
// 此写法是异步更新的
//state：最新的state
//props：最新的props
setState((state, props) => {
  return {
    //要更改的状态
    count: state.count + 1;
  }
});
```

> 给setState传递一个对象与传递一个函数的区别是什么？

传递一个函数可以让你在函数内访问当前的state的值。因为seState的调用是分批的，所以你可以链式地进行更新，并确保它们是一个建立在另一个之上的。

关于`setState`方法的第二个参数：在状态更新后（页面完成重新渲染）立即执行某个操作。通常建立使用componentDidUpdate()来替代此方式。

```javascript
this.setState(
  (state, props) => {},
  () => { console.log('这个回调函数会在状态更新后立即执行') }
);
```

> 为什么不直接更新this.state？

在开始重新渲染之前，React会有意地进行“等待”，直到所有在组件的事件处理函数内调用的setState()完成之后，这样可以通过避免不必要的重新渲染来提升性能。

> setState什么时候是异步的？为什么setState()会批量执行？

在事件处理函数内部的setState是异步的。因为React的批量处理更新（batch the update）。

React为了优化性能，setState()执行时会判断变量isBatchingUpdates的值是true或false，然后决定是同步更新还是批量更新。

<img :src="$withBase('/framework/React/setState01.png')" alt="setState" />

由于isBatchingUpdates默认值是false，即默认是不批量更新的，是立即执行，是同步的。但如果this.setState在React合成事件/钩子函数中，React会通过batchedUpdates()这个函数将isBatchingUpdates变成true，即批量更新，不同步的。

<img :src="$withBase('/framework/React/setState02.png')" alt="setState" />

所以主要看调用this.setState()的函数有没有被React包装过，如果没经过React包装，isBatchingUpdates就不会从false变成true，就是同步更新。

```javascript
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0
    };
  }

  componentDidMount() {
    /**
     * 1. 钩子函数中里面的代码是同步的，但是this.setState()异步执行
     * console.log同步输出，所以是0。但是会执行this.setState(...)
     * 
     * 2. this.setState()更新在render之前
     */
    
    // 此时两次执行this.setState相当于
    // this.setState({
    //     val: this.state.val + 1（被覆盖）
    //     val: this.state.val + 1 
    // })
    // 实际上是
    // this.setState({
    //     val: this.state.val + 1
    // })

    this.setState({ val: this.state.val + 1 });
    console.log('componentDidMount: ' + this.state.val);

    this.setState({ val: this.state.val + 1 });
    console.log('componentDidMount: ' + this.state.val);

    // React钩子函数中使用setTimeout
    setTimeout(() => {
      // setTimeout中的this.setState(...)同步执行
      console.log('setTimeout: ' + this.state.val); 
      this.setState({ val: this.state.val + 1 });
      console.log('setTimeout: ' + this.state.val);

      this.setState({ val: this.state.val + 1 });
      console.log('setTimeout: ' + this.state.val);
    }, 0);
  }

  render() {
    console.log('render: ' + this.state.val); // 每次state.val发生改变，都会输出
    return null;
  }
};
```
```javascript
render: 0
componentDidMount: 0
componentDidMount: 0
render: 1
setTimeout: 1
render: 2
setTimeout: 2
render: 3
setTimeout: 3
```

总结：
1. setState只在合成事件和钩子函数中是异步的，在原生事件和setTimeout中都是同步的。
2. setState的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形成了所谓的“异步”，当然可以通过第二个参数setTState(partialState, callback)中的callback拿到更新后的结果。
3. setState 的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和setTimeout 中不会批量更新，
在“异步”中如果对同一个值进行多次setState，setState的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时setState多个不同的值，在更新时会对其进行合并批量更新