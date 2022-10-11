---
autoGroup-1: React
sidebarDepth: 3
title: state
---

## state
state是React的核心，是一个组件私有的状态数据池。
```javascript
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

    state = {
        dateTime: new Date().toString()
    }

    // 组件已经被渲染到DOM中以后运行
    // 组价已经被挂载到了真实DOM中后，运行的函数
    componentDidMount() {
        this.t = setInterval(() => {
            this.setState({
                dateTime: new Date().toString()
            })
        }, 1000)
    }

    // 组件即将被卸载时运行
    componentWillUnmount() {
        clearInterval(this.t);
        this.t = null;
        console.log('Over')
    }

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

setTimeout(() => {
    // 卸载组件
    ReactDOM.unmountComponentAtNode(
        document.getElementById('app')
    )
}, 5000)
```
总结：
1. 如果想使用组件的时候，传入数据props组件配置
2. 如果是组件使用的数据，使用私有数据状态state

:::tip
1. 必须使用setState方法来修改state
2. 多个setState是会合并调用
3. props和state更新数据需谨慎，避免直接依赖它们，它们俩很可能是在异步程序中更新的
   ```javascript
   // 不可以使用
   this.setState({
        result: this.state.result + this.props.content
   })

   // 解决方案：使用回调函数
   this.setState((state, props) => {
        // state是上一个state
        // props是此次更新时被使用的props
        result: state.result + props.content
    })
   ```
4. setState操作合并的原理是浅合并
   ```javascript
    constructor(props) {
        super(props);
        this.state = {
        posts: [],
        comments: []
        }
    }

    // 更新posts、comments
    componentDidMount() {
        fetchPostes().then(response => {
        this.setState({
            posts: response.posts
        })
        });

        fetchComments().then(response => {
        this.setState({
            comments: response.comments
        })
        })
    }
    // this.setState({comments})完整保留了this.state.posts，
    // 但完全替换了this.state.comments
   ```
:::

关于组件中的state：
1. state是组件特有的数据封装
2. 其他组件是无法读写修改该组件的state
3. 组件可以通过其他组件调用的时候传入属性来传递state的值
4. props虽然是响应式的，但是在组件内部是只读的，所以仍然无法修改其他组件的state
5. 安全影响范围：state只能传递给自己的子组件，说明state只能影响当前组件的UI的内部的UI
6. 组件可以没有状态，是否有状态，组件间都不受嵌套影响，有无状态是可切换的

## 单向数据流（One-Way Data Flow）
从父组件到子组件由上而下的传递流动的数据状态，叫单向数据流。

## setState 专题
setState()是异步更新数据的，可以多次调用，但只会触发一次渲染

关于setState方法，状态是可变的，它的作用在于：
1. 修改state状态
2. 更新UI

关于setState方法的推荐调用方法：
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
关于setState方法的第二个参数：在状态更新后（页面完成重新渲染）立即执行某个操作
```javascript
this.setState(
  (state, props) => {},
  () => { console.log('这个回调函数会在状态更新后立即执行') }
);
```