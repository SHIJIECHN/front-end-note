---
autoGroup-1: React
sidebarDepth: 3
title: 组件与props
---

## 组件
组件是什么？

在前端，组件是视图的片段，组件包含视图标记、事件、数据、逻辑、外部的设置。

props的作用是什么？

组件是封闭的，要接收外部数据通过props来实现，props接收传递给组件的数据。

数据是什么？

组件一般是内部管理数据集合（state），外部传入配置集合（props）
```typescript
// 类组件
class Test extends React.Component {
    // 接收外部传入的属性配置在props里保存
    constructor(props) {
        super(props);

        // 内部数据
        // this.state = {
        //     title: this.props.title
        // }
    }

    // 内部数据
    state = {
        title: this.props.title
    }

    // 事件处理函数
    handleBtnClick() {
        // 事件逻辑处理
        this.setState({
            title: "This is my Component."
        })
    }

    render() {
        // 视图标记
        return (
            <div>
                <h1>{this.state.title}</h1>
                {/* 事件 */}
                <button onClick={this.handleBtnClick.bind(this)}>Click</button>
            </div>
        )
    }

}

ReactDOM.render(
    <Test title="This is a Class Component." />,
    document.getElementById('app')
)
```

```typescript
// 函数组件
// 利用hooks来做
function Test(props) {
    const [title, setTitle] = React.useState(props.title);

    // 视图
    return (
        <div>
            <h1>{title}</h1>
            {/* 事件 */}
            <button onClick={() => setTitle('This is my Component')}>Click</button>
        </div>
    )
}

ReactDOM.render(
    <Test title="This is a Class Component." />,
    document.getElementById('app')
)
```
组件渲染的过程：
1. React主动调用组件
2. 将属性集合转换成对象 props => { title: 'This is a class Component.'}
3. 将对象作为props传入组件
4. 替换JSX中的props或者state中的变量
5. ReactDOM将最终React元素通过一系列的操作转化成真实DOM进行渲染

::: tip
使用类组件时，如写了构造函数，应该将props传递给super(),否则无法在构造函数中获取props
:::

组件调用规范：
- 视图标记时HTML标签 `<div></div>`
- 大驼峰写法作为一个React元素 `<Title />`组件 -> JSX -> React元素。`<Test title="This is a Class Component." />`
- 组件转换React元素 React.createElement(Title, {...})

## 组合组件
几个子组件放入到父组件里（返回的视图中组合）
```javascript
/**
 * title
 * author
 * paragraph
 * APP
 */
class Title extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <h1> {this.props.title} </h1>
        )
    }
}

class Author extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <span>{this.props.author}</span>
        )
    }
}

class Para extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <p>{this.props.para}</p>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        title: 'This is a title',
        author: 'Xiaoye',
        para: "This is a paragraph"
    }
    render() {
        return (
            <div>
                <Title title={this.state.title} />
                <Author author={this.state.author} />
                <Para para={this.state.para} />
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
)
```
组件嵌套
```javascript
/**
 * title
 *      author
 *      paragraph
 * APP
 */
class Title extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { author, title, para } = this.props;
        return (
            <div>
                <h1> {this.props.title} </h1>
                <Author author={this.props.author} />
                <Para para={this.props.para} />
            </div>
        )
    }
}

class Author extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <span>{this.props.author}</span>
        )
    }
}

class Para extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <p>{this.props.para}</p>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        title: 'This is a title',
        author: 'Xiaoye',
        para: "This is a paragraph"
    }
    render() {
        return (
            <div>
                <Title
                    // title={this.state.title}
                    // author={this.state.author}
                    // para={this.state.para}

                    // state的属性被全部使用了
                    {...this.state}
                />
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
)
```

## props
属性props和数据状态state的区别：
1. state叫数据池对象，组件内部的管理数据的容器，可写读
2. props叫配置池对象，外部使用（调用）组件时传入的属性集合，组件内部只读

为什么属性props对象可不写？

组件内部是不应该有权限修改组件外部的数据
```javascript
// props的只读性

// 函数组件一定要是一个纯函数。
// 纯函数能保证绝对的复用性
// 相同的入参保证相同的结果
// 纯函数不可以修改入参
function test(a, b){
    return a + b
}
// 从设计上讲，在函数内部更改入参
// 其实是在组件运行时更改了外部的设置
// 该配置是使用者希望通过该配置达到对应的结果。
```

```javascript
/**
 * state与props结合
 * 
 * content = props => outer => 外部配置
 * state => content => default => props.content
 */

class App extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props)
    }

    state = {
        content: this.props.content
    }

    handleBtnClick() {
        // this.props.content = "123";
        this.setState({
            content: 123
        })
    }

    render() {
        return (
            <div>
                <h1>{this.state.content}</h1>
                <button onClick={this.handleBtnClick.bind(this)}>click</button>
            </div>

        )
    }
}

ReactDOM.render(
    <App content="This is my content." />,
    document.getElementById('app')
)
```
