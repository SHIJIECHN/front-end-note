---
autoGroup-1: React
sidebarDepth: 3
title: 4. 组件与props
---

## 组件
> 组件是什么？

在前端，组件是视图的片段，组件包含视图标记、事件、数据、逻辑、外部的设置。

> `props`的作用是什么？

组件是封闭的，要接收外部数据通过`props`来实现，`props`接收传递给组件的数据。

> 数据是什么？

组件一般是内部管理数据集合（`state`），外部传入配置集合（`props`）

### 1. 类组件

```js
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
        title: this.props.title // 访问外部传入的值 this.props
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
                {/* 事件。handleBtnClick内部的this默认是指向button的，但是在handleBtnClick我们需要处理this.setState，
                    此时this是组件实例，所以需要修改this指向 */}
                <button onClick={this.handleBtnClick.bind(this)}>Click</button>
            </div>
        )
    }

}

ReactDOM.render(
    // 外部传入 title
    <Test title="This is a Class Component." />,
    document.getElementById('app')
)
```

### 2. 函数组件

```js
// 函数组件
// 利用hooks来做
function Test(props) {
    const [title, setTitle] = React.useState(props.title);

    // 视图
    return (
        <div>
            <h1>{title}</h1>
            {/* 事件。
                执行setTitle。() => setTitle('This is my Component') 相当于 function (){ setTitle('This is my Component')} */}
            <button onClick={() => setTitle('This is my Component')}>Click</button>
        </div>
    )
}

ReactDOM.render(
    <Test title="This is a Class Component." />,
    document.getElementById('app')
)
```

## 渲染组件 

组件渲染的过程：

1. React主动调用组件。
2. 将属性集合转换成对象 `props => { title: 'This is a class Component.'}`
3. 将对象作为`props`传入组件
4. 替换`JSX`中的`props`或者`state`中的变量
5. `ReactDOM`将最终`React`元素通过一系列的操作转化成真实`DOM`进行渲染

::: tip
使用类组件时，如写了构造函数，应该将`props`传递给`super()`,否则无法在构造函数中获取`props`
:::

组件调用规范：

- 视图标记时HTML标签 `<div></div>`
- 大驼峰写法作为一个React元素 `<Title />`组件 -> JSX -> React元素。`<Test title="This is a Class Component." />`
- 组件转换`React`元素 `React.createElement(Title, {...})`

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

属性props和数据状态state的区别：

1. state叫数据池对象，组件内部的管理数据的容器，可写读
2. props叫配置池对象，外部使用（调用）组件时传入的属性集合，组件内部只读

```javascript
/**
 * state与props结合
 * 
 * content => props => outer => 外部配置
 * state => content => default => props.content
 */

class App extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props)
    }

    state = {
        content: this.props.content // 将外部值赋给state
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

## props的只读性

> 为什么属性props对象不可写？

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

组件props可以传递什么类型的数据？

```jsx
<List
  //字符串
  name="rose"
  //数值
  age={19}
  //数组
  colors={['red', 'green', 'blue']}
  //返回结果的函数
  fn={() => consolo.log('this is a fn')}
  //React元素
  tag={<p>this is a p.</p>}
/>
```


## props检验
允许在创建组件的时候，就指定props的类型，格式等
```javascript
// 安装包
npm i -S props-types

// 引入
import PropTypes from 'prop-types'

MyComponent.propTYpes = {
    a: propTypes.number,
    fn: propTypes.func.isRequired,
    tag: PropTYped.element,
    // 特定结构的对象
    filter: PropTYpes.shape({
        area: PropTypes.string,
        price: PropTypes.number
    }),
    //必选
    requiredFunc: PropTypes.func.isRequired,

}
```

常见类型： array，bool，function，number，object，string

默认Props值
```javascript
MyComponent.defaultProps = {
    name: 'Stranger'
}
```
